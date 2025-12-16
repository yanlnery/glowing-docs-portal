import { supabase } from "@/integrations/supabase/client";
import { InternshipWaitlistEntry, InternshipWaitlistStatus } from "@/types/internshipWaitlist";

export const internshipWaitlistService = {
  async addToWaitlist(entry: {
    name: string;
    email: string;
    phone: string;
    institution: string;
    course: string;
    semester?: string;
    availability: string;
    interest_area: string;
    motivation?: string;
    linkedin_url?: string;
  }): Promise<{ data: InternshipWaitlistEntry | null; error: any }> {
    // Check if email already exists
    const { data: existing } = await supabase
      .from('internship_waitlist')
      .select('id')
      .eq('email', entry.email)
      .maybeSingle();

    if (existing) {
      return { data: null, error: { message: 'Este email já está cadastrado na lista de estágio.' } };
    }

    const { data, error } = await supabase
      .from('internship_waitlist')
      .insert(entry)
      .select()
      .single();

    return { data: data as InternshipWaitlistEntry | null, error };
  },

  async getAllEntries(): Promise<{ data: InternshipWaitlistEntry[] | null; error: any }> {
    const { data, error } = await supabase
      .from('internship_waitlist')
      .select('*')
      .order('created_at', { ascending: false });

    return { data: data as InternshipWaitlistEntry[] | null, error };
  },

  async updateStatus(id: string, status: InternshipWaitlistStatus): Promise<{ error: any }> {
    const { error } = await supabase
      .from('internship_waitlist')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    return { error };
  },

  async updateNotes(id: string, notes: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('internship_waitlist')
      .update({ notes, updated_at: new Date().toISOString() })
      .eq('id', id);

    return { error };
  },

  async deleteEntry(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('internship_waitlist')
      .delete()
      .eq('id', id);

    return { error };
  }
};
