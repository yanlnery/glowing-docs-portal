import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Manual, ManualFormData, ManualCategory } from '@/types/manual';
import { useToast } from '@/components/ui/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const MANUALS_BUCKET = 'manuals_images';

export function useManualsManagement() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAdminLoggedIn } = useAdminAuth();

  const fetchManuals = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('manuals')
      .select('*')
      .order('title', { ascending: true });

    if (error) {
      toast({ title: "Erro ao carregar manuais", description: error.message, variant: "destructive" });
      setManuals([]);
    } else {
      setManuals(data as Manual[]);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchManuals();
  }, [fetchManuals]);

  const deleteFileFromStorage = async (fileUrl: string | null | undefined): Promise<void> => {
    if (!fileUrl || !fileUrl.includes(MANUALS_BUCKET)) return;
    
    try {
      const url = new URL(fileUrl);
      const pathSegments = url.pathname.split('/');
      const bucketNameInPath = MANUALS_BUCKET;
      const bucketIndex = pathSegments.findIndex(segment => segment === bucketNameInPath);

      if (bucketIndex !== -1 && pathSegments.length > bucketIndex + 1) {
        const filePathInBucket = pathSegments.slice(bucketIndex + 1).join('/');
        if (filePathInBucket) {
          console.log(`Attempting to remove file from ${MANUALS_BUCKET}:`, filePathInBucket);
          const { error: deleteError } = await supabase.storage.from(MANUALS_BUCKET).remove([filePathInBucket]);
          if (deleteError) {
            console.error("Error deleting old file from storage: ", deleteError);
            toast({ title: "Aviso", description: `Não foi possível remover o arquivo antigo do armazenamento: ${deleteError.message}`, variant: "default"});
          }
        }
      } else {
         console.warn("Could not parse file path for deletion from URL:", fileUrl);
      }
    } catch(e) {
        console.error("Error parsing file URL for deletion:", e);
    }
  };
  
  const uploadManualFile = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(MANUALS_BUCKET)
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      toast({ title: "Erro no Upload", description: `Falha ao enviar arquivo ${file.name}: ${uploadError.message}`, variant: "destructive" });
      console.error("Upload error for manual file: ", uploadError);
      return null;
    }
    if (uploadData) {
      const { data: publicUrlData } = supabase.storage.from(MANUALS_BUCKET).getPublicUrl(fileName);
      return publicUrlData.publicUrl;
    }
    return null;
  };

  const saveManual = async (formData: ManualFormData, isNew: boolean): Promise<boolean> => {
    if (!isAdminLoggedIn) {
      toast({ title: "Acesso Negado", variant: "destructive" });
      return false;
    }
     if (!formData.title) {
      toast({ title: "Erro de validação", description: "O título do manual é obrigatório.", variant: "destructive" });
      return false;
    }

    setIsLoading(true);
    let newImageUrl = formData.image;
    let newPdfUrl = formData.pdf_url;

    // Handle Image Upload
    if (formData.imageFile) {
      if (!isNew && formData.originalImageUrl) await deleteFileFromStorage(formData.originalImageUrl);
      newImageUrl = await uploadManualFile(formData.imageFile);
      if (!newImageUrl) {
        setIsLoading(false);
        return false;
      }
    } else if (formData.image === null && formData.originalImageUrl && !isNew) {
        await deleteFileFromStorage(formData.originalImageUrl);
        newImageUrl = null;
    }

    // Handle PDF Upload
    if (formData.pdfFile) {
      if (!isNew && formData.originalPdfUrl) await deleteFileFromStorage(formData.originalPdfUrl);
      newPdfUrl = await uploadManualFile(formData.pdfFile);
      if (!newPdfUrl) {
        if (formData.imageFile && newImageUrl) await deleteFileFromStorage(newImageUrl); 
        setIsLoading(false);
        return false;
      }
    } else if (formData.pdf_url === null && formData.originalPdfUrl && !isNew) {
        await deleteFileFromStorage(formData.originalPdfUrl);
        newPdfUrl = null;
    }

    const manualToSave: Omit<Manual, 'id' | 'created_at' | 'updated_at'> = {
      title: formData.title,
      description: formData.description || null,
      pages: formData.pages || null,
      category: formData.category || null,
      image: newImageUrl,
      pdf_url: newPdfUrl,
    };

    let success = false;
    let opMessage = "";

    if (isNew) {
      const { data, error } = await supabase.from('manuals').insert(manualToSave).select().single();
      if (error) {
        opMessage = `Erro ao adicionar manual: ${error.message}`;
        console.error("Error inserting manual: ", error);
        if (formData.imageFile && newImageUrl) await deleteFileFromStorage(newImageUrl);
        if (formData.pdfFile && newPdfUrl) await deleteFileFromStorage(newPdfUrl);
      } else {
        opMessage = `Manual "${data.title}" foi adicionado.`;
        success = true;
      }
    } else if (formData.id) {
      const { data, error } = await supabase.from('manuals').update(manualToSave).eq('id', formData.id).select().single();
      if (error) {
        opMessage = `Erro ao atualizar manual: ${error.message}`;
        console.error("Error updating manual: ", error);
        if (formData.imageFile && newImageUrl && newImageUrl !== formData.originalImageUrl) await deleteFileFromStorage(newImageUrl);
        if (formData.pdfFile && newPdfUrl && newPdfUrl !== formData.originalPdfUrl) await deleteFileFromStorage(newPdfUrl);
      } else {
        opMessage = `Manual "${data.title}" foi atualizado.`;
        success = true;
      }
    } else {
        opMessage = "ID do manual ausente para atualização.";
        console.error(opMessage);
    }
    
    toast({ title: success ? "Sucesso" : "Erro", description: opMessage, variant: success ? "default" : "destructive" });
    if (success) await fetchManuals();
    setIsLoading(false);
    return success;
  };

  const deleteManual = async (manualId: string): Promise<boolean> => {
    if (!isAdminLoggedIn) {
      toast({ title: "Acesso Negado", variant: "destructive" });
      return false;
    }
    
    const manualToDelete = manuals.find(m => m.id === manualId);
    if (!manualToDelete) {
        toast({title: "Erro", description: "Manual não encontrado.", variant: "destructive"});
        return false;
    }

    const confirmed = window.confirm(`Tem certeza que deseja excluir o manual "${manualToDelete.title}"? Esta ação também removerá a imagem de capa e o arquivo PDF associados.`);
    if (!confirmed) return false;

    setIsLoading(true);
    if (manualToDelete.image) await deleteFileFromStorage(manualToDelete.image);
    if (manualToDelete.pdf_url) await deleteFileFromStorage(manualToDelete.pdf_url);

    const { error: dbError } = await supabase.from('manuals').delete().eq('id', manualId);
    let success = false;
    let opMessage = "";

    if (dbError) {
      opMessage = `Erro ao excluir manual do banco de dados: ${dbError.message}`;
      console.error("Error deleting manual from DB: ", dbError);
    } else {
      opMessage = `Manual "${manualToDelete.title}" foi removido.`;
      success = true;
    }

    toast({ title: success ? "Sucesso" : "Erro", description: opMessage, variant: success ? "default" : "destructive" });
    if (success) await fetchManuals();
    setIsLoading(false);
    return success;
  };

  return { manuals, isLoading, fetchManuals, saveManual, deleteManual };
}
