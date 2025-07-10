import { Species } from '@/types/species';
import { ToastFunction } from './fileStorageService';
// Funções internas de DB
import {
  fetchSpeciesDataFromDb,
  createSpeciesInDb,
  updateSpeciesInDb,
  deleteSpeciesFromDb,
  reorderSpeciesInDb,
} from './internal/speciesDb';
// Funções internas de Imagem
import {
  handleSpeciesImageUploadOrRemoval,
  deleteSpeciesImage,
  // SPECIES_BUCKET_NAME, // Não é usado diretamente aqui
} from './internal/speciesImage';

// Helper local para gerar slug, já que não é usado em mais nenhum local
const generateLocalSlug = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

export const fetchSpeciesData = async (toast: ToastFunction): Promise<Species[]> => {
  console.log("SpeciesService: Chamando fetchSpeciesDataFromDb...");
  const { data, error } = await fetchSpeciesDataFromDb();

  if (error) {
    toast({ title: "Erro ao carregar espécies", description: error.message, variant: "destructive" });
    return [];
  }
  
  console.log("SpeciesService: Espécies buscadas com sucesso.");
  // A lógica de mapeamento de commonname para commonName no fetch já está em SpeciesPage.tsx
  // Se precisarmos centralizar, podemos fazer aqui. Por ora, mantemos como está.
  return data || [];
};

export const saveSpeciesData = async (
  speciesFormData: Omit<Species, 'id' | 'created_at' | 'updated_at'> & { id?: string },
  isNew: boolean,
  imageFile: File | null,
  originalImageUrlFromDb: string | null,
  toast: ToastFunction
): Promise<boolean> => {
  if (!speciesFormData.name || !speciesFormData.commonname) {
    toast({ title: "Erro de validação", description: "Preencha Nome Popular e Nome Científico.", variant: "destructive" });
    return false;
  }

  let speciesToSave = { ...speciesFormData };
  
  if (!speciesToSave.slug || speciesToSave.slug.trim() === '') {
    speciesToSave.slug = generateLocalSlug(speciesFormData.name);
  }
  
  if (!speciesToSave.slug) {
    toast({ title: "Erro de validação", description: "Não foi possível gerar o slug. Verifique o Nome Científico.", variant: "destructive" });
    return false;
  }

  const imageProcessingResult = await handleSpeciesImageUploadOrRemoval(
    speciesToSave.image, 
    isNew,
    imageFile,
    originalImageUrlFromDb,
    toast
  );

  if (imageProcessingResult === false) {
    return false;
  }
  
  const finalImageUrl = imageProcessingResult;

  // Mapeamento para o banco de dados: commonName (frontend) -> commonname (db)
  const dbPayload = {
    name: speciesToSave.name,
    commonname: speciesToSave.commonname, // Campo corrigido para o DB
    slug: speciesToSave.slug,
    type: speciesToSave.type || 'outro',
    image: finalImageUrl,
    description: speciesToSave.description || '',
    characteristics: speciesToSave.characteristics || [],
    curiosities: speciesToSave.curiosities || [],
    order: typeof speciesToSave.order === 'number' ? speciesToSave.order : 0,
  };

  let result;
  if (isNew) {
    // Ajustar o tipo do payload para createSpeciesInDb se ele espera Omit<Species, ...>
    // que usa commonName. Se createSpeciesInDb espera a forma do DB, está ok.
    // Assumindo que createSpeciesInDb espera o formato do DB diretamente:
    result = await createSpeciesInDb(dbPayload as Omit<Species, 'id' | 'created_at' | 'updated_at' | 'commonName'> & { commonname: string });
  } else {
    if (!speciesFormData.id) {
        toast({ title: "Erro", description: "ID da espécie ausente para atualização.", variant: "destructive" });
        return false;
    }
    // Similar para updateSpeciesInDb
    result = await updateSpeciesInDb(dbPayload as Omit<Species, 'id' | 'created_at' | 'updated_at' | 'commonName'> & { commonname: string }, speciesFormData.id);
  }

  if (result.error) {
    const action = isNew ? "adicionar" : "atualizar";
    toast({ title: `Erro ao ${action} espécie`, description: result.error.message, variant: "destructive" });
    if (finalImageUrl && finalImageUrl !== originalImageUrlFromDb) {
        console.warn(`DB ${isNew ? 'insert' : 'update'} failed after image upload. Attempting to clean up uploaded image: ${finalImageUrl}`);
        await deleteSpeciesImage(finalImageUrl, toast);
    }
    return false;
  }

  if (result.data) {
    const action = isNew ? "adicionada" : "atualizada";
    toast({ 
      title: "Sucesso", 
      // result.data aqui pode vir com 'commonname'. Se o toast espera 'commonName', precisa mapear de volta ou usar .name
      description: `${result.data.commonname || result.data.name} ${action} com sucesso!`, 
      variant: "default" 
    });
    return true;
  }
  
  const unexpectedMsg = `Erro ao ${isNew ? "adicionar" : "atualizar"} espécie: resposta inesperada do servidor.`;
  toast({ title: "Erro", description: unexpectedMsg, variant: "destructive" });
  return false;
};

export const deleteSpeciesRecord = async (
  id: string,
  speciesList: Species[], // Mantido para encontrar a espécie e sua imagem
  toast: ToastFunction
): Promise<boolean> => {
  const speciesToDelete = speciesList.find(s => s.id === id);
  if (!speciesToDelete) {
    toast({title: "Erro", description: "Espécie não encontrada para exclusão.", variant: "destructive"});
    return false;
  }

  // Deletar imagem se existir
  if (speciesToDelete.image) { 
    // A função deleteSpeciesImage já lida com toasts de erro de imagem
    await deleteSpeciesImage(speciesToDelete.image, toast);
    // Não precisamos verificar o resultado aqui, prosseguimos para a exclusão do DB.
    // Se a imagem não for deletada, o registro do DB ainda será removido.
  }

  const { error: deleteDbError } = await deleteSpeciesFromDb(id);
  
  if (deleteDbError) {
    toast({ title: "Erro ao excluir espécie do DB", description: deleteDbError.message, variant: "destructive" });
    return false;
  } 
  
  toast({ 
    title: "Sucesso", 
    description: `Espécie "${speciesToDelete.commonname}" removida com sucesso.`, 
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
  // A lógica de reordenação e os updates no DB são tratados por reorderSpeciesInDb
  // reorderSpeciesInDb já lida com toasts para erros de DB.
  const updatedList = await reorderSpeciesInDb(speciesList, currentIndex, direction, toast);
  
  if (updatedList) {
    toast({ title: "Ordem atualizada com sucesso!" }); // Toast de sucesso geral da operação
    return updatedList;
  } else {
    // Se reorderSpeciesInDb retornou null, um erro já foi toastado por ela.
    // Podemos adicionar um toast mais genérico se necessário, ou confiar nos toasts específicos.
    // toast({ title: "Falha ao reordenar", description: "Não foi possível atualizar a ordem das espécies.", variant: "destructive" });
    return null;
  }
};
