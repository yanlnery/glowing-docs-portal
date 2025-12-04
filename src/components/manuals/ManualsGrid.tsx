
import React from "react";
import ManualCard from "./ManualCard";
import { Button } from "@/components/ui/button";
import { Manual } from "@/types/manual";
import { Skeleton } from "@/components/ui/skeleton";

interface ManualsGridProps {
  manuals: Manual[];
  displayedManuals: Manual[];
  searchQuery: string;
  onDownload: (pdfUrl: string | null, title: string) => void;
  onClearSearch: () => void;
  isLoading: boolean; // Ensure isLoading is part of the props
}

export default function ManualsGrid({ 
  manuals, 
  displayedManuals, 
  searchQuery, 
  onDownload, 
  onClearSearch,
  isLoading 
}: ManualsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 min-h-[60vh]">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[160px] sm:h-[200px] w-full rounded-lg" />
            <div className="space-y-2 p-3 sm:p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (manuals.length === 0 && !searchQuery) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-sm sm:text-base">
          Nenhum manual cadastrado no momento. Utilize o painel administrativo para adicionar novos manuais.
        </p>
      </div>
    );
  }

  if (displayedManuals.length > 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {displayedManuals.map((manual) => (
          <ManualCard key={manual.id} manual={manual} onDownload={onDownload} />
        ))}
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground text-sm sm:text-base">
        Nenhum manual encontrado para sua pesquisa "{searchQuery}".
      </p>
      {searchQuery && (
        <Button 
          variant="outline" 
          className="mt-4 min-h-[44px]"
          onClick={onClearSearch}
        >
          Limpar Busca
        </Button>
      )}
    </div>
  );
}
