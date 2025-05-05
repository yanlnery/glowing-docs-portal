import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, AlertCircle, Info } from "lucide-react";

// Updated Species List with the 21 species including detailed information
const speciesList = [
  {
    id: 1,
    name: "Boa constrictor constrictor",
    commonName: "Jiboia Amazônica",
    type: "serpente",
    slug: "boa-constrictor-constrictor",
    image: "/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png",
    gallery: [
      "/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png",
      "/lovable-uploads/87bb79b7-12d7-41e7-9b09-a2a646636a7f.png"
    ],
    description: "A *Boa constrictor constrictor*, popularmente chamada de **Jiboia Amazônica**, é uma das subespécies mais emblemáticas do gênero *Boa*. Nativa da região amazônica, destaca-se pela coloração intensa, geralmente com tons avermelhados e manchas bem delineadas. É uma serpente constritora, não peçonhenta, que utiliza a força muscular para capturar suas presas.\n\nPor ser de grande porte e apresentar comportamento imponente, essa espécie exige manejo experiente e estrutura adequada, sendo mais indicada para criadores avançados.",
    characteristics: [
      "Tamanho adulto: 2,5 a 3,5 metros",
      "Comportamento: Reservado, porém responsivo ao manuseio constante",
      "Expectativa de vida: Até 30 anos em cativeiro",
      "Atividade: Noturna",
      "Alimentação: Roedores, aves e pequenos mamíferos",
      "Ambientação ideal: Recintos espaçosos, com tocas e áreas para escalada, umidade controlada e temperatura entre 26 °C e 32 °C"
    ],
    curiosities: "- Apesar do nome, a *B. c. constrictor* não é exclusiva da Amazônia e pode ser encontrada também no Pará e Amapá.\n- É uma das serpentes brasileiras com maior valor genético no mercado internacional.\n- Apresenta variações visuais conforme a localidade de origem.\n- É frequentemente confundida com outras jiboias, mas seu padrão de cauda avermelhada é característico."
  },
  {
    id: 2,
    name: "Boa constrictor amarali",
    commonName: "Jiboia do Cerrado",
    type: "serpente",
    slug: "boa-constrictor-amarali",
    image: "/lovable-uploads/f6e67c5c-183d-46ac-a882-997f826be1b3.png",
    gallery: [
      "/lovable-uploads/f6e67c5c-183d-46ac-a882-997f826be1b3.png",
      "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png"
    ],
    description: "A *Boa constrictor amarali*, conhecida como **Jiboia do Cerrado**, é uma subespécie endêmica do Brasil, com distribuição no bioma cerrado. Reconhecida por sua coloração acinzentada e padrão menos vibrante que a jiboia amazônica, é uma das mais robustas fisicamente.\n\nIndicada para criadores experientes, pois seu temperamento pode variar bastante e seu tamanho exige um recinto espaçoso e bem estruturado.",
    characteristics: [
      "Tamanho adulto: 2,2 a 3 metros",
      "Comportamento: Territorial e menos tolerante ao manuseio em algumas fases",
      "Expectativa de vida: 20 a 30 anos",
      "Atividade: Noturna",
      "Alimentação: Roedores e pequenos mamíferos",
      "Ambientação ideal: Alta circulação de ar, substrato seco, temperatura entre 27 °C e 30 °C, com área de refúgio"
    ],
    curiosities: "- É uma das jiboias mais resistentes a variações climáticas.\n- Tem crescimento rápido e musculatura muito desenvolvida.\n- Exige atenção ao enriquecimento ambiental devido ao comportamento mais reativo.\n- É valorizada em projetos de manejo por sua rusticidade e boa reprodução."
  },
  {
    id: 3,
    name: "Boa atlantica",
    commonName: "Jiboia da Mata Atlântica",
    type: "serpente",
    slug: "boa-atlantica",
    image: "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png",
    gallery: [
      "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png",
      "/lovable-uploads/f6e67c5c-183d-46ac-a882-997f826be1b3.png"
    ],
    description: "A *Boa atlantica* é uma espécie endêmica da Mata Atlântica brasileira, considerada rara na natureza e alvo de projetos de conservação. Com porte médio, padrão visual diferenciado e comportamento mais pacífico, é uma das jiboias mais queridas por criadores que buscam uma espécie manejável.\n\nSua aparência pode variar entre tons de marrom e cinza com padrões escuros pouco definidos, o que a diferencia das demais jiboias.",
    characteristics: [
      "Tamanho adulto: 1,5 a 2 metros",
      "Comportamento: Dócil e tranquila, especialmente com manuseio frequente",
      "Expectativa de vida: Até 25 anos",
      "Atividade: Noturna",
      "Alimentação: Roedores e aves",
      "Ambientação ideal: Ambiente úmido com folhagens e áreas de refúgio, temperatura entre 25 °C e 30 °C"
    ],
    curiosities: "- Foi reconhecida como espécie separada recentemente, sendo antes considerada uma subespécie.\n- Vive em fragmentos de floresta, sendo muito sensível à degradação ambiental.\n- Sua reprodução em cativeiro é mais complexa do que a de outras jiboias.\n- É protegida por lei em diversas regiões e de grande importância para a biodiversidade brasileira."
  },
  {
    id: 4,
    name: "Epicrates cenchria",
    commonName: "Jiboia Arco-íris da Amazônia",
    type: "serpente",
    slug: "epicrates-cenchria",
    image: "/lovable-uploads/f7bc5a30-657d-418c-8b25-7b0494f36029.png",
    gallery: [
      "/lovable-uploads/f7bc5a30-657d-418c-8b25-7b0494f36029.png"
    ]
  },
  {
    id: 5,
    name: "Epicrates assisi",
    commonName: "Jiboia Arco-íris da Caatinga",
    type: "serpente",
    slug: "epicrates-assisi",
    image: "/lovable-uploads/51de7896-4d25-4af0-af9d-31c8028fcc3b.png",
    gallery: [
      "/lovable-uploads/51de7896-4d25-4af0-af9d-31c8028fcc3b.png"
    ]
  },
  {
    id: 6,
    name: "Epicrates crassus",
    commonName: "Jiboia Arco-íris do Cerrado",
    type: "serpente",
    slug: "epicrates-crassus",
    image: "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png",
    gallery: [
      "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png"
    ]
  },
  {
    id: 7,
    name: "Epicrates maurus",
    commonName: "Jiboia Arco-íris do Norte",
    type: "serpente",
    slug: "epicrates-maurus",
    image: "/lovable-uploads/0e7c1a90-84bb-4471-908a-af3fcab85c04.png",
    gallery: [
      "/lovable-uploads/0e7c1a90-84bb-4471-908a-af3fcab85c04.png"
    ]
  },
  {
    id: 8,
    name: "Corallus batesii",
    commonName: "Jiboia Esmeralda",
    type: "serpente",
    slug: "corallus-batesii",
    image: "/lovable-uploads/6dcc0ef5-dc47-4f3c-9020-54ecc65ed390.png",
    gallery: [
      "/lovable-uploads/6dcc0ef5-dc47-4f3c-9020-54ecc65ed390.png"
    ]
  },
  {
    id: 9,
    name: "Corallus hortulana",
    commonName: "Suaçuboia",
    type: "serpente",
    slug: "corallus-hortulana",
    image: "/lovable-uploads/87bb79b7-12d7-41e7-9b09-a2a646636a7f.png",
    gallery: [
      "/lovable-uploads/87bb79b7-12d7-41e7-9b09-a2a646636a7f.png"
    ]
  },
  {
    id: 10,
    name: "Erythrolamprus miliaris",
    commonName: "Cobra d'água",
    type: "serpente",
    slug: "erythrolamprus-miliaris",
    image: "/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png",
    gallery: [
      "/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png",
      "/lovable-uploads/87bb79b7-12d7-41e7-9b09-a2a646636a7f.png"
    ]
  },
  {
    id: 11,
    name: "Spilotes pullatus",
    commonName: "Caninana",
    type: "serpente",
    slug: "spilotes-pullatus",
    image: "/lovable-uploads/d71c2fb7-1bfe-41ba-8db3-d2d0b4279365.png",
    gallery: [
      "/lovable-uploads/d71c2fb7-1bfe-41ba-8db3-d2d0b4279365.png"
    ]
  },
  {
    id: 12,
    name: "Spilotes sulphureus",
    commonName: "Caninana de Fogo",
    type: "serpente",
    slug: "spilotes-sulphureus",
    image: "/lovable-uploads/0e7c1a90-84bb-4471-908a-af3fcab85c04.png",
    gallery: [
      "/lovable-uploads/0e7c1a90-84bb-4471-908a-af3fcab85c04.png"
    ]
  },
  {
    id: 13,
    name: "Salvator teguixin",
    commonName: "Teiú Dourado",
    type: "lagarto",
    slug: "salvator-teguixin",
    image: "/lovable-uploads/b81f6c0b-360a-4408-834b-cb20bd36e3da.png",
    gallery: [
      "/lovable-uploads/b81f6c0b-360a-4408-834b-cb20bd36e3da.png"
    ]
  },
  {
    id: 14,
    name: "Salvator merianae",
    commonName: "Teiú",
    type: "lagarto",
    slug: "salvator-merianae",
    image: "/lovable-uploads/370accb0-50cf-459e-a966-c1fc135ecb83.png",
    gallery: [
      "/lovable-uploads/370accb0-50cf-459e-a966-c1fc135ecb83.png",
      "/lovable-uploads/b81f6c0b-360a-4408-834b-cb20bd36e3da.png"
    ]
  },
  {
    id: 15,
    name: "Iguana iguana",
    commonName: "Iguana",
    type: "lagarto",
    slug: "iguana-iguana",
    image: "/lovable-uploads/c138dc46-3fd6-4dda-aa7b-c02dead150e7.png",
    gallery: [
      "/lovable-uploads/c138dc46-3fd6-4dda-aa7b-c02dead150e7.png"
    ]
  },
  {
    id: 16,
    name: "Diploglossus lessonae",
    commonName: "Lagarto Coral",
    type: "lagarto",
    slug: "diploglossus-lessonae",
    image: "/lovable-uploads/481f8f82-22b1-407d-9e88-623e453faf6a.png",
    gallery: [
      "/lovable-uploads/481f8f82-22b1-407d-9e88-623e453faf6a.png"
    ]
  },
  {
    id: 17,
    name: "Polychrus marmoratus",
    commonName: "Lagarto Preguiça",
    type: "lagarto",
    slug: "polychrus-marmoratus",
    image: "/lovable-uploads/b11770a0-4aca-4362-aa63-c0e9a9d4df0c.png",
    gallery: [
      "/lovable-uploads/b11770a0-4aca-4362-aa63-c0e9a9d4df0c.png"
    ]
  },
  {
    id: 18,
    name: "Thecadactylus rapicauda",
    commonName: "Lagartixa Rabo de Nabo",
    type: "lagarto",
    slug: "thecadactylus-rapicauda",
    image: "/lovable-uploads/11848f61-6118-4555-92b5-61760f34cf00.png",
    gallery: [
      "/lovable-uploads/11848f61-6118-4555-92b5-61760f34cf00.png"
    ]
  },
  {
    id: 19,
    name: "Chelonoidis carbonaria",
    commonName: "Jabuti Piranga",
    type: "quelonio",
    slug: "chelonoidis-carbonaria",
    image: "/lovable-uploads/90e09ad1-fa3b-48d6-9979-59f090220fcb.png",
    gallery: [
      "/lovable-uploads/90e09ad1-fa3b-48d6-9979-59f090220fcb.png"
    ]
  },
  {
    id: 20,
    name: "Chelonoidis denticulata",
    commonName: "Jabuti Tinga",
    type: "quelonio",
    slug: "chelonoidis-denticulata",
    image: "/lovable-uploads/90e09ad1-fa3b-48d6-9979-59f090220fcb.png",
    gallery: [
      "/lovable-uploads/90e09ad1-fa3b-48d6-9979-59f090220fcb.png"
    ]
  },
  {
    id: 21,
    name: "Crocodilurus amazonicus",
    commonName: "Jacarerana",
    type: "lagarto",
    slug: "crocodilurus-amazonicus",
    image: "/lovable-uploads/b11770a0-4aca-4362-aa63-c0e9a9d4df0c.png",
    gallery: [
      "/lovable-uploads/b11770a0-4aca-4362-aa63-c0e9a9d4df0c.png"
    ]
  }
  // The rest of the 21 species would follow the same format
];

