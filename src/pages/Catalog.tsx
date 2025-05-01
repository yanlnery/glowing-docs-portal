
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Filter, SortDesc, Search } from "lucide-react";

export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState("todos");
  
  // Mock data for species
  const speciesList = [
    {
      id: 1,
      name: "Python regius",
      commonName: "Python-bola",
      type: "serpente",
      habitat: "terrestre",
      stage: "filhote",
      price: 1500,
      available: true,
      image: "https://images.unsplash.com/photo-1585095595239-2c5d5b3721f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 2,
      name: "Morelia viridis",
      commonName: "Píton-verde-arbórea",
      type: "serpente",
      habitat: "arboricola",
      stage: "adulto",
      price: 3200,
      available: true,
      image: "https://images.unsplash.com/photo-1557178985-891076b318dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 3,
      name: "Pogona vitticeps",
      commonName: "Dragão-barbudo",
      type: "lagarto",
      habitat: "terrestre",
      stage: "filhote",
      price: 800,
      available: true,
      image: "https://images.unsplash.com/photo-1535295119433-5a3d0c779053?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 4,
      name: "Lampropeltis triangulum",
      commonName: "Falsa-coral",
      type: "serpente",
      habitat: "terrestre",
      stage: "adulto",
      price: 2100,
      available: false,
      image: "https://images.unsplash.com/photo-1550172268-9a48af98ac5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 5,
      name: "Pantherophis guttatus",
      commonName: "Corn Snake",
      type: "serpente",
      habitat: "terrestre",
      stage: "filhote",
      price: 900,
      available: true,
      image: "https://images.unsplash.com/photo-1633527316352-52177079b3f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 6,
      name: "Eublepharis macularius",
      commonName: "Leopard Gecko",
      type: "lagarto",
      habitat: "terrestre",
      stage: "adulto",
      price: 650,
      available: true,
      image: "https://images.unsplash.com/photo-1597284902002-b783970afd73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    }
  ];
  
  // Filter species based on selected filter
  const filteredSpecies = activeFilter === "todos" 
    ? speciesList 
    : speciesList.filter(species => {
        if (activeFilter === "serpentes") return species.type === "serpente";
        if (activeFilter === "lagartos") return species.type === "lagarto";
        if (activeFilter === "arboricolas") return species.habitat === "arboricola";
        if (activeFilter === "terrestres") return species.habitat === "terrestre";
        if (activeFilter === "filhotes") return species.stage === "filhote";
        return true;
      });
  
  return (
    <div className="container px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="docs-section-title">
          <h1 className="text-4xl font-bold">Catálogo de Espécies</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mt-4">
          Conheça nossas serpentes e lagartos disponíveis para venda, todos com procedência legal e documentação
        </p>
      </div>
      
      {/* Filters */}
      <div className="mb-8">
        <Tabs defaultValue="todos" className="w-full" onValueChange={setActiveFilter}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList className="h-auto p-1 overflow-x-auto">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="serpentes">Serpentes</TabsTrigger>
              <TabsTrigger value="lagartos">Lagartos</TabsTrigger>
              <TabsTrigger value="arboricolas">Arborícolas</TabsTrigger>
              <TabsTrigger value="terrestres">Terrestres</TabsTrigger>
              <TabsTrigger value="filhotes">Filhotes</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar espécie..."
                  className="h-10 rounded-md border border-input pl-8 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              
              <Button variant="outline" size="icon">
                <SortDesc className="h-4 w-4" />
                <span className="sr-only">Ordenar</span>
              </Button>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filtrar</span>
              </Button>
            </div>
          </div>
          
          {/* Species Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSpecies.map((species) => (
              <div key={species.id} className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={species.image}
                    alt={species.name} 
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <span className={`inline-block text-white text-xs px-2 py-1 rounded ${species.available ? 'bg-serpente-600' : 'bg-earth-600'}`}>
                      {species.available ? 'Disponível' : 'Pré-venda'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{species.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{species.commonName}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg text-serpente-600">R$ {species.price.toLocaleString('pt-BR')}</span>
                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredSpecies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">Nenhuma espécie encontrada para este filtro</p>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
