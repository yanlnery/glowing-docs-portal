
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Species as SpeciesType } from '@/types/species';

interface SpeciesGridItemProps {
  species: SpeciesType;
}

export function SpeciesGridItem({ species }: SpeciesGridItemProps) {
  return (
    <div className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group w-full">
      <Link to={`/especies-criadas/${species.slug}`} className="block">
        <div className="relative h-32 sm:h-40 md:h-48 lg:h-60 overflow-hidden">
          <OptimizedImage
            src={species.image || '/placeholder.svg'}
            alt={species.commonname}
            priority={false}
            quality={80}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="w-full h-full"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              transform: "scale(1)",
              transition: "transform 0.3s ease"
            }}
            onLoad={() => console.log(`✅ Espécie ${species.commonname} carregada`)}
          />
        </div>
      </Link>
      <div className="p-3 sm:p-4">
        <Link to={`/especies-criadas/${species.slug}`}>
          <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 line-clamp-1">
            <em>{species.name}</em>
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-1">{species.commonname}</p>
        </Link>
        <div className="flex justify-end mt-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm" asChild>
            <Link to={`/especies-criadas/${species.slug}`}>Ver Detalhes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
