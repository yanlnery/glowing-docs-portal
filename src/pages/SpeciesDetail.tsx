
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Species as SpeciesType } from "@/types/species"; // Use updated type

export default function SpeciesDetail() {
  const { slug } = useParams<{ slug: string }>(); // Get slug directly
  const [species, setSpecies] = useState<SpeciesType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpeciesDetail = async () => {
      if (!slug) {
        setError("Slug da espécie não fornecido.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from('species')
        .select('*')
        .eq('slug', slug)
        .single(); // Expecting a single result or null

      if (dbError) {
        console.error("Error fetching species detail by slug:", dbError);
        if (dbError.code === 'PGRST116') { // PostgREST error for "Searched for a single row, but found 0 rows" or "found multiple rows"
             setError("Espécie não encontrada.");
        } else {
            setError("Falha ao carregar detalhes da espécie.");
        }
        setSpecies(null);
      } else {
        setSpecies(data as SpeciesType);
      }
      setLoading(false);
    };

    fetchSpeciesDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="container px-4 py-12 sm:px-6">
        <div className="flex justify-center">
          <div className="animate-pulse">Carregando detalhes da espécie...</div>
        </div>
      </div>
    );
  }

  if (error || !species) {
    return (
      <div className="container px-4 py-12 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{error || "Espécie não encontrada"}</h2>
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

  const typeDisplayMap = {
    serpente: 'Serpente',
    lagarto: 'Lagarto',
    quelonio: 'Quelônio',
    outro: 'Outro'
  };

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
              src={species.image || '/placeholder.svg'} // Fallback image
              alt={species.commonname} 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        
        {/* Details */}
        <div>
          <div className="mb-2 text-muted-foreground">
            {typeDisplayMap[species.type] || species.type}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{species.commonname}</h1>
          <h2 className="text-xl text-muted-foreground mb-6"><em>{species.name}</em></h2>
          
          {species.description && (
            <div className="prose dark:prose-invert max-w-none mb-8">
              <p>{species.description}</p>
            </div>
          )}
          
          <div className="space-y-8">
            {/* Characteristics */}
            {species.characteristics && species.characteristics.length > 0 && species.characteristics[0] !== '' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Características</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {species.characteristics.map((characteristic, index) => (
                    characteristic && <li key={index}>{characteristic}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Curiosities */}
            {species.curiosities && species.curiosities.length > 0 && species.curiosities[0] !== '' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Curiosidades</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {species.curiosities.map((curiosity, index) => (
                    curiosity && <li key={index}>{curiosity}</li>
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
