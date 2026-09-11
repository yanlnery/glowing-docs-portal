import { supabase } from "@/integrations/supabase/client";
import { SpeciesWaitlistEntry, SpeciesWaitlistStatus } from "@/types/speciesWaitlist";

export const speciesWaitlistService = {
  // Contagem leve de pessoas aguardando por espécie (via RPC pública)
  async getWaitingCount(speciesId: string): Promise<number> {
    const { data, error } = await supabase.rpc('species_waitlist_count', {
      p_species_id: speciesId,
    });

    if (error) return 0;
    return (data as number) ?? 0;
  },

  // Cadastro na lista de espera (validação e deduplicação no servidor)
  async addToWaitlist(entry: {
    species_id: string;
    name: string;
    phone: string;
    consent?: boolean;
  }): Promise<{ data: SpeciesWaitlistEntry | null; error: any; position?: number }> {
    const { data, error } = await supabase.rpc('join_species_waitlist', {
      p_species_id: entry.species_id,
      p_name: entry.name,
      p_phone: entry.phone,
      p_consent: entry.consent === true,
    });

    if (error) return { data: null, error };

    const row = Array.isArray(data) ? data[0] : data;

    if (row?.already_registered) {
      return { data: null, error: { message: 'Você já está na lista de espera desta espécie.' } };
    }

    return { data: null, error: null, position: row?.queue_position ?? undefined };
  },


  // Get all waitlist entries with species info
  async getAllEntries(): Promise<{ data: SpeciesWaitlistEntry[] | null; error: any }> {
    const { data, error } = await supabase
      .from('species_waitlist')
      .select(`
        *,
        species:species_id (name, commonname),
        previous_species:previous_species_id (name, commonname)
      `)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error };

    const formattedData = data?.map(entry => ({
      ...entry,
      species_name: (entry.species as any)?.name,
      species_commonname: (entry.species as any)?.commonname,
      previous_species_name: (entry.previous_species as any)?.commonname,
      species: undefined,
      previous_species: undefined
    })) as SpeciesWaitlistEntry[];

    return { data: formattedData, error: null };
  },

  // Get entries by species
  async getEntriesBySpecies(speciesId: string): Promise<{ data: SpeciesWaitlistEntry[] | null; error: any }> {
    const { data, error } = await supabase
      .from('species_waitlist')
      .select('*')
      .eq('species_id', speciesId)
      .order('priority', { ascending: true })
      .order('created_at', { ascending: true });

    return { data: data as SpeciesWaitlistEntry[] | null, error };
  },

  // Get count by species
  async getCountBySpecies(): Promise<{ data: { species_id: string; commonname: string; count: number }[] | null; error: any }> {
    const { data, error } = await supabase
      .from('species_waitlist')
      .select(`
        species_id,
        species:species_id (commonname)
      `)
      .eq('status', 'waiting');

    if (error) return { data: null, error };

    const counts = data?.reduce((acc: Record<string, { commonname: string; count: number }>, entry) => {
      const id = entry.species_id;
      const name = (entry.species as any)?.commonname || 'Desconhecido';
      if (!acc[id]) {
        acc[id] = { commonname: name, count: 0 };
      }
      acc[id].count++;
      return acc;
    }, {});

    const result = Object.entries(counts || {}).map(([species_id, data]) => ({
      species_id,
      commonname: data.commonname,
      count: data.count
    })).sort((a, b) => b.count - a.count);

    return { data: result, error: null };
  },

  // Update status
  async updateStatus(id: string, status: SpeciesWaitlistStatus): Promise<{ error: any }> {
    const { error } = await supabase
      .from('species_waitlist')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    return { error };
  },

  // Update notes
  async updateNotes(id: string, notes: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('species_waitlist')
      .update({ notes, updated_at: new Date().toISOString() })
      .eq('id', id);

    return { error };
  },

  // Migrate to another species
  async migrateToSpecies(id: string, newSpeciesId: string, currentSpeciesId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('species_waitlist')
      .update({
        species_id: newSpeciesId,
        previous_species_id: currentSpeciesId,
        migrated_at: new Date().toISOString(),
        status: 'waiting',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    return { error };
  },

  // Delete entry
  async deleteEntry(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('species_waitlist')
      .delete()
      .eq('id', id);

    return { error };
  }
};
