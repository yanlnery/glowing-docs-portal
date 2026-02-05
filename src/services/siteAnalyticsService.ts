import { supabase } from "@/integrations/supabase/client";

// Event types for the analytics system
export type EventType = 
  | 'session_start'
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'checkout_form_open'
  | 'checkout_form_abandon'
  | 'checkout_start'
  | 'checkout_form_error'
  | 'checkout_success'
  | 'whatsapp_redirect';

export type EventCategory = 'session' | 'navigation' | 'product' | 'cart' | 'checkout' | 'conversion';

export interface SiteEvent {
  id?: string;
  session_id: string;
  user_id?: string;
  user_email?: string;
  event_type: EventType;
  event_category: EventCategory;
  page_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  device_type?: string;
  browser?: string;
  product_id?: string;
  product_name?: string;
  product_price?: number;
  metadata?: Record<string, any>;
  created_at?: string;
}

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('site_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('site_session_id', sessionId);
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

// Get UTM parameters from URL
const getUTMParams = (): { utm_source?: string; utm_medium?: string; utm_campaign?: string } => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
  };
};

// Get referrer domain
const getReferrer = (): string | undefined => {
  if (!document.referrer) return undefined;
  try {
    const url = new URL(document.referrer);
    return url.hostname;
  } catch {
    return document.referrer;
  }
};

// Detect traffic source from referrer
const getTrafficSource = (referrer?: string): string => {
  if (!referrer) return 'Direto';
  const ref = referrer.toLowerCase();
  if (ref.includes('instagram')) return 'Instagram';
  if (ref.includes('facebook') || ref.includes('fb.')) return 'Facebook';
  if (ref.includes('whatsapp') || ref.includes('wa.me')) return 'WhatsApp';
  if (ref.includes('google')) return 'Google';
  if (ref.includes('bing')) return 'Bing';
  if (ref.includes('youtube')) return 'YouTube';
  if (ref.includes('tiktok')) return 'TikTok';
  return 'Outro';
};

// Get current user info
const getCurrentUserInfo = async (): Promise<{ userId?: string; userEmail?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return { userId: user.id, userEmail: user.email };
    }
  } catch (error) {
    console.error('Error getting user info:', error);
  }
  return {};
};

// Check if session was already started
const isSessionStarted = (): boolean => {
  return sessionStorage.getItem('session_started') === 'true';
};

// Mark session as started
const markSessionStarted = (): void => {
  sessionStorage.setItem('session_started', 'true');
};

