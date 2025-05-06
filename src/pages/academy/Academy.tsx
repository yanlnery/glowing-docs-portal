
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Brain, BookOpen, Award, Check, Clock, ChevronRight } from 'lucide-react';

const Academy = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container py-12 px-4 sm:px-6">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            PS Academy: Aprenda com Especialistas em Répteis
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Desenvolva habilidades e conhecimentos para cuidar, criar e reproduzir répteis com nossa plataforma de educação especializada.
          </p>
          <Button 
            size="lg" 
            className="bg-serpente-600 hover:bg-serpente-700 text-white"
            onClick={() => navigate('/lista-de-espera')}
          >
            Entrar para a Lista de Espera
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Seja notificado quando abrirmos novas vagas para nossos cursos.
          </p>
        </div>
        <div className="flex-1">
          <img 
            src="/lovable-uploads/481f8f82-22b1-407d-9e88-623e453faf6a.png" 
            alt="PS Academy" 
            className="rounded-lg shadow-lg border dark:border-gray-800" 
          />
        </div>
      </div>

      {/* Features */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Por que escolher a PS Academy?</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Nossa plataforma foi projetada para oferecer a melhor experiência de aprendizado para criadores e entusiastas de répteis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <div className="bg-serpente-100 dark:bg-serpente-900/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-serpente-600 dark:text-serpente-300" />
              </div>
              <CardTitle>Conhecimento Especializado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Conteúdo criado por criadores experientes e biólogos especializados em herpetologia.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <div className="bg-serpente-100 dark:bg-serpente-900/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-serpente-600 dark:text-serpente-300" />
              </div>
              <CardTitle>Material Prático</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Estudos de caso, vídeos demonstrativos e guias práticos para aplicação imediata.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <div className="bg-serpente-100 dark:bg-serpente-900/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-serpente-600 dark:text-serpente-300" />
              </div>
              <CardTitle>Certificação</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Receba certificados de conclusão para comprovar seus conhecimentos e habilidades.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Preview */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">O que você vai aprender</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Nossos cursos abrangem todos os aspectos da criação e manejo de répteis, desde o básico até técnicas avançadas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Fundamentos da Terrariofilia</CardTitle>
              <CardDescription>Curso introdutório</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Criação de habitats adequados para diferentes espécies</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Nutrição e alimentação adequadas</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Comportamento e manejo de répteis</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Prevenção de doenças comuns</p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>4 semanas de duração</span>
              </div>
            </CardFooter>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Reprodução de Serpentes</CardTitle>
              <CardDescription>Curso avançado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Ciclos reprodutivos e brumação</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Técnicas de acasalamento</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Incubação de ovos e cuidados com filhotes</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Genética e morfos</p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>6 semanas de duração</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Pricing */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Planos de Assinatura</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Escolha o plano que melhor atende às suas necessidades e objetivos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Premium Plan */}
          <Card className="bg-white dark:bg-gray-800 border-serpente-200 dark:border-serpente-800">
            <CardHeader>
              <CardTitle>Plano Premium</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">R$9,90</span>
                <span className="text-muted-foreground ml-1">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Acesso a todos os cursos básicos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Comunidade de discussão</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Certificados de conclusão</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Atualizações de conteúdo</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/lista-de-espera')}>
                Entrar para Lista de Espera
              </Button>
            </CardFooter>
          </Card>

          {/* Professional Plan */}
          <Card className="bg-serpente-50 dark:bg-serpente-900/10 border-serpente-200 dark:border-serpente-800 relative overflow-hidden">
            <div className="absolute top-0 right-0">
              <div className="bg-serpente-600 text-white text-xs px-3 py-1 rotate-45 translate-x-2 translate-y-3">
                Popular
              </div>
            </div>
            <CardHeader>
              <CardTitle>Plano Professional</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">R$17,90</span>
                <span className="text-muted-foreground ml-1">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Tudo do Plano Premium</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Cursos avançados e especializados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Mentorias com especialistas mensais</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Downloads de materiais exclusivos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Acesso antecipado a novos conteúdos</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-serpente-600 hover:bg-serpente-700"
                onClick={() => navigate('/lista-de-espera')}
              >
                Entrar para Lista de Espera
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-serpente-100 dark:bg-serpente-900/20 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Pronto para elevar seus conhecimentos?</h2>
        <p className="max-w-2xl mx-auto mb-6 text-muted-foreground">
          Junte-se à nossa lista de espera e seja o primeiro a saber quando as matrículas estiverem abertas. Vagas limitadas!
        </p>
        <Button 
          size="lg" 
          className="bg-serpente-600 hover:bg-serpente-700"
          onClick={() => navigate('/lista-de-espera')}
        >
          Entrar para Lista de Espera
        </Button>
      </div>
    </div>
  );
};

export default Academy;
