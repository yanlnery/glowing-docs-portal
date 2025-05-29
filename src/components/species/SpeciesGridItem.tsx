
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Species } from "@/types/species";

interface SpeciesGridItemProps {
  species: Species;
}

export function SpeciesGridItem({ species }: SpeciesGridItemProps) {
  return (
    <Link 
      to={`/especies/${species.id}`} 
      className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group block"
    >
      <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
        <OptimizedImage
          src={species.image || "/placeholder.svg"}
          alt={`${species.name} - ${species.commonName}`}
          priority={false}
          quality={75}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          style={{
            objectFit: "cover",
            objectPosition: "center"
          }}
          onLoad={() => console.log(`✅ Espécie ${species.name} carregada`)}
        />
        <div className="absolute top-2 right-2">
          <span className={`inline-block text-white text-xs px-2 py-1 rounded ${
            species.type === 'serpente' ? 'bg-serpente-600' : 'bg-earth-600'
          }`}>
            {species.type === 'serpente' ? 'Serpente' : 'Lagarto'}
          </span>
        </div>
      </div>
      <div className="p-3 sm:p-4 h-full flex flex-col">
        <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 line-clamp-1">
          <em>{species.name}</em>
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 flex-1 line-clamp-2">
          {species.commonName}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full min-h-[36px] sm:min-h-[40px] text-xs sm:text-sm group-hover:bg-serpente-600 group-hover:text-white transition-colors"
          asChild
        >
          <span>Ver Detalhes</span>
        </Button>
      </div>
    </Link>
  );
}
