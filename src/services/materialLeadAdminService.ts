import { supabase } from "@/integrations/supabase/client";

export interface MaterialLeadRow {
  id: string;
  name: string;
  email: string;
  consent: boolean;
  downloaded_material: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaterialLeadFilters {
  search?: string;
  material?: string;
  startDate?: string;
  endDate?: string;
}

export const materialLeadAdminService = {
  /**
   * Fetch all leads with optional filters (admin only)
   */
  async fetchLeads(filters?: MaterialLeadFilters): Promise<{ data: MaterialLeadRow[]; error: string | null }> {
    try {
      let query = supabase
        .from('material_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(`email.ilike.%${filters.search}%,name.ilike.%${filters.search}%`);
      }

      if (filters?.material) {
        query = query.ilike('downloaded_material', `%${filters.material}%`);
      }

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('created_at', `${filters.endDate}T23:59:59`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching leads:', error);
        return { data: [], error: error.message };
      }

      return { data: data || [], error: null };
    } catch (err) {
      console.error('Unexpected error fetching leads:', err);
      return { data: [], error: 'Erro inesperado ao buscar leads' };
    }
  },

  /**
   * Get unique materials for filter dropdown
   */
  async getUniqueMaterials(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('material_leads')
        .select('downloaded_material')
        .not('downloaded_material', 'is', null);

      if (error || !data) return [];

      const unique = [...new Set(data.map(d => d.downloaded_material).filter(Boolean))] as string[];
      return unique.sort();
    } catch {
      return [];
    }
  },

  /**
   * Delete a lead by ID
   */
  async deleteLead(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('material_leads')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Erro ao excluir lead' };
    }
  },

  /**
   * Export leads to CSV
   */
  exportToCSV(leads: MaterialLeadRow[]): void {
    const headers = ['Nome', 'Email', 'Material Baixado', 'Consentimento', 'Fonte', 'Data de Cadastro'];
    const rows = leads.map(lead => [
      lead.name,
      lead.email,
      lead.downloaded_material || '',
      lead.consent ? 'Sim' : 'Não',
      lead.source || '',
      new Date(lead.created_at).toLocaleString('pt-BR'),
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads_materiais_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
