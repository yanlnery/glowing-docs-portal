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
  }, [toast]);

  useEffect(() => {
    fetchSpecies();
  }, [fetchSpecies]);

  const uploadSpeciesImage = async (file: File, oldImageUrl?: string | null): Promise<string | null> => {
    if (oldImageUrl) {
      await deleteImageFromStorage(oldImageUrl);
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = fileName;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      toast({ title: "Erro no Upload da Imagem", description: `Falha ao enviar imagem: ${uploadError.message}`, variant: "destructive" });
      console.error("Image Upload Error:", uploadError);
      return null;
    }
    if (uploadData) {
      const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
      return publicUrlData.publicUrl;
    }
    return null;
  };

  const deleteImageFromStorage = async (imageUrl: string | null | undefined) => {
    if (!imageUrl || !imageUrl.includes(BUCKET_NAME)) return;
    
    try {
      const url = new URL(imageUrl);
      const pathSegments = url.pathname.split('/');
      const bucketNameInPath = BUCKET_NAME;
      const bucketIndex = pathSegments.findIndex(segment => segment === bucketNameInPath);
      
      if (bucketIndex !== -1 && pathSegments.length > bucketIndex + 1) {
        const filePathInBucket = pathSegments.slice(bucketIndex + 1).join('/');
        if (filePathInBucket) {
          console.log("Attempting to remove image from storage:", filePathInBucket);
          const { error: storageError } = await supabase.storage.from(BUCKET_NAME).remove([filePathInBucket]);
          if (storageError) {
              console.error("Error deleting image from storage:", storageError);
              toast({title: "Erro ao remover imagem antiga do armazenamento", description: storageError.message, variant: "default"});
          }
        }
      } else {
        console.warn("Could not parse image path for deletion from URL:", imageUrl);
      }
    } catch (e) {
      console.error("Error parsing image URL for deletion:", e);
    }
  };

  const saveSpecies = async (
    speciesData: Omit<Species, 'id' | 'created_at' | 'updated_at'> & { id?: string },
    isNew: boolean,
    imageFile: File | null,
    originalImageUrl?: string | null 
  ): Promise<boolean> => {
    if (!isAdminLoggedIn) {
      toast({ title: "Acesso Negado", description: "Você precisa estar logado como administrador.", variant: "destructive" });
      return false;
    }
    if (!speciesData.name || !speciesData.commonName) {
      toast({ title: "Erro de validação", description: "Preencha Nome Popular e Nome Científico.", variant: "destructive" });
      return false;
    }

    setIsLoading(true);
    let speciesToSave = { ...speciesData };
    
    if (!speciesToSave.slug || speciesToSave.slug.trim() === '') {
      speciesToSave.slug = generateSlug(speciesData.name);
    }
    if (!speciesToSave.slug) {
      toast({ title: "Erro de validação", description: "Não foi possível gerar o slug. Verifique o Nome Científico.", variant: "destructive" });
      setIsLoading(false);
      return false;
    }

    let finalImageUrl: string | null = speciesToSave.image || null;

    if (imageFile) { 
      const newUrl = await uploadSpeciesImage(imageFile, isNew ? null : originalImageUrl);
      if (!newUrl) {
        setIsLoading(false);
        return false; 
      }
      finalImageUrl = newUrl;
    } else if (speciesToSave.image === null && originalImageUrl && !isNew) {
      await deleteImageFromStorage(originalImageUrl);
      finalImageUrl = null;
    }

    const dbPayload: Omit<Species, 'id' | 'created_at' | 'updated_at'> = {
      name: speciesToSave.name,
      commonName: speciesToSave.commonName,
      slug: speciesToSave.slug,
      type: speciesToSave.type || 'outro',
      image: finalImageUrl,
      description: speciesToSave.description || '',
      characteristics: speciesToSave.characteristics || [],
      curiosities: speciesToSave.curiosities || [],
      order: typeof speciesToSave.order === 'number' ? speciesToSave.order : 0,
    };

    let success = false;
    let opMessage = "";

    if (isNew) {
      const { data, error } = await supabase
        .from('species')
        .insert(dbPayload)
        .select()
        .single();
      if (error) {
        opMessage = `Erro ao adicionar espécie: ${error.message}`;
        console.error("Error inserting species:", error);
        if (imageFile && finalImageUrl) await deleteImageFromStorage(finalImageUrl);
      } else {
        opMessage = `${data.commonName} adicionada com sucesso!`;
        success = true;
      }
    } else if (speciesToSave.id) {
      const { data, error } = await supabase
        .from('species')
        .update(dbPayload)
        .eq('id', speciesToSave.id)
        .select()
        .single();
      if (error) {
        opMessage = `Erro ao atualizar espécie: ${error.message}`;
        console.error("Error updating species:", error);
        if (imageFile && finalImageUrl && finalImageUrl !== originalImageUrl) {
          await deleteImageFromStorage(finalImageUrl);
        }
      } else {
        opMessage = `${data.commonName} atualizada com sucesso!`;
        success = true;
      }
    } else {
      opMessage = "ID da espécie ausente para atualização.";
      console.error(opMessage);
    }

    toast({ title: success ? "Sucesso" : "Erro", description: opMessage, variant: success ? "default" : "destructive" });
    if (success) await fetchSpecies();
    setIsLoading(false);
    return success;
  };

  const deleteSpecies = async (id: string): Promise<boolean> => {
    if (!isAdminLoggedIn) {
      toast({ title: "Acesso Negado", variant: "destructive" });
      return false;
    }
    const speciesToDelete = speciesList.find(s => s.id === id);
    if (!speciesToDelete) {
      toast({title: "Erro", description: "Espécie não encontrada.", variant: "destructive"});
      return false;
    }

    const confirmed = window.confirm(`Tem certeza que deseja excluir a espécie "${speciesToDelete.commonName}"? Esta ação não pode ser desfeita.`);
    if (!confirmed) return false;

    setIsLoading(true);
    if (speciesToDelete.image) { 
      await deleteImageFromStorage(speciesToDelete.image);
    }

    const { error: deleteDbError } = await supabase.from('species').delete().eq('id', id);
    let success = false;
    let opMessage = "";

    if (deleteDbError) {
      opMessage = `Erro ao excluir espécie: ${deleteDbError.message}`;
      console.error("Error deleting species from DB: ", deleteDbError);
    } else {
      opMessage = `Espécie "${speciesToDelete.commonName}" removida com sucesso.`;
      success = true;
    }
    
    toast({ title: success ? "Sucesso" : "Erro", description: opMessage, variant: success ? "default" : "destructive" });
    if (success) await fetchSpecies();
    setIsLoading(false);
    return success;
  };
  
  const reorderSpecies = async (currentIndex: number, direction: 'up' | 'down'): Promise<void> => {
    const newSpeciesList = [...speciesList];
    const itemToMove = newSpeciesList[currentIndex];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= newSpeciesList.length) return;
    
    const itemAtTarget = newSpeciesList[targetIndex];

    const currentOrder = Number(itemToMove.order) || 0;
    const targetOrder = Number(itemAtTarget.order) || 0;

    itemToMove.order = targetOrder;
    itemAtTarget.order = currentOrder;
    newSpeciesList.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    setSpeciesList(newSpeciesList);

    setIsLoading(true);
    const updates = [
        supabase.from('species').update({ order: targetOrder }).eq('id', itemToMove.id),
        supabase.from('species').update({ order: currentOrder }).eq('id', itemAtTarget.id)
    ];
    const results = await Promise.all(updates);
    setIsLoading(false);

    const errors = results.filter(res => res.error);
    if (errors.length > 0) {
        errors.forEach(err => {
          toast({ title: "Erro ao reordenar", description: err.error?.message, variant: "destructive"});
          console.error("Reorder error: ", err.error);
        });
    } else {
        toast({ title: "Ordem atualizada" });
    }
    await fetchSpecies(); // This will set isLoading to false after fetching
  };

  return {
    speciesList,
    isLoading,
    fetchSpecies,
    saveSpecies,
    deleteSpecies,
    reorderSpecies,
    maxOrder: speciesList.length > 0 ? Math.max(...speciesList.map(s => Number(s.order) || 0)) : 0,
  };
}
