
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { Manual } from "@/types/manual";

interface ManualCardProps {
  manual: Manual;
  onDownload: (pdfUrl: string | null, title: string) => void;
}

export default function ManualCard({ manual, onDownload }: ManualCardProps) {
  return (
    <div className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
      <div className="p-3 sm:p-4 md:p-6 h-full flex flex-col">
        <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
          <FileText className="text-serpente-600 h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm sm:text-base md:text-lg leading-tight mb-1 line-clamp-2">
              {manual.title}
            </h3>
            {manual.category && (
              <span className="inline-block bg-serpente-600/10 text-serpente-700 dark:text-serpente-400 text-xs px-2 py-1 rounded">
                {manual.category}
              </span>
            )}
          </div>
        </div>
        
        {manual.description && (
          <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 flex-1 line-clamp-3">
            {manual.description}
          </p>
        )}
        
        <Button
          onClick={() => onDownload(manual.pdf_url, manual.title)}
          size="sm"
          className="w-full min-h-[36px] sm:min-h-[40px] text-xs sm:text-sm bg-serpente-600 hover:bg-serpente-700 text-white"
          disabled={!manual.pdf_url}
        >
          <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          {manual.pdf_url ? 'Baixar PDF' : 'Indisponível'}
        </Button>
      </div>
    </div>
  );
}
