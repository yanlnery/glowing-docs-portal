
export interface Species {
  id: string; // uuid
  commonName: string; // common_name TEXT
  name: string; // name TEXT (Scientific Name)
  description: string;
  characteristics: string[];
  curiosities: string[];
  image: string; // URL da imagem
  order: number; // "order" INTEGER
  type: 'serpente' | 'lagarto' | 'quelonio' | 'outro'; // Mapeamento do enum species_type_enum
  slug: string; // slug TEXT UNIQUE
  created_at?: string; // TIMESTAMPTZ
  updated_at?: string; // TIMESTAMPTZ
}
