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

  const fetchProfile = async (userId: string) => {
    setProfileError(null);
    try {
      console.log(`[AuthContext] Fetching profile for user ID: ${userId}`);
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
        console.log('[AuthContext] Profile fetched successfully:', data);
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

  useEffect(() => {
    setIsLoading(true);
    console.log('[AuthContext] Initializing AuthProvider, fetching initial session...');
    const fetchInitialSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('[AuthContext] Initial session fetched:', currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error("Error fetching initial session:", error);
        setProfileError(error);
      } finally {
        console.log('[AuthContext] fetchInitialSession finished, setIsLoading(false)');
        setIsLoading(false);
      }
    };

    fetchInitialSession();

    const { data: authListenerData } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, currentSession: Session | null) => {
        console.log('[AuthContext] onAuthStateChange event:', event, 'Session:', currentSession);
        setSession(currentSession);
        const authUser = currentSession?.user ?? null;
        setUser(authUser);
        
        if (event === 'SIGNED_IN' && authUser) {
          console.log('[AuthContext] SIGNED_IN event, queuing fetchProfile for user:', authUser.id);
          setTimeout(async () => {
            console.log('[AuthContext] Executing deferred fetchProfile for SIGNED_IN user:', authUser.id);
            await fetchProfile(authUser.id);
          }, 0);
        }
        if (event === 'SIGNED_OUT') {
          console.log('[AuthContext] SIGNED_OUT event, setting profile to null.');
          setProfile(null);
        }
        if (event === 'USER_UPDATED' && authUser) {
          console.log('[AuthContext] USER_UPDATED event, queuing fetchProfile for user:', authUser.id);
           setTimeout(async () => {
            console.log('[AuthContext] Executing deferred fetchProfile for USER_UPDATED user:', authUser.id);
            await fetchProfile(authUser.id);
          }, 0);
        }
        if (event === 'TOKEN_REFRESHED') {
          console.log('[AuthContext] TOKEN_REFRESHED event.');
          // Profile should already be up-to-date unless user data changed server-side without a USER_UPDATED event
          // If issues persist with profile staleness after token refresh, consider fetching profile here too.
        }
        if (event === 'INITIAL_SESSION' && authUser) {
            console.log('[AuthContext] INITIAL_SESSION event for user:', authUser.id, 'Profile should be handled by fetchInitialSession.');
            // fetchInitialSession already handles fetching profile on initial load.
            // If setIsLoading(false) in fetchInitialSession runs before this INITIAL_SESSION event completes its profile fetch (if any),
            // it might cause a flicker or brief moment of incorrect state.
            // However, our current fetchInitialSession awaits fetchProfile.
        }
      }
    );

    return () => {
      console.log('[AuthContext] Unsubscribing auth listener.');
      authListenerData?.subscription?.unsubscribe();
    };
  }, []);
  
  const refreshProfile = async () => {
    if (!user) {
      console.log('[AuthContext] refreshProfile called but no user.');
      return;
    }
    console.log('[AuthContext] refreshProfile called for user:', user.id);
    setIsLoading(true);
    try {
      await fetchProfile(user.id);
    } catch (error) {
      console.error('[AuthContext] Error during refreshProfile:', error);
    }
    finally {
      setIsLoading(false);
    }
  };
  
  const login = async (email: string, password: string) => {
    console.log('[AuthContext] login attempt for email:', email);
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      // onAuthStateChange will handle setting user, session, and fetching profile on SIGNED_IN event
      if (error) {
        console.error('[AuthContext] Login error:', error.message);
      } else {
        console.log('[AuthContext] Login successful for user:', data.user?.id);
      }
      return { error };
    } catch (error) {
      console.error("Unexpected error during login:", error);
      return { error: error as any };
    } finally {
      console.log('[AuthContext] login finished, setIsLoading(false)');
      setIsLoading(false);
    }
  };

  const signup = async (payload: { email: string, password: string, options?: { data: any } }) => {
    console.log('[AuthContext] signup attempt for email:', payload.email);
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp(payload);
      // onAuthStateChange will handle SIGNED_IN if email confirmation is off or after confirmation.
      if (error) {
        console.error('[AuthContext] Signup error:', error.message);
      } else {
        console.log('[AuthContext] Signup successful, user data:', data.user);
      }
      return { error, data };
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      return { error: error as any, data: null };
    } finally {
      console.log('[AuthContext] signup finished, setIsLoading(false)');
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('[AuthContext] logout attempt.');
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      // onAuthStateChange will handle setting user, session to null and profile to null on SIGNED_OUT event
      if (error) {
        console.error('[AuthContext] Logout error:', error.message);
      } else {
        console.log('[AuthContext] Logout successful.');
      }
      return { error };
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      return { error: error as any };
    } finally {
      console.log('[AuthContext] logout finished, setIsLoading(false)');
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    console.log('[AuthContext] requestPasswordReset attempt for email:', email);
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      if (error) {
        console.error('[AuthContext] Password reset request error:', error.message);
      } else {
        console.log('[AuthContext] Password reset request successful.');
      }
      return { error, data };
    } catch (error) {
      console.error("Unexpected error during password reset request:", error);
      return { error: error as any, data: null };
    } finally {
      console.log('[AuthContext] requestPasswordReset finished, setIsLoading(false)');
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    console.log('[AuthContext] updatePassword attempt.');
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) {
        console.error('[AuthContext] Password update error:', error.message);
      } else {
        console.log('[AuthContext] Password update successful.');
      }
      // USER_UPDATED event should be handled by onAuthStateChange
      return { error, data };
    } catch (error) {
      console.error("Unexpected error during password update:", error);
      return { error: error as any, data: null };
    } finally {
      console.log('[AuthContext] updatePassword finished, setIsLoading(false)');
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedProfileData: Partial<Profile>) => {
    if (!user) {
      console.error('[AuthContext] updateProfile called but no user.');
      return { error: { message: 'User not authenticated' } as any, data: null };
    }
    console.log('[AuthContext] updateProfile attempt for user:', user.id, 'Data:', updatedProfileData);
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updatedProfileData, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();
      
      if (!error && data) {
        console.log('[AuthContext] Profile update successful, new profile data:', data);
        setProfile(data as Profile);
      } else if(error) {
        console.error('[AuthContext] Profile update error:', error.message);
      }
      return { error, data: data as Profile | null };
    } catch (error) {
      console.error("Unexpected error during profile update:", error);
      return { error: error as any, data: null };
    } finally {
      console.log('[AuthContext] updateProfile finished, setIsLoading(false)');
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
