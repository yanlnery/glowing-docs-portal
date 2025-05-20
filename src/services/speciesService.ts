
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
  SPECIES_BUCKET_NAME, // Importar se ainda necessário, ou usar o de speciesImage.ts
} from './internal/speciesImage';
// fileStorageService pode não ser mais necessário aqui diretamente
// import { uploadFileToStorage, deleteFileFromStorage } from './fileStorageService'; // Remover se não usado diretamente


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
  return data || [];
};

// A função generateSlug foi movida para ser local (generateLocalSlug) ou removida se não for mais exportada.
// export const generateSlug = generateLocalSlug; // Remover se não precisar exportar

export const saveSpeciesData = async (
  speciesFormData: Omit<Species, 'id' | 'created_at' | 'updated_at'> & { id?: string },
  isNew: boolean,
  imageFile: File | null, // Novo arquivo de imagem
  originalImageUrlFromDb: string | null, // URL da imagem atualmente no DB (para edições)
  toast: ToastFunction
): Promise<boolean> => {
  if (!speciesFormData.name || !speciesFormData.commonName) {
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

  // Processar imagem
  // currentImageValueInForm é o speciesToSave.image, que reflete o estado do formulário
  const imageProcessingResult = await handleSpeciesImageUploadOrRemoval(
    speciesToSave.image, // Valor da imagem vindo do formulário
    isNew,
    imageFile,
    originalImageUrlFromDb,
    toast
  );

  if (imageProcessingResult === false) { // false indica erro no processamento da imagem
    // Toast já foi chamado por handleSpeciesImageUploadOrRemoval ou fileStorageService
    return false;
  }
  
  const finalImageUrl = imageProcessingResult; // Pode ser string (URL) ou null

  const dbPayload: Omit<Species, 'id' | 'created_at' | 'updated_at'> = {
    name: speciesToSave.name,
    commonName: speciesToSave.commonName,
    slug: speciesToSave.slug,
    type: speciesToSave.type || 'outro',
    image: finalImageUrl, // Usa a URL final da imagem processada
    description: speciesToSave.description || '',
    characteristics: speciesToSave.characteristics || [],
    curiosities: speciesToSave.curiosities || [],
    order: typeof speciesToSave.order === 'number' ? speciesToSave.order : 0,
  };

  let result;
  if (isNew) {
    result = await createSpeciesInDb(dbPayload);
  } else {
    if (!speciesFormData.id) {
        toast({ title: "Erro", description: "ID da espécie ausente para atualização.", variant: "destructive" });
        return false;
    }
    result = await updateSpeciesInDb(dbPayload, speciesFormData.id);
  }

  if (result.error) {
    const action = isNew ? "adicionar" : "atualizar";
    toast({ title: `Erro ao ${action} espécie`, description: result.error.message, variant: "destructive" });
    // Se houve erro ao salvar no DB e uma nova imagem foi carregada, ela precisa ser removida do storage.
    // Isso é complexo porque a imagem antiga já pode ter sido removida.
    // Por simplicidade, a imagem carregada pode ficar órfã ou uma lógica de rollback mais complexa seria necessária.
    // O handleSpeciesImageUploadOrRemoval já lida com a remoção da imagem antiga ANTES do upload da nova.
    // Se o upload da NOVA falha, ela não existe. Se o upload da NOVA SUCEDE mas o DB falha, a NOVA imagem existe.
    // Para reverter, precisaríamos saber qual era a originalImageUrlFromDb para restaurá-la, o que não é trivial.
    // E se a nova imagem foi carregada (finalImageUrl não é o originalImageUrlFromDb), e o DB falhou, deletamos a nova.
    if (finalImageUrl && finalImageUrl !== originalImageUrlFromDb) {
        console.warn(`DB ${isNew ? 'insert' : 'update'} failed after image upload. Attempting to clean up uploaded image: ${finalImageUrl}`);
        await deleteSpeciesImage(finalImageUrl, toast); // Tenta limpar a nova imagem
    }
    return false;
  }

  if (result.data) {
    const action = isNew ? "adicionada" : "atualizada";
    toast({ 
      title: "Sucesso", 
      description: `${result.data.commonName} ${action} com sucesso!`, 
      variant: "default" 
    });
    return true;
  }
  
  // Caso inesperado
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
