
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
    image: "/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png",
    gallery: [
      "/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png",
      "/lovable-uploads/87bb79b7-12d7-41e7-9b09-a2a646636a7f.png",
      "/lovable-uploads/d71c2fb7-1bfe-41ba-8db3-d2d0b4279365.png"
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
  {
    id: 2,
    name: "Tupinambis teguixin",
    commonName: "Teiú-amarelo",
    type: "lagarto",
    image: "/lovable-uploads/b81f6c0b-360a-4408-834b-cb20bd36e3da.png",
    gallery: [
      "/lovable-uploads/b81f6c0b-360a-4408-834b-cb20bd36e3da.png",
      "/lovable-uploads/370accb0-50cf-459e-a966-c1fc135ecb83.png"
    ],
    description: "Descrição detalhada do Teiú-amarelo (Tupinambis teguixin).",
    characteristics: [
      "Tamanho: 1-1,5m incluindo a cauda",
      "Dieta: onívoro (ovos, pequenos vertebrados, frutas)",
      "Habitat: áreas florestais e campos",
      "Comportamento: territorial e diurno"
    ]
  },
  {
    id: 3,
    name: "Epicrates crassus",
    commonName: "Jiboia-do-Cerrado",
    type: "serpente",
    image: "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png",
    gallery: [
      "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png",
      "/lovable-uploads/f6e67c5c-183d-46ac-a882-997f826be1b3.png"
    ]
  },
  {
    id: 4,
    name: "Lampropeltis triangulum",
    commonName: "Falsa-coral",
    type: "serpente",
    image: "/lovable-uploads/f7bc5a30-657d-418c-8b25-7b0494f36029.png",
    gallery: [
      "/lovable-uploads/f7bc5a30-657d-418c-8b25-7b0494f36029.png"
    ]
  },
  {
    id: 5,
    name: "Pantherophis guttatus",
    commonName: "Corn Snake",
    type: "serpente",
    image: "/lovable-uploads/51de7896-4d25-4af0-af9d-31c8028fcc3b.png",
    gallery: [
      "/lovable-uploads/51de7896-4d25-4af0-af9d-31c8028fcc3b.png",
      "/lovable-uploads/0e7c1a90-84bb-4471-908a-af3fcab85c04.png"
    ]
  },
  {
    id: 6,
    name: "Eublepharis macularius",
    commonName: "Leopard Gecko",
    type: "lagarto",
    image: "/lovable-uploads/11848f61-6118-4555-92b5-61760f34cf00.png",
    gallery: [
      "/lovable-uploads/11848f61-6118-4555-92b5-61760f34cf00.png"
    ]
  },
  {
    id: 7,
    name: "Chelonoidis carbonarius",
    commonName: "Jabuti-piranga",
    type: "quelonio",
    image: "/lovable-uploads/90e09ad1-fa3b-48d6-9979-59f090220fcb.png",
    gallery: [
      "/lovable-uploads/90e09ad1-fa3b-48d6-9979-59f090220fcb.png"
    ]
  },
  {
    id: 8,
    name: "Trachemys scripta elegans",
    commonName: "Tartaruga-de-orelha-vermelha",
    type: "quelonio",
    image: "/lovable-uploads/d7cd39f5-e491-4eb3-a10d-6cf8ad24669a.png",
    gallery: [
      "/lovable-uploads/d7cd39f5-e491-4eb3-a10d-6cf8ad24669a.png"
    ]
  },
  {
    id: 9,
    name: "Bothrops jararaca",
    commonName: "Jararaca",
    type: "serpente",
    image: "/lovable-uploads/d71c2fb7-1bfe-41ba-8db3-d2d0b4279365.png",
    gallery: [
      "/lovable-uploads/d71c2fb7-1bfe-41ba-8db3-d2d0b4279365.png"
    ]
  },
  {
    id: 10,
    name: "Iguana iguana",
    commonName: "Iguana-verde",
    type: "lagarto",
    image: "/lovable-uploads/c138dc46-3fd6-4dda-aa7b-c02dead150e7.png",
    gallery: [
      "/lovable-uploads/c138dc46-3fd6-4dda-aa7b-c02dead150e7.png"
    ]
  },
  {
    id: 11,
    name: "Boa constrictor",
    commonName: "Jiboia",
    type: "serpente",
    image: "/lovable-uploads/f6e67c5c-183d-46ac-a882-997f826be1b3.png",
    gallery: [
      "/lovable-uploads/f6e67c5c-183d-46ac-a882-997f826be1b3.png",
      "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png"
    ]
  },
  {
    id: 12,
    name: "Crotalus durissus",
    commonName: "Cascavel",
    type: "serpente",
    image: "/lovable-uploads/0e7c1a90-84bb-4471-908a-af3fcab85c04.png",
    gallery: [
      "/lovable-uploads/0e7c1a90-84bb-4471-908a-af3fcab85c04.png"
    ]
  },
  {
    id: 13,
    name: "Salvator merianae",
    commonName: "Teiú",
    type: "lagarto",
    image: "/lovable-uploads/370accb0-50cf-459e-a966-c1fc135ecb83.png",
    gallery: [
      "/lovable-uploads/370accb0-50cf-459e-a966-c1fc135ecb83.png",
      "/lovable-uploads/b81f6c0b-360a-4408-834b-cb20bd36e3da.png"
    ]
  },
  {
    id: 14,
    name: "Chelonoidis denticulatus",
    commonName: "Jabuti-tinga",
    type: "quelonio",
    image: "/lovable-uploads/90e09ad1-fa3b-48d6-9979-59f090220fcb.png",
    gallery: [
      "/lovable-uploads/90e09ad1-fa3b-48d6-9979-59f090220fcb.png"
    ]
  },
  {
    id: 15,
    name: "Lachesis muta",
    commonName: "Surucucu-pico-de-jaca",
    type: "serpente",
    image: "/lovable-uploads/87bb79b7-12d7-41e7-9b09-a2a646636a7f.png",
    gallery: [
      "/lovable-uploads/87bb79b7-12d7-41e7-9b09-a2a646636a7f.png"
    ]
  },
  {
    id: 16,
    name: "Diploglossus fasciatus",
    commonName: "Cobra-de-vidro",
    type: "lagarto",
    image: "/lovable-uploads/481f8f82-22b1-407d-9e88-623e453faf6a.png",
    gallery: [
      "/lovable-uploads/481f8f82-22b1-407d-9e88-623e453faf6a.png"
    ]
  },
  {
    id: 17,
    name: "Micrurus corallinus",
    commonName: "Coral-verdadeira",
    type: "serpente",
    image: "/lovable-uploads/6dcc0ef5-dc47-4f3c-9020-54ecc65ed390.png",
    gallery: [
      "/lovable-uploads/6dcc0ef5-dc47-4f3c-9020-54ecc65ed390.png"
    ]
  },
  {
    id: 18,
    name: "Phrynops geoffroanus",
    commonName: "Cágado-de-barbicha",
    type: "quelonio",
    image: "/lovable-uploads/d7cd39f5-e491-4eb3-a10d-6cf8ad24669a.png",
    gallery: [
      "/lovable-uploads/d7cd39f5-e491-4eb3-a10d-6cf8ad24669a.png"
    ]
  },
  {
    id: 19,
    name: "Tropidurus torquatus",
    commonName: "Calango",
    type: "lagarto",
    image: "/lovable-uploads/b11770a0-4aca-4362-aa63-c0e9a9d4df0c.png",
    gallery: [
      "/lovable-uploads/b11770a0-4aca-4362-aa63-c0e9a9d4df0c.png"
    ]
  },
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
