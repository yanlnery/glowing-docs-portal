
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
  // waitlistCount can be removed or handled differently if not relevant for client auth
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      }
      setIsLoading(false);
    };

    fetchInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
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
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } else {
      setProfile(data as Profile);
    }
    return { data, error };
  };
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      await fetchProfile(data.user.id);
    }
    setIsLoading(false);
    return { error };
  };

  const signup = async (payload: { email: string, password: string, options?: { data: any } }) => {
    setIsLoading(true);
    const { error, data } = await supabase.auth.signUp(payload);
     // Profile is created by trigger, fetchProfile will be called by onAuthStateChange
    setIsLoading(false);
    return { error, data };
  };

  const logout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    setProfile(null); // Clear profile on logout
    setIsLoading(false);
    return { error };
  };

  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    // For password reset to work, you need to configure email templates in Supabase settings
    // And setup a redirect URL. This URL should point to your reset password page.
    const redirectUrl = `${window.location.origin}/reset-password`;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    setIsLoading(false);
    return { error, data };
  };

  const updatePassword = async (password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);
    return { error, data };
  };

  const updateProfile = async (updatedProfileData: Partial<Profile>) => {
    if (!user) return { error: { message: 'User not authenticated' }, data: null };
    setIsLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updatedProfileData, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();
    
    if (!error && data) {
      setProfile(data as Profile);
    }
    setIsLoading(false);
    return { error, data: data as Profile | null };
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
        isLoading
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
