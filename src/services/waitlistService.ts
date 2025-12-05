import { supabase } from "@/integrations/supabase/client";

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  contact_preference: string;
  created_at: string;
  updated_at: string;
}

export const waitlistService = {
  // Add new entry to waitlist
  async addToWaitlist(entry: {
    name: string;
    email: string;
    phone: string;
    contact_preference: string;
  }): Promise<{ data: WaitlistEntry | null; error: any }> {
    const { data, error } = await supabase
      .from('waitlist')
      .insert(entry)
      .select()
      .single();

    return { data: data as WaitlistEntry | null, error };
  },

  // Get all waitlist entries (admin only)
  async getAllEntries(): Promise<{ data: WaitlistEntry[] | null; error: any }> {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });

    return { data: data as WaitlistEntry[] | null, error };
  },

  // Delete an entry
  async deleteEntry(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('waitlist')
      .delete()
      .eq('id', id);

    return { error };
  }
};
