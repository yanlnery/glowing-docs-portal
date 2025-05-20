
import { useState, useCallback, useEffect } from 'react';
import { Species } from '@/types/species';
import { useToast } from '@/components/ui/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { 
  fetchSpeciesData, 
  saveSpeciesData,
  deleteSpeciesRecord,
  reorderSpeciesItems
} from '@/services/speciesService';

export function useSpeciesManagement() {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAdminLoggedIn } = useAdminAuth();

  const fetchSpecies = useCallback(async () => {
    console.log("useSpeciesManagement: Attempting to fetch species (admin hook)...");
    setIsLoading(true);
    
    const data = await fetchSpeciesData(toast);
    setSpeciesList(data);
    
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
    
    setIsLoading(true);
    
    const success = await saveSpeciesData(
      speciesData,
      isNew,
      imageFile,
      originalImageUrl || null,
      toast
    );
    
    if (success) {
      await fetchSpecies(); // Atualiza a lista após salvar com sucesso
    }
    
    setIsLoading(false);
    return success;
  };

  const deleteSpecies = async (id: string): Promise<boolean> => {
    if (!isAdminLoggedIn) {
      toast({ title: "Acesso Negado", variant: "destructive" });
      return false;
    }
    
    const confirmed = window.confirm(`Tem certeza que deseja excluir esta espécie? Esta ação não pode ser desfeita.`);
    if (!confirmed) return false;

    setIsLoading(true);
    
    const success = await deleteSpeciesRecord(id, speciesList, toast);
    
    if (success) {
      await fetchSpecies(); // Atualiza a lista após deletar com sucesso
    }
    
    setIsLoading(false);
    return success;
  };
  
  const reorderSpecies = async (currentIndex: number, direction: 'up' | 'down'): Promise<void> => {
    setIsLoading(true);
    
    const updatedList = await reorderSpeciesItems(speciesList, currentIndex, direction, toast);
    
    if (updatedList) {
      setSpeciesList(updatedList);
      // Ainda fazemos um fetchSpecies para garantir sincronização com o servidor
      await fetchSpecies();
    } else {
      await fetchSpecies(); // Em caso de erro, recarregamos do servidor
    }
    
    setIsLoading(false);
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
