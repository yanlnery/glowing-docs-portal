import { supabase } from '@/integrations/supabase/client';

// Security monitoring and logging service for auth operations

interface SecurityEvent {
  event_type: 'suspicious_login' | 'multiple_otp_requests' | 'failed_login_attempts' | 'password_reset_request' | 'new_device_login';
  user_email?: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  severity: 'low' | 'medium' | 'high';
}

class AuthSecurityService {
  private recentEvents: SecurityEvent[] = [];
  
  // Log security event
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    const timestamp = new Date().toISOString();
    
    // Store in memory for monitoring
    this.recentEvents.push({ ...event });
    
    // Keep only last 100 events in memory
    if (this.recentEvents.length > 100) {
      this.recentEvents.shift();
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.warn(`[Security Event] ${event.event_type}`, {
        timestamp,
        ...event
      });
    }

    // Could extend to send to external monitoring service or Supabase table
  }

  // Check for suspicious patterns
  async checkSuspiciousActivity(email: string): Promise<{
    isSuspicious: boolean;
    reason?: string;
  }> {
    const recentEventsForEmail = this.recentEvents.filter(
      e => e.user_email === email && 
      Date.now() - new Date(e.metadata?.timestamp || 0).getTime() < 15 * 60 * 1000 // Last 15 minutes
    );

    // Multiple failed login attempts
    const failedLogins = recentEventsForEmail.filter(
      e => e.event_type === 'failed_login_attempts'
    );
    if (failedLogins.length >= 3) {
      return {
        isSuspicious: true,
        reason: 'Multiple failed login attempts detected'
      };
    }

    // Multiple OTP requests
    const otpRequests = recentEventsForEmail.filter(
      e => e.event_type === 'multiple_otp_requests'
    );
    if (otpRequests.length >= 3) {
      return {
        isSuspicious: true,
        reason: 'Unusual OTP request pattern detected'
      };
    }

    return { isSuspicious: false };
  }

  // Send security notification email
  async sendSecurityNotification(
    email: string,
    eventType: SecurityEvent['event_type'],
    details: string
  ): Promise<void> {
    try {
      // This would typically use an edge function to send emails
      // For now, we'll log it
      console.log(`[Security Notification] Sending to ${email}:`, {
        eventType,
        details,
        timestamp: new Date().toISOString()
      });

      // TODO: Implement via Supabase Edge Function or email service
      // Example: await supabase.functions.invoke('send-security-alert', { body: { email, eventType, details } })
    } catch (error) {
      console.error('Failed to send security notification:', error);
    }
  }

  // Monitor login from new device/location
  async checkNewDeviceLogin(userId: string, userAgent?: string): Promise<boolean> {
    // This is a simplified check - in production, you'd want to store
    // device fingerprints and compare against known devices
    const knownDevices = this.recentEvents.filter(
      e => e.user_id === userId && 
      e.event_type === 'new_device_login' &&
      e.user_agent === userAgent
    );

    const isNewDevice = knownDevices.length === 0;

    if (isNewDevice) {
      await this.logSecurityEvent({
        event_type: 'new_device_login',
        user_id: userId,
        user_agent: userAgent,
        metadata: { timestamp: new Date().toISOString() },
        severity: 'medium'
      });
    }

    return isNewDevice;
  }

  // Get recent security events for monitoring
  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.recentEvents.slice(-limit);
  }
}

export const authSecurityService = new AuthSecurityService();
