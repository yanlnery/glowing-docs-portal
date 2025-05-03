import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Calendar, CreditCard, Shield, BookOpen, Users, Video, Syringe } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";

export default function Home() {
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
            {/* Species Card 1 */}
            <div className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
              <div className="relative h-48 sm:h-64 overflow-hidden">
                <img 
                  src="/lovable-uploads/87bb79b7-12d7-41e7-9b09-a2a646636a7f.png" 
                  alt="Erythrolamprus miliaris" 
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <span className="inline-block bg-serpente-600 text-white text-xs px-2 py-1 rounded">Disponível</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Erythrolamprus miliaris</h3>
                <p className="text-muted-foreground text-sm mb-3">Cobra-d'água</p>
                <div className="flex justify-end items-center">
                  <Button variant="outline" size="sm" className="min-h-[44px] w-full sm:w-auto" asChild>
                    <Link to="/catalogo">Ver Detalhes</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Species Card 2 */}
            <div className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
              <div className="relative h-48 sm:h-64 overflow-hidden">
                <img 
                  src="/lovable-uploads/b81f6c0b-360a-4408-834b-cb20bd36e3da.png" 
                  alt="Tupinambis teguixin" 
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <span className="inline-block bg-serpente-600 text-white text-xs px-2 py-1 rounded">Disponível</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Tupinambis teguixin</h3>
                <p className="text-muted-foreground text-sm mb-3">Teiú-amarelo</p>
                <div className="flex justify-end items-center">
                  <Button variant="outline" size="sm" className="min-h-[44px] w-full sm:w-auto" asChild>
                    <Link to="/catalogo">Ver Detalhes</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Species Card 3 */}
            <div className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
              <div className="relative h-48 sm:h-64 overflow-hidden">
                <img 
                  src="/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png" 
                  alt="Epicrates crassus" 
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <span className="inline-block bg-serpente-600 text-white text-xs px-2 py-1 rounded">Disponível</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Epicrates crassus</h3>
                <p className="text-muted-foreground text-sm mb-3">Jiboia-do-Cerrado</p>
                <div className="flex justify-end items-center">
                  <Button variant="outline" size="sm" className="min-h-[44px] w-full sm:w-auto" asChild>
                    <Link to="/catalogo">Ver Detalhes</Link>
                  </Button>
                </div>
              </div>
            </div>
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
                src="/lovable-uploads/420a5a2e-8cec-420f-89e1-3f9a584e00f7.png" 
                alt="Yan Nery" 
                className="rounded-lg shadow-lg w-full h-auto object-cover aspect-[4/3]"
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
      
      {/* Educational Content Preview */}
      <section className="py-16 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">Conteúdo Educativo</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Descubra dicas, tutoriais e materiais informativos para cuidar adequadamente da sua serpente ou lagarto
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="docs-card-gradient p-6 rounded-lg border">
              <BookOpen className="h-8 w-8 text-serpente-600 mb-4" />
              <h3 className="font-bold text-xl mb-4">Manuais de Criação</h3>
              <p className="text-muted-foreground mb-6">Guias completos e técnicos para o manejo adequado de cada espécie</p>
              <Link to="/manuais" className="text-serpente-600 font-medium hover:underline inline-flex items-center">
                Ver Manuais <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="docs-card-gradient p-6 rounded-lg border">
              <Video className="h-8 w-8 text-serpente-600 mb-4" />
              <h3 className="font-bold text-xl mb-4">Conteúdos em Vídeo</h3>
              <p className="text-muted-foreground mb-6">Aulas práticas, demonstrações e tutoriais em formato audiovisual</p>
              <Link to="/educacao/videos" className="text-serpente-600 font-medium hover:underline inline-flex items-center">
                Assistir Vídeos <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="docs-card-gradient p-6 rounded-lg border">
              <Users className="h-8 w-8 text-serpente-600 mb-4" />
              <h3 className="font-bold text-xl mb-4">Pet Serpentes Academy</h3>
              <p className="text-muted-foreground mb-6">Comunidade interativa para criadores e amantes de répteis</p>
              <Link to="/academy" className="text-serpente-600 font-medium hover:underline inline-flex items-center">
                Conhecer Comunidade <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
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
