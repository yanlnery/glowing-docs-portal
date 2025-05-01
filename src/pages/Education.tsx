
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, File, Play, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Education() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-serpente-900 text-white">
        <div className="absolute inset-0 opacity-30" style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1597243243421-7fa53b455120?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}></div>
        <div className="container relative z-10 px-4 py-24 sm:px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Educação e Cuidados</h1>
            <p className="text-xl text-white/80 mb-6">
              Conteúdo educativo para entusiastas e criadores de répteis
            </p>
          </div>
        </div>
      </section>
      
      {/* Tabs Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 sm:px-6">
          <Tabs defaultValue="guides" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="guides">Guias</TabsTrigger>
              <TabsTrigger value="videos">Vídeos</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
            </TabsList>
            
            {/* Guides Content */}
            <TabsContent value="guides">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {/* Guide 1 */}
                <div className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
                  <div className="relative h-48 overflow-hidden bg-muted flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1585095595239-2c5d5b3721f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                      alt="Guia de Cuidados com Python-bola" 
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-serpente-600 text-xs font-medium px-2 py-1 rounded">PDF</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2">Guia de Cuidados com Python-bola</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manual completo com instruções para manejo, alimentação e reprodução.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">15 páginas</span>
                      <Button size="sm" variant="outline" className="gap-1">
                        <File className="h-4 w-4" /> Baixar PDF
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Guide 2 */}
                <div className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
                  <div className="relative h-48 overflow-hidden bg-muted flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1597243243421-7fa53b455120?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                      alt="Terrários e Ambientação" 
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-serpente-600 text-xs font-medium px-2 py-1 rounded">PDF</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2">Terrários e Ambientação</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Como criar o habitat ideal para diferentes espécies de répteis.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">22 páginas</span>
                      <Button size="sm" variant="outline" className="gap-1">
                        <File className="h-4 w-4" /> Baixar PDF
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Guide 3 */}
                <div className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
                  <div className="relative h-48 overflow-hidden bg-muted flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                      alt="Saúde e Prevenção" 
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-serpente-600 text-xs font-medium px-2 py-1 rounded">PDF</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2">Saúde e Prevenção</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Dicas para identificar e prevenir problemas de saúde em répteis.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">18 páginas</span>
                      <Button size="sm" variant="outline" className="gap-1">
                        <File className="h-4 w-4" /> Baixar PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Videos Content */}
            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {/* Video 1 */}
                <div className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
                  <div className="relative h-48 overflow-hidden bg-muted group-hover:opacity-90 transition-opacity">
                    <img 
                      src="https://images.unsplash.com/photo-1599564865452-4d92f8a3e302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                      alt="Como alimentar filhotes" 
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play className="h-6 w-6 text-serpente-600" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2">Como alimentar filhotes</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Técnicas e cuidados na alimentação de serpentes recém-nascidas.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">15:42 minutos</span>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Play className="h-4 w-4" /> Assistir
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Video 2 */}
                <div className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
                  <div className="relative h-48 overflow-hidden bg-muted group-hover:opacity-90 transition-opacity">
                    <img 
                      src="https://images.unsplash.com/photo-1557178985-891076b318dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                      alt="Reprodução de Píton-verde" 
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play className="h-6 w-6 text-serpente-600" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2">Reprodução de Píton-verde</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Condições ideais e manejo reprodutivo de Morelia viridis.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">23:10 minutos</span>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Play className="h-4 w-4" /> Assistir
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Video 3 */}
                <div className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
                  <div className="relative h-48 overflow-hidden bg-muted group-hover:opacity-90 transition-opacity">
                    <img 
                      src="https://images.unsplash.com/photo-1550172268-9a48af98ac5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                      alt="Ecdise em Serpentes" 
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play className="h-6 w-6 text-serpente-600" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2">Ecdise em Serpentes</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Como identificar e auxiliar no processo de troca de pele.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">18:35 minutos</span>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Play className="h-4 w-4" /> Assistir
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Blog Content */}
            <TabsContent value="blog">
              <div className="space-y-8 mt-8">
                {/* Blog Post 1 */}
                <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img 
                      src="https://images.unsplash.com/photo-1550172268-9a48af98ac5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                      alt="Desmistificando serpentes venenosas" 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="p-6 md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted-foreground">15 de maio, 2024</span>
                        <span className="inline-block bg-serpente-100 text-serpente-800 text-xs px-2 py-1 rounded-full dark:bg-serpente-900/50 dark:text-serpente-300">Educação</span>
                      </div>
                      <h3 className="font-bold text-xl mb-3">Desmistificando serpentes venenosas: o que você precisa saber</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        Existem muitos mitos sobre serpentes venenosas que causam medo desnecessário. Neste artigo, discutimos fatos científicos e aprendemos a identificar corretamente espécies perigosas.
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/educacao/blog/desmistificando-serpentes">
                          Ler Artigo <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Blog Post 2 */}
                <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img 
                      src="https://images.unsplash.com/photo-1633527316352-52177079b3f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                      alt="Escolhendo o primeiro réptil" 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="p-6 md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted-foreground">2 de abril, 2024</span>
                        <span className="inline-block bg-serpente-100 text-serpente-800 text-xs px-2 py-1 rounded-full dark:bg-serpente-900/50 dark:text-serpente-300">Guia</span>
                      </div>
                      <h3 className="font-bold text-xl mb-3">Escolhendo o primeiro réptil: guia para iniciantes</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        Quais fatores considerar ao escolher seu primeiro réptil? Este guia completo apresenta as espécies mais adequadas para iniciantes, requisitos de cuidado e considerações importantes.
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/educacao/blog/primeiro-reptil">
                          Ler Artigo <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Blog Post 3 */}
                <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img 
                      src="https://images.unsplash.com/photo-1597284902002-b783970afd73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                      alt="Nutrição para répteis" 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="p-6 md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted-foreground">18 de março, 2024</span>
                        <span className="inline-block bg-serpente-100 text-serpente-800 text-xs px-2 py-1 rounded-full dark:bg-serpente-900/50 dark:text-serpente-300">Cuidados</span>
                      </div>
                      <h3 className="font-bold text-xl mb-3">Nutrição adequada: a chave para répteis saudáveis</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        A alimentação correta é fundamental para a saúde do seu réptil. Aprenda sobre as necessidades nutricionais específicas de diferentes espécies e como fornecer uma dieta balanceada.
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/educacao/blog/nutricao-repteis">
                          Ler Artigo <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Academy Promo Section */}
      <section className="py-16 bg-muted/30 snake-pattern-bg">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <div className="docs-section-title">
                <h2 className="text-3xl font-bold">Pet Serpentes Academy</h2>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-foreground/90">
                Aprofunde seu conhecimento através de nossos cursos online especializados, criados por biólogos e especialistas em herpetologia.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-foreground/90">
                Oferecemos desde cursos introdutórios para iniciantes até conteúdo avançado sobre reprodução e genética de répteis.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex gap-3 items-start">
                  <BookOpen className="text-serpente-600 h-6 w-6 mt-1" />
                  <div>
                    <h3 className="font-bold">Conteúdo Exclusivo</h3>
                    <p className="text-sm text-muted-foreground">Aulas em vídeo, PDFs e exercícios</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Play className="text-serpente-600 h-6 w-6 mt-1" />
                  <div>
                    <h3 className="font-bold">Aulas Práticas</h3>
                    <p className="text-sm text-muted-foreground">Demonstrações em vídeo</p>
                  </div>
                </div>
              </div>
              
              <Button className="mt-8" asChild>
                <Link to="/academy">Conhecer a Academy</Link>
              </Button>
            </div>
            
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <img 
                src="https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                alt="Pet Serpentes Academy" 
                className="rounded-lg shadow-lg w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
