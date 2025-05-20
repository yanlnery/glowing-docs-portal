
import { useState, useCallback, useEffect } from 'react';
import { Manual, ManualFormData } from '@/types/manual';
import { useToast } from '@/components/ui/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { 
  fetchManualsFromDb, 
  addManualToDb, 
  updateManualInDb, 
  deleteManualFromDb 
} from '@/services/manualsDbService';
import { 
  uploadManualFile, 
  deleteManualFile 
} from '@/services/manualsFileService';

export function useManualsManagement() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAdminLoggedIn } = useAdminAuth();

  const fetchManuals = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await fetchManualsFromDb();

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
    let imageUploadedSuccessfully = false;
    let pdfUploadedSuccessfully = false;

    try {
      // Handle Image Upload
      if (formData.imageFile) {
        if (!isNew && formData.originalImageUrl) await deleteManualFile(formData.originalImageUrl, toast);
        newImageUrl = await uploadManualFile(formData.imageFile, toast);
        if (!newImageUrl) throw new Error("Falha no upload da imagem.");
        imageUploadedSuccessfully = true;
      } else if (formData.image === null && formData.originalImageUrl && !isNew) {
          await deleteManualFile(formData.originalImageUrl, toast);
          newImageUrl = null;
      }

      // Handle PDF Upload
      if (formData.pdfFile) {
        if (!isNew && formData.originalPdfUrl) await deleteManualFile(formData.originalPdfUrl, toast);
        newPdfUrl = await uploadManualFile(formData.pdfFile, toast);
        if (!newPdfUrl) throw new Error("Falha no upload do PDF.");
        pdfUploadedSuccessfully = true;
      } else if (formData.pdf_url === null && formData.originalPdfUrl && !isNew) {
          await deleteManualFile(formData.originalPdfUrl, toast);
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
      let dbData: Manual | null = null;

      if (isNew) {
        const { data, error } = await addManualToDb(manualToSave);
        if (error) {
          opMessage = `Erro ao adicionar manual: ${error.message}`;
          console.error("Error inserting manual: ", error);
          throw new Error(opMessage); // Propagate error to catch block for cleanup
        } else if (data) {
          opMessage = `Manual "${data.title}" foi adicionado.`;
          dbData = data;
          success = true;
        }
      } else if (formData.id) {
        const { data, error } = await updateManualInDb(formData.id, manualToSave);
        if (error) {
          opMessage = `Erro ao atualizar manual: ${error.message}`;
          console.error("Error updating manual: ", error);
          throw new Error(opMessage); // Propagate error to catch block for cleanup
        } else if (data) {
          opMessage = `Manual "${data.title}" foi atualizado.`;
          dbData = data;
          success = true;
        }
      } else {
          opMessage = "ID do manual ausente para atualização.";
          console.error(opMessage);
          throw new Error(opMessage);
      }
      
      toast({ title: success ? "Sucesso" : "Erro", description: opMessage, variant: success ? "default" : "destructive" });
      if (success) await fetchManuals();
      setIsLoading(false);
      return success;

    } catch (error: any) {
      // Cleanup uploaded files if DB operation failed or any step before it failed
      if (imageUploadedSuccessfully && newImageUrl) {
        console.warn(`DB operation failed after image upload. Attempting to clean up uploaded image: ${newImageUrl}`);
        await deleteManualFile(newImageUrl, toast);
      }
      if (pdfUploadedSuccessfully && newPdfUrl) {
        console.warn(`DB operation failed after PDF upload. Attempting to clean up uploaded PDF: ${newPdfUrl}`);
        await deleteManualFile(newPdfUrl, toast);
      }
      
      toast({ title: "Erro na Operação", description: error.message || "Ocorreu um erro desconhecido.", variant: "destructive" });
      setIsLoading(false);
      return false;
    }
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
    try {
      if (manualToDelete.image) await deleteManualFile(manualToDelete.image, toast);
      if (manualToDelete.pdf_url) await deleteManualFile(manualToDelete.pdf_url, toast);

      const { error: dbError } = await deleteManualFromDb(manualId);
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
    } catch (error: any) {
        toast({ title: "Erro ao Excluir", description: error.message || "Falha ao remover arquivos ou registro.", variant: "destructive"});
        setIsLoading(false);
        return false;
    }
  };

  return { manuals, isLoading, fetchManuals, saveManual, deleteManual };
}
