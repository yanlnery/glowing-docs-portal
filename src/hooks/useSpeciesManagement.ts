import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Species } from '@/types/species';
import { useToast } from '@/components/ui/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { uploadFileToStorage, deleteFileFromStorage } from '@/services/fileStorageService';

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

    let finalImageUrl: string | null = speciesData.image; // Imagem atual do formulário

    if (imageFile) { // Novo arquivo de imagem fornecido
      // Se for uma atualização e existia uma imagem original, delete-a primeiro
      if (!isNew && originalImageUrl) {
        await deleteFileFromStorage(originalImageUrl, BUCKET_NAME, toast);
      }
      // Faça o upload da nova imagem
      const newUrl = await uploadFileToStorage(imageFile, BUCKET_NAME, toast);
      if (!newUrl) {
        setIsLoading(false);
        // O upload falhou, a imagem antiga (se existia) já foi deletada.
        // O toast de erro do upload já foi emitido pelo serviço.
        return false; 
      }
      finalImageUrl = newUrl;
    } else if (!isNew && originalImageUrl && speciesData.image === null) {
      // Nenhum novo arquivo, é uma atualização, existia uma imagem original E a imagem no formulário é null (foi removida)
      await deleteFileFromStorage(originalImageUrl, BUCKET_NAME, toast);
      finalImageUrl = null;
    }
    // Se nenhum novo arquivo foi fornecido e a imagem não foi explicitamente removida (speciesData.image não é null),
    // finalImageUrl já contém o valor correto (seja a URL existente ou null para novas espécies sem imagem).

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
        // Se o upload da imagem foi bem-sucedido mas a inserção no DB falhou, reverter o upload
        if (imageFile && finalImageUrl) await deleteFileFromStorage(finalImageUrl, BUCKET_NAME, toast);
      } else if (data) {
        opMessage = `${data.commonName} adicionada com sucesso!`;
        success = true;
      } else {
        opMessage = `Erro ao adicionar espécie: resposta inesperada do servidor.`;
        console.error("Error inserting species: No data returned");
        if (imageFile && finalImageUrl) await deleteFileFromStorage(finalImageUrl, BUCKET_NAME, toast);
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
        // Se uma nova imagem foi carregada (finalImageUrl) e é diferente da original,
        // e a atualização do DB falhou, teoricamente a imagem nova não deveria ter sido "confirmada".
        // A imagem antiga já foi deletada se uma nova foi provida.
        // Se a nova imagem (finalImageUrl) foi carregada com sucesso, mas o update falhou,
        // e essa finalImageUrl é diferente da originalImageUrl, reverter o upload da nova imagem.
        if (imageFile && finalImageUrl && finalImageUrl !== originalImageUrl) {
           // A imagem antiga já foi deletada. Se o upload da nova deu certo mas o db falhou, deletar a nova.
           await deleteFileFromStorage(finalImageUrl, BUCKET_NAME, toast);
        }
      } else if (data) {
        opMessage = `${data.commonName} atualizada com sucesso!`;
        success = true;
      } else {
        opMessage = `Erro ao atualizar espécie: resposta inesperada do servidor.`;
        console.error("Error updating species: No data returned");
         if (imageFile && finalImageUrl && finalImageUrl !== originalImageUrl) {
           await deleteFileFromStorage(finalImageUrl, BUCKET_NAME, toast);
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
    // Deleta a imagem do storage se existir
    if (speciesToDelete.image) { 
      await deleteFileFromStorage(speciesToDelete.image, BUCKET_NAME, toast);
    }

    const { error: deleteDbError } = await supabase.from('species').delete().eq('id', id);
    let success = false;
    let opMessage = "";

    if (deleteDbError) {
      opMessage = `Erro ao excluir espécie: ${deleteDbError.message}`;
      console.error("Error deleting species from DB: ", deleteDbError);
      // Se a deleção do DB falhar, a imagem já foi deletada. Considerar o que fazer aqui.
      // No momento, a imagem fica deletada.
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
    
    // Optimistically update UI
    newSpeciesList.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    setSpeciesList(newSpeciesList); // This should trigger a re-render with sorted list

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
          // Revert optimistic update on error by re-fetching
          await fetchSpecies(); 
      } else {
          toast({ title: "Ordem atualizada" });
          // No need to call fetchSpecies() if successful, optimistic update is fine
          // However, if order values are not perfectly consecutive or unique, fetching ensures consistency.
          // For safety, let's keep fetchSpecies() or ensure orders are managed to be unique and consecutive if possible.
          await fetchSpecies(); // Re-fetch to ensure consistency and correct order values
      }
    } catch (error: any) {
        toast({ title: "Erro Crítico ao Reordenar", description: error.message, variant: "destructive"});
        console.error("Critical reorder error: ", error);
        await fetchSpecies(); // Revert on critical error
    } finally {
        setIsLoading(false); // Ensure loading is set to false
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
