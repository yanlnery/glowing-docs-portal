import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, Calendar, CreditCard, Shield, Syringe } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

export default function AboutSection() {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2">
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
              onLoad={() => console.log("✅ Imagem da seção About carregada")}
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
  );
}
