import { supabase } from "@/integrations/supabase/client";
import { SpeciesWaitlistEntry, SpeciesWaitlistStatus } from "@/types/speciesWaitlist";

const onlyDigits = (value: string) => (value || '').replace(/\D/g, '');

export const speciesWaitlistService = {
  // Contagem leve de pessoas aguardando por espécie
  async getWaitingCount(speciesId: string): Promise<number> {
    const { count, error } = await supabase
      .from('species_waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('species_id', speciesId)
      .eq('status', 'waiting');

    if (error) return 0;
    return count ?? 0;
  },

  // Add entry to species waitlist
  async addToWaitlist(entry: {
    species_id: string;
    name: string;
    email?: string | null;
    phone: string;
    cpf?: string;
    contact_preference?: string | null;
    consent?: boolean;
    consent_at?: string;
  }): Promise<{ data: SpeciesWaitlistEntry | null; error: any; position?: number }> {
    // Duplicidade por telefone (normalizado) + espécie
    const phoneDigits = onlyDigits(entry.phone);
    const { data: sameSpecies } = await supabase
      .from('species_waitlist')
      .select('id, phone')
      .eq('species_id', entry.species_id);

    const alreadyIn = (sameSpecies || []).some(
      (row: { phone: string | null }) => onlyDigits(row.phone || '') === phoneDigits
    );

    if (alreadyIn) {
      return { data: null, error: { message: 'Você já está na lista de espera desta espécie.' } };
    }

    // Posição na fila = quantos já aguardavam antes deste cadastro + 1
    const previousWaiting = await this.getWaitingCount(entry.species_id);

    const { error } = await supabase
      .from('species_waitlist')
      .insert(entry);

    if (error) return { data: null, error };

    return { data: null, error: null, position: previousWaiting + 1 };
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
