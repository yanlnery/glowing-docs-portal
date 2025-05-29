
import React from "react";
import { Manual } from "@/types/manual";
import ManualCard from "./ManualCard";
import { Button } from "@/components/ui/button";

interface ManualsGridProps {
  manuals: Manual[];
  displayedManuals: Manual[];
  searchQuery: string;
  onDownload: (pdfUrl: string | null, title: string) => void;
  onClearSearch: () => void;
  isLoading: boolean;
}

export default function ManualsGrid({
  manuals,
  displayedManuals,
  searchQuery,
  onDownload,
  onClearSearch,
  isLoading,
}: ManualsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-card border rounded-lg p-4 sm:p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (displayedManuals.length === 0) {
    if (searchQuery) {
      return (
        <div className="text-center py-12">
          <p className="text-lg sm:text-xl text-muted-foreground mb-4">
            Nenhum manual encontrado para "{searchQuery}"
          </p>
          <Button onClick={onClearSearch} variant="outline">
            Limpar Busca
          </Button>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <p className="text-lg sm:text-xl text-muted-foreground">
          Nenhum manual disponível no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {displayedManuals.map((manual) => (
        <ManualCard
          key={manual.id}
          manual={manual}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}
