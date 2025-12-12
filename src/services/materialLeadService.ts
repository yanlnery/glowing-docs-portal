import { supabase } from "@/integrations/supabase/client";

export interface MaterialLead {
  name: string;
  email: string;
  consent: boolean;
  downloaded_material?: string;
}

const LEAD_STORAGE_KEY = 'psa_material_lead_registered';

export const materialLeadService = {
  /**
   * Check if user is already registered as a lead (via localStorage)
   */
  isLeadRegistered(): boolean {
    try {
      const stored = localStorage.getItem(LEAD_STORAGE_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  },

  /**
   * Mark user as registered lead in localStorage
   */
  markAsRegistered(): void {
    try {
      localStorage.setItem(LEAD_STORAGE_KEY, 'true');
    } catch {
      console.warn('Failed to save lead registration status to localStorage');
    }
  },

  /**
   * Register a new material download lead
   */
  async registerLead(lead: MaterialLead): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('material_leads')
        .upsert(
          {
            name: lead.name.trim(),
            email: lead.email.trim().toLowerCase(),
            consent: lead.consent,
            downloaded_material: lead.downloaded_material,
            source: 'material_download',
          },
          { onConflict: 'email' }
        );

      if (error) {
        console.error('Error registering lead:', error);
        return { success: false, error: error.message };
      }

      // Mark as registered in localStorage
      this.markAsRegistered();
      
      return { success: true };
    } catch (err) {
      console.error('Unexpected error registering lead:', err);
      return { success: false, error: 'Erro inesperado ao registrar' };
    }
  },

  /**
   * Clear registration status (for testing)
   */
  clearRegistration(): void {
    try {
      localStorage.removeItem(LEAD_STORAGE_KEY);
    } catch {
      console.warn('Failed to clear lead registration status');
    }
  }
};
