
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Brain, HelpCircle } from "lucide-react";

export default function EducationalContentSection() {
  return (
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

          {/* Card 3: Descubra seu Animal Ideal */}
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
  );
}
