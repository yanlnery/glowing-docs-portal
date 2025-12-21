import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, Calendar, CreditCard, PawPrint, Shield, Syringe } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

const features = [
  {
    icon: <Shield className="text-serpente-600 h-6 w-6" />,
    title: "Criadouro Certificado",
    description: "Registro oficial IBAMA e INEA"
  },
  {
    icon: <Award className="text-serpente-600 h-6 w-6" />,
    title: "Expertise",
    description: "Equipe qualificada em herpetocultura"
  },
  {
    icon: <Calendar className="text-serpente-600 h-6 w-6" />,
    title: "+10 Anos",
    description: "De experiência no mercado"
  },
  {
    icon: <CreditCard className="text-serpente-600 h-6 w-6" />,
    title: "10% OFF no PIX",
    description: "Ou 10x sem juros no cartão"
  },
  {
    icon: <Syringe className="text-serpente-600 h-6 w-6" />,
    title: "Acompanhamento Veterinário",
    description: "Suporte em saúde animal"
  },
  {
    icon: <PawPrint className="text-serpente-600 h-6 w-6" />,
    title: "Combate ao Tráfico de Fauna",
    description: "Conservação e criação legalizada"
  }
];

export default function AboutSection() {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Desktop: Imagem no lado esquerdo */}
          <div className="w-full lg:w-1/2 hidden md:block">
            <OptimizedImage
              src="/lovable-uploads/c988fe8f-9ba2-4b94-a8e7-a7347e0d0a84.png"
              alt="Pet Serpentes & Companhia - Instalações do Criadouro"
              priority={false}
              quality={85}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="rounded-lg shadow-lg w-full h-auto aspect-[4/3]"
              style={{
                objectFit: "cover",
                objectPosition: "center"
              }}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">Sobre o Criadouro</h2>
            </div>
            
            {/* Primeiro parágrafo */}
            <p className="mt-6 text-lg leading-relaxed text-foreground/90">
              O <strong>Pet Serpentes & Companhia</strong> é um criadouro comercial legalizado localizado no Rio de Janeiro, certificado pelo IBAMA e INEA-RJ. Trabalhamos exclusivamente com répteis nativos, focando no bem-estar dos animais e na criação responsável.
            </p>
            
            {/* Mobile: Imagem após primeiro parágrafo */}
            <div className="md:hidden my-6 rounded-lg overflow-hidden shadow-lg">
              <OptimizedImage
                src="/lovable-uploads/c988fe8f-9ba2-4b94-a8e7-a7347e0d0a84.png"
                alt="Pet Serpentes & Companhia - Instalações do Criadouro"
                priority={false}
                quality={85}
                sizes="100vw"
                className="w-full h-auto aspect-[4/3]"
                style={{
                  objectFit: "cover",
                  objectPosition: "center"
                }}
              />
            </div>
            
            {/* Segundo parágrafo */}
            <p className="mt-4 text-lg leading-relaxed text-foreground/90">
              Nosso trabalho vai além da venda de animais. Fazemos questão de compartilhar conhecimento sobre as espécies que criamos, ajudando novos tutores a entenderem as necessidades reais de cada animal. Também colaboramos com pesquisadores e instituições que estudam répteis brasileiros.
            </p>

            {/* Mobile: Carrossel automático infinito com touch */}
            <div className="md:hidden overflow-x-auto mt-8 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="flex gap-4 animate-scroll-carousel w-max">
                {[...features, ...features].map((item, index) => (
                  <div key={index} className="flex-shrink-0 w-[70vw] flex gap-3 items-start bg-card border border-border/50 rounded-xl p-4">
                    <div className="mt-1">{item.icon}</div>
                    <div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Grid normal */}
            <div className="hidden md:grid grid-cols-2 gap-4 mt-8">
              {features.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button className="mt-8" variant="outline" asChild>
              <Link to="/sobre">Conheça Nossa História Completa</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
