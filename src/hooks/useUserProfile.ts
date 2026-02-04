
import { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/client';
import type { PostgrestError } from '@supabase/supabase-js';
import { fetchProfileService, updateProfileService } from '@/services/profileService';

export const useUserProfile = (user: User | null, onProfileLoadAttempted: () => void) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true); // Começa true até a primeira tentativa de carregar o perfil
  const [profileError, setProfileError] = useState<PostgrestError | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    console.log('[useUserProfile] Iniciando fetch do perfil para userId:', userId);
    setIsProfileLoading(true);
    setProfileError(null);
    try {
      const { data, error } = await fetchProfileService(userId);
      if (error) {
        console.error('[useUserProfile] Erro retornado do fetchProfileService:', error);
        setProfileError(error);
        setProfile(null);
      } else {
        console.log('[useUserProfile] Perfil carregado com sucesso:', data);
        setProfile(data as Profile);
      }
      return { data, error };
    } catch (e) {
      const catchedError = e as PostgrestError;
      console.error('[useUserProfile] Exceção ao carregar perfil:', catchedError);
      setProfileError(catchedError);
      setProfile(null);
      return { data: null, error: catchedError };
    } finally {
      setIsProfileLoading(false);
      onProfileLoadAttempted();
    }
  }, [onProfileLoadAttempted]);

  useEffect(() => {
    if (user?.id) {
      // Deferir o carregamento do perfil para permitir que o estado inicial seja definido
      setTimeout(() => {
        fetchProfile(user.id);
      }, 0);
    } else {
      setProfile(null);
      setIsProfileLoading(false); // Sem usuário, não há perfil para carregar
      onProfileLoadAttempted();
    }
  }, [user, fetchProfile, onProfileLoadAttempted]);

  const updateProfile = async (updatedProfileData: Partial<Profile>) => {
    if (!user) {
      const err = { name: 'AuthError', message: 'User not authenticated', status: 401, details: '', hint: '', code: '401' } as unknown as PostgrestError;
      setProfileError(err);
      return { error: err, data: null };
    }
    setIsProfileLoading(true);
    setProfileError(null);
    const { data, error } = await updateProfileService(user.id, updatedProfileData);
    if (error) {
      setProfileError(error);
    } else if (data) {
      setProfile(data);
    }
    setIsProfileLoading(false);
    return { error, data };
  };

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfileError({ name: "UserError", message: "Usuário não autenticado para atualizar perfil.", details:"", hint:"", code:"401" });
      return;
    }
    await fetchProfile(user.id);
  }, [user, fetchProfile]);

  return { profile, isProfileLoading, profileError, updateProfile, refreshProfile };
};
