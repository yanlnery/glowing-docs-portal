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
                    "group w-full text-left p-2.5 rounded-lg transition-all duration-300 mb-1.5 relative overflow-hidden",
                    "border-l-4 flex items-center gap-3",
                    selectedId === speciesItem.id
                      ? "bg-serpente-600/20 border-serpente-500 shadow-md"
                      : "border-transparent hover:bg-serpente-600/10 hover:border-serpente-400 hover:shadow-sm hover:translate-x-1"
                  )}
                >
                  {/* Efeito de brilho no hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-serpente-400/0 via-serpente-400/5 to-serpente-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  
                  {/* Miniatura */}
                  <div className={cn(
                    "relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 transition-all duration-300",
                    "ring-2",
                    selectedId === speciesItem.id 
                      ? "ring-serpente-500" 
                      : "ring-border group-hover:ring-serpente-400/50"
                  )}>
                    {speciesItem.image ? (
                      <img 
                        src={speciesItem.image} 
                        alt={speciesItem.commonname}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-lg">
                        🦎
                      </div>
                    )}
                  </div>
                  
                  {/* Texto */}
                  <div className="flex-1 min-w-0 relative z-10">
                    <div className={cn(
                      "font-medium text-sm transition-colors duration-200 truncate",
                      selectedId === speciesItem.id ? "text-serpente-400" : "group-hover:text-serpente-500"
                    )}>
                      {speciesItem.commonname}
                    </div>
                    <div className={cn(
                      "text-xs italic mt-0.5 transition-colors duration-200 truncate",
                      selectedId === speciesItem.id ? "text-serpente-400/70" : "text-muted-foreground group-hover:text-muted-foreground/80"
                    )}>
                      {speciesItem.name}
                    </div>
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
