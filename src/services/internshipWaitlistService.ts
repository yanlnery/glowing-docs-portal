import { supabase } from "@/integrations/supabase/client";
import { InternshipWaitlistEntry, InternshipWaitlistStatus } from "@/types/internshipWaitlist";
import { rateLimitService } from "./rateLimitService";

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
    // Rate limiting: prevent abuse (5 submissions per 15 minutes per email)
    const rateLimit = rateLimitService.checkLoginLimit(entry.email);
    if (!rateLimit.allowed) {
      return { 
        data: null, 
        error: { message: `Aguarde ${rateLimit.retryAfter} segundos antes de tentar novamente.` } 
      };
    }

    // Check if email already exists (silently - don't reveal if email exists to prevent enumeration)
    const { data: existing } = await supabase
      .from('internship_waitlist')
      .select('id')
      .eq('email', entry.email)
      .maybeSingle();

    // Return success even if email exists to prevent timing attacks / email enumeration
    if (existing) {
      // Simulate a small delay to match normal insert time
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      return { 
        data: { id: 'existing', ...entry } as unknown as InternshipWaitlistEntry, 
        error: null 
      };
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
