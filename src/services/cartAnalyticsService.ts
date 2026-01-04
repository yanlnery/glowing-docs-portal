import { supabase } from "@/integrations/supabase/client";

export interface CartAnalyticsEntry {
  id?: string;
  action: string;
  item_count: number;
  total_value: number;
  items: any[];
  session_id?: string;
  created_at?: string;
  user_id?: string;
  user_email?: string;
  device_type?: string;
  browser?: string;
}

// Generate a session ID for tracking
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    sessionStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

// Detect device type
const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) return 'Mobile';
  return 'Desktop';
};

// Detect browser
const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Outro';
};

// Get current user info
const getCurrentUserInfo = async (): Promise<{ userId?: string; userEmail?: string }> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    return { userId: user.id, userEmail: user.email };
  }
  return {};
};

export const cartAnalyticsService = {
  // Record a cart event
  async recordEvent(event: {
    action: string;
    item_count?: number;
    total_value?: number;
    items?: any[];
  }): Promise<{ error: any }> {
    const userInfo = await getCurrentUserInfo();
    
    const { error } = await supabase
      .from('cart_analytics')
      .insert({
        action: event.action,
        item_count: event.item_count || 0,
        total_value: event.total_value || 0,
        items: event.items || [],
        session_id: getSessionId(),
        user_id: userInfo.userId || null,
        user_email: userInfo.userEmail || null,
        device_type: getDeviceType(),
        browser: getBrowser()
      });

    return { error };
  },

  // Get all analytics entries (admin only)
  async getAllEntries(): Promise<{ data: CartAnalyticsEntry[] | null; error: any }> {
    const { data, error } = await supabase
      .from('cart_analytics')
      .select('*')
      .order('created_at', { ascending: false });

    return { data: data as CartAnalyticsEntry[] | null, error };
  }
};
