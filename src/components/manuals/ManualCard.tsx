
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, ImageOff } from "lucide-react";
import { Manual } from "@/types/manual";

interface ManualCardProps {
  manual: Manual;
  onDownload: (pdfUrl: string | null, title: string) => void;
}

export default function ManualCard({ manual, onDownload }: ManualCardProps) {
  const pagesText = manual.pages && manual.pages > 0 ? `${manual.pages} páginas` : 'N/A';
  
  return (
    <div key={manual.id} className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md flex flex-col">
      <div className="relative h-40 sm:h-48 overflow-hidden bg-muted">
        {manual.image ? (
          <img 
            src={manual.image}
            alt={manual.title} 
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageOff size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-4">
            <span className="inline-flex items-center gap-1 bg-white/90 text-serpente-800 text-xs px-2 py-1 rounded">
              <FileText className="h-3 w-3" /> {pagesText}
            </span>
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4 flex-grow">
        <h3 className="font-bold text-sm sm:text-base md:text-lg mb-2 line-clamp-2">{manual.title}</h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-4 line-clamp-2 sm:line-clamp-3">{manual.description || "Sem descrição disponível."}</p>
      </div>
      <div className="p-3 sm:p-4 pt-0 mt-auto">
        <Button 
          className="w-full min-h-[44px]" 
          variant={manual.pdf_url ? "outline" : "secondary"}
          onClick={() => onDownload(manual.pdf_url, manual.title)}
          disabled={!manual.pdf_url}
        >
          <Download className="mr-2 h-4 w-4" /> 
          {manual.pdf_url ? "Baixar PDF" : "PDF Indisponível"}
        </Button>
      </div>
    </div>
  );
}