export const siteAnalyticsService = {
  getSessionId,
  getDeviceType,
  getBrowser,
  getUTMParams,
  getReferrer,
  getTrafficSource,

  // Track any event
  async trackEvent(event: {
    event_type: EventType;
    event_category: EventCategory;
    page_path?: string;
    product_id?: string;
    product_name?: string;
    product_price?: number;
    metadata?: Record<string, any>;
  }): Promise<{ error: any }> {
    const userInfo = await getCurrentUserInfo();
    const utmParams = getUTMParams();
    const referrer = getReferrer();

    const eventData: Omit<SiteEvent, 'id' | 'created_at'> = {
      session_id: getSessionId(),
      user_id: userInfo.userId,
      user_email: userInfo.userEmail,
      event_type: event.event_type,
      event_category: event.event_category,
      page_path: event.page_path || window.location.pathname,
      referrer,
      utm_source: utmParams.utm_source,
      utm_medium: utmParams.utm_medium,
      utm_campaign: utmParams.utm_campaign,
      device_type: getDeviceType(),
      browser: getBrowser(),
      product_id: event.product_id,
      product_name: event.product_name,
      product_price: event.product_price,
      metadata: event.metadata || {},
    };

    const { error } = await supabase
      .from('site_events')
      .insert(eventData);

    if (error) {
      console.error('Error tracking event:', error);
    }

    return { error };
  },

  // Track session start (only once per session)
  async trackSessionStart(): Promise<void> {
    if (isSessionStarted()) return;
    
    await this.trackEvent({
      event_type: 'session_start',
      event_category: 'session',
      metadata: {
        landing_page: window.location.pathname,
        traffic_source: getTrafficSource(getReferrer()),
      },
    });
    
    markSessionStarted();
  },

  // Track page view
  async trackPageView(pagePath?: string): Promise<void> {
    await this.trackEvent({
      event_type: 'page_view',
      event_category: 'navigation',
      page_path: pagePath || window.location.pathname,
    });
  },

  // Track product view
  async trackProductView(product: { id: string; name: string; price: number; productCode?: string }): Promise<void> {
    await this.trackEvent({
      event_type: 'product_view',
      event_category: 'product',
      product_id: product.id,
      product_name: product.productCode ? `#${product.productCode} ${product.name}` : product.name,
      product_price: product.price,
      metadata: { product_code: product.productCode },
    });
  },

  // Track add to cart
  async trackAddToCart(product: { id: string; name: string; price: number; productCode?: string }): Promise<void> {
    await this.trackEvent({
      event_type: 'add_to_cart',
      event_category: 'cart',
      product_id: product.id,
      product_name: product.productCode ? `#${product.productCode} ${product.name}` : product.name,
      product_price: product.price,
      metadata: { product_code: product.productCode },
    });
  },

  // Track remove from cart
  async trackRemoveFromCart(product: { id: string; name: string; price: number; productCode?: string }): Promise<void> {
    await this.trackEvent({
      event_type: 'remove_from_cart',
      event_category: 'cart',
      product_id: product.id,
      product_name: product.productCode ? `#${product.productCode} ${product.name}` : product.name,
      product_price: product.price,
      metadata: { product_code: product.productCode },
    });
  },

  // Track view cart
  async trackViewCart(cartData: { itemCount: number; totalValue: number }): Promise<void> {
    await this.trackEvent({
      event_type: 'view_cart',
      event_category: 'cart',
      metadata: cartData,
    });
  },

  // Track checkout form open (when user clicks "Finalizar Compra" and opens the form)
  async trackCheckoutFormOpen(cartData: { itemCount: number; totalValue: number }): Promise<void> {
    await this.trackEvent({
      event_type: 'checkout_form_open',
      event_category: 'checkout',
      metadata: cartData,
    });
  },

  // Track checkout form abandon (when user closes the form without completing)
  async trackCheckoutFormAbandon(data: { 
    itemCount: number; 
    totalValue: number; 
    filledFields: string[];
    timeSpentSeconds?: number;
  }): Promise<void> {
    await this.trackEvent({
      event_type: 'checkout_form_abandon',
      event_category: 'checkout',
      metadata: data,
    });
  },

  // Track checkout start (when user submits the form)
  async trackCheckoutStart(cartData: { itemCount: number; totalValue: number }): Promise<void> {
    await this.trackEvent({
      event_type: 'checkout_start',
      event_category: 'checkout',
      metadata: cartData,
    });
  },

  // Track checkout form error
  async trackCheckoutFormError(errorType: string, errorDetails?: string): Promise<void> {
    await this.trackEvent({
      event_type: 'checkout_form_error',
      event_category: 'checkout',
      metadata: { error_type: errorType, error_details: errorDetails },
    });
  },

  // Track checkout success
  async trackCheckoutSuccess(orderData: { orderId: string; totalValue: number; itemCount: number }): Promise<void> {
    await this.trackEvent({
      event_type: 'checkout_success',
      event_category: 'checkout',
      metadata: orderData,
    });
  },

  // Track WhatsApp redirect
  async trackWhatsAppRedirect(orderData: { orderId: string; totalValue: number }): Promise<void> {
    await this.trackEvent({
      event_type: 'whatsapp_redirect',
      event_category: 'conversion',
      metadata: orderData,
    });
  },

  // Get all events (admin only)
  async getAllEvents(filters?: {
    startDate?: string;
    endDate?: string;
    eventType?: EventType;
    deviceType?: string;
  }): Promise<{ data: SiteEvent[] | null; error: any }> {
    let query = supabase
      .from('site_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }
    if (filters?.eventType) {
      query = query.eq('event_type', filters.eventType);
    }
    if (filters?.deviceType) {
      query = query.eq('device_type', filters.deviceType);
    }

    const { data, error } = await query.limit(10000);
    return { data: data as SiteEvent[] | null, error };
  },

  // Get events aggregated by type
  async getEventCounts(startDate?: string, endDate?: string): Promise<Record<string, number>> {
    const { data, error } = await this.getAllEvents({ startDate, endDate });
    if (error || !data) return {};

    const counts: Record<string, number> = {};
    data.forEach(event => {
      counts[event.event_type] = (counts[event.event_type] || 0) + 1;
    });
    return counts;
  },

  // Get unique sessions count
  async getUniqueSessions(startDate?: string, endDate?: string): Promise<number> {
    const { data, error } = await this.getAllEvents({ startDate, endDate });
    if (error || !data) return 0;

    const sessions = new Set(data.map(e => e.session_id));
    return sessions.size;
  },

  // Get unique users count
  async getUniqueUsers(startDate?: string, endDate?: string): Promise<number> {
    const { data, error } = await this.getAllEvents({ startDate, endDate });
    if (error || !data) return 0;

    const users = new Set(data.filter(e => e.user_id).map(e => e.user_id));
    return users.size;
  },
};
