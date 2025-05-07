import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface Species {
  id: string;
  name: string;
  commonName: string;
  type: string;
  image: string;
  slug: string;
  description?: string;
  characteristics?: string[];
  curiosities?: string[];
  order?: number;
}

export default function Species() {
  const [activeFilter, setActiveFilter] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  
  useEffect(() => {
    // Try to load species from localStorage (managed by admin)
    const savedSpecies = localStorage.getItem('speciesList');
    if (savedSpecies) {
      const parsedSpecies = JSON.parse(savedSpecies);
      // Sort by order if available
      const sortedSpecies = parsedSpecies.sort((a: Species, b: Species) => 
        (a.order || 0) - (b.order || 0)
      );
      setSpeciesList(sortedSpecies);
    } else {
      // Fallback to the default hardcoded species
      setSpeciesList([
        {
          id: "1",
          name: "Boa constrictor constrictor",
          commonName: "Jiboia Amazônica",
          type: "serpente",
          image: "/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png",
          slug: "boa-constrictor-constrictor"
        },
        {
          id: "2",
          name: "Boa constrictor amarali",
          commonName: "Jiboia do Cerrado",
          type: "serpente",
          image: "/lovable-uploads/f6e67c5c-183d-46ac-a882-997f826be1b3.png",
          slug: "boa-constrictor-amarali"
        },
        {
          id: "3",
          name: "Boa atlantica",
          commonName: "Jiboia da Mata Atlântica",
          type: "serpente",
          image: "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png",
          slug: "boa-atlantica"
        },
        {
          id: "4",
          name: "Epicrates cenchria",
          commonName: "Jiboia Arco-íris da Amazônia",
          type: "serpente",
          image: "/lovable-uploads/f7bc5a30-657d-418c-8b25-7b0494f36029.png",
          slug: "epicrates-cenchria"
        },
        {
          id: "5",
          name: "Epicrates assisi",
          commonName: "Jiboia Arco-íris da Caatinga",
          type: "serpente",
          image: "/lovable-uploads/51de7896-4d25-4af0-af9d-31c8028fcc3b.png",
          slug: "epicrates-assisi"
        },
        {
          id: "6",
          name: "Epicrates crassus",
          commonName: "Jiboia Arco-íris do Cerrado",
          type: "serpente",
          image: "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png",
          slug: "epicrates-crassus"
        },
        {
          id: "7",
          name: "Epicrates maurus",
          commonName: "Jiboia Arco-íris do Norte",
          type: "serpente",
          image: "/lovable-uploads/0e7c1a90-84bb-4471-908a-af3fcab85c04.png",
          slug: "epicrates-maurus"
        },
        {
          id: "8",
          name: "Corallus batesii",
          commonName: "Jiboia Esmeralda",
          type: "serpente",
          image: "/lovable-uploads/6dcc0ef5-dc47-4f3c-9020-54ecc65ed390.png",
          slug: "corallus-batesii"
        },
        {
          id: "9",
          name: "Corallus hortulana",
          commonName: "Suaçuboia",
          type: "serpente",
          image: "/lovable-uploads/87bb79b7-12d7-41e7-9b09-a2a646636a7f.png",
          slug: "corallus-hortulana"
        },
        {
          id: "10",
          name: "Erythrolamprus miliaris",
          commonName: "Cobra d'água",
          type: "serpente",
          image: "/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png",
          slug: "erythrolamprus-miliaris"
        },
        {
          id: "11",
          name: "Spilotes pullatus",
          commonName: "Caninana",
          type: "serpente",
          image: "/lovable-uploads/d71c2fb7-1bfe-41ba-8db3-d2d0b4279365.png",
          slug: "spilotes-pullatus"
        },
        {
          id: "12",
          name: "Spilotes sulphureus",
          commonName: "Caninana de Fogo",
          type: "serpente",
          image: "/lovable-uploads/0e7c1a90-84bb-4471-908a-af3fcab85c04.png",
          slug: "spilotes-sulphureus"
        },
        {
          id: "13",
          name: "Salvator teguixin",
          commonName: "Teiú Dourado",
          type: "lagarto",
          image: "/lovable-uploads/b81f6c0b-360a-4408-834b-cb20bd36e3da.png",
          slug: "salvator-teguixin"
        },
        {
          id: "14",
          name: "Salvator merianae",
          commonName: "Teiú",
          type: "lagarto",
          image: "/lovable-uploads/370accb0-50cf-459e-a966-c1fc135ecb83.png",
          slug: "salvator-merianae"
        },
        {
          id: "15",
          name: "Iguana iguana",
          commonName: "Iguana",
          type: "lagarto",
          image: "/lovable-uploads/c138dc46-3fd6-4dda-aa7b-c02dead150e7.png",
          slug: "iguana-iguana"
        },
        {
          id: "16",
          name: "Diploglossus lessonae",
          commonName: "Lagarto Coral",
          type: "lagarto",
          image: "/lovable-uploads/481f8f82-22b1-407d-9e88-623e453faf6a.png",
          slug: "diploglossus-lessonae"
        },
        {
          id: "17",
          name: "Polychrus marmoratus",
          commonName: "Lagarto Preguiça",
          type: "lagarto",
          image: "/lovable-uploads/b11770a0-4aca-4362-aa63-c0e9a9d4df0c.png",
          slug: "polychrus-marmoratus"
        },
        {
          id: "18",
          name: "Thecadactylus rapicauda",
          commonName: "Lagartixa Rabo de Nabo",
          type: "lagarto",
          image: "/lovable-uploads/11848f61-6118-4555-92b5-61760f34cf00.png",
          slug: "thecadactylus-rapicauda"
        },
        {
          id: "19",
          name: "Chelonoidis carbonaria",
          commonName: "Jabuti Piranga",
          type: "quelonio",
          image: "/lovable-uploads/90e09ad1-fa3b-48d6-9979-59f090220fcb.png",
          slug: "chelonoidis-carbonaria"
        },
        {
          id: "20",
          name: "Chelonoidis denticulata",
          commonName: "Jabuti Tinga",
          type: "quelonio",
          image: "/lovable-uploads/90e09ad1-fa3b-48d6-9979-59f090220fcb.png",
          slug: "chelonoidis-denticulata"
        },
        {
          id: "21",
          name: "Crocodilurus amazonicus",
          commonName: "Jacarerana",
          type: "lagarto",
          image: "/lovable-uploads/b11770a0-4aca-4362-aa63-c0e9a9d4df0c.png",
          slug: "crocodilurus-amazonicus"
        }
      ]);
    }
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
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar espécie..."
              className="h-10 w-full rounded-md border border-input pl-8 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
        </div>
      </div>
      
      {/* Species Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {searchedSpecies.map((species) => (
          <div key={species.id} className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
            <div className="relative h-40 sm:h-60 overflow-hidden">
              <img 
                src={species.image}
                alt={species.name} 
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
      
      {searchedSpecies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">Nenhuma espécie encontrada com os filtros selecionados</p>
        </div>
      )}
    </div>
  );
}
