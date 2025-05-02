
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Shield, CheckCircle, Lock, Video, MessageSquare, Trophy } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import WaitlistForm from "@/components/WaitlistForm";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function Academy() {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    contactPreference: ""
  });

  const handleWaitlistSubmit = (formData) => {
    setUserData(formData);
    setShowWaitlistModal(false);
    setShowConfirmationModal(true);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-serpente-900 text-white">
        <div className="absolute inset-0 opacity-30" style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1557178985-891076b318dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}></div>
        <div className="container relative z-10 px-4 py-24 sm:px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Pet Serpentes Academy</h1>
            <p className="text-xl text-white/80 mb-6">
              Uma comunidade completa para criadores e amantes de répteis
            </p>
            <Button size="lg" className="bg-white text-serpente-600 hover:bg-white/90" onClick={() => setShowWaitlistModal(true)}>
              Entrar na Lista de Espera
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">Por que escolher a Academy?</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Uma plataforma completa criada por especialistas em herpetologia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            <div className="docs-card p-6 border rounded-lg flex flex-col items-center text-center">
              <div className="bg-serpente-100 dark:bg-serpente-900/50 p-3 rounded-full mb-4">
                <Video className="h-8 w-8 text-serpente-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Aulas e Demonstrações</h3>
              <p className="text-muted-foreground">
                Vídeos práticos e educativos desenvolvidos por biólogos e especialistas com experiência prática no manejo de répteis.
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg flex flex-col items-center text-center">
              <div className="bg-serpente-100 dark:bg-serpente-900/50 p-3 rounded-full mb-4">
                <MessageSquare className="h-8 w-8 text-serpente-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Rede Social Interna</h3>
              <p className="text-muted-foreground">
                Muro de postagens, fóruns e interações entre membros, onde você pode compartilhar experiências e aprender com outros entusiastas.
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg flex flex-col items-center text-center">
              <div className="bg-serpente-100 dark:bg-serpente-900/50 p-3 rounded-full mb-4">
                <Trophy className="h-8 w-8 text-serpente-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sistema de Recompensas</h3>
              <p className="text-muted-foreground">
                Sistema de gamificação e recompensas baseado em participação, compartilhamento de conhecimento e engajamento na comunidade.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Content Highlight Cards */}
      <section className="py-16 bg-muted/30 snake-pattern-bg">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">Conteúdos Destacados</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Confira alguns dos conteúdos disponíveis para os membros da comunidade
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Content Card 1 */}
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm transition-all hover:shadow-md">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1633527316352-52177079b3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80" 
                  alt="Vídeos Técnicos" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-serpente-600 text-white text-xs font-medium px-2 py-1 rounded">Exclusivo</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2">Vídeos Técnicos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Conteúdo especializado sobre manejo, reprodução, genética e veterinária de répteis.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">Aulas de especialistas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">Demonstrações práticas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">Conteúdo profissional</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline" onClick={() => setShowWaitlistModal(true)}>
                  <Lock className="h-4 w-4 mr-2" /> Entrar na Lista de Espera
                </Button>
              </div>
            </div>
            
            {/* Content Card 2 */}
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm transition-all hover:shadow-md">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1598445609092-7c7d80d816dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80" 
                  alt="Tutoriais em Vídeo" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-serpente-600 text-white text-xs font-medium px-2 py-1 rounded">Exclusivo</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2">Tutoriais em Vídeo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Aprenda passo a passo a criar, manter e reproduzir diferentes espécies de répteis.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">Guias completos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">Passo a passo detalhado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">Técnicas exclusivas</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline" onClick={() => setShowWaitlistModal(true)}>
                  <Lock className="h-4 w-4 mr-2" /> Entrar na Lista de Espera
                </Button>
              </div>
            </div>
            
            {/* Content Card 3 */}
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm transition-all hover:shadow-md">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1550172268-9a48af98ac5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80" 
                  alt="Histórias de Criadores" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-serpente-600 text-white text-xs font-medium px-2 py-1 rounded">Exclusivo</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2">Histórias de Criadores</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Conheça a trajetória e experiências de criadores de sucesso no universo da herpetocultura.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">Entrevistas exclusivas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">Histórias inspiradoras</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">Dicas de sucesso</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline" onClick={() => setShowWaitlistModal(true)}>
                  <Lock className="h-4 w-4 mr-2" /> Entrar na Lista de Espera
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">Planos de Assinatura</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Escolha o plano que melhor se adapta às suas necessidades
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Basic Plan */}
            <div className="border rounded-lg p-6 bg-card shadow-sm transition-all hover:shadow-md flex flex-col">
              <div className="mb-4">
                <h3 className="font-bold text-xl mb-1">Básico</h3>
                <p className="text-sm text-muted-foreground">Acesso aos conteúdos introdutórios</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">R$14</span>
                  <span className="text-muted-foreground ml-1">/mês</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>5 vídeos básicos por mês</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Acesso ao fórum</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Eventos virtuais</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => setShowWaitlistModal(true)}>
                Entrar na Lista de Espera
              </Button>
            </div>
            
            {/* Premium Plan (Highlighted) */}
            <div className="border-2 border-serpente-600 rounded-lg p-6 bg-card relative shadow-md transition-all hover:shadow-lg flex flex-col">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-serpente-600 text-white text-xs font-medium px-3 py-1 rounded-full">MAIS POPULAR</span>
              </div>
              <div className="mb-4 mt-2">
                <h3 className="font-bold text-xl mb-1">Premium</h3>
                <p className="text-sm text-muted-foreground">Acesso completo à comunidade</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">R$29</span>
                  <span className="text-muted-foreground ml-1">/mês</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Todos os vídeos (20+ por mês)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Postagens ilimitadas no mural</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Acesso à rede social exclusiva</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Consulta mensal (30 min)</span>
                </li>
              </ul>
              <Button className="w-full" onClick={() => setShowWaitlistModal(true)}>
                Entrar na Lista de Espera
              </Button>
            </div>
            
            {/* Professional Plan */}
            <div className="border rounded-lg p-6 bg-card shadow-sm transition-all hover:shadow-md flex flex-col">
              <div className="mb-4">
                <h3 className="font-bold text-xl mb-1">Profissional</h3>
                <p className="text-sm text-muted-foreground">Para criadores comerciais</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">R$49</span>
                  <span className="text-muted-foreground ml-1">/mês</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Todos os benefícios Premium</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Conteúdo exclusivo profissional</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Consultoria semanal (1 hora)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Desconto em produtos</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => setShowWaitlistModal(true)}>
                Entrar na Lista de Espera
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30 snake-pattern-bg">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">O Que Dizem Nossos Membros</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Depoimentos de participantes da Pet Serpentes Academy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {/* Testimonial 1 */}
            <div className="bg-card border p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-serpente-100 dark:bg-serpente-900/50 h-12 w-12 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-lg text-serpente-600">MC</span>
                </div>
                <div>
                  <h4 className="font-medium">Marcos Costa</h4>
                  <p className="text-sm text-muted-foreground">Criador iniciante</p>
                </div>
              </div>
              <p className="text-foreground/80 italic">
                "Os conteúdos da Academy foram fundamentais para que eu tivesse segurança ao adquirir minha primeira serpente. O suporte da comunidade é incrível."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-card border p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-serpente-100 dark:bg-serpente-900/50 h-12 w-12 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-lg text-serpente-600">AS</span>
                </div>
                <div>
                  <h4 className="font-medium">Amanda Silva</h4>
                  <p className="text-sm text-muted-foreground">Veterinária</p>
                </div>
              </div>
              <p className="text-foreground/80 italic">
                "Como profissional da área veterinária, encontrei na comunidade Academy conteúdos específicos que complementaram minha formação acadêmica."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-card border p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-serpente-100 dark:bg-serpente-900/50 h-12 w-12 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-lg text-serpente-600">RF</span>
                </div>
                <div>
                  <h4 className="font-medium">Rafael Ferreira</h4>
                  <p className="text-sm text-muted-foreground">Criador comercial</p>
                </div>
              </div>
              <p className="text-foreground/80 italic">
                "A rede social interna da Academy é um diferencial incrível. Consegui conectar com outros criadores e resolver dúvidas importantes para o meu negócio."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 bg-serpente-600 text-white">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Pronto para começar?</h2>
              <p className="text-white/80">Junte-se à comunidade Pet Serpentes Academy hoje mesmo</p>
            </div>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-serpente-600 hover:bg-white/90 border-none"
              onClick={() => setShowWaitlistModal(true)}
            >
              Entrar na Lista de Espera
            </Button>
          </div>
        </div>
      </section>

      {/* Waitlist Modal */}
      <Dialog open={showWaitlistModal} onOpenChange={setShowWaitlistModal}>
        <DialogContent className="sm:max-w-md">
          <WaitlistForm onSubmit={handleWaitlistSubmit} onCancel={() => setShowWaitlistModal(false)} />
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmationModal} onOpenChange={setShowConfirmationModal}>
        <DialogContent className="sm:max-w-lg">
          <ConfirmationModal userData={userData} onClose={() => setShowConfirmationModal(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