export default function SpeciesDetail() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [species, setSpecies] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Find the species by ID or slug
  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    let foundSpecies;
    
    // First try to find by slug if it exists
    if (slug) {
      foundSpecies = speciesList.find(s => s.slug === slug);
    } else if (id) {
      // Otherwise try to find by ID
      foundSpecies = speciesList.find(s => s.id === Number(id));
    }
    
    if (foundSpecies) {
      setSpecies(foundSpecies);
      setSelectedImage(foundSpecies.gallery?.[0] || foundSpecies.image);
    } else {
      // If species not found, redirect to species list
      navigate("/especies");
    }
    
    setIsLoading(false);
  }, [id, slug, navigate]);
  
  const formatContentWithMarkdown = (content) => {
    if (!content) return '';
    
    // Handle bold text
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle italic text
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Handle line breaks
    formatted = formatted.replace(/\n/g, '<br />');
    
    return formatted;
  };
  
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
          <Button asChild className="min-h-[44px]">
            <Link to="/especies">Voltar para espécies</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-8 sm:py-12 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="pl-0 min-h-[44px]">
          <Link to="/especies">
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar para Espécies
          </Link>
        </Button>
      </div>
      
      {/* Species Header */}
      <div className="flex flex-col items-start mb-6 sm:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold"><em>{species.name}</em></h1>
        <p className="text-lg sm:text-xl text-muted-foreground">{species.commonName}</p>
        <div className="mt-2 inline-block bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
          {species.type === "serpente" ? "Serpente" : species.type === "lagarto" ? "Lagarto" : "Quelônio"}
        </div>
      </div>
      
      {/* Image Gallery and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 mb-10 sm:mb-12">
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
                  className={`rounded-md overflow-hidden border-2 min-h-[44px] ${selectedImage === img ? 'border-serpente-600' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img 
                    src={img} 
                    alt={`${species.name} - imagem ${idx + 1}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover" 
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
              <TabsTrigger value="description" className="flex-1 min-h-[44px]">Descrição</TabsTrigger>
              <TabsTrigger value="characteristics" className="flex-1 min-h-[44px]">Características</TabsTrigger>
              <TabsTrigger value="curiosities" className="flex-1 min-h-[44px]">Curiosidades</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-4">
              <div className="p-4 border rounded-md bg-card">
                {species.description ? (
                  <p dangerouslySetInnerHTML={{ __html: formatContentWithMarkdown(species.description) }}></p>
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
                  <p dangerouslySetInnerHTML={{ __html: formatContentWithMarkdown(species.curiosities) }}></p>
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
      <div className="mt-12 sm:mt-16">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Espécies Relacionadas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {speciesList
            .filter(s => s.id !== species.id && s.type === species.type)
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
                <div className="p-3 sm:p-4">
                  <h3 className="font-bold text-sm sm:text-base mb-1 line-clamp-1"><em>{relatedSpecies.name}</em></h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3">{relatedSpecies.commonName}</p>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto min-h-[44px]" asChild>
                      <Link to={`/especies-criadas/${relatedSpecies.slug}`}>Ver Detalhes</Link>
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
