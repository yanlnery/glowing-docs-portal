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

    // Insert directly - unique constraint on email handles duplicates
    // No .select() call as anonymous users don't have SELECT permission
    const { error } = await supabase
      .from('internship_waitlist')
      .insert(entry);

    // Handle unique violation silently (security - don't reveal if email exists)
    if (error?.code === '23505') {
      // Simulate a small delay to match normal insert time
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      return { 
        data: { id: 'existing', ...entry } as unknown as InternshipWaitlistEntry, 
        error: null 
      };
    }

    return { data: entry as unknown as InternshipWaitlistEntry, error };
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
