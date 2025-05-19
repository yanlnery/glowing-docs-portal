
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Species } from '@/types/species';
import { useToast } from '@/components/ui/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const BUCKET_NAME = 'species_images';

const generateSlug = (name: string) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

export function useSpeciesManagement() {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAdminLoggedIn } = useAdminAuth();

  const fetchSpecies = useCallback(async () => {
    if (!isAdminLoggedIn) {
      setSpeciesList([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from('species')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      toast({ title: "Erro ao carregar espécies", description: error.message, variant: "destructive" });
      setSpeciesList([]);
    } else {
      setSpeciesList(data as Species[]);
    }
    setIsLoading(false);
  }, [toast, isAdminLoggedIn]);

  useEffect(() => {
    fetchSpecies();
  }, [fetchSpecies]);

  const saveSpecies = async (
    speciesData: Species,
    isNew: boolean,
    imageFile: File | null,
    originalImageUrl?: string // Used to check if old image needs deletion
  ): Promise<boolean> => {
    if (!isAdminLoggedIn) {
      toast({ title: "Acesso Negado", description: "Você precisa estar logado como administrador.", variant: "destructive" });
      return false;
    }
    if (!speciesData.name || !speciesData.commonName || !speciesData.description) {
      toast({ title: "Erro de validação", description: "Preencha Nome Popular, Nome Científico e Descrição.", variant: "destructive" });
      return false;
    }

    let speciesToSave = { ...speciesData };
    if (!speciesToSave.slug) {
      speciesToSave.slug = generateSlug(speciesToSave.name);
    }
    if (!speciesToSave.slug) {
      toast({ title: "Erro de validação", description: "Não foi possível gerar o slug. Verifique o Nome Científico.", variant: "destructive" });
      return false;
    }

    let imageUrl = speciesToSave.image;

    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '_')}`;
      const filePath = `public/${fileName}`;

      if (originalImageUrl && originalImageUrl.includes(BUCKET_NAME)) {
        const oldImageSupabasePath = originalImageUrl.split(`${BUCKET_NAME}/`)[1]?.split('?')[0];
        if (oldImageSupabasePath && oldImageSupabasePath !== filePath.substring(filePath.indexOf('/') + 1)) { // filePath includes 'public/'
             await supabase.storage.from(BUCKET_NAME).remove([oldImageSupabasePath]);
        }
      }
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, imageFile, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        toast({ title: "Erro no Upload", description: `Falha ao enviar imagem: ${uploadError.message}`, variant: "destructive" });
        return false;
      }
      if (uploadData) {
        const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
        imageUrl = publicUrlData.publicUrl;
      }
    } else if (speciesToSave.image === '' && originalImageUrl && originalImageUrl.includes(BUCKET_NAME)) {
      const oldImageSupabasePath = originalImageUrl.split(`${BUCKET_NAME}/`)[1]?.split('?')[0];
      if (oldImageSupabasePath) {
          await supabase.storage.from(BUCKET_NAME).remove([oldImageSupabasePath]);
      }
      imageUrl = '';
    }
    
    speciesToSave.image = imageUrl;

    const { id, created_at, updated_at, ...dataToUpsert } = speciesToSave;
    
    if (isNew) {
      const { data, error } = await supabase
        .from('species')
        .insert(dataToUpsert)
        .select()
        .single();
      if (error) {
        toast({ title: "Erro ao adicionar espécie", description: error.message, variant: "destructive" });
        return false;
      }
      toast({ title: "Espécie cadastrada", description: `${data.commonName} adicionada com sucesso!` });
    } else {
      const { data, error } = await supabase
        .from('species')
        .update(dataToUpsert)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        toast({ title: "Erro ao atualizar espécie", description: error.message, variant: "destructive" });
        return false;
      }
      toast({ title: "Espécie atualizada", description: `${data.commonName} atualizada com sucesso!` });
    }
    await fetchSpecies();
    return true;
  };

  const deleteSpecies = async (id: string): Promise<boolean> => {
    if (!isAdminLoggedIn) {
      toast({ title: "Acesso Negado", variant: "destructive" });
      return false;
    }
    const speciesToDelete = speciesList.find(s => s.id === id);
    if (!speciesToDelete) return false;

    const confirmed = window.confirm("Tem certeza que deseja excluir esta espécie? Esta ação não pode ser desfeita.");
    if (!confirmed) return false;

    if (speciesToDelete.image && speciesToDelete.image.includes(BUCKET_NAME)) {
      const imagePath = speciesToDelete.image.split(`${BUCKET_NAME}/`)[1]?.split('?')[0];
      if (imagePath) {
        await supabase.storage.from(BUCKET_NAME).remove([imagePath]);
      }
    }

    const { error: deleteDbError } = await supabase.from('species').delete().eq('id', id);
    if (deleteDbError) {
      toast({ title: "Erro ao excluir espécie", description: deleteDbError.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Espécie removida" });
    await fetchSpecies();
    return true;
  };
  
  const reorderSpecies = async (currentIndex: number, direction: 'up' | 'down'): Promise<void> => {
    const newSpeciesList = [...speciesList];
    const itemToMove = newSpeciesList[currentIndex];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= newSpeciesList.length) return;
    
    const itemAtTarget = newSpeciesList[targetIndex];

    const updates = [
        supabase.from('species').update({ order: itemAtTarget.order }).eq('id', itemToMove.id),
        supabase.from('species').update({ order: itemToMove.order }).eq('id', itemAtTarget.id)
    ];

    const results = await Promise.all(updates);
    const errors = results.filter(res => res.error);

    if (errors.length > 0) {
        errors.forEach(err => toast({ title: "Erro ao reordenar", description: err.error?.message, variant: "destructive"}));
    } else {
        toast({ title: "Ordem atualizada" });
    }
    await fetchSpecies();
  };


  return {
    speciesList,
    isLoading,
    fetchSpecies,
    saveSpecies,
    deleteSpecies,
    reorderSpecies,
    maxOrder: speciesList.length > 0 ? Math.max(...speciesList.map(s => s.order || 0)) : 0,
  };
}
