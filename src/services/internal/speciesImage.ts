
import { supabase } from '@/integrations/supabase/client';
import { ToastFunction, uploadFileToStorage, deleteFileFromStorage } from '../fileStorageService';

export const SPECIES_BUCKET_NAME = 'species_images';

// Função auxiliar para processar a imagem da espécie
export const handleSpeciesImageUploadOrRemoval = async (
  currentImageValueInForm: string | null, // Valor atual do campo imagem no formulário
  isNewSpecies: boolean,
  newImageFile: File | null, // Novo arquivo de imagem selecionado
  originalImageUrlFromDb: string | null, // URL original da imagem (para espécies existentes)
  toast: ToastFunction
): Promise<string | null | false> => {
  let finalImageUrl: string | null = currentImageValueInForm;

  try {
    if (newImageFile) {
      // Se é uma atualização e havia uma imagem original no DB, deleta a antiga.
      // Isso acontece ANTES do upload da nova.
      if (!isNewSpecies && originalImageUrlFromDb) {
        console.log("Tentando deletar imagem antiga do DB:", originalImageUrlFromDb);
        await deleteFileFromStorage(originalImageUrlFromDb, SPECIES_BUCKET_NAME, toast);
      }
      
      // Upload da nova imagem
      console.log("Fazendo upload de nova imagem.");
      const newUrl = await uploadFileToStorage(newImageFile, SPECIES_BUCKET_NAME, toast);
      if (!newUrl) {
        console.error("Falha no upload da nova imagem.");
        return false; // Erro no upload, toast já foi chamado por uploadFileToStorage
      }
      finalImageUrl = newUrl;
      console.log("Nova imagem carregada:", finalImageUrl);
    } 
    // Caso onde a imagem foi removida no formulário (currentImageValueInForm é null),
    // é uma espécie existente (não nova) e havia uma imagem original no DB.
    else if (!isNewSpecies && originalImageUrlFromDb && currentImageValueInForm === null) {
      console.log("Removendo imagem existente do DB:", originalImageUrlFromDb);
      await deleteFileFromStorage(originalImageUrlFromDb, SPECIES_BUCKET_NAME, toast);
      finalImageUrl = null; // Imagem foi removida
    }
    // Se não há novo arquivo, e a imagem atual no formulário é a mesma que a do DB (ou ambas são null),
    // não faz nada com a imagem. finalImageUrl já está correto.

    return finalImageUrl;
  } catch (error) {
    console.error("Erro ao processar imagem da espécie:", error);
    toast({ 
      title: "Erro no processamento da imagem", 
      description: error instanceof Error ? error.message : "Erro desconhecido", 
      variant: "destructive" 
    });
    return false; // Indica falha no processamento da imagem
  }
};

export const deleteSpeciesImage = async (
  imageUrl: string | null,
  toast: ToastFunction
): Promise<void> => {
  if (imageUrl) {
    await deleteFileFromStorage(imageUrl, SPECIES_BUCKET_NAME, toast);
  }
};
