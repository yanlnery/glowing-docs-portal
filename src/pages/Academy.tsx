
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Shield, CheckCircle, Lock } from "lucide-react";
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

  // Hero Section
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-serpente-900 text-white">
        <div className="absolute inset-0 opacity-30" style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}></div>
        <div className="container relative z-10 px-4 py-24 sm:px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Pet Serpentes Academy</h1>
            <p className="text-xl text-white/80 mb-6">
              Cursos online especializados sobre répteis, para iniciantes e profissionais
            </p>
            <Button size="lg" className="bg-white text-serpente-600 hover:bg-white/90" onClick={() => setShowWaitlistModal(true)}>
              Entrar na Lista de Espera <ArrowRight className="ml-2 h-5 w-5" />
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
              Uma plataforma de ensino completa criada por especialistas em herpetologia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            <div className="docs-card p-6 border rounded-lg flex flex-col items-center text-center">
              <div className="bg-serpente-100 dark:bg-serpente-900/50 p-3 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-serpente-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Conteúdo Exclusivo</h3>
              <p className="text-muted-foreground">
                Materiais didáticos desenvolvidos por biólogos e especialistas com experiência prática no manejo de répteis.
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg flex flex-col items-center text-center">
              <div className="bg-serpente-100 dark:bg-serpente-900/50 p-3 rounded-full mb-4">
                <Users className="h-8 w-8 text-serpente-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Comunidade Ativa</h3>
              <p className="text-muted-foreground">
                Fóruns de discussão moderados por tutores, onde você pode tirar dúvidas e interagir com outros entusiastas.
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg flex flex-col items-center text-center">
              <div className="bg-serpente-100 dark:bg-serpente-900/50 p-3 rounded-full mb-4">
                <Shield className="h-8 w-8 text-serpente-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Certificação</h3>
              <p className="text-muted-foreground">
                Receba certificados ao concluir os cursos, reconhecidos por criadores e profissionais da área.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Courses Section */}
      <section className="py-16 bg-muted/30 snake-pattern-bg">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">Cursos em Destaque</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Conheça alguns dos nossos cursos mais populares disponíveis para assinantes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Course 1 */}
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm transition-all hover:shadow-md">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1550172268-9a48af98ac5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                  alt="Fundamentos da Herpetocultura" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-serpente-600 text-white text-xs font-medium px-2 py-1 rounded">Básico</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2">Fundamentos da Herpetocultura</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Curso introdutório para quem deseja iniciar na criação de répteis, com conceitos básicos e práticas essenciais.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">12 módulos em vídeo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">Material complementar em PDF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">Certificado de conclusão</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Lock className="h-4 w-4 mr-2" /> Acesso Exclusivo para Assinantes
                </Button>
              </div>
            </div>
            
            {/* Course 2 */}
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm transition-all hover:shadow-md">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1585095595239-2c5d5b3721f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                  alt="Reprodução de Serpentes" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-earth-600 text-white text-xs font-medium px-2 py-1 rounded">Avançado</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2">Reprodução de Serpentes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Técnicas avançadas de reprodução, incubação de ovos e cuidados com filhotes de diversas espécies.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">15 módulos em vídeo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">Demonstrações práticas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">Fórum de dúvidas especializado</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Lock className="h-4 w-4 mr-2" /> Acesso Exclusivo para Assinantes
                </Button>
              </div>
            </div>
            
            {/* Course 3 */}
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm transition-all hover:shadow-md">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1557178985-891076b318dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                  alt="Genética e Morfos" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-earth-600 text-white text-xs font-medium px-2 py-1 rounded">Avançado</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2">Genética e Morfos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Entenda os princípios genéticos por trás das diferentes variações morfológicas em répteis.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">10 módulos em vídeo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">Estudos de caso</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-serpente-600" />
                    <span className="text-sm">Tabelas de probabilidade genética</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Lock className="h-4 w-4 mr-2" /> Acesso Exclusivo para Assinantes
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
                <p className="text-sm text-muted-foreground">Acesso aos cursos introdutórios</p>
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
                  <span>5 cursos básicos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Material em PDF</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Certificados</span>
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
                <p className="text-sm text-muted-foreground">Acesso completo à biblioteca</p>
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
                  <span>Todos os cursos (20+)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Material em PDF e vídeos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Acesso ao fórum exclusivo</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Consultoria mensal (30 min)</span>
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
                  <span className="text-3xl font-bold">R$99</span>
                  <span className="text-muted-foreground ml-1">/mês</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-serpente-600 mr-2" />
                  <span>Todos os cursos Premium</span>
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
              <h2 className="text-3xl font-bold">O Que Dizem Nossos Alunos</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Depoimentos de membros da Pet Serpentes Academy
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
                "Os cursos da Academy foram fundamentais para que eu tivesse segurança ao adquirir minha primeira serpente. O conteúdo é claro, prático e muito bem explicado."
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
                "Como profissional da área veterinária, encontrei na Academy conteúdos específicos que complementaram minha formação acadêmica. Recomendo especialmente os cursos avançados."
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
                "O curso de genética e morfos revolucionou meu negócio. Consegui melhorar significativamente os resultados de reprodução e a qualidade dos filhotes no meu criadouro."
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
              <p className="text-white/80">Inicie sua jornada na Pet Serpentes Academy hoje mesmo</p>
            </div>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-serpente-600 hover:bg-white/90 border-none"
              onClick={() => setShowWaitlistModal(true)}
            >
              Entrar na Lista de Espera <ArrowRight className="ml-2 h-4 w-4" />
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
