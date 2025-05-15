import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Calendar, CreditCard, Shield, Book, Brain, Syringe, Users, HelpCircle, AlertCircle } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import { productService } from "@/services/productService";
import { Product } from "@/types/product";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Load featured products from the product service
    const products = productService.getFeaturedProducts().slice(0, 3); // Get up to 3 featured products
    
    setFeaturedProducts(products);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Carousel Section */}
      <section className="relative">
        <HeroCarousel />
      </section>

      {/* Featured Species Section */}
      <section className="py-10 sm:py-16 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-8 sm:mb-12 text-center">
            <div className="docs-section-title">
              <h2 className="text-2xl sm:text-3xl font-bold">Espécies em Destaque</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Conheça algumas das serpentes e lagartos disponíveis no nosso criadouro, todos com certificação de origem e documentação legal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div key={product.id} className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
                  <div className="relative h-48 sm:h-64 overflow-hidden">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      {product.status === 'disponivel' ? (
                        <span className="inline-block bg-serpente-600 text-white text-xs px-2 py-1 rounded">Disponível</span>
                      ) : (
                        <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded">Indisponível</span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1"><em>{product.speciesName}</em></h3>
                    <p className="text-muted-foreground text-sm mb-3">{product.name}</p>
                    <div className="flex justify-end items-center">
                      <Button 
                        variant={product.status === 'indisponivel' ? "secondary" : "outline"} 
                        size="sm" 
                        className="min-h-[44px] w-full sm:w-auto" 
                        asChild
                        disabled={product.status === 'indisponivel'}
                      >
                        <Link to={`/produtos/${product.id}`}>
                          {product.status === 'indisponivel' ? 'Esgotado' : 'Ver Detalhes'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">Nenhum animal em destaque disponível no momento.</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-8 sm:mt-10">
            <Button size="lg" className="min-h-[44px] w-full sm:w-auto" asChild>
              <Link to="/catalogo">Ver Catálogo Completo <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-16 bg-muted/30 snake-pattern-bg">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2">
              <img 
                src="/lovable-uploads/3b1edcbf-8480-4165-934c-0dfcb0ec9b59.png" 
                alt="Pet Serpentes & Companhia" 
                className="rounded-lg shadow-lg w-full h-auto object-cover object-bottom aspect-[4/3]"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <div className="docs-section-title">
                <h2 className="text-3xl font-bold">Sobre o Criadouro</h2>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-foreground/90">
                O <strong>Pet Serpentes & Companhia</strong> é conduzido por Yan Nery, professor e biólogo apaixonado por herpetologia. Localizado no Rio de Janeiro, nosso criadouro é 100% legalizado pelo IBAMA e INEA-RJ, com foco total no bem-estar animal, criação responsável e na disseminação de conhecimento sobre répteis nativos.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-foreground/90">
                Atuamos com ética e compromisso, promovendo educação ambiental, pesquisa científica e o manejo consciente das espécies.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex gap-3 items-start">
                  <Shield className="text-serpente-600 h-6 w-6 mt-1" />
                  <div>
                    <h3 className="font-bold">100% Legal</h3>
                    <p className="text-sm text-muted-foreground">Criadouro certificado pelo IBAMA e INEA</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Award className="text-serpente-600 h-6 w-6 mt-1" />
                  <div>
                    <h3 className="font-bold">Expertise</h3>
                    <p className="text-sm text-muted-foreground">Equipe qualificada em herpetologia</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Calendar className="text-serpente-600 h-6 w-6 mt-1" />
                  <div>
                    <h3 className="font-bold">+10 Anos</h3>
                    <p className="text-sm text-muted-foreground">De experiência no mercado</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <CreditCard className="text-serpente-600 h-6 w-6 mt-1" />
                  <div>
                    <h3 className="font-bold">Facilidades</h3>
                    <p className="text-sm text-muted-foreground">Parcelamento e formas de pagamento</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Syringe className="text-serpente-600 h-6 w-6 mt-1" />
                  <div>
                    <h3 className="font-bold">Acompanhamento Veterinário</h3>
                    <p className="text-sm text-muted-foreground">Suporte em saúde animal</p>
                  </div>
                </div>
              </div>
              
              <Button className="mt-8" variant="outline" asChild>
                <Link to="/sobre">Conheça Nossa História Completa</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Educational Content Preview - UPDATED SUBTITLE */}
      <section className="py-16 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">Aprenda a Criar com Responsabilidade</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Conteúdo gratuito e acessível para promover a posse responsável de répteis no Brasil
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Manuais de Criação */}
            <div className="docs-card-gradient p-6 rounded-lg border hover:shadow-md transition-all group">
              <div className="h-16 w-16 rounded-full bg-serpente-100 text-serpente-600 flex items-center justify-center mb-6 group-hover:bg-serpente-200 transition-colors dark:bg-serpente-900/50">
                <Book className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-4">Manuais de Criação</h3>
              <p className="text-muted-foreground mb-6 min-h-[80px]">
                Guias técnicos com tudo o que você precisa saber sobre cuidados, alimentação e estrutura ideal.
              </p>
              <Button 
                className="w-full group-hover:translate-y-[-2px] transition-transform" 
                variant="outline" 
                asChild
              >
                <Link to="/manuais-de-criacao" className="flex items-center justify-center">
                  Acessar Manuais <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            
            {/* Card 2: Pet Serpentes Academy */}
            <div className="docs-card-gradient p-6 rounded-lg border hover:shadow-md transition-all group">
              <div className="h-16 w-16 rounded-full bg-serpente-100 text-serpente-600 flex items-center justify-center mb-6 group-hover:bg-serpente-200 transition-colors dark:bg-serpente-900/50">
                <Brain className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-4">Pet Serpentes Academy</h3>
              <p className="text-muted-foreground mb-6 min-h-[80px]">
                Plataforma com aulas, vídeos exclusivos e uma comunidade ativa para entusiastas do hobby.
              </p>
              <Button 
                className="w-full group-hover:translate-y-[-2px] transition-transform" 
                variant="outline" 
                asChild
              >
                <Link to="/ps-academy" className="flex items-center justify-center">
                  Entrar na Academy <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            
            {/* Card 3: Descubra seu Animal Ideal - CHANGED ICON */}
            <div className="docs-card-gradient p-6 rounded-lg border hover:shadow-md transition-all group">
              <div className="h-16 w-16 rounded-full bg-serpente-100 text-serpente-600 flex items-center justify-center mb-6 group-hover:bg-serpente-200 transition-colors dark:bg-serpente-900/50">
                <HelpCircle className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-4">Descubra seu Animal Ideal</h3>
              <p className="text-muted-foreground mb-6 min-h-[80px]">
                Teste interativo para saber qual espécie combina com seu estilo de vida.
              </p>
              <Button 
                className="w-full group-hover:translate-y-[-2px] transition-transform" 
                variant="outline" 
                asChild
              >
                <Link to="/quiz" className="flex items-center justify-center">
                  Fazer o Quiz <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 bg-serpente-600 text-white">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Pronto para ter seu próprio réptil?</h2>
              <p className="text-white/80">Entre em contato conosco e descubra as espécies disponíveis</p>
            </div>
            <Button size="lg" variant="outline" className="bg-white text-serpente-600 hover:bg-white/90 border-none" asChild>
              <Link to="/contato">Falar com um Especialista</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
