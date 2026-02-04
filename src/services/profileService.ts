
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/types/client';
import type { PostgrestError } from '@supabase/supabase-js';

/**
 * Busca o perfil do usuário pelo ID.
 * Se não existir, cria automaticamente (bootstrap).
 */
export const fetchProfileService = async (userId: string): Promise<{ data: Profile | null, error: PostgrestError | null }> => {
  console.log('[ProfileService] Buscando perfil para userId:', userId);
  
  // Primeiro, tenta buscar o perfil existente usando maybeSingle
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('[ProfileService] Erro ao buscar perfil:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    });
    return { data: null, error };
  }

  // Se o perfil existe, retorna
  if (data) {
    console.log('[ProfileService] Perfil encontrado:', data);
    return { data: data as Profile, error: null };
  }

  // Se não existe, tenta criar (bootstrap)
  console.log('[ProfileService] Perfil não encontrado, criando bootstrap para userId:', userId);
  
  const { data: newProfile, error: insertError } = await supabase
    .from('profiles')
    .insert({ id: userId, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (insertError) {
    console.error('[ProfileService] Erro ao criar perfil (bootstrap):', {
      code: insertError.code,
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint
    });
    return { data: null, error: insertError };
  }

  console.log('[ProfileService] Perfil criado com sucesso:', newProfile);
  return { data: newProfile as Profile, error: null };
};

export const updateProfileService = async (userId: string, updatedProfileData: Partial<Profile>): Promise<{ data: Profile | null, error: PostgrestError | null }> => {
  console.log('[ProfileService] Atualizando perfil para userId:', userId, updatedProfileData);
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updatedProfileData, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('[ProfileService] Erro ao atualizar perfil:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    });
  }
  
  return { data: data as Profile | null, error };
};

