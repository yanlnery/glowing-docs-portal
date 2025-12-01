
import React from 'react';
import { Button } from "@/components/ui/button";
import { Species } from '@/types/species';

type SpeciesTypeFilter = Species['type'] | 'todos';

interface SpeciesFilterControlsProps {
  activeFilter: SpeciesTypeFilter;
  onFilterChange: (filter: SpeciesTypeFilter) => void;
}

const filterOptions: { label: string; value: SpeciesTypeFilter }[] = [
  { label: "Todos", value: "todos" },
  { label: "Serpentes", value: "serpente" },
  { label: "Lagartos", value: "lagarto" },
  { label: "Quelônios", value: "quelonio" },
  { label: "Outros", value: "outro" },
];

export function SpeciesFilterControls({ activeFilter, onFilterChange }: SpeciesFilterControlsProps) {
  return (
    <div className="flex items-center gap-2 w-full overflow-x-auto py-2">
      {filterOptions.map(option => (
        <Button
          key={option.value}
          variant={activeFilter === option.value ? "outline" : "ghost"}
          size="sm"
          className="min-h-[44px] flex-shrink-0"
          onClick={() => onFilterChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
