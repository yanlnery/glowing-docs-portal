
import { supabase } from '@/integrations/supabase/client';
import { Species } from '@/types/species';
import { ToastFunction } from './fileStorageService';
import { uploadFileToStorage, deleteFileFromStorage } from './fileStorageService';

const BUCKET_NAME = 'species_images';

export const fetchSpeciesData = async (toast: ToastFunction): Promise<Species[]> => {
  console.log("SpeciesService: Attempting to fetch species data...");
  const { data, error } = await supabase
    .from('species')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error("SpeciesService: Error fetching species:", error);
    toast({ title: "Erro ao carregar espécies (serviço)", description: error.message, variant: "destructive" });
    return [];
  }
  
  console.log("SpeciesService: Species fetched successfully:", data);
  return data as Species[];
};

export const generateSlug = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

export const saveSpeciesData = async (
  speciesData: Omit<Species, 'id' | 'created_at' | 'updated_at'> & { id?: string },
  isNew: boolean,
  imageFile: File | null,
  originalImageUrl: string | null,
  toast: ToastFunction
): Promise<boolean> => {
  if (!speciesData.name || !speciesData.commonName) {
    toast({ title: "Erro de validação", description: "Preencha Nome Popular e Nome Científico.", variant: "destructive" });
    return false;
  }

  let speciesToSave = { ...speciesData };
  
  if (!speciesToSave.slug || speciesToSave.slug.trim() === '') {
    speciesToSave.slug = generateSlug(speciesData.name);
  }
  
  if (!speciesToSave.slug) {
    toast({ title: "Erro de validação", description: "Não foi possível gerar o slug. Verifique o Nome Científico.", variant: "destructive" });
    return false;
  }

  // Processar imagem
  let finalImageUrl = await processSpeciesImage(
    speciesData.image,
    isNew,
    imageFile,
    originalImageUrl,
    toast
  );

  if (finalImageUrl === false) {
    // Erro no processamento da imagem
    return false;
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

  return isNew ? 
    createNewSpecies(dbPayload, toast) : 
    updateExistingSpecies(dbPayload, speciesData.id, toast);
};

// Função auxiliar para processar a imagem da espécie
const processSpeciesImage = async (
  currentImage: string | null,
  isNew: boolean,
  imageFile: File | null,
  originalImageUrl: string | null,
  toast: ToastFunction
): Promise<string | null | false> => {
  let finalImageUrl: string | null = currentImage;

  try {
    if (imageFile) {
      // Se estamos atualizando e há um URL original, deletamos
      if (!isNew && originalImageUrl) {
        await deleteFileFromStorage(originalImageUrl, BUCKET_NAME, toast);
      }
      
      // Upload da nova imagem
      const newUrl = await uploadFileToStorage(imageFile, BUCKET_NAME, toast);
      if (!newUrl) {
        return false; // Erro no upload
      }
      finalImageUrl = newUrl;
    } 
    // Caso onde queremos remover a imagem existente
    else if (!isNew && originalImageUrl && currentImage === null) {
      await deleteFileFromStorage(originalImageUrl, BUCKET_NAME, toast);
      finalImageUrl = null;
    }
    
    return finalImageUrl;
  } catch (error) {
    console.error("Error processing species image:", error);
    toast({ 
      title: "Erro no processamento da imagem", 
      description: error instanceof Error ? error.message : "Erro desconhecido", 
      variant: "destructive" 
    });
    return false;
  }
};

// Função para criar uma nova espécie
const createNewSpecies = async (
  dbPayload: Omit<Species, 'id' | 'created_at' | 'updated_at'>,
  toast: ToastFunction
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('species')
    .insert(dbPayload)
    .select()
    .single();

  if (error) {
    const errorMsg = `Erro ao adicionar espécie: ${error.message}`;
    toast({ title: "Erro", description: errorMsg, variant: "destructive" });
    console.error(errorMsg, error);
    
    // Se houve erro e temos uma imagem, devemos limpar
    if (dbPayload.image) {
      await deleteFileFromStorage(dbPayload.image, BUCKET_NAME, toast);
    }
    return false;
  } 
  
  if (data) {
    toast({ 
      title: "Sucesso", 
      description: `${data.commonName} adicionada com sucesso!`, 
      variant: "default" 
    });
    return true;
  }
  
  const unexpectedMsg = "Erro ao adicionar espécie: resposta inesperada do servidor.";
  toast({ title: "Erro", description: unexpectedMsg, variant: "destructive" });
  console.error(unexpectedMsg);
  
  // Cleanup em caso de erro
  if (dbPayload.image) {
    await deleteFileFromStorage(dbPayload.image, BUCKET_NAME, toast);
  }
  return false;
};

// Função para atualizar uma espécie existente
const updateExistingSpecies = async (
  dbPayload: Omit<Species, 'id' | 'created_at' | 'updated_at'>,
  id: string | undefined,
  toast: ToastFunction
): Promise<boolean> => {
  if (!id) {
    const errorMsg = "ID da espécie ausente para atualização.";
    toast({ title: "Erro", description: errorMsg, variant: "destructive" });
    console.error(errorMsg);
    return false;
  }

  const { data, error } = await supabase
    .from('species')
    .update(dbPayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    const errorMsg = `Erro ao atualizar espécie: ${error.message}`;
    toast({ title: "Erro", description: errorMsg, variant: "destructive" });
    console.error(errorMsg, error);
    return false;
  } 
  
  if (data) {
    toast({ 
      title: "Sucesso", 
      description: `${data.commonName} atualizada com sucesso!`, 
      variant: "default" 
    });
    return true;
  }
  
  const unexpectedMsg = `Erro ao atualizar espécie: resposta inesperada do servidor.`;
  toast({ title: "Erro", description: unexpectedMsg, variant: "destructive" });
  console.error(unexpectedMsg);
  return false;
};

export const deleteSpeciesRecord = async (
  id: string,
  species: Species[],
  toast: ToastFunction
): Promise<boolean> => {
  const speciesToDelete = species.find(s => s.id === id);
  if (!speciesToDelete) {
    toast({title: "Erro", description: "Espécie não encontrada.", variant: "destructive"});
    return false;
  }

  // Deletar imagem se existir
  if (speciesToDelete.image) { 
    await deleteFileFromStorage(speciesToDelete.image, BUCKET_NAME, toast);
  }

  const { error: deleteDbError } = await supabase.from('species').delete().eq('id', id);
  
  if (deleteDbError) {
    const errorMsg = `Erro ao excluir espécie: ${deleteDbError.message}`;
    toast({ title: "Erro", description: errorMsg, variant: "destructive" });
    console.error("Error deleting species from DB: ", deleteDbError);
    return false;
  } 
  
  toast({ 
    title: "Sucesso", 
    description: `Espécie "${speciesToDelete.commonName}" removida com sucesso.`, 
    variant: "default" 
  });
  return true;
};

export const reorderSpeciesItems = async (
  speciesList: Species[],
  currentIndex: number,
  direction: 'up' | 'down',
  toast: ToastFunction
): Promise<Species[] | null> => {
  const newSpeciesList = [...speciesList];
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= newSpeciesList.length) {
    return null;
  }
  
  const itemToMove = newSpeciesList[currentIndex];
  const itemAtTarget = newSpeciesList[targetIndex];

  const currentOrder = Number(itemToMove.order) || 0;
  const targetOrder = Number(itemAtTarget.order) || 0;

  // Swap orders
  itemToMove.order = targetOrder;
  itemAtTarget.order = currentOrder;
  
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
      return null;
    }
    
    toast({ title: "Ordem atualizada" });
    
    // Retorna a lista atualizada e ordenada
    newSpeciesList.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    return newSpeciesList;
  } catch (error: any) {
    toast({ title: "Erro Crítico ao Reordenar", description: error.message, variant: "destructive"});
    console.error("Critical reorder error: ", error);
    return null;
  }
};
