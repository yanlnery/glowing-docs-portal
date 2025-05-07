
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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

export default function SpeciesDetail() {
  const { id, slug } = useParams();
  const [species, setSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // First try to load from localStorage (admin data)
    const savedSpecies = localStorage.getItem('speciesList');
    let speciesList: Species[] = [];
    
    if (savedSpecies) {
      speciesList = JSON.parse(savedSpecies);
    } else {
      // Fallback to default data
      speciesList = [
        {
          id: "1",
          name: "Boa constrictor constrictor",
          commonName: "Jiboia Amazônica",
          type: "serpente",
          image: "/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png",
          slug: "boa-constrictor-constrictor",
          description: "Uma das maiores serpentes do Brasil, podendo atingir até 4 metros de comprimento. Habita florestas úmidas da Amazônia.",
          characteristics: ["Não-venenosa", "Constritora", "Noturna", "Alimenta-se principalmente de roedores"],
          curiosities: ["Pode viver até 30 anos em cativeiro", "É ovovivípara, dando à luz filhotes já formados"]
        },
        {
          id: "2",
          name: "Epicrates cenchria",
          commonName: "Jiboia Arco-íris da Amazônia",
          type: "serpente",
          image: "/lovable-uploads/f7bc5a30-657d-418c-8b25-7b0494f36029.png",
          slug: "epicrates-cenchria",
          description: "Uma serpente de médio porte conhecida por suas iridescências quando exposta à luz do sol.",
          characteristics: ["Não-venenosa", "Constritora", "Coloração avermelhada com padrões circulares"],
          curiosities: ["Seu nome vem do reflexo iridescente que sua pele produz sob a luz", "Prefere habitats arbóreos"]
        }
      ];
    }
    
    // Find species by ID or slug
    let foundSpecies = null;
    
    if (id) {
      foundSpecies = speciesList.find(s => s.id.toString() === id);
    } else if (slug) {
      foundSpecies = speciesList.find(s => s.slug === slug);
    }
    
    if (foundSpecies) {
      setSpecies(foundSpecies);
      setLoading(false);
    } else {
      setError("Espécie não encontrada");
      setLoading(false);
    }
  }, [id, slug]);

  if (loading) {
    return (
      <div className="container px-4 py-12 sm:px-6">
        <div className="flex justify-center">
          <div className="animate-pulse">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error || !species) {
    return (
      <div className="container px-4 py-12 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Espécie não encontrada</h2>
          <p className="mb-8 text-muted-foreground">
            A espécie que você está procurando não foi encontrada ou pode ter sido removida.
          </p>
          <Button asChild>
            <Link to="/especies">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para todas as espécies
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 sm:px-6">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link to="/especies" className="inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" /> 
            Voltar para todas as espécies
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img 
              src={species.image} 
              alt={species.commonName} 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        
        {/* Details */}
        <div>
          <div className="mb-2 text-muted-foreground">
            {species.type === 'serpente' && 'Serpente'}
            {species.type === 'lagarto' && 'Lagarto'}
            {species.type === 'quelonio' && 'Quelônio'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{species.commonName}</h1>
          <h2 className="text-xl text-muted-foreground mb-6"><em>{species.name}</em></h2>
          
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p>{species.description}</p>
          </div>
          
          <div className="space-y-8">
            {/* Characteristics */}
            {species.characteristics && species.characteristics.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Características</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {species.characteristics.map((characteristic, index) => (
                    <li key={index}>{characteristic}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Curiosities */}
            {species.curiosities && species.curiosities.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Curiosidades</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {species.curiosities.map((curiosity, index) => (
                    <li key={index}>{curiosity}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
