import React from 'react';
import { Species } from '@/types/species';
import { SpeciesGallery } from './SpeciesGallery';

interface SpeciesDetailPanelProps {
  species: Species | null;
}

export function SpeciesDetailPanel({ species }: SpeciesDetailPanelProps) {
  if (!species) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-12">
          <div className="text-5xl mb-4">🦎</div>
          <p className="text-muted-foreground text-lg">
            Selecione uma espécie na lista ao lado para ver detalhes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      key={species.id} 
      className="flex-1 animate-fade-in"
    >
      <div className="bg-card border border-border rounded-lg p-6 lg:p-8">
        {/* Título */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-serpente-400 mb-2">
            {species.commonname}
          </h2>
          <p className="text-lg italic text-muted-foreground">
            {species.name}
          </p>
        </div>

        {/* Galeria */}
        <div className="mb-8">
          <SpeciesGallery
            images={species.gallery || []}
            mainImage={species.image}
            altText={species.commonname}
          />
        </div>

        {/* Descrição */}
        {species.description && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-serpente-400 mb-3">Descrição</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {species.description}
            </p>
          </div>
        )}

        {/* Características */}
        {species.characteristics && species.characteristics.length > 0 && species.characteristics[0] !== '' && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-serpente-400 mb-3">Características</h3>
            <ul className="space-y-2">
              {species.characteristics.map((char, index) => (
                char && (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-serpente-500 mt-1">•</span>
                    <span className="text-muted-foreground">{char}</span>
                  </li>
                )
              ))}
            </ul>
          </div>
        )}

        {/* Curiosidades */}
        {species.curiosities && species.curiosities.length > 0 && species.curiosities[0] !== '' && (
          <div>
            <h3 className="text-xl font-semibold text-serpente-400 mb-3">Curiosidades</h3>
            <ul className="space-y-2">
              {species.curiosities.map((curiosity, index) => (
                curiosity && (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-serpente-500 mt-1">🔍</span>
                    <span className="text-muted-foreground">{curiosity}</span>
                  </li>
                )
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
