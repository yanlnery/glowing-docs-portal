
import { supabase } from '@/integrations/supabase/client';
import { Species } from '@/types/species';
import type { ToastFunction } from '../fileStorageService'; // Added import type

// Interface para o formato do banco de dados
interface SpeciesDbRecord {
  id: string;
  commonname: string; 
  name: string;
  description: string;
  characteristics: string[];
  curiosities: string[];
  image: string | null;
  order: number;
  type: 'serpente' | 'lagarto' | 'quelonio' | 'outro';
  slug: string;
  created_at?: string;
  updated_at?: string;
}

// Helper para mapear do formato DB para o formato da aplicação (Species type)
const mapDbRecordToSpecies = (record: SpeciesDbRecord): Species => {
  return {
    ...record,
    commonName: record.commonname,
  };
};

// Função para buscar dados de espécies do banco de dados
export const fetchSpeciesDataFromDb = async (
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
  const speciesData = data ? (data as SpeciesDbRecord[]).map(mapDbRecordToSpecies) : null;
  return { data: speciesData, error: null };
};

// Função para criar uma nova espécie no banco de dados
export const createSpeciesInDb = async (
  dbPayload: Omit<SpeciesDbRecord, 'id' | 'created_at' | 'updated_at'>
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
  
  return { data: data ? mapDbRecordToSpecies(data as SpeciesDbRecord) : null, error: null };
};

// Função para atualizar uma espécie no banco de dados
export const updateSpeciesInDb = async (
  dbPayload: Omit<SpeciesDbRecord, 'id' | 'created_at' | 'updated_at'>,
  id: string
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
  
  return { data: data ? mapDbRecordToSpecies(data as SpeciesDbRecord) : null, error: null };
};

// Função para deletar um registro de espécie do banco de dados
export const deleteSpeciesFromDb = async (
  id: string
): Promise<{ error: Error | null }> => {
  const { error: deleteDbError } = await supabase.from('species').delete().eq('id', id);
  
  if (deleteDbError) {
    console.error("speciesDb.ts: Erro ao excluir espécie do DB:", deleteDbError);
    return { error: new Error(deleteDbError.message) };
  }
  
  return { error: null };
};

// Função para reordenar itens de espécies no banco de dados
export const reorderSpeciesInDb = async (
  speciesList: Species[],
  currentIndex: number,
  direction: 'up' | 'down',
  toast: ToastFunction // ToastFunction type is now recognized
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

  // Atualiza a ordem localmente primeiro para refletir a mudança visualmente (se aplicável)
  // e para consistência antes da chamada ao DB.
  // No entanto, a ordenação final virá do DB ou após o sucesso do DB.
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
        // Usando a função toast passada como parâmetro
        toast({ title: "Erro ao reordenar no DB", description: err.error?.message, variant: "destructive"});
        console.error("speciesDb.ts: Reorder error:", err.error);
      });
      // Se houver erro, pode ser melhor reverter a mudança local ou buscar novamente do DB
      // Por enquanto, retornaremos null indicando falha.
      return null; 
    }
    
    // Reordena a lista local com base na nova ordem e retorna
    // Isso garante que a lista retornada está na ordem correta após a atualização no DB.
    newSpeciesList.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    return newSpeciesList;
  } catch (error: any) {
    // Usando a função toast passada como parâmetro
    toast({ title: "Erro Crítico ao Reordenar no DB", description: error.message, variant: "destructive"});
    console.error("speciesDb.ts: Critical reorder error:", error);
    return null; // Retornar null em caso de erro crítico
  }
};

