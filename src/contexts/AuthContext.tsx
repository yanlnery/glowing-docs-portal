
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AuthChangeEvent, Session, User, AuthError, UserResponse } from '@supabase/supabase-js';
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
  signup: (payload: { email: string, password: string, options?: { data: any } }) => Promise<{ error: AuthError | null, data: UserResponse | null }>;
  logout: () => Promise<{ error: AuthError | null }>;
  requestPasswordReset: (email: string) => Promise<{ error: AuthError | null, data: {} | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null, data: UserResponse | null }>;
  updateProfile: (updatedProfileData: Partial<Profile>) => Promise<{ error: PostgrestError | null, data: Profile | null }>;
  isLoading: boolean;
  profileError: any;
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState<any>(null);

  const fetchProfile = async (userId: string): Promise<{ data: Profile | null, error: PostgrestError | null }> => {
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
    } catch (error) {
      setProfileError(error);
      setProfile(null);
      return { data: null, error: error as PostgrestError };
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchInitialSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (error) {
        setProfileError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialSession();

    const { data: authListenerData } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, currentSession: Session | null) => {
        setSession(currentSession);
        const authUser = currentSession?.user ?? null;
        setUser(authUser);
        
        const handleAsyncAuthEvent = async () => {
          if (!authUser) return;
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            await fetchProfile(authUser.id);
          }
        };

        if (event === 'SIGNED_IN' && authUser) {
          setTimeout(() => handleAsyncAuthEvent(), 0);
        }
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        if (event === 'USER_UPDATED' && authUser) {
          setTimeout(() => handleAsyncAuthEvent(), 0);
        }
      }
    );

    return () => {
      authListenerData?.subscription?.unsubscribe();
    };
  }, []);
  
  const refreshProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await fetchProfile(user.id);
    } catch (error) {
      // fetchProfile already sets profileError
    }
    finally {
      setIsLoading(false);
    }
  };
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    let result: { error: AuthError | null } = { error: null };
    try {
      const { error } = await loginService(email, password);
      // onAuthStateChange handles setting user, session, and fetching profile
      result = { error };
    } catch (error) {
      result = { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
    return result;
  };

  const signup = async (payload: { email: string, password: string, options?: { data: any } }) => {
    setIsLoading(true);
    let result: { error: AuthError | null, data: UserResponse | null } = { error: null, data: null };
    try {
      const { error, data } = await signupService(payload);
      // onAuthStateChange handles SIGNED_IN if email confirmation is off or after confirmation.
      result = { error, data };
    } catch (error) {
      result = { error: error as AuthError, data: null };
    } finally {
      setIsLoading(false);
    }
    return result;
  };

  const logout = async () => {
    setIsLoading(true);
    let result: { error: AuthError | null } = { error: null };
    try {
      const { error } = await logoutService();
      // onAuthStateChange handles setting user, session to null and profile to null
      result = { error };
    } catch (error) {
      result = { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
    return result;
  };

  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    let result: { error: AuthError | null, data: {} | null } = { error: null, data: null };
    try {
      const { error, data } = await requestPasswordResetService(email);
      result = { error, data };
    } catch (error) {
      result = { error: error as AuthError, data: null };
    } finally {
      setIsLoading(false);
    }
    return result;
  };

  const updatePassword = async (password: string) => {
    setIsLoading(true);
    let result: { error: AuthError | null, data: UserResponse | null } = { error: null, data: null };
    try {
      const { data, error } = await updatePasswordService(password);
      // USER_UPDATED event should be handled by onAuthStateChange
      result = { error, data };
    } catch (error) {
      result = { error: error as AuthError, data: null };
    } finally {
      setIsLoading(false);
    }
    return result;
  };

  const updateProfile = async (updatedProfileData: Partial<Profile>) => {
    if (!user) {
      return { error: { message: 'User not authenticated', name: 'AuthError', status: 401 } as PostgrestError, data: null };
    }
    setIsLoading(true);
    let result: { error: PostgrestError | null, data: Profile | null } = { error: null, data: null };
    try {
      const { data, error } = await updateProfileService(user.id, updatedProfileData);
      if (!error && data) {
        setProfile(data as Profile);
      } else if(error) {
        setProfileError(error);
      }
      result = { error, data: data as Profile | null };
    } catch (error) {
      setProfileError(error);
      result = { error: error as PostgrestError, data: null };
    } finally {
      setIsLoading(false);
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user && !!session, // Ensure session is also present for isAuthenticated
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
        profileError,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// The useAuth hook is now in src/hooks/useAuth.ts and should be imported from there
// e.g. import { useAuth } from '@/hooks/useAuth';

