import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Species } from '@/types/species';
import { useToast } from '@/components/ui/use-toast';
import type { ToastActionElement } from "@/components/ui/toast";
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { uploadFileToStorage, deleteFileFromStorage, type ToastFunction } from '@/services/fileStorageService';

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
    console.log("useSpeciesManagement: Attempting to fetch species (admin hook)...");
    setIsLoading(true);
    const { data, error } = await supabase
      .from('species')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error("useSpeciesManagement: Error fetching species (admin hook):", error);
      toast({ title: "Erro ao carregar espécies (admin)", description: error.message, variant: "destructive" });
      setSpeciesList([]);
    } else {
      console.log("useSpeciesManagement: Species fetched successfully (admin hook):", data);
      setSpeciesList(data as Species[]);
    }
    setIsLoading(false);
    console.log("useSpeciesManagement: Loading finished (admin hook).");
  }, [toast]);

  useEffect(() => {
    if (isAdminLoggedIn) { // Only fetch if admin is logged in, or adjust if needed for public parts using this.
      fetchSpecies();
    } else {
      setIsLoading(false); // Not logged in, not loading
      setSpeciesList([]); // Clear list if not logged in
    }
  }, [fetchSpecies, isAdminLoggedIn]);

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

    let finalImageUrl: string | null = speciesData.image;

    // Casting toast to unknown then to ToastFunction to satisfy the service's expected type
    // This is a workaround if the hook's toast type and service's toast type are slightly different
    // but generally compatible in usage for title/description/variant.
    const serviceToast = toast as unknown as ToastFunction;

    if (imageFile) {
      if (!isNew && originalImageUrl) {
        await deleteFileFromStorage(originalImageUrl, BUCKET_NAME, serviceToast);
      }
      const newUrl = await uploadFileToStorage(imageFile, BUCKET_NAME, serviceToast);
      if (!newUrl) {
        setIsLoading(false);
        return false; 
      }
      finalImageUrl = newUrl;
    } else if (!isNew && originalImageUrl && speciesData.image === null) {
      await deleteFileFromStorage(originalImageUrl, BUCKET_NAME, serviceToast);
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
        if (imageFile && finalImageUrl) await deleteFileFromStorage(finalImageUrl, BUCKET_NAME, serviceToast);
      } else if (data) {
        opMessage = `${data.commonName} adicionada com sucesso!`;
        success = true;
      } else {
        opMessage = `Erro ao adicionar espécie: resposta inesperada do servidor.`;
        console.error("Error inserting species: No data returned");
        if (imageFile && finalImageUrl) await deleteFileFromStorage(finalImageUrl, BUCKET_NAME, serviceToast);
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
           await deleteFileFromStorage(finalImageUrl, BUCKET_NAME, serviceToast);
        }
      } else if (data) {
        opMessage = `${data.commonName} atualizada com sucesso!`;
        success = true;
      } else {
        opMessage = `Erro ao atualizar espécie: resposta inesperada do servidor.`;
        console.error("Error updating species: No data returned");
         if (imageFile && finalImageUrl && finalImageUrl !== originalImageUrl) {
           await deleteFileFromStorage(finalImageUrl, BUCKET_NAME, serviceToast);
        }
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
    const serviceToast = toast as unknown as ToastFunction; // Casting for service compatibility

    if (speciesToDelete.image) { 
      await deleteFileFromStorage(speciesToDelete.image, BUCKET_NAME, serviceToast);
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

    // Swap orders
    itemToMove.order = targetOrder;
    itemAtTarget.order = currentOrder;
    
    newSpeciesList.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    setSpeciesList(newSpeciesList); 

    setIsLoading(true);
    try {
      const updates = [
          supabase.from('species').update({ order: targetOrder }).eq('id', itemToMove.id),
          supabase.from('species').update({ order: currentOrder }).eq('id', itemAtTarget.id)
      ];
      const results = await Promise.all(updates);
      
      const errors = results.filter(res => res.error);
      if (errors.length > 0) {
          errors.forEach(err => {
            toast({ title: "Erro ao reordenar", description: err.error?.message, variant: "destructive"});
            console.error("Reorder error: ", err.error);
          });
          await fetchSpecies(); 
      } else {
          toast({ title: "Ordem atualizada" });
          await fetchSpecies(); 
      }
    } catch (error: any) {
        toast({ title: "Erro Crítico ao Reordenar", description: error.message, variant: "destructive"});
        console.error("Critical reorder error: ", error);
        await fetchSpecies(); 
    } finally {
        setIsLoading(false);
    }
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
