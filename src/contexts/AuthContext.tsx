import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AuthChangeEvent, Session, User, AuthError, UserResponse, AuthResponse } from '@supabase/supabase-js'; // Adicionado AuthResponse
import type { Profile } from '@/types/client';
import type { PostgrestError } from '@supabase/supabase-js';

import {
  loginService,
  signupService,
  logoutService,
  requestPasswordResetService,
  updatePasswordService
} from '@/services/authService';
import {
  fetchProfileService,
  updateProfileService
} from '@/services/profileService';

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: AuthError | null, data: { user: User | null, session: Session | null } | null }>; // Ajustado para clareza
  signup: (payload: { email: string, password: string, options?: { data: any } }) => Promise<{ error: AuthError | null, data: AuthResponse['data'] | null }>; // Usa AuthResponse['data']
  logout: () => Promise<{ error: AuthError | null }>;
  requestPasswordReset: (email: string) => Promise<{ error: AuthError | null, data: {} | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null, data: UserResponse['data'] | null }>; // Usa UserResponse['data']
  updateProfile: (updatedProfileData: Partial<Profile>) => Promise<{ error: PostgrestError | null, data: Profile | null }>;
  isLoading: boolean;
  authError: AuthError | null;
  profileError: PostgrestError | null;
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [profileError, setProfileError] = useState<PostgrestError | null>(null);

  const fetchProfile = useCallback(async (userId: string): Promise<{ data: Profile | null, error: PostgrestError | null }> => {
    setProfileError(null);
    try {
      const { data, error } = await fetchProfileService(userId);
      if (error) {
        setProfileError(error);
        setProfile(null);
      } else {
        setProfile(data as Profile);
      }
      return { data, error };
    } catch (e) {
      const catchedError = e as PostgrestError; // Or a more generic error type
      setProfileError(catchedError);
      setProfile(null);
      return { data: null, error: catchedError };
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setAuthError(null);

    const { data: authListenerData } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        setSession(currentSession);
        const authUser = currentSession?.user ?? null;
        setUser(authUser);
        setAuthError(null); // Clear auth error on state change

        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
          if (authUser) {
            // Defer profile fetching
            setTimeout(async () => {
              await fetchProfile(authUser.id);
              setIsLoading(false); // Set loading to false after profile fetch attempt
            }, 0);
          } else {
            setProfile(null);
            setIsLoading(false); // No user, stop loading
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setUser(null);
          setSession(null);
          setIsLoading(false); // Signed out, stop loading
        } else if (event === 'PASSWORD_RECOVERY') {
          // Handled by ResetPasswordPage typically, set loading false if no user action needed here
          setIsLoading(false);
        } else {
           setIsLoading(false); // For any other events, ensure loading is false
        }
      }
    );
    
    const fetchInitialSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession?.user) {
            setIsLoading(false);
        }
      } catch (error) {
        setAuthError(error as AuthError);
        setIsLoading(false);
      }
    };

    fetchInitialSession();


    return () => {
      authListenerData?.subscription?.unsubscribe();
    };
  }, [fetchProfile]);
  
  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfileError({ name: "UserError", message: "Usuário não autenticado para atualizar perfil.", details:"", hint:"", code:"401" });
      return;
    }
    setIsLoading(true);
    setProfileError(null);
    try {
      await fetchProfile(user.id);
    }
    // fetchProfile sets its own errors
    finally {
      setIsLoading(false);
    }
  }, [user, fetchProfile]);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);
    const { data, error } = await loginService(email, password);
    if (error) setAuthError(error);
    // onAuthStateChange will handle setting user, session, profile and setIsLoading(false)
    return { error, data }; // data already includes user and session
  };

  const signup = async (payload: { email: string, password: string, options?: { data: any } }) => {
    setIsLoading(true);
    setAuthError(null);
    const { data, error } = await signupService(payload); // data is AuthResponse['data']
    if (error) setAuthError(error);
    
    // data can be { user, session } or null.
    // If there's an error, or if data is null, or if data.user is null (which implies data.session is also null or irrelevant)
    if (error || !data?.user) {
      setIsLoading(false);
    }
    // onAuthStateChange will handle setting user, session, profile and setIsLoading(false) in successful cases
    return { error, data };
  };

  const logout = async () => {
    setIsLoading(true);
    setAuthError(null);
    const { error } = await logoutService();
    if (error) {
        setAuthError(error);
        setIsLoading(false); // Ensure loading is false on error
    }
    // onAuthStateChange handles SIGNED_OUT: sets user, session, profile to null and setIsLoading(false)
    return { error };
  };

  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    setAuthError(null);
    const { data, error } = await requestPasswordResetService(email);
    if (error) setAuthError(error);
    setIsLoading(false);
    return { error, data };
  };

  const updatePassword = async (password: string) => {
    setIsLoading(true);
    setAuthError(null);
    const { data, error } = await updatePasswordService(password); // data is UserResponse['data']
    if (error) setAuthError(error);
    
    if (error || !data?.user) {
      setIsLoading(false);
    }
    // onAuthStateChange handles USER_UPDATED and setIsLoading(false)
    return { error, data };
  };

  const updateProfile = async (updatedProfileData: Partial<Profile>) => {
    if (!user) {
      const err = { name: 'AuthError', message: 'User not authenticated', status: 401, details: '', hint: '', code: '401' } as unknown as PostgrestError;
      setProfileError(err);
      return { error: err, data: null };
    }
    setIsLoading(true);
    setProfileError(null);
    const { data, error } = await updateProfileService(user.id, updatedProfileData);
    if (error) {
      setProfileError(error);
    } else if (data) {
      setProfile(data); // Update profile in context immediately
    }
    setIsLoading(false);
    return { error, data };
  };

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
        updateProfile,
        isLoading,
        authError,
        profileError,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
