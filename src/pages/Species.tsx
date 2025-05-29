
import React, { useState, useEffect, useMemo } from "react";
import { Search as SearchIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Species as SpeciesType } from "@/types/species";
import { SpeciesFilterControls } from "@/components/species/SpeciesFilterControls";
import { SpeciesGridItem } from "@/components/species/SpeciesGridItem";
import { Input } from "@/components/ui/input";

type SpeciesFilterValue = SpeciesType['type'] | 'todos';

export default function Species() {
  const [activeFilter, setActiveFilter] = useState<SpeciesFilterValue>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [speciesList, setSpeciesList] = useState<SpeciesType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecies = async () => {
      console.log("SpeciesPage: Attempting to fetch species...");
      setIsLoading(true);
      setError(null);
      const { data, error: dbError } = await supabase
        .from('species')
        .select('*')
        .order('order', { ascending: true });

      if (dbError) {
        console.error("SpeciesPage: Error fetching species:", dbError);
        setError("Falha ao carregar espécies. Tente novamente mais tarde.");
        setSpeciesList([]);
      } else {
        console.log("SpeciesPage: Species fetched successfully:", data?.length, "records");
        if (data && data.length > 0) {
          // Verificar se os dados têm a estrutura esperada
          console.log("SpeciesPage: First species object:", data[0]);
          
          // Verificar especificamente a propriedade 'commonName'
          if (data[0].commonName === undefined && data[0].commonname !== undefined) {
            console.log("SpeciesPage: Remapping 'commonname' to 'commonName'");
            // Mapeamento para corrigir inconsistências de nomenclatura
            const mappedData = data.map(item => ({
              ...item,
              commonName: item.commonname,
            }));
            setSpeciesList(mappedData as SpeciesType[]);
          } else {
            setSpeciesList(data as SpeciesType[]);
          }
        } else {
          console.log("SpeciesPage: No species data returned");
          setSpeciesList([]);
        }
      }
      setIsLoading(false);
      console.log("SpeciesPage: Loading finished.");
    };
    fetchSpecies();
  }, []);

  const filteredSpecies = useMemo(() => {
    let result = speciesList;
    if (activeFilter !== "todos") {
      result = result.filter(species => species.type === activeFilter);
    }
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(species =>
        species.name.toLowerCase().includes(lowerQuery) ||
        species.commonName.toLowerCase().includes(lowerQuery)
      );
    }
    return result;
  }, [speciesList, activeFilter, searchQuery]);

  if (isLoading) {
    return <div className="container px-4 py-12 text-center">Carregando espécies...</div>;
  }

  if (error) {
    return <div className="container px-4 py-12 text-center text-red-500">{error}</div>;
  }
  
  if (filteredSpecies.length === 0 && !isLoading && !error) {
    console.log("SpeciesPage: No species found after filtering or initial load, rendering fallback.");
  }

  return (
    <div className="container px-4 py-8 sm:py-12 sm:px-6">
      <div className="flex flex-col items-center mb-8 sm:mb-12 text-center">
        <div className="docs-section-title">
          <h1 className="text-3xl sm:text-4xl font-bold">Espécies Criadas</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mt-4">
          Conheça todas as espécies criadas em nosso plantel, com informações detalhadas e características.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar espécie..."
            className="h-10 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <SpeciesFilterControls activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      {/* Species Grid */}
      {filteredSpecies.length > 0 ? (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredSpecies.map((species) => (
            <SpeciesGridItem key={species.id} species={species} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">Nenhuma espécie encontrada com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
}
