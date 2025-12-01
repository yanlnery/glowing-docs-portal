import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Species } from '@/types/species';
import { cn } from '@/lib/utils';

interface SpeciesSidebarProps {
  species: Species[];
  selectedId: string | null;
  onSelect: (species: Species) => void;
}

export function SpeciesSidebar({ species, selectedId, onSelect }: SpeciesSidebarProps) {
  return (
    <div className="sticky top-6">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-lg">Lista de Espécies</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {species.length} {species.length === 1 ? 'espécie' : 'espécies'} encontrada{species.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <ScrollArea className="h-[calc(100vh-320px)]">
          <div className="p-2">
            {species.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                Nenhuma espécie encontrada
              </div>
            ) : (
              species.map((speciesItem) => (
                <button
                  key={speciesItem.id}
                  onClick={() => onSelect(speciesItem)}
                  className={cn(
                    "w-full text-left p-3 rounded-md transition-all duration-200 mb-1",
                    "hover:bg-serpente-600/10 hover:border-l-4 hover:border-serpente-400",
                    selectedId === speciesItem.id
                      ? "bg-serpente-600/20 border-l-4 border-serpente-500"
                      : "border-l-4 border-transparent"
                  )}
                >
                  <div className="font-medium text-sm">
                    {speciesItem.commonname}
                  </div>
                  <div className="text-xs italic text-muted-foreground mt-0.5">
                    {speciesItem.name}
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
