
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, AlertCircle, Info } from "lucide-react";

// Same mock data as in the Species.tsx page
const speciesList = [
  {
    id: 1,
    name: "Erythrolamprus miliaris",
    commonName: "Cobra-d'água",
    type: "serpente",
    image: "https://images.unsplash.com/photo-1633527316352-52177079b3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1633527316352-52177079b3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1557178985-891076b318dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1598445609092-7c7d80d816dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
    ],
    description: "Espaço reservado para descrição detalhada da espécie Erythrolamprus miliaris (Cobra-d'água).",
    characteristics: [
      "Tamanho médio: 60-80 cm",
      "Alimentação: peixes, anfíbios",
      "Habitat: áreas próximas a rios e lagos",
      "Reprodução: ovípara"
    ],
    curiosities: "Curiosidades sobre a Cobra-d'água serão adicionadas aqui."
  },
  // ... additional species data would be here for all 19 species
];

export default function SpeciesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [species, setSpecies] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Find the species by ID
  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    // Find species by ID
    const foundSpecies = speciesList.find(s => s.id === Number(id));
    
    if (foundSpecies) {
      setSpecies(foundSpecies);
      setSelectedImage(foundSpecies.gallery?.[0] || foundSpecies.image);
    } else {
      // If species not found, redirect to species list
      navigate("/especies");
    }
    
    setIsLoading(false);
  }, [id, navigate]);
  
  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }
  
  if (!species) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Espécie não encontrada</h1>
          <p className="mb-6 text-muted-foreground">Esta espécie não está disponível em nosso catálogo.</p>
          <Button asChild>
            <Link to="/especies">Voltar para espécies</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-12 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="pl-0">
          <Link to="/especies">
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar para Espécies
          </Link>
        </Button>
      </div>
      
      {/* Species Header */}
      <div className="flex flex-col items-start mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">{species.name}</h1>
        <p className="text-xl text-muted-foreground">{species.commonName}</p>
        <div className="mt-2 inline-block bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
          {species.type === "serpente" ? "Serpente" : species.type === "lagarto" ? "Lagarto" : "Quelônio"}
        </div>
      </div>
      
      {/* Image Gallery and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
        {/* Gallery */}
        <div className="lg:col-span-3">
          <div className="rounded-lg overflow-hidden">
            <img 
              src={selectedImage} 
              alt={species.name} 
              className="w-full h-auto object-cover rounded-lg"
              style={{ maxHeight: "500px" }}
            />
          </div>
          
          {/* Thumbnails */}
          {species.gallery && species.gallery.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {species.gallery.map((img, idx) => (
                <button 
                  key={idx}
                  className={`rounded-md overflow-hidden border-2 ${selectedImage === img ? 'border-serpente-600' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img 
                    src={img} 
                    alt={`${species.name} - imagem ${idx + 1}`}
                    className="w-20 h-20 object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="description">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">Descrição</TabsTrigger>
              <TabsTrigger value="characteristics" className="flex-1">Características</TabsTrigger>
              <TabsTrigger value="curiosities" className="flex-1">Curiosidades</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-4">
              <div className="p-4 border rounded-md bg-card">
                {species.description ? (
                  <p>{species.description}</p>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Info className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Descrição detalhada será adicionada em breve.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="characteristics" className="mt-4">
              <div className="p-4 border rounded-md bg-card">
                {species.characteristics && species.characteristics.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {species.characteristics.map((char, idx) => (
                      <li key={idx}>{char}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Info className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Características da espécie serão adicionadas em breve.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="curiosities" className="mt-4">
              <div className="p-4 border rounded-md bg-card">
                {species.curiosities ? (
                  <p>{species.curiosities}</p>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Info className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Curiosidades sobre a espécie serão adicionadas em breve.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Related Species */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Espécies Relacionadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {speciesList
            .filter(s => s.id !== Number(id) && s.type === species.type)
            .slice(0, 4)
            .map((relatedSpecies) => (
              <div key={relatedSpecies.id} className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={relatedSpecies.image}
                    alt={relatedSpecies.name} 
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1">{relatedSpecies.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{relatedSpecies.commonName}</p>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/especies/${relatedSpecies.id}`}>Ver Detalhes</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
