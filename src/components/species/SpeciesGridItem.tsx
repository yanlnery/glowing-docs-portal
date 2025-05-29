
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Species as SpeciesType } from '@/types/species';

interface SpeciesGridItemProps {
  species: SpeciesType;
}

export function SpeciesGridItem({ species }: SpeciesGridItemProps) {
  return (
    <div key={species.id} className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
      <Link to={`/especies-criadas/${species.slug}`} className="block">
        <div className="relative h-32 sm:h-40 md:h-48 lg:h-60 overflow-hidden">
          <img
            src={species.image || '/placeholder.svg'}
            alt={species.commonName}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-3 sm:p-4">
        <Link to={`/especies-criadas/${species.slug}`}>
          <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 line-clamp-1">
            <em>{species.name}</em>
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-1">{species.commonName}</p>
        </Link>
        <div className="flex justify-end mt-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto min-h-[44px] text-xs sm:text-sm" asChild>
            <Link to={`/especies-criadas/${species.slug}`}>Ver Detalhes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
