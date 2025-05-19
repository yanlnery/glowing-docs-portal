
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Manual, ManualFormData } from '@/types/manual';
import { useToast } from '@/components/ui/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const MANUALS_BUCKET = 'manuals_images'; // Bucket for both images and PDFs

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
    if (isAdminLoggedIn) {
      fetchManuals();
    } else {
      setManuals([]);
      setIsLoading(false);
    }
  }, [fetchManuals, isAdminLoggedIn]);

  const uploadFile = async (file: File, pathPrefix: string): Promise<string | null> => {
    const fileName = `${pathPrefix}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(MANUALS_BUCKET)
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      toast({ title: "Erro no Upload", description: `Falha ao enviar arquivo ${file.name}: ${uploadError.message}`, variant: "destructive" });
      console.error("Upload error: ", uploadError);
      return null;
    }
    if (uploadData) {
      const { data: publicUrlData } = supabase.storage.from(MANUALS_BUCKET).getPublicUrl(fileName);
      return publicUrlData.publicUrl;
    }
    return null;
  };

  const deleteFileFromStorage = async (fileUrl: string | null | undefined) => {
    if (!fileUrl || !fileUrl.includes(MANUALS_BUCKET)) return;
    const filePath = fileUrl.split(`${MANUALS_BUCKET}/`)[1]?.split('?')[0];
    if (filePath) {
      const { error: deleteError } = await supabase.storage.from(MANUALS_BUCKET).remove([filePath]);
      if (deleteError) {
        console.error("Error deleting old file from storage: ", deleteError);
        // Non-critical, so don't block main operation, but log it
        toast({ title: "Aviso", description: `Não foi possível remover o arquivo antigo do armazenamento: ${deleteError.message}`, variant: "default"});
      }
    }
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
      await deleteFileFromStorage(formData.originalImageUrl); // Delete old if new one is uploaded
      newImageUrl = await uploadFile(formData.imageFile, 'covers');
      if (!newImageUrl && formData.imageFile) { // Upload failed
        setIsLoading(false);
        return false;
      }
    } else if (formData.image === null && formData.originalImageUrl) { // Image explicitly removed
        await deleteFileFromStorage(formData.originalImageUrl);
        newImageUrl = null;
    }


    // Handle PDF Upload
    if (formData.pdfFile) {
      await deleteFileFromStorage(formData.originalPdfUrl); // Delete old if new one is uploaded
      newPdfUrl = await uploadFile(formData.pdfFile, 'pdfs');
      if (!newPdfUrl && formData.pdfFile) { // Upload failed
         // Rollback image upload if PDF upload fails and image was uploaded in this save operation
        if (formData.imageFile && newImageUrl) await deleteFileFromStorage(newImageUrl);
        setIsLoading(false);
        return false;
      }
    } else if (formData.pdf_url === null && formData.originalPdfUrl) { // PDF explicitly removed
        await deleteFileFromStorage(formData.originalPdfUrl);
        newPdfUrl = null;
    }

    const manualToSave: Omit<Manual, 'id' | 'created_at' | 'updated_at'> & { id?: string } = {
      title: formData.title,
      description: formData.description,
      pages: formData.pages,
      category: formData.category,
      image: newImageUrl,
      pdf_url: newPdfUrl,
    };

    if (isNew) {
      const { data, error } = await supabase.from('manuals').insert(manualToSave).select().single();
      if (error) {
        toast({ title: "Erro ao adicionar manual", description: error.message, variant: "destructive" });
        console.error("Error inserting manual: ", error);
        // Rollback uploads if DB insert fails
        if (formData.imageFile && newImageUrl) await deleteFileFromStorage(newImageUrl);
        if (formData.pdfFile && newPdfUrl) await deleteFileFromStorage(newPdfUrl);
        setIsLoading(false);
        return false;
      }
      toast({ title: "Manual adicionado", description: `${data.title} foi adicionado.` });
    } else if (formData.id) {
      const { data, error } = await supabase.from('manuals').update(manualToSave).eq('id', formData.id).select().single();
      if (error) {
        toast({ title: "Erro ao atualizar manual", description: error.message, variant: "destructive" });
        console.error("Error updating manual: ", error);
        // Consider rollback strategy for updates if needed, though more complex
        setIsLoading(false);
        return false;
      }
      toast({ title: "Manual atualizado", description: `${data.title} foi atualizado.` });
    }
    await fetchManuals();
    setIsLoading(false);
    return true;
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

    const confirmed = window.confirm(`Tem certeza que deseja excluir o manual "${manualToDelete.title}"?`);
    if (!confirmed) return false;

    setIsLoading(true);
    // Delete associated files from storage first
    await deleteFileFromStorage(manualToDelete.image);
    await deleteFileFromStorage(manualToDelete.pdf_url);

    const { error: dbError } = await supabase.from('manuals').delete().eq('id', manualId);
    if (dbError) {
      toast({ title: "Erro ao excluir manual", description: dbError.message, variant: "destructive" });
      console.error("Error deleting manual from DB: ", dbError);
      setIsLoading(false);
      return false;
    }

    toast({ title: "Manual excluído", description: `${manualToDelete.title} foi removido.` });
    await fetchManuals();
    setIsLoading(false);
    return true;
  };

  return { manuals, isLoading, fetchManuals, saveManual, deleteManual };
}
