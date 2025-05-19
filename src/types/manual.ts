
export type ManualCategory = 'serpente' | 'lagarto' | 'quelonio' | 'geral';

export interface Manual {
  id: string; // uuid
  title: string;
  description: string | null;
  pages: number | null;
  image: string | null; // URL of the cover image from Supabase Storage
  category: ManualCategory | null;
  pdf_url: string | null; // URL of the PDF file from Supabase Storage
  created_at?: string;
  updated_at?: string;
}

// This type can be used for form data, including transient file objects
export interface ManualFormData extends Omit<Manual, 'id' | 'created_at' | 'updated_at'> {
  id?: string; // Optional for new manuals
  imageFile?: File | null;
  pdfFile?: File | null;
  originalImageUrl?: string | null; // To track if old image needs deletion
  originalPdfUrl?: string | null;   // To track if old PDF needs deletion
}
