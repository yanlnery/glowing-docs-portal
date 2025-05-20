
import { supabase } from '@/integrations/supabase/client';
import { Species } from '@/types/species';
import { ToastFunction } from '../fileStorageService'; // ToastFunction pode não ser necessária aqui se os toasts forem centralizados

// Função para buscar os dados das espécies do DB
export const fetchSpeciesDataFromDb = async (
  // toast: ToastFunction // Removido, toast será tratado pelo serviço principal
): Promise<{ data: Species[] | null, error: Error | null }> => {
  console.log("speciesDb.ts: Buscando espécies do DB...");
  const { data, error } = await supabase
    .from('species')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error("speciesDb.ts: Erro ao buscar espécies:", error);
    return { data: null, error: new Error(error.message) };
  }
  
  console.log("speciesDb.ts: Espécies buscadas com sucesso.");
  return { data: data as Species[], error: null };
};

// Função para criar uma nova espécie no DB
export const createSpeciesInDb = async (
  dbPayload: Omit<Species, 'id' | 'created_at' | 'updated_at'>
  // toast: ToastFunction // Removido
): Promise<{ data: Species | null, error: Error | null }> => {
  const { data, error } = await supabase
    .from('species')
    .insert(dbPayload)
    .select()
    .single();

  if (error) {
    console.error("speciesDb.ts: Erro ao adicionar espécie:", error.message, error);
    return { data: null, error: new Error(error.message) };
  }
  
  return { data: data as Species, error: null };
};

// Função para atualizar uma espécie existente no DB
export const updateSpeciesInDb = async (
  dbPayload: Omit<Species, 'id' | 'created_at' | 'updated_at'>,
  id: string
  // toast: ToastFunction // Removido
): Promise<{ data: Species | null, error: Error | null }> => {
  const { data, error } = await supabase
    .from('species')
    .update(dbPayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("speciesDb.ts: Erro ao atualizar espécie:", error.message, error);
    return { data: null, error: new Error(error.message) };
  }
  
  return { data: data as Species, error: null };
};

// Função para deletar um registro de espécie do DB
export const deleteSpeciesFromDb = async (
  id: string
  // toast: ToastFunction // Removido
): Promise<{ error: Error | null }> => {
  const { error: deleteDbError } = await supabase.from('species').delete().eq('id', id);
  
  if (deleteDbError) {
    console.error("speciesDb.ts: Erro ao excluir espécie do DB:", deleteDbError);
    return { error: new Error(deleteDbError.message) };
  }
  
  return { error: null };
};

// Função para reordenar itens de espécies no DB
export const reorderSpeciesInDb = async (
  speciesList: Species[],
  currentIndex: number,
  direction: 'up' | 'down',
  toast: ToastFunction // Manter toast aqui pois é uma operação complexa com múltiplos updates
): Promise<Species[] | null> => {
  const newSpeciesList = [...speciesList];
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= newSpeciesList.length) {
    return null; // Operação inválida, não fazer nada
  }
  
  const itemToMove = newSpeciesList[currentIndex];
  const itemAtTarget = newSpeciesList[targetIndex];

  const currentOrder = Number(itemToMove.order) || 0;
  const targetOrder = Number(itemAtTarget.order) || 0;

  // Swap orders no objeto local primeiro
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
        toast({ title: "Erro ao reordenar no DB", description: err.error?.message, variant: "destructive"});
        console.error("speciesDb.ts: Reorder error:", err.error);
      });
      return null; // Retorna null para indicar falha parcial ou total
    }
    
    // Não precisa de toast de sucesso aqui, será tratado pelo serviço principal se necessário
    // A lista é atualizada localmente, e o serviço principal pode decidir se re-fetches ou usa esta.
    newSpeciesList.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    return newSpeciesList;
  } catch (error: any) {
    toast({ title: "Erro Crítico ao Reordenar no DB", description: error.message, variant: "destructive"});
    console.error("speciesDb.ts: Critical reorder error:", error);
    return null;
  }
};
