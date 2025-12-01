import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Species } from '@/types/species';
import { Input } from '@/components/ui/input';
import { SpeciesFilterControls } from '@/components/species/SpeciesFilterControls';
import { SpeciesSidebar } from '@/components/species/SpeciesSidebar';
import { SpeciesDetailPanel } from '@/components/species/SpeciesDetailPanel';
import { SpeciesMobileView } from '@/components/species/SpeciesMobileView';
import { useIsMobile } from '@/hooks/use-mobile';
import { Search } from 'lucide-react';

type SpeciesTypeFilter = Species['type'] | 'todos';

export default function SpeciesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  const [activeFilter, setActiveFilter] = useState<SpeciesTypeFilter>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch inicial - só roda uma vez no mount
  useEffect(() => {
    const fetchSpecies = async () => {
      setLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('species')
          .select('*')
          .order('order', { ascending: true });

        if (fetchError) throw fetchError;

        const mappedData: Species[] = (data || []).map((item: any) => ({
          ...item,
          characteristics: item.characteristics || [],
          curiosities: item.curiosities || [],
          gallery: item.gallery || [],
        }));

        setSpeciesList(mappedData);
      } catch (err: any) {
        console.error('Erro ao buscar espécies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, []); // Só roda uma vez

  // Pré-seleção baseada na URL
  useEffect(() => {
    const selectedSlug = searchParams.get('selected');
    if (selectedSlug && speciesList.length > 0) {
      const species = speciesList.find(s => s.slug === selectedSlug);
      if (species) {
        setSelectedSpecies(species);
      }
    }
  }, [searchParams, speciesList]);

  const filteredSpecies = useMemo(() => {
    return speciesList.filter((species) => {
      const matchesType = activeFilter === 'todos' || species.type === activeFilter;
      const matchesSearch =
        searchQuery === '' ||
        species.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        species.commonname.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [speciesList, activeFilter, searchQuery]);

  const handleSelectSpecies = (species: Species) => {
    setSelectedSpecies(species);
    setSearchParams({ selected: species.slug }, { replace: true });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Carregando espécies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-lg text-destructive">Erro ao carregar espécies: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-6 py-8 sm:py-12">
      {/* Header centralizado com barra verde */}
      <div className="flex flex-col items-center mb-8 sm:mb-12 text-center">
        <div className="docs-section-title">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">Espécies Criadas</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mt-3 sm:mt-4 text-sm sm:text-base">
          Conheça as espécies que criamos em nosso criadouro legalizado
        </p>
      </div>

      {/* Busca + Filtros na mesma linha (desktop) */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Busca à esquerda */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar espécie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Filtros à direita (apenas desktop) */}
        {!isMobile && (
          <SpeciesFilterControls
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        )}
      </div>

      {isMobile ? (
        <>
          {/* Filtros abaixo da busca no mobile */}
          <div className="mb-4">
            <SpeciesFilterControls
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
          <SpeciesMobileView species={filteredSpecies} />
        </>
      ) : (
        <div className="flex gap-6 min-h-[calc(100vh-24rem)]">
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <SpeciesSidebar
              species={filteredSpecies}
              selectedId={selectedSpecies?.id || null}
              onSelect={handleSelectSpecies}
            />
          </div>
          <SpeciesDetailPanel species={selectedSpecies} />
        </div>
      )}
    </div>
  );
}
