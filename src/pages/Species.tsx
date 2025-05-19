
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react"; // Renamed to avoid conflict
import { supabase } from "@/integrations/supabase/client";
import { Species as SpeciesType } from "@/types/species"; // Use updated type

export default function Species() {
  const [activeFilter, setActiveFilter] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [speciesList, setSpeciesList] = useState<SpeciesType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSpecies = async () => {
      setIsLoading(true);
      setError(null);
      const { data, error: dbError } = await supabase
        .from('species')
        .select('*')
        .order('order', { ascending: true });

      if (dbError) {
        console.error("Error fetching species:", dbError);
        setError("Falha ao carregar espécies. Tente novamente mais tarde.");
        setSpeciesList([]);
      } else {
        setSpeciesList(data as SpeciesType[]);
      }
      setIsLoading(false);
    };
    fetchSpecies();
  }, []);
  
  const filteredSpecies = activeFilter === "todos"
    ? speciesList
    : speciesList.filter(species => species.type === activeFilter);
    
  const searchedSpecies = searchQuery
    ? filteredSpecies.filter(species => 
        species.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        species.commonName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredSpecies;

  if (isLoading) {
    return <div className="container px-4 py-12 text-center">Carregando espécies...</div>;
  }

  if (error) {
    return <div className="container px-4 py-12 text-center text-red-500">{error}</div>;
  }
    
  return (
    <div className="container px-4 py-8 sm:py-12 sm:px-6">
      <div className="flex flex-col items-center mb-8 sm:mb-12 text-center">
        <div className="docs-section-title">
          <h1 className="text-3xl sm:text-4xl font-bold">Espécies Criadas</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mt-4">
          Conheça todas as espécies criadas em nosso plantel, com informações detalhadas e características
        </p>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar espécie..."
              className="h-10 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end overflow-x-auto py-2 sm:py-0">
          <Button 
            variant={activeFilter === "todos" ? "outline" : "ghost"} 
            size="sm"
            className="min-h-[44px]"
            onClick={() => setActiveFilter("todos")}
          >
            Todos
          </Button>
          <Button 
            variant={activeFilter === "serpente" ? "outline" : "ghost"} 
            size="sm"
            className="min-h-[44px]"
            onClick={() => setActiveFilter("serpente")}
          >
            Serpentes
          </Button>
          <Button 
            variant={activeFilter === "lagarto" ? "outline" : "ghost"} 
            size="sm"
            className="min-h-[44px]"
            onClick={() => setActiveFilter("lagarto")}
          >
            Lagartos
          </Button>
          <Button 
            variant={activeFilter === "quelonio" ? "outline" : "ghost"} 
            size="sm"
            className="min-h-[44px]"
            onClick={() => setActiveFilter("quelonio")}
          >
            Quelônios
          </Button>
           <Button 
            variant={activeFilter === "outro" ? "outline" : "ghost"} 
            size="sm"
            className="min-h-[44px]"
            onClick={() => setActiveFilter("outro")}
          >
            Outros
          </Button>
        </div>
      </div>
      
      {/* Species Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {searchedSpecies.map((species) => (
          <div key={species.id} className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
            <div className="relative h-40 sm:h-60 overflow-hidden">
              <img 
                src={species.image || '/placeholder.svg'} // Fallback image
                alt={species.commonName} 
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="font-bold text-sm sm:text-lg mb-1 line-clamp-1"><em>{species.name}</em></h3>
              <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3">{species.commonName}</p>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="w-full sm:w-auto min-h-[44px] text-xs sm:text-sm" asChild>
                  <Link to={`/especies-criadas/${species.slug}`}>Ver Detalhes</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {searchedSpecies.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">Nenhuma espécie encontrada com os filtros selecionados</p>
        </div>
      )}
    </div>
  );
}
