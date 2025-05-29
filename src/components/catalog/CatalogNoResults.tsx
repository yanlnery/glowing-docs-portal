
import React from "react";
import { Button } from "@/components/ui/button";

interface CatalogNoResultsProps {
  onClearFilters: () => void;
}

export default function CatalogNoResults({ onClearFilters }: CatalogNoResultsProps) {
  return (
    <div className="text-center py-8 sm:py-12 px-4">
      <h3 className="text-lg sm:text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
      <p className="text-muted-foreground mb-4 text-sm sm:text-base">
        Não encontramos nenhum animal com os filtros selecionados.
      </p>
      <Button onClick={onClearFilters} className="min-h-[44px] px-6">
        Limpar Filtros
      </Button>
    </div>
  );
}
