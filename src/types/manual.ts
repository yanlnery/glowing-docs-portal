
export interface Manual {
  id: string;
  title: string;
  description: string;
  pages: number;
  image: string;
  category: string;
  pdfUrl: string;
  pdfFile?: File;
}
