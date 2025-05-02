
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Mock data for species listing
const speciesList = [
  {
    id: 1,
    name: "Erythrolamprus miliaris",
    commonName: "Cobra-d'água",
    type: "serpente",
    image: "https://images.unsplash.com/photo-1633527316352-52177079b3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Tupinambis teguixin",
    commonName: "Teiú-amarelo",
    type: "lagarto",
    image: "https://images.unsplash.com/photo-1550172268-9a48af98ac5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Epicrates crassus",
    commonName: "Jiboia-do-Cerrado",
    type: "serpente",
    image: "https://images.unsplash.com/photo-1598445609092-7c7d80d816dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Lampropeltis triangulum",
    commonName: "Falsa-coral",
    type: "serpente",
    image: "https://images.unsplash.com/photo-1557178985-891076b318dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    name: "Pantherophis guttatus",
    commonName: "Corn Snake",
    type: "serpente",
    image: "/lovable-uploads/8353d3e8-d19d-4821-8a00-892cf9ac6bae.png"
  },
  {
    id: 6,
    name: "Eublepharis macularius",
    commonName: "Leopard Gecko",
    type: "lagarto",
    image: "https://images.unsplash.com/photo-1597284902002-b783970afd73?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 7,
    name: "Chelonoidis carbonarius",
    commonName: "Jabuti-piranga",
    type: "quelonio",
    image: "https://images.unsplash.com/photo-1557178985-891076b318dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 8,
    name: "Trachemys scripta elegans",
    commonName: "Tartaruga-de-orelha-vermelha",
    type: "quelonio",
    image: "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 9,
    name: "Bothrops jararaca",
    commonName: "Jararaca",
    type: "serpente",
    image: "https://images.unsplash.com/photo-1550172268-9a48af98ac5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 10,
    name: "Iguana iguana",
    commonName: "Iguana-verde",
    type: "lagarto",
    image: "https://images.unsplash.com/photo-1598445609092-7c7d80d816dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 11,
    name: "Boa constrictor",
    commonName: "Jiboia",
    type: "serpente",
    image: "https://images.unsplash.com/photo-1633527316352-52177079b3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 12,
    name: "Crotalus durissus",
    commonName: "Cascavel",
    type: "serpente",
    image: "https://images.unsplash.com/photo-1557178985-891076b318dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 13,
    name: "Salvator merianae",
    commonName: "Teiú",
    type: "lagarto",
    image: "https://images.unsplash.com/photo-1550172268-9a48af98ac5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 14,
    name: "Chelonoidis denticulatus",
    commonName: "Jabuti-tinga",
    type: "quelonio",
    image: "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 15,
    name: "Lachesis muta",
    commonName: "Surucucu-pico-de-jaca",
    type: "serpente",
    image: "https://images.unsplash.com/photo-1557178985-891076b318dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 16,
    name: "Diploglossus fasciatus",
    commonName: "Cobra-de-vidro",
    type: "lagarto",
    image: "https://images.unsplash.com/photo-1597284902002-b783970afd73?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 17,
    name: "Micrurus corallinus",
    commonName: "Coral-verdadeira",
    type: "serpente",
    image: "https://images.unsplash.com/photo-1598445609092-7c7d80d816dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 18,
    name: "Phrynops geoffroanus",
    commonName: "Cágado-de-barbicha",
    type: "quelonio",
    image: "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 19,
    name: "Tropidurus torquatus",
    commonName: "Calango",
    type: "lagarto",
    image: "https://images.unsplash.com/photo-1550172268-9a48af98ac5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
  }
];

export default function Species() {
  return (
    <div className="container px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="docs-section-title">
          <h1 className="text-4xl font-bold">Espécies Criadas</h1>
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
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" size="sm">Todos</Button>
          <Button variant="ghost" size="sm">Serpentes</Button>
          <Button variant="ghost" size="sm">Lagartos</Button>
          <Button variant="ghost" size="sm">Quelônios</Button>
        </div>
      </div>
      
      {/* Species Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {speciesList.map((species) => (
          <div key={species.id} className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
            <div className="relative h-60 overflow-hidden">
              <img 
                src={species.image}
                alt={species.name} 
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{species.name}</h3>
              <p className="text-muted-foreground text-sm mb-3">{species.commonName}</p>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/especies/${species.id}`}>Ver Detalhes</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
