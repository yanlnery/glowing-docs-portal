
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { Manual } from "@/types/manual";

interface ManualCardProps {
  manual: Manual;
  onDownload: (pdfUrl: string, title: string) => void;
}

export default function ManualCard({ manual, onDownload }: ManualCardProps) {
  return (
    <div key={manual.id} className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={manual.image}
          alt={manual.title} 
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-4">
            <span className="inline-flex items-center gap-1 bg-white/90 text-serpente-800 text-xs px-2 py-1 rounded">
              <FileText className="h-3 w-3" /> {manual.pages} páginas
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 flex-grow">
        <h3 className="font-bold text-lg mb-2">{manual.title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{manual.description}</p>
      </div>
      <div className="p-4 pt-0 mt-auto">
        <Button 
          className="w-full" 
          variant="outline" 
          onClick={() => onDownload(manual.pdfUrl, manual.title)}
        >
          <Download className="mr-2 h-4 w-4" /> Baixar PDF
        </Button>
      </div>
    </div>
  );
}
