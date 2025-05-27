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
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Brain, BookOpen, Award, Check, Clock, ChevronRight } from 'lucide-react';
import WaitlistForm from '@/components/WaitlistForm';

const Academy = () => {
  const navigate = useNavigate();
  const [isWaitlistDialogOpen, setIsWaitlistDialogOpen] = useState(false);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleWaitlistSubmit = (data: any) => {
    // Store in localStorage for demonstration purposes
    const waitlistEntry = {
      ...data,
      date: new Date().toISOString()
    };

    // Get current waitlist entries or initialize empty array
    const currentEntries = JSON.parse(localStorage.getItem('waitlist') || '[]');
    localStorage.setItem('waitlist', JSON.stringify([...currentEntries, waitlistEntry]));
    
    setIsWaitlistDialogOpen(false);
    navigate('/confirmacao-inscricao');
  };

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
            onClick={() => setIsWaitlistDialogOpen(true)}
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
            src="/lovable-uploads/bf008d0e-9874-4dad-9871-fb0c80c0efd4.png" 
            alt="PS Academy - Répteis e conhecimento" 
            className="rounded-lg shadow-lg border dark:border-gray-800" 
            loading="lazy"
          />
        </div>
      </div>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">Por que escolher a Academy?</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Uma plataforma criada por especialistas para compartilhar conhecimento de qualidade sobre criação e manejo de répteis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="docs-card p-6 border rounded-lg flex flex-col">
              <div className="rounded-full bg-serpente-100 text-serpente-600 p-3 h-14 w-14 flex items-center justify-center mb-4 dark:bg-serpente-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Conhecimento Especializado</h3>
              <p className="text-muted-foreground flex-grow">
                Conteúdo desenvolvido por biólogos e profissionais com anos de experiência em manejo, criação e comportamento de répteis.
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg flex flex-col">
              <div className="rounded-full bg-serpente-100 text-serpente-600 p-3 h-14 w-14 flex items-center justify-center mb-4 dark:bg-serpente-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Comunidade Ativa</h3>
              <p className="text-muted-foreground flex-grow">
                Faça parte de uma comunidade de tutores apaixonados, compartilhe experiências e tire dúvidas com outros criadores.
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg flex flex-col">
              <div className="rounded-full bg-serpente-100 text-serpente-600 p-3 h-14 w-14 flex items-center justify-center mb-4 dark:bg-serpente-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Conteúdo em Vídeo</h3>
              <p className="text-muted-foreground flex-grow">
                Assista aulas práticas e demonstrações em vídeo que facilitam o aprendizado de técnicas de manejo e cuidados com répteis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Preview */}
      <section className="py-16 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">Cursos em Destaque</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Explore nossos cursos mais populares e avançados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="docs-card p-6 border rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mr-3">
                  <span className="text-lg font-bold">C1</span>
                </div>
                <div>
                  <h4 className="font-bold">Cursos de Criação de Répteis</h4>
                  <p className="text-sm text-muted-foreground">Aprenda a criar e cuidar de répteis</p>
                </div>
              </div>
              <p className="italic text-muted-foreground">
                "Aprenda a criar e cuidar de répteis de forma eficaz com nossos cursos de criação."
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mr-3">
                  <span className="text-lg font-bold">C2</span>
                </div>
                <div>
                  <h4 className="font-bold">Cursos de Manejo de Répteis</h4>
                  <p className="text-sm text-muted-foreground">Aprenda a manter e cuidar de répteis</p>
                </div>
              </div>
              <p className="italic text-muted-foreground">
                "Aprenda a manter e cuidar de répteis de forma eficaz com nossos cursos de manejo."
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mr-3">
                  <span className="text-lg font-bold">C3</span>
                </div>
                <div>
                  <h4 className="font-bold">Cursos de Herpetologia</h4>
                  <p className="text-sm text-muted-foreground">Aprenda sobre herpetologia</p>
                </div>
              </div>
              <p className="italic text-muted-foreground">
                "Aprenda sobre herpetologia de forma eficaz com nossos cursos de herpetologia."
              </p>
            </div>
          </div>
        </div>
      </section>

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
              <Button className="w-full" onClick={() => setIsWaitlistDialogOpen(true)}>
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
                onClick={() => setIsWaitlistDialogOpen(true)}
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
          onClick={() => setIsWaitlistDialogOpen(true)}
        >
          Entrar para Lista de Espera
        </Button>
      </div>

      {/* Waitlist Dialog */}
      <Dialog open={isWaitlistDialogOpen} onOpenChange={setIsWaitlistDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <WaitlistForm 
            onSubmit={handleWaitlistSubmit} 
            onCancel={() => setIsWaitlistDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Academy;
