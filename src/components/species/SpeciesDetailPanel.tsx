import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Species } from '@/types/species';
import { SpeciesGallery } from './SpeciesGallery';
import { SpeciesActionButton } from './SpeciesActionButton';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface SpeciesDetailPanelProps {
  species: Species | null;
}

interface RelatedManual {
  id: string;
  title: string;
  description: string | null;
}

export function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/)|youtu\.be\/)([\w-]{6,})/);
  return match ? match[1] : null;
}

function useRelatedManual(species: Species | null) {
  const [manual, setManual] = useState<RelatedManual | null>(null);

  useEffect(() => {
    let cancelled = false;
    setManual(null);
    if (!species) return;

    const load = async () => {
      const { data } = await supabase
        .from('manuals')
        .select('id, title, description')
        .eq('species_id', species.id)
        .limit(1);

      if (cancelled) return;
      if (data && data.length > 0) {
        setManual(data[0] as RelatedManual);
        return;
      }

      if (!species.type) return;
      const { data: fallback } = await supabase
        .from('manuals')
        .select('id, title, description')
        .eq('category', species.type)
        .is('species_id', null)
        .limit(1);

      if (!cancelled && fallback && fallback.length > 0) {
        setManual(fallback[0] as RelatedManual);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [species]);

  return manual;
}

export function SpeciesDetailPanel({ species }: SpeciesDetailPanelProps) {
  const relatedManual = useRelatedManual(species);
  const youtubeId = species?.video_url ? getYoutubeId(species.video_url) : null;
  const faqItems = (species?.faq || []).filter((item) => item?.question && item?.answer);

  return (
    <div className="flex-1 min-h-[calc(100vh-24rem)]">
      {!species ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-12">
            <div className="text-5xl mb-4">🦎</div>
            <p className="text-muted-foreground text-lg">
              Selecione uma espécie na lista ao lado para ver detalhes
            </p>
          </div>
        </div>
      ) : (
        <div key={species.id} className="animate-fade-in">
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

        {/* FAQ */}
        {faqItems.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-serpente-400 mb-3">Perguntas frequentes</h3>
            <Accordion type="single" collapsible className="space-y-2">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border border-border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* Vídeo */}
        {youtubeId && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-serpente-400 mb-3">Vídeo</h3>
            <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-border">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={`Vídeo sobre ${species.commonname}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Manual relacionado */}
        {relatedManual && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-serpente-400 mb-3">Manual de manejo relacionado</h3>
            <Link
              to="/manuais"
              className="flex items-start gap-3 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-serpente-500 mt-0.5 flex-shrink-0" />
              <span>
                <span className="block font-medium">{relatedManual.title}</span>
                {relatedManual.description && (
                  <span className="block text-sm text-muted-foreground line-clamp-2">
                    {relatedManual.description}
                  </span>
                )}
              </span>
            </Link>
          </div>
        )}

        {/* Action CTA */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-serpente-400">Interessado nesta espécie?</h3>
              <p className="text-sm text-muted-foreground">Veja disponibilidade ou cadastre-se para ser notificado.</p>
            </div>
            <SpeciesActionButton species={species} />
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
}
