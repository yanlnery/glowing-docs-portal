
export interface Species {
  id: string; // uuid
  commonname: string; // commonname TEXT
  name: string; // name TEXT (Scientific Name)
  description: string;
  characteristics: string[];
  curiosities: string[];
  image: string | null; // URL da imagem, now nullable
  order: number; // "order" INTEGER
  type: 'serpente' | 'lagarto' | 'quelonio' | 'outro'; // Mapeamento do enum species_type_enum
  slug: string; // slug TEXT UNIQUE
  created_at?: string; // TIMESTAMPTZ
  updated_at?: string; // TIMESTAMPTZ
}
