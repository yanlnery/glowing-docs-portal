
import React, { createContext, useState, useCallback } from 'react';
import type { User, Session, AuthError, UserResponse, AuthResponse } from '@supabase/supabase-js';
import type { Profile } from '@/types/client';
import type { PostgrestError } from '@supabase/supabase-js';

import { useAuthSession } from '@/hooks/useAuthSession';
import { useUserProfile } from '@/hooks/useUserProfile';

import {
  loginService,
  signupService,
  logoutService,
  requestPasswordResetService,
  updatePasswordService
} from '@/services/authService';

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: AuthError | null, data: { user: User | null, session: Session | null } | null }>;
  signup: (payload: { email: string, password: string, options?: { data: any } }) => Promise<{ error: AuthError | null, data: AuthResponse['data'] | null }>;
  logout: () => Promise<{ error: AuthError | null }>;
  requestPasswordReset: (email: string) => Promise<{ error: AuthError | null, data: {} | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null, data: UserResponse['data'] | null }>;
  updateProfile: (updatedProfileData: Partial<Profile>) => Promise<{ error: PostgrestError | null, data: Profile | null }>;
  isLoading: boolean;
  authError: AuthError | PostgrestError | null; // Pode ser AuthError ou PostgrestError vindo do profile
  profileError: PostgrestError | null;
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, isSessionLoading, authError: sessionAuthError, setIsSessionLoading } = useAuthSession();
  
  // Callback para useUserProfile saber quando o carregamento da sessão (e tentativa de perfil) terminaram
  const handleProfileLoadAttempted = useCallback(() => {
    if (isSessionLoading) { // Apenas modifica se isSessionLoading ainda for true
        setIsSessionLoading(false);
    }
  }, [isSessionLoading, setIsSessionLoading]);
  
  const { profile, isProfileLoading, profileError, updateProfile: updateProfileHandler, refreshProfile: refreshProfileHandler } = useUserProfile(user, handleProfileLoadAttempted);

  const [isAuthActionLoading, setIsAuthActionLoading] = useState(false);
  const [authActionError, setAuthActionError] = useState<AuthError | null>(null);

  const login = async (email: string, password: string) => {
    setIsAuthActionLoading(true);
    setAuthActionError(null);
    const { data, error } = await loginService(email, password);
    if (error) setAuthActionError(error);
    setIsAuthActionLoading(false);
    // onAuthStateChange (via useAuthSession) tratará a configuração de user, session, profile e isSessionLoading/isProfileLoading
    return { error, data };
  };

  const signup = async (payload: { email: string, password: string, options?: { data: any } }) => {
    setIsAuthActionLoading(true);
    setAuthActionError(null);
    const { data, error } = await signupService(payload);
    if (error) setAuthActionError(error);
    setIsAuthActionLoading(false);
    // onAuthStateChange tratará a configuração
    return { error, data };
  };

  const logout = async () => {
    setIsAuthActionLoading(true);
    setAuthActionError(null);
    const { error } = await logoutService();
    if (error) setAuthActionError(error);
    setIsAuthActionLoading(false);
    // onAuthStateChange tratará a configuração
    return { error };
  };

  const requestPasswordReset = async (email: string) => {
    setIsAuthActionLoading(true);
    setAuthActionError(null);
    const { data, error } = await requestPasswordResetService(email);
    if (error) setAuthActionError(error);
    setIsAuthActionLoading(false);
    return { error, data };
  };

  const updatePassword = async (password: string) => {
    setIsAuthActionLoading(true);
    setAuthActionError(null);
    const { data, error } = await updatePasswordService(password);
    if (error) setAuthActionError(error);
    setIsAuthActionLoading(false);
    // onAuthStateChange tratará a configuração
    return { error, data };
  };
  
  const combinedAuthError = sessionAuthError || authActionError;
  const isLoading = isSessionLoading || isProfileLoading || isAuthActionLoading;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user && !!session,
        user,
        profile,
        session,
        login,
        signup,
        logout,
        requestPasswordReset,
        updatePassword,
        updateProfile: updateProfileHandler,
        isLoading,
        authError: combinedAuthError,
        profileError,
        refreshProfile: refreshProfileHandler
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
