import { supabase } from '@/integrations/supabase/client';
import type { AuthError, User, Session, AuthResponse, UserResponse } from '@supabase/supabase-js';

// loginService já parece correto, signInWithPassword retorna user e session
export const loginService = async (email: string, password: string): Promise<{ data: { user: User | null, session: Session | null } | null, error: AuthError | null }> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data: data ? { user: data.user, session: data.session } : null, error };
};

// signupService deve usar AuthResponse['data'] que contém user e session
export const signupService = async (payload: { email: string, password: string, options?: { data: any } }): Promise<{ data: AuthResponse['data'] | null, error: AuthError | null }> => {
  const response: AuthResponse = await supabase.auth.signUp(payload);
  // response.data já é { user, session }
  return { data: response.data, error: response.error };
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

// updatePasswordService deve usar UserResponse['data'] que contém apenas user
export const updatePasswordService = async (password: string): Promise<{ data: UserResponse['data'] | null, error: AuthError | null }> => {
  const response: UserResponse = await supabase.auth.updateUser({ password });
  // response.data é { user }
  return { data: response.data, error: response.error };
};
