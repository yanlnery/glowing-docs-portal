
import { supabase } from '@/integrations/supabase/client';
import { Manual, ManualFormData } from '@/types/manual';

export const fetchManualsFromDb = async (): Promise<{ data: Manual[] | null, error: any }> => {
  return supabase
    .from('manuals')
    .select('*')
    .order('title', { ascending: true });
};

export const addManualToDb = async (
  manualData: Omit<Manual, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: Manual | null, error: any }> => {
  return supabase.from('manuals').insert(manualData).select().single();
};

export const updateManualInDb = async (
  manualId: string,
  manualData: Omit<Manual, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: Manual | null, error: any }> => {
  return supabase.from('manuals').update(manualData).eq('id', manualId).select().single();
};

export const deleteManualFromDb = async (manualId: string): Promise<{ error: any }> => {
  return supabase.from('manuals').delete().eq('id', manualId);
};
