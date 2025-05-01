
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Calendar, CreditCard, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Banner Section */}
      <section className="relative">
        <div className="hero-pattern relative w-full h-[70vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
          <div className="container relative z-20 flex flex-col items-start justify-center h-full py-10 px-4 sm:px-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-2xl animate-slide-in">
              Serpentes exóticas com <span className="text-earth-200">certificação legal</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-xl mb-8 animate-fade-in">
              Venha conhecer as espécies mais fascinantes em um criadouro 100% legalizado pelo IBAMA e INEA
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-serpente-600 hover:bg-serpente-700">
                Ver Catálogo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Conheça nossa História
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Species Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">Espécies em Destaque</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Conheça algumas das serpentes e lagartos disponíveis no nosso criadouro, todos com certificação de origem e documentação legal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {/* Species Card 1 */}
            <div className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1585095595239-2c5d5b3721f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                  alt="Python regius" 
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <span className="inline-block bg-serpente-600 text-white text-xs px-2 py-1 rounded">Disponível</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Python regius</h3>
                <p className="text-muted-foreground text-sm mb-3">Python-bola</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg text-serpente-600">R$ 1.500,00</span>
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </div>
              </div>
            </div>
            
            {/* Species Card 2 */}
            <div className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1557178985-891076b318dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                  alt="Morelia viridis" 
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <span className="inline-block bg-earth-600 text-white text-xs px-2 py-1 rounded">Pré-venda</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Morelia viridis</h3>
                <p className="text-muted-foreground text-sm mb-3">Píton-verde-arbórea</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg text-serpente-600">R$ 3.200,00</span>
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </div>
              </div>
            </div>
            
            {/* Species Card 3 */}
            <div className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1535295119433-5a3d0c779053?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                  alt="Pogona vitticeps" 
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <span className="inline-block bg-serpente-600 text-white text-xs px-2 py-1 rounded">Disponível</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Pogona vitticeps</h3>
                <p className="text-muted-foreground text-sm mb-3">Dragão-barbudo</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg text-serpente-600">R$ 800,00</span>
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-10">
            <Button size="lg" asChild>
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
                src="https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                alt="Patrick Henriques Petitinga" 
                className="rounded-lg shadow-lg w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <div className="docs-section-title">
                <h2 className="text-3xl font-bold">Sobre o Criadouro</h2>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-foreground/90">
                O <strong>Pet Serpentes & Companhia</strong> nasceu da paixão de Patrick Henriques Petitinga, biólogo e pesquisador especializado em comportamento animal. Localizado no Rio de Janeiro, nosso criadouro é 100% legalizado pelo IBAMA e INEA.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-foreground/90">
                Nossa missão é promover a criação responsável, contribuir com a conservação das espécies e disseminar conhecimento sobre esses fascinantes animais através da educação ambiental e pesquisa científica.
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
              <h3 className="font-bold text-xl mb-4">Guias de Cuidados</h3>
              <p className="text-muted-foreground mb-6">Manuais completos para cuidados específicos de cada espécie</p>
              <Link to="/educacao/guias" className="text-serpente-600 font-medium hover:underline inline-flex items-center">
                Ver Guias <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="docs-card-gradient p-6 rounded-lg border">
              <h3 className="font-bold text-xl mb-4">Blog Especializado</h3>
              <p className="text-muted-foreground mb-6">Artigos informativos sobre comportamento, alimentação e saúde</p>
              <Link to="/educacao/blog" className="text-serpente-600 font-medium hover:underline inline-flex items-center">
                Ler Artigos <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="docs-card-gradient p-6 rounded-lg border">
              <h3 className="font-bold text-xl mb-4">Academy Pet Serpentes</h3>
              <p className="text-muted-foreground mb-6">Cursos online para criadores e entusiastas de répteis</p>
              <Link to="/academy" className="text-serpente-600 font-medium hover:underline inline-flex items-center">
                Conhecer Cursos <ArrowRight className="ml-1 h-4 w-4" />
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
