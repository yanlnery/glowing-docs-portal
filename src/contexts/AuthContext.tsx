
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AuthChangeEvent, Session, User, AuthError, UserResponse as SupabaseUserResponse } from '@supabase/supabase-js'; // Renamed to avoid conflict
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
  login: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signup: (payload: { email: string, password: string, options?: { data: any } }) => Promise<{ error: AuthError | null, data: SupabaseUserResponse['data'] | null }>; // Adjusted type
  logout: () => Promise<{ error: AuthError | null }>;
  requestPasswordReset: (email: string) => Promise<{ error: AuthError | null, data: {} | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null, data: SupabaseUserResponse['data'] | null }>; // Adjusted type
  updateProfile: (updatedProfileData: Partial<Profile>) => Promise<{ error: PostgrestError | null, data: Profile | null }>;
  isLoading: boolean;
  authError: AuthError | null; // Changed from profileError to a more generic authError
  profileError: PostgrestError | null; // Specific error for profile operations
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
    
    // Fetch initial session separately AFTER listener is set up
    // to correctly trigger 'INITIAL_SESSION' if session exists
     const fetchInitialSession = async () => {
      try {
        // getSession doesn't trigger INITIAL_SESSION, it just gets current state
        // The listener above will handle setting user/profile based on this initial state
        // if it leads to SIGNED_IN or INITIAL_SESSION event by Supabase internally
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        // If there's no session, or if onAuthStateChange handles it, we might not need to do much here
        // except potentially stop loading if no authUser is found and no event will fire to do so.
        if (!currentSession?.user) {
            setIsLoading(false);
        }
        // if currentSession exists, onAuthStateChange should fire with INITIAL_SESSION or SIGNED_IN
        // and handle user/profile loading & setIsLoading(false)
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
    return { error };
  };

  const signup = async (payload: { email: string, password: string, options?: { data: any } }) => {
    setIsLoading(true);
    setAuthError(null);
    const { data, error } = await signupService(payload);
    if (error) setAuthError(error);
    // onAuthStateChange or further user action (email confirmation) handles next steps.
    // setIsLoading(false) will be handled by onAuthStateChange or if error
    if (error || (!data?.user && !data?.session)) setIsLoading(false);
    return { error, data: data ? { user: data.user, session: data.session } : null };
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
    const { data, error } = await updatePasswordService(password);
    if (error) setAuthError(error);
    // onAuthStateChange handles USER_UPDATED and setIsLoading(false)
    // if error, ensure loading is false
    if (error || !data?.user) setIsLoading(false);
    return { error, data: data ? { user: data.user } : null };
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
