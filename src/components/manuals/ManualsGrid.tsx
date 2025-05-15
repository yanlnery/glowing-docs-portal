
import React from "react";
import ManualCard from "./ManualCard";
import { Button } from "@/components/ui/button";
import { Manual } from "@/types/manual";

interface ManualsGridProps {
  manuals: Manual[]; // All loaded manuals
  displayedManuals: Manual[];
  searchQuery: string;
  onDownload: (pdfUrl: string, title: string) => void;
  onClearSearch: () => void;
}

export default function ManualsGrid({ 
  manuals, 
  displayedManuals, 
  searchQuery, 
  onDownload, 
  onClearSearch 
}: ManualsGridProps) {
  if (manuals.length === 0 && !searchQuery) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Nenhum manual cadastrado no momento. Utilize o painel administrativo para adicionar novos manuais.
        </p>
      </div>
    );
  }

  if (displayedManuals.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedManuals.map((manual) => (
          <ManualCard key={manual.id} manual={manual} onDownload={onDownload} />
        ))}
      </div>
    );
  }

  // This case means manuals might exist, but search query cleared them all
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">
        Nenhum manual encontrado para sua pesquisa.
      </p>
      {searchQuery && (
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onClearSearch}
        >
          Limpar Busca
        </Button>
      )}
    </div>
  );
}
