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

        const selectedSlug = searchParams.get('selected');
        if (selectedSlug && mappedData.length > 0) {
          const species = mappedData.find(s => s.slug === selectedSlug);
          if (species) setSelectedSpecies(species);
        }
      } catch (err: any) {
        console.error('Erro ao buscar espécies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [searchParams]);

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
    setSearchParams({ selected: species.slug });
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
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 text-serpente-400">Espécies Criadas</h1>
        <p className="text-muted-foreground text-lg">
          Conheça as espécies que criamos em nosso criadouro legalizado
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
          <SpeciesFilterControls
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      </div>

      {isMobile ? (
        <SpeciesMobileView species={filteredSpecies} />
      ) : (
        <div className="flex gap-6">
          <SpeciesSidebar
            species={filteredSpecies}
            selectedId={selectedSpecies?.id || null}
            onSelect={handleSelectSpecies}
          />
          <SpeciesDetailPanel species={selectedSpecies} />
        </div>
      )}
    </div>
  );
}
