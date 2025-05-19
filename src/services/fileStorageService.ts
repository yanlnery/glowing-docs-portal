import { supabase } from '@/integrations/supabase/client';
import React from 'react';
// Import ToastActionElement
import type { ToastActionElement } from "@/components/ui/toast";

// Define um tipo para a função toast para clareza
type ToastFunction = (props: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ToastActionElement; // Updated to use ToastActionElement
}) => void;

const getFilePathFromStorageUrl = (fileUrl: string, bucketName: string): string | null => {
  if (!fileUrl || !fileUrl.includes(bucketName)) return null;
  try {
    const url = new URL(fileUrl);
    const pathSegments = url.pathname.split('/');
    // Encontra o nome do bucket nos segmentos do caminho e pega tudo depois dele
    // Ex: /storage/v1/object/public/species_images/image.png -> species_images/image.png
    // Ex: /storage/v1/object/public/bucketName/optional/folders/image.png -> optional/folders/image.png
    const bucketSegmentIndex = pathSegments.findIndex(segment => segment === bucketName);
    
    if (bucketSegmentIndex !== -1 && pathSegments.length > bucketSegmentIndex + 1) {
      // O caminho no Supabase Storage não inclui o nome do bucket na API de remoção/upload.
      // Ele começa do diretório logo após o nome do bucket.
      return pathSegments.slice(bucketSegmentIndex + 1).join('/');
    }
    console.warn(`Não foi possível extrair o caminho do arquivo da URL: ${fileUrl} para o bucket ${bucketName}`);
    return null;
  } catch (e) {
    console.error(`Erro ao analisar a URL do arquivo: ${e}, URL: ${fileUrl}`);
    return null;
  }
};

export const uploadFileToStorage = async (
  file: File,
  bucketName: string,
  toast: ToastFunction
): Promise<string | null> => {
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  // O Supabase considera o filePath como o caminho dentro do bucket.
  // Se não houver pastas, será apenas o nome do arquivo.
  const filePath = fileName;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { cacheControl: '3600', upsert: true });

  if (uploadError) {
    toast({ title: "Erro no Upload do Arquivo", description: `Falha ao enviar arquivo: ${uploadError.message}`, variant: "destructive" });
    console.error("File Upload Error:", uploadError);
    return null;
  }
  if (uploadData) {
    // uploadData.path é o filePath que usamos
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  }
  return null;
};

export const deleteFileFromStorage = async (
  fileUrl: string | null | undefined,
  bucketName: string,
  toast: ToastFunction
): Promise<void> => {
  if (!fileUrl) return;

  const filePathInBucket = getFilePathFromStorageUrl(fileUrl, bucketName);

  if (filePathInBucket) {
    console.log(`Tentando remover arquivo do armazenamento: ${filePathInBucket} no bucket ${bucketName}`);
    const { error: storageError } = await supabase.storage.from(bucketName).remove([filePathInBucket]);
    if (storageError) {
      console.error("Erro ao deletar arquivo do armazenamento:", storageError);
      // Corrigido para variant: "destructive" para erros
      toast({ title: "Erro ao remover arquivo", description: storageError.message, variant: "destructive" });
    } else {
      // Toast de sucesso opcional, pode ser útil para debug ou feedback específico
      // toast({ title: "Sucesso", description: "Arquivo antigo removido do armazenamento.", variant: "default" });
      console.log(`Arquivo ${filePathInBucket} removido com sucesso do bucket ${bucketName}`);
    }
  }
};
