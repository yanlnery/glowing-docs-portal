import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";

// Ícones personalizados
import iconCertificado from "@/assets/icons/about-certificado.png";
import iconExpertise from "@/assets/icons/about-expertise.png";
import icon10Anos from "@/assets/icons/about-10anos.png";
import iconPix from "@/assets/icons/about-pix.png";
import iconVeterinario from "@/assets/icons/about-veterinario.png";
import iconTrafico from "@/assets/icons/about-trafico.png";

const features = [
  {
    icon: iconCertificado,
    title: "Criadouro Certificado",
    description: "Registro oficial IBAMA e INEA"
  },
  {
    icon: iconExpertise,
    title: "Expertise",
    description: "Equipe qualificada em herpetocultura"
  },
  {
    icon: icon10Anos,
    title: "+10 Anos",
    description: "De experiência no mercado"
  },
  {
    icon: iconPix,
    title: "10% OFF no PIX",
    description: "Ou 10x sem juros no cartão"
  },
  {
    icon: iconVeterinario,
    title: "Acompanhamento Veterinário",
    description: "Suporte em saúde animal"
  },
  {
    icon: iconTrafico,
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
              <div className="flex gap-3 animate-scroll-carousel w-max">
                {[...features, ...features].map((item, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 w-[42vw] flex flex-col items-center text-center bg-card border border-border/50 rounded-xl p-4 shadow-sm"
                  >
                    <div className="w-14 h-14 flex items-center justify-center mb-3">
                      <img src={item.icon} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <h3 className="font-bold text-sm leading-tight">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Grid normal */}
            <div className="hidden md:grid grid-cols-2 gap-4 mt-8">
              {features.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="w-10 h-10 flex-shrink-0">
                    <img src={item.icon} alt={item.title} className="w-full h-full object-contain" />
                  </div>
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
