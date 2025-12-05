import { supabase } from "@/integrations/supabase/client";

export interface CartAnalyticsEntry {
  id?: string;
  action: string;
  item_count: number;
  total_value: number;
  items: any[];
  session_id?: string;
  created_at?: string;
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

export const cartAnalyticsService = {
  // Record a cart event
  async recordEvent(event: {
    action: string;
    item_count?: number;
    total_value?: number;
    items?: any[];
  }): Promise<{ error: any }> {
    const { error } = await supabase
      .from('cart_analytics')
      .insert({
        action: event.action,
        item_count: event.item_count || 0,
        total_value: event.total_value || 0,
        items: event.items || [],
        session_id: getSessionId()
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
