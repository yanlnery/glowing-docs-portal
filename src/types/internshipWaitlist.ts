export interface InternshipWaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  course: string;
  semester?: string | null;
  availability: string;
  interest_area: string;
  motivation?: string | null;
  linkedin_url?: string | null;
  status: 'pending' | 'contacted' | 'approved' | 'rejected';
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export type InternshipWaitlistStatus = 'pending' | 'contacted' | 'approved' | 'rejected';

export const internshipStatusLabels: Record<InternshipWaitlistStatus, string> = {
  pending: 'Pendente',
  contacted: 'Contatado',
  approved: 'Aprovado',
  rejected: 'Não aprovado'
};

export const internshipStatusColors: Record<InternshipWaitlistStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  contacted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

export const interestAreas = [
  { value: 'manejo', label: 'Manejo de Animais' },
  { value: 'educacao', label: 'Educação Ambiental' },
  { value: 'pesquisa', label: 'Pesquisa' },
  { value: 'todos', label: 'Todas as áreas' }
];

export const availabilityOptions = [
  { value: 'manha', label: 'Manhã' },
  { value: 'tarde', label: 'Tarde' },
  { value: 'noite', label: 'Noite' },
  { value: 'flexivel', label: 'Flexível' }
];
