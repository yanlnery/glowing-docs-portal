
import { supabase } from '@/integrations/supabase/client';
import type { AuthError, UserResponse, Session } from '@supabase/supabase-js';

export const loginService = async (email: string, password: string): Promise<{ data: { user: UserResponse['user'], session: Session | null }, error: AuthError | null }> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data: { user: data.user, session: data.session }, error };
};

export const signupService = async (payload: { email: string, password: string, options?: { data: any } }): Promise<{ data: UserResponse, error: AuthError | null }> => {
  return supabase.auth.signUp(payload);
};

export const logoutService = async (): Promise<{ error: AuthError | null }> => {
  return supabase.auth.signOut();
};

export const requestPasswordResetService = async (email: string): Promise<{ data: {}, error: AuthError | null }> => {
  const redirectUrl = `${window.location.origin}/reset-password`;
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });
};

export const updatePasswordService = async (password: string): Promise<{ data: UserResponse, error: AuthError | null }> => {
  return supabase.auth.updateUser({ password });
};

