
export interface Species {
  id: string; // uuid
  commonname: string; // commonname TEXT
  name: string; // name TEXT (Scientific Name)
  description: string;
  characteristics: string[];
  curiosities: string[];
  image: string | null; // URL da imagem principal, now nullable
  gallery: string[]; // Array de URLs de imagens adicionais para galeria (3-6 fotos)
  order: number; // "order" INTEGER
  type: 'serpente' | 'lagarto' | 'quelonio' | 'outro'; // Mapeamento do enum species_type_enum
  slug: string; // slug TEXT UNIQUE
  created_at?: string; // TIMESTAMPTZ
  updated_at?: string; // TIMESTAMPTZ
  focus_desktop?: string; // Focal point for main image on desktop
  focus_mobile?: string; // Focal point for main image on mobile
}
