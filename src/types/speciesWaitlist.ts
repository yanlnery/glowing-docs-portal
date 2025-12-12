export interface SpeciesWaitlistEntry {
  id: string;
  species_id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string | null;
  contact_preference: string;
  status: 'waiting' | 'contacted' | 'converted' | 'cancelled' | 'migrated';
  priority: number;
  notes?: string | null;
  previous_species_id?: string | null;
  migrated_at?: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  species_name?: string;
  species_commonname?: string;
  previous_species_name?: string;
}

export type SpeciesWaitlistStatus = 'waiting' | 'contacted' | 'converted' | 'cancelled' | 'migrated';

export const statusLabels: Record<SpeciesWaitlistStatus, string> = {
  waiting: 'Aguardando',
  contacted: 'Contatado',
  converted: 'Convertido',
  cancelled: 'Cancelado',
  migrated: 'Migrado'
};

export const statusColors: Record<SpeciesWaitlistStatus, string> = {
  waiting: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  contacted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  converted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  migrated: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
};
