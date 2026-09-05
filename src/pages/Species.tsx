import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SEO } from '@/components/SEO';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
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
  const { slug: routeSlug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
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

  // Referência para acessar o valor atual de selectedSpecies sem adicioná-lo às dependências
  const selectedSpeciesRef = useRef<Species | null>(selectedSpecies);
  selectedSpeciesRef.current = selectedSpecies;

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

  // Seleção unificada: prioridade URL > seleção atual válida > primeira da lista filtrada
  useEffect(() => {
    if (speciesList.length === 0) return;

    const selectedSlug = routeSlug || searchParams.get('selected');
    let nextSpecies: Species | null = null;

    // 1) Prioridade máxima: slug explícito na URL (mesmo que não passe no filtro ativo)
    if (selectedSlug) {
      const urlSpecies = speciesList.find(s => s.slug === selectedSlug);
      if (urlSpecies) {
        nextSpecies = urlSpecies;
      }
    }

    // 2) Mantém a seleção atual se ela ainda estiver na lista filtrada
    if (!nextSpecies) {
      const current = selectedSpeciesRef.current;
      const currentIsInFiltered = current && filteredSpecies.some(s => s.id === current.id);
      if (currentIsInFiltered) {
        nextSpecies = current;
      } else if (filteredSpecies.length > 0) {
        nextSpecies = filteredSpecies[0];
      }
    }

    // Só atualiza se for diferente do estado atual
    if (nextSpecies?.id !== selectedSpeciesRef.current?.id) {
      setSelectedSpecies(nextSpecies);
    }
  }, [routeSlug, searchParams, speciesList, filteredSpecies]);

  const handleSelectSpecies = (species: Species) => {
    setSelectedSpecies(species);
    if (routeSlug) {
      navigate(`/especies-criadas/${species.slug}`, { replace: true });
    } else {
      setSearchParams({ selected: species.slug }, { replace: true });
    }
  };

  const baseUrl = 'https://petserpentes.com.br';

  const { pageTitle, pageDescription, canonicalUrl } = useMemo(() => {
    // SEO por espécie só quando a URL aponta explicitamente para ela;
    // na listagem pura (/especies) mantemos título/canonical da listagem.
    const slugInUrl = routeSlug || searchParams.get('selected');
    const seoSpecies = selectedSpecies && slugInUrl === selectedSpecies.slug ? selectedSpecies : null;
    if (seoSpecies) {
      const title = `${seoSpecies.commonname} (${seoSpecies.name}) | Pet Serpentes`;
      const rawDescription = seoSpecies.description?.replace(/\s+/g, ' ').trim() || '';
      const scientificContext = `Espécie ${seoSpecies.name}`;
      const maxLen = 160 - scientificContext.length - 4;
      let description = rawDescription;
      if (description.length > maxLen) {
        const truncated = description.slice(0, maxLen);
        const lastSpace = truncated.lastIndexOf(' ');
        description = lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
      }
      description = `${scientificContext}: ${description}`;
      const canonical = `/especies-criadas/${seoSpecies.slug}`;
      return { pageTitle: title, pageDescription: description, canonicalUrl: canonical };
    }
    return {
      pageTitle: 'Espécies Criadas | Pet Serpentes',
      pageDescription: 'Conheça as espécies de répteis nativos brasileiros criadas pelo Pet Serpentes, criadouro legalizado pelo IBAMA e INEA-RJ.',
      canonicalUrl: '/especies',
    };
  }, [selectedSpecies, routeSlug, searchParams]);

  // Mantém o título sincronizado também durante o carregamento da rota canônica,
  // quando o retorno antecipado abaixo ainda impede a montagem do componente SEO.
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const breadcrumbJsonLd = useMemo(() => {
    const slugInUrl = routeSlug || searchParams.get('selected');
    if (!selectedSpecies || slugInUrl !== selectedSpecies.slug) return null;
    const speciesUrl = `${baseUrl}/especies-criadas/${selectedSpecies.slug}`;
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${baseUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Espécies Criadas',
          item: `${baseUrl}/especies`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: selectedSpecies.commonname,
          item: speciesUrl,
        },
      ],
    };
  }, [selectedSpecies, routeSlug, searchParams]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-serpente-600 mx-auto mb-4"></div>
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
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
      >
        {breadcrumbJsonLd && (
          <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        )}
      </SEO>
      <div className="container px-4 md:px-6 py-8 sm:py-12 min-h-[60vh]">
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
    </>
  );
}
