import { supabase } from '@/integrations/supabase/client';
import type { AuthError, User, Session, AuthResponse, UserResponse } from '@supabase/supabase-js';
import { rateLimitService } from './rateLimitService';
import { authSecurityService } from './authSecurityService';

// Enhanced login with rate limiting and security monitoring
export const loginService = async (email: string, password: string): Promise<{ data: { user: User | null, session: Session | null } | null, error: AuthError | null }> => {
  // Check rate limit
  const rateLimit = rateLimitService.checkLoginLimit(email);
  if (!rateLimit.allowed) {
    return {
      data: null,
      error: {
        message: `Too many login attempts. Please try again in ${rateLimit.retryAfter} seconds.`,
        status: 429,
        name: 'RateLimitError'
      } as AuthError
    };
  }

  // Check for suspicious activity
  const suspiciousCheck = await authSecurityService.checkSuspiciousActivity(email);
  if (suspiciousCheck.isSuspicious) {
    await authSecurityService.logSecurityEvent({
      event_type: 'suspicious_login',
      user_email: email,
      metadata: { reason: suspiciousCheck.reason },
      severity: 'high'
    });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    // Log failed attempt
    await authSecurityService.logSecurityEvent({
      event_type: 'failed_login_attempts',
      user_email: email,
      metadata: { error: error.message },
      severity: 'medium'
    });
    return { data: null, error };
  }

  if (data.user) {
    // Clear rate limit on successful login
    rateLimitService.clearLoginLimit(email);
    
    // Check for new device
    const isNewDevice = await authSecurityService.checkNewDeviceLogin(
      data.user.id,
      navigator.userAgent
    );
    
    if (isNewDevice) {
      await authSecurityService.sendSecurityNotification(
        email,
        'new_device_login',
        'A new login was detected from an unrecognized device.'
      );
    }
  }

  return { data: data ? { user: data.user, session: data.session } : null, error };
};

// signupService deve usar AuthResponse['data'] que contém user e session
export const signupService = async (payload: { email: string, password: string, options?: { data: any } }): Promise<{ data: AuthResponse['data'] | null, error: AuthError | null }> => {
  const redirectUrl = `${window.location.origin}/auth/callback`;
  
  const response: AuthResponse = await supabase.auth.signUp({
    ...payload,
    options: {
      ...payload.options,
      emailRedirectTo: redirectUrl,
    }
  });
  // response.data já é { user, session }
  return { data: response.data, error: response.error };
};

export const logoutService = async (): Promise<{ error: AuthError | null }> => {
  return supabase.auth.signOut();
};

// Enhanced password reset with rate limiting
export const requestPasswordResetService = async (email: string): Promise<{ data: {}, error: AuthError | null }> => {
  // Check OTP rate limit
  const rateLimit = rateLimitService.checkOTPRequestLimit(email);
  if (!rateLimit.allowed) {
    return {
      data: {},
      error: {
        message: `Please wait ${rateLimit.retryAfter} seconds before requesting another password reset.`,
        status: 429,
        name: 'RateLimitError'
      } as AuthError
    };
  }

  // Log password reset request
  await authSecurityService.logSecurityEvent({
    event_type: 'password_reset_request',
    user_email: email,
    metadata: { timestamp: new Date().toISOString() },
    severity: 'medium'
  });

  const redirectUrl = `${window.location.origin}/reset-password`;
  const result = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (!result.error) {
    // Send notification about password reset
    await authSecurityService.sendSecurityNotification(
      email,
      'password_reset_request',
      'A password reset was requested for your account. If this wasn\'t you, please contact support immediately.'
    );
  }

  return result;
};

// updatePasswordService deve usar UserResponse['data'] que contém apenas user
export const updatePasswordService = async (password: string): Promise<{ data: UserResponse['data'] | null, error: AuthError | null }> => {
  const response: UserResponse = await supabase.auth.updateUser({ password });
  // response.data é { user }
  return { data: response.data, error: response.error };
};
