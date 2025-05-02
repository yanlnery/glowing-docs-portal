import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, SortDesc, Search, ChevronDown, X } from "lucide-react";

export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState("todos");
  const [subCategory, setSubCategory] = useState("");
  
  // Mock data for species
  const speciesList = [
    {
      id: 1,
      name: "Erythrolamprus miliaris",
      commonName: "Cobra-d'água",
      type: "serpente",
      subtype: "colubrideos",
      habitat: "terrestre",
      stage: "filhote",
      price: 1500,
      available: true,
      image: "https://images.unsplash.com/photo-1633527316352-52177079b3f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 2,
      name: "Tupinambis teguixin",
      commonName: "Teiú-amarelo",
      type: "lagarto",
      subtype: "grandes",
      habitat: "terrestre",
      stage: "adulto",
      price: 3200,
      available: true,
      image: "https://images.unsplash.com/photo-1550172268-9a48af98ac5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 3,
      name: "Epicrates crassus",
      commonName: "Jiboia-do-Cerrado",
      type: "serpente",
      subtype: "boideos",
      habitat: "terrestre",
      stage: "filhote",
      price: 800,
      available: true,
      image: "https://images.unsplash.com/photo-1598445609092-7c7d80d816dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 4,
      name: "Lampropeltis triangulum",
      commonName: "Falsa-coral",
      type: "serpente",
      subtype: "colubrideos",
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
      subtype: "colubrideos",
      habitat: "terrestre",
      stage: "filhote",
      price: 900,
      available: true,
      image: "/lovable-uploads/8353d3e8-d19d-4821-8a00-892cf9ac6bae.png"
    },
    {
      id: 6,
      name: "Eublepharis macularius",
      commonName: "Leopard Gecko",
      type: "lagarto",
      subtype: "pequenos",
      habitat: "terrestre",
      stage: "adulto",
      price: 650,
      available: true,
      image: "https://images.unsplash.com/photo-1597284902002-b783970afd73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 7,
      name: "Chelonoidis carbonarius",
      commonName: "Jabuti-piranga",
      type: "quelonio",
      subtype: "terrestres",
      habitat: "terrestre",
      stage: "adulto",
      price: 1800,
      available: true,
      image: "https://images.unsplash.com/photo-1557178985-891076b318dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 8,
      name: "Trachemys scripta elegans",
      commonName: "Tartaruga-de-orelha-vermelha",
      type: "quelonio",
      subtype: "aquaticos",
      habitat: "aquatico",
      stage: "filhote",
      price: 550,
      available: true,
      image: "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
    }
  ];
  
  // Filter species based on selected filter and subcategory
  const filteredSpecies = activeFilter === "todos" 
    ? (subCategory ? speciesList.filter(s => s.subtype === subCategory) : speciesList)
    : speciesList.filter(species => {
        if (!species.type.includes(activeFilter.slice(0, -1))) return false;
        if (subCategory && species.subtype !== subCategory) return false;
        return true;
      });
  
  const handleCategoryChange = (category) => {
    setActiveFilter(category);
    setSubCategory("");
  };
  
  return (
    <div className="container px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="docs-section-title">
          <h1 className="text-4xl font-bold">Animais Disponíveis</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mt-4">
          Conheça nossas serpentes, lagartos e quelônios disponíveis para venda, todos com procedência legal e documentação
        </p>
      </div>
      
      {/* Filters */}
      <div className="mb-8">
        <Tabs defaultValue="todos" className="w-full" onValueChange={handleCategoryChange}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <TabsList className="h-auto p-1 overflow-x-auto">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="serpentes" className="flex items-center">
                  Serpentes
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                        <ChevronDown className="h-3 w-3" />
                        <span className="sr-only">Subcategorias</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                      <div className="flex flex-col space-y-1">
                        <Button 
                          variant={subCategory === "colubrideos" ? "default" : "ghost"} 
                          size="sm"
                          onClick={() => setSubCategory(subCategory === "colubrideos" ? "" : "colubrideos")}
                        >
                          Colubrídeos
                        </Button>
                        <Button 
                          variant={subCategory === "boideos" ? "default" : "ghost"} 
                          size="sm"
                          onClick={() => setSubCategory(subCategory === "boideos" ? "" : "boideos")}
                        >
                          Boídeos
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TabsTrigger>
                <TabsTrigger value="lagartos" className="flex items-center">
                  Lagartos
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                        <ChevronDown className="h-3 w-3" />
                        <span className="sr-only">Subcategorias</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                      <div className="flex flex-col space-y-1">
                        <Button 
                          variant={subCategory === "pequenos" ? "default" : "ghost"} 
                          size="sm"
                          onClick={() => setSubCategory(subCategory === "pequenos" ? "" : "pequenos")}
                        >
                          Pequenos
                        </Button>
                        <Button 
                          variant={subCategory === "grandes" ? "default" : "ghost"} 
                          size="sm"
                          onClick={() => setSubCategory(subCategory === "grandes" ? "" : "grandes")}
                        >
                          Grandes
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TabsTrigger>
                <TabsTrigger value="quelonios" className="flex items-center">
                  Quelônios
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                        <ChevronDown className="h-3 w-3" />
                        <span className="sr-only">Subcategorias</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                      <div className="flex flex-col space-y-1">
                        <Button 
                          variant={subCategory === "terrestres" ? "default" : "ghost"} 
                          size="sm"
                          onClick={() => setSubCategory(subCategory === "terrestres" ? "" : "terrestres")}
                        >
                          Terrestres
                        </Button>
                        <Button 
                          variant={subCategory === "aquaticos" ? "default" : "ghost"} 
                          size="sm"
                          onClick={() => setSubCategory(subCategory === "aquaticos" ? "" : "aquaticos")}
                        >
                          Aquáticos
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TabsTrigger>
              </TabsList>
              
              {subCategory && (
                <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md flex items-center">
                  Filtro ativo: {subCategory}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setSubCategory("")}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Limpar filtro</span>
                  </Button>
                </div>
              )}
            </div>
            
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
