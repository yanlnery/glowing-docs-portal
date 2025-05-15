
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/types/client';
import type { PostgrestError } from '@supabase/supabase-js';

export const fetchProfileService = async (userId: string): Promise<{ data: Profile | null, error: PostgrestError | null }> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data: data as Profile | null, error };
};

export const updateProfileService = async (userId: string, updatedProfileData: Partial<Profile>): Promise<{ data: Profile | null, error: PostgrestError | null }> => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updatedProfileData, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data: data as Profile | null, error };
};

