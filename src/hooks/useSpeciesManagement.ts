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

  const deleteImageFromStorage = async (imageUrl: string | null | undefined) => {
    if (!imageUrl || !imageUrl.includes(BUCKET_NAME)) return;
    const imagePath = imageUrl.split(`${BUCKET_NAME}/`)[1]?.split('?')[0];
    if (imagePath) {
        const { error: storageError } = await supabase.storage.from(BUCKET_NAME).remove([imagePath]);
        if (storageError) {
            console.error("Error deleting image from storage:", storageError);
            toast({title: "Erro ao remover imagem antiga", description: storageError.message, variant: "default"});
            // Do not block the main operation for this, but inform user.
        }
    }
  };

  const saveSpecies = async (
    speciesData: Species,
    isNew: boolean,
    imageFile: File | null,
    originalImageUrl?: string | null // Used to check if old image needs deletion
  ): Promise<boolean> => {
    if (!isAdminLoggedIn) {
      toast({ title: "Acesso Negado", description: "Você precisa estar logado como administrador.", variant: "destructive" });
      return false;
    }
    if (!speciesData.name || !speciesData.commonName || !speciesData.description) {
      toast({ title: "Erro de validação", description: "Preencha Nome Popular, Nome Científico e Descrição.", variant: "destructive" });
      return false;
    }

    setIsLoading(true);
    let speciesToSave = { ...speciesData };
    if (!speciesToSave.slug || speciesToSave.slug.trim() === '') {
      speciesToSave.slug = generateSlug(speciesToSave.name);
    }
    if (!speciesToSave.slug) {
      toast({ title: "Erro de validação", description: "Não foi possível gerar o slug. Verifique o Nome Científico.", variant: "destructive" });
      setIsLoading(false);
      return false;
    }

    let finalImageUrl: string | null = speciesToSave.image; // Start with current image (or null if new)

    if (imageFile) { // A new image file is provided
      // Attempt to delete old image from storage if it exists and is different
      if (originalImageUrl && originalImageUrl !== speciesToSave.image) { // originalImageUrl provided and differs from current (e.g. current was cleared)
          await deleteImageFromStorage(originalImageUrl);
      } else if (speciesToSave.image && speciesToSave.image !== originalImageUrl) { // current image exists and differs (less likely scenario if originalImageUrl is primary)
          await deleteImageFromStorage(speciesToSave.image);
      }


      const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '_')}`;
      const filePath = `public/${fileName}`; // Supabase storage paths are typically relative to bucket root, 'public/' is a common convention if used as a folder
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, imageFile, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        toast({ title: "Erro no Upload da Imagem", description: `Falha ao enviar imagem: ${uploadError.message}`, variant: "destructive" });
        console.error("Image Upload Error:", uploadError);
        setIsLoading(false);
        return false; // Critical failure, stop here
      }
      if (uploadData) {
        const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
        finalImageUrl = publicUrlData.publicUrl;
      } else {
         // Should not happen if uploadError is null, but as a safeguard
        toast({ title: "Erro no Upload", description: "Não foi possível obter a URL da imagem após o upload.", variant: "destructive" });
        setIsLoading(false);
        return false;
      }
    } else if (speciesToSave.image === null && originalImageUrl) {
      // Image was explicitly removed (image set to null and there was an originalImageUrl)
      await deleteImageFromStorage(originalImageUrl);
      finalImageUrl = null;
    }
    // If no imageFile and speciesToSave.image is already set (e.g. during an update without image change), finalImageUrl retains that value.

    speciesToSave.image = finalImageUrl;

    // Remove properties not in the table or handled by DB
    const { id, created_at, updated_at, ...dataToUpsert } = speciesToSave;
    
    // Ensure 'order' is a number, default to 0 if somehow not set.
    const orderValue = typeof dataToUpsert.order === 'number' ? dataToUpsert.order : 0;
    const dbPayload = { ...dataToUpsert, order: orderValue };


    if (isNew) {
      console.log("Attempting to insert new species:", dbPayload);
      const { data, error } = await supabase
        .from('species')
        .insert(dbPayload)
        .select()
        .single();
      if (error) {
        toast({ title: "Erro ao adicionar espécie", description: `Detalhe: ${error.message} (Code: ${error.code})`, variant: "destructive" });
        console.error("Error inserting species:", error);
        // If insert fails after image upload, delete the newly uploaded image
        if (imageFile && finalImageUrl) {
            await deleteImageFromStorage(finalImageUrl);
        }
        setIsLoading(false);
        return false;
      }
      toast({ title: "Espécie cadastrada", description: `${data.commonName} adicionada com sucesso!` });
    } else {
      console.log("Attempting to update species (ID: " + id + "):", dbPayload);
      const { data, error } = await supabase
        .from('species')
        .update(dbPayload)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        toast({ title: "Erro ao atualizar espécie", description: `Detalhe: ${error.message} (Code: ${error.code})`, variant: "destructive" });
        console.error("Error updating species:", error);
        // Rollback for update is more complex, might not delete image if it was pre-existing and upload failed
        // For now, if imageFile was processed and new URL obtained, but DB fails, consider deleting the *newly uploaded* one
        if (imageFile && finalImageUrl && finalImageUrl !== originalImageUrl) {
             await deleteImageFromStorage(finalImageUrl);
        }
        setIsLoading(false);
        return false;
      }
      toast({ title: "Espécie atualizada", description: `${data.commonName} atualizada com sucesso!` });
    }
    await fetchSpecies();
    setIsLoading(false);
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

    setIsLoading(true);
    if (speciesToDelete.image) { // Check if image string is not null/empty
        await deleteImageFromStorage(speciesToDelete.image);
    }

    const { error: deleteDbError } = await supabase.from('species').delete().eq('id', id);
    if (deleteDbError) {
      toast({ title: "Erro ao excluir espécie", description: deleteDbError.message, variant: "destructive" });
      console.error("Error deleting species from DB: ", deleteDbError);
      setIsLoading(false);
      return false;
    }
    toast({ title: "Espécie removida" });
    await fetchSpecies();
    setIsLoading(false);
    return true;
  };
  
  const reorderSpecies = async (currentIndex: number, direction: 'up' | 'down'): Promise<void> => {
    const newSpeciesList = [...speciesList];
    const itemToMove = newSpeciesList[currentIndex];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= newSpeciesList.length) return;
    
    const itemAtTarget = newSpeciesList[targetIndex];

    // Ensure 'order' is treated as a number
    const currentOrder = Number(itemToMove.order) || 0;
    const targetOrder = Number(itemAtTarget.order) || 0;

    const updates = [
        supabase.from('species').update({ order: targetOrder }).eq('id', itemToMove.id),
        supabase.from('species').update({ order: currentOrder }).eq('id', itemAtTarget.id)
    ];

    setIsLoading(true);
    const results = await Promise.all(updates);
    const errors = results.filter(res => res.error);

    if (errors.length > 0) {
        errors.forEach(err => {
          toast({ title: "Erro ao reordenar", description: err.error?.message, variant: "destructive"});
          console.error("Reorder error: ", err.error);
        });
    } else {
        toast({ title: "Ordem atualizada" });
    }
    await fetchSpecies(); // This will set isLoading to false
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
