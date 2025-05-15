
import { supabase } from '@/integrations/supabase/client';
import type { AuthError, UserResponse as SupabaseUserResponse, Session, AuthResponse } from '@supabase/supabase-js'; // UserResponse renamed to SupabaseUserResponse

// Corrected return type for loginService
export const loginService = async (email: string, password: string): Promise<{ data: { user: SupabaseUserResponse['data']['user'], session: Session | null } | null, error: AuthError | null }> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  // Ensure data structure matches: data.user and data.session
  return { data: data ? { user: data.user, session: data.session } : null, error };
};

// Corrected return type for signupService
export const signupService = async (payload: { email: string, password: string, options?: { data: any } }): Promise<{ data: SupabaseUserResponse['data'] | null, error: AuthError | null }> => {
  const response: AuthResponse = await supabase.auth.signUp(payload);
  return { data: response.data.user ? { user: response.data.user, session: response.data.session } : null, error: response.error };
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

// Corrected return type for updatePasswordService
export const updatePasswordService = async (password: string): Promise<{ data: SupabaseUserResponse['data'] | null, error: AuthError | null }> => {
  const response: AuthResponse = await supabase.auth.updateUser({ password });
  // updateUser response for password only contains user, not session.
  return { data: response.data.user ? { user: response.data.user } : null, error: response.error };
};
