
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'; 
import type { Profile } from '@/types/client';

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (payload: { email: string, password: string, options?: { data: any } }) => Promise<{ error: any, data: any }>;
  logout: () => Promise<{ error: any }>;
  requestPasswordReset: (email: string) => Promise<{ error: any, data: any }>;
  updatePassword: (password: string) => Promise<{ error: any, data: any }>;
  updateProfile: (updatedProfileData: Partial<Profile>) => Promise<{ error: any, data: Profile | null }>;
  isLoading: boolean;
  profileError: any;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState<any>(null);

  useEffect(() => {
    const fetchInitialSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error("Error fetching initial session:", error);
        setProfileError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialSession();

    const { data: authListenerData } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        try {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (event === 'SIGNED_IN' && currentSession?.user) {
            await fetchProfile(currentSession.user.id);
          }
          if (event === 'SIGNED_OUT') {
            setProfile(null);
          }
          if (event === 'USER_UPDATED' && currentSession?.user) {
             await fetchProfile(currentSession.user.id);
          }
        } catch (error) {
          console.error("Error in auth state change handler:", error);
          setProfileError(error);
        }
      }
    );

    return () => {
      authListenerData?.subscription?.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    setProfileError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        setProfileError(error);
        setProfile(null);
        return { data: null, error };
      } else {
        setProfile(data as Profile);
        return { data, error: null };
      }
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      setProfileError(error);
      setProfile(null);
      return { data: null, error };
    }
  };
  
  const refreshProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await fetchProfile(user.id);
    } finally {
      setIsLoading(false);
    }
  };
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data.user) {
        await fetchProfile(data.user.id);
      }
      return { error };
    } catch (error) {
      console.error("Unexpected error during login:", error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload: { email: string, password: string, options?: { data: any } }) => {
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp(payload);
      return { error, data };
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      setProfile(null);
      return { error };
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      return { error, data };
    } catch (error) {
      console.error("Unexpected error during password reset request:", error);
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      return { error, data };
    } catch (error) {
      console.error("Unexpected error during password update:", error);
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedProfileData: Partial<Profile>) => {
    if (!user) return { error: { message: 'User not authenticated' }, data: null };
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updatedProfileData, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();
      
      if (!error && data) {
        setProfile(data as Profile);
      }
      return { error, data: data as Profile | null };
    } catch (error) {
      console.error("Unexpected error during profile update:", error);
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
