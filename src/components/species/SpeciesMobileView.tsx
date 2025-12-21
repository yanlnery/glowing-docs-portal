import React from 'react';
import { Species } from '@/types/species';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SpeciesDetailPanel } from './SpeciesDetailPanel';
import { SpeciesWaitlistButton } from './SpeciesWaitlistButton';

interface SpeciesMobileViewProps {
  species: Species[];
}

export function SpeciesMobileView({ species }: SpeciesMobileViewProps) {
  if (species.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma espécie encontrada</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="space-y-2">
      {species.map((speciesItem) => (
        <AccordionItem 
          key={speciesItem.id} 
          value={speciesItem.id}
          className="border border-border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 hover:bg-muted/50 [&[data-state=open]]:bg-serpente-600/10">
            <div className="flex items-center gap-3 text-left">
              {speciesItem.image && (
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                  <img 
                    src={speciesItem.image} 
                    alt={speciesItem.commonname}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <div className="font-medium">{speciesItem.commonname}</div>
                <div className="text-sm italic text-muted-foreground">
                  {speciesItem.name}
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <div className="p-4 pt-0">
              <SpeciesDetailPanel species={speciesItem} />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
