import { supabase } from "@/integrations/supabase/client";

export type DownloadAnalyticsEvent = 
  | 'modal_open'
  | 'option_signup_clicked'
  | 'option_login_clicked'
  | 'option_lead_form_clicked'
  | 'lead_form_submitted'
  | 'signup_complete_with_pending'
  | 'login_complete_with_pending'
  | 'download_started';

interface DownloadAnalyticsPayload {
  event: DownloadAnalyticsEvent;
  material_title?: string;
  source?: string;
}

const SESSION_KEY = 'psa_download_session';

function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export const downloadAnalyticsService = {
  /**
   * Track a download funnel event
   */
  async track(payload: DownloadAnalyticsPayload): Promise<void> {
    try {
      const sessionId = getSessionId();
      
      // Use cart_analytics table for now (could create dedicated table later)
      await supabase
        .from('cart_analytics')
        .insert({
          action: `download_${payload.event}`,
          session_id: sessionId,
          items: { 
            material_title: payload.material_title || null,
            source: payload.source || null,
            timestamp: new Date().toISOString()
          },
          item_count: 0,
          total_value: 0
        });
    } catch (err) {
      // Silent fail - analytics should not break UX
      console.debug('Analytics tracking failed:', err);
    }
  },

  /**
   * Track modal open
   */
  trackModalOpen(materialTitle: string) {
    this.track({ event: 'modal_open', material_title: materialTitle });
  },

  /**
   * Track option selection
   */
  trackOptionClicked(option: 'signup' | 'login' | 'lead_form', materialTitle: string) {
    const eventMap = {
      signup: 'option_signup_clicked' as const,
      login: 'option_login_clicked' as const,
      lead_form: 'option_lead_form_clicked' as const
    };
    this.track({ event: eventMap[option], material_title: materialTitle });
  },

  /**
   * Track lead form submission
   */
  trackLeadFormSubmitted(materialTitle: string) {
    this.track({ event: 'lead_form_submitted', material_title: materialTitle });
  },

  /**
   * Track auth completion with pending download
   */
  trackAuthComplete(type: 'signup' | 'login') {
    const event = type === 'signup' ? 'signup_complete_with_pending' : 'login_complete_with_pending';
    this.track({ event, source: 'manual_download' });
  },

  /**
   * Track download started
   */
  trackDownloadStarted(materialTitle: string, source: 'lead_form' | 'authenticated') {
    this.track({ event: 'download_started', material_title: materialTitle, source });
  }
};
