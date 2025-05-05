
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, ExternalLink } from "lucide-react";

export default function Academy() {
  return (
    <div>
      {/* Hero Section with Updated Background Image */}
      <section className="relative py-24 text-white">
        <div className="absolute inset-0 bg-black/70 z-0">
          <img 
            src="/lovable-uploads/e045c67b-a1d3-4a76-9c84-7a52ef1a076f.png" 
            alt="Pet Serpentes Academy" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="container relative z-10 px-4 sm:px-6 flex flex-col items-center">
          <div className="max-w-3xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Pet Serpentes Academy</h1>
            <p className="text-xl text-white/80 mb-8">
              A plataforma educacional definitiva para criadores e entusiastas de répteis no Brasil
            </p>
            <Button size="lg" className="min-h-[44px]">
              Conheça nossos cursos <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
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
      
      {/* Pricing Plans - UPDATED TO REMOVE PROFESSIONAL PLAN */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">Escolha seu Plano</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Invista em seu conhecimento com um plano que se adapta às suas necessidades
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="docs-card-gradient p-6 border rounded-lg shadow-sm hover:shadow-md transition-all">
              <h3 className="text-2xl font-bold mb-2">Gratuito</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold">R$0</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Artigos educacionais básicos</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Acesso à comunidade</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>1 webinar mensal</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full min-h-[44px]" asChild>
                <Link to="/lista-de-espera">Começar Grátis</Link>
              </Button>
            </div>
            
            {/* Premium Plan with Most Popular Tag */}
            <div className="docs-card-gradient p-6 border rounded-lg shadow-sm hover:shadow-md transition-all relative">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-serpente-600 text-white text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider">Mais Popular</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold">R$27</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Todos os cursos disponíveis</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Certificados de conclusão</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Acesso a eventos exclusivos</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Suporte prioritário</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Desconto em produtos</span>
                </div>
              </div>
              
              <Button className="w-full min-h-[44px]" asChild>
                <Link to="/confirmacao-inscricao">Assinar Agora</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">O que dizem nossos alunos</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Depoimentos de quem já faz parte da Pet Serpentes Academy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="docs-card p-6 border rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mr-3">
                  <span className="text-lg font-bold">M</span>
                </div>
                <div>
                  <h4 className="font-bold">Marcos Silva</h4>
                  <p className="text-sm text-muted-foreground">Criador há 2 anos</p>
                </div>
              </div>
              <p className="italic text-muted-foreground">
                "Os cursos da Academy me ajudaram a entender muito melhor sobre o comportamento da minha Jiboia. O suporte da equipe é incrível!"
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mr-3">
                  <span className="text-lg font-bold">C</span>
                </div>
                <div>
                  <h4 className="font-bold">Carolina Mendes</h4>
                  <p className="text-sm text-muted-foreground">Veterinária</p>
                </div>
              </div>
              <p className="italic text-muted-foreground">
                "Como profissional da área, encontrei conteúdos de altíssima qualidade. Recomendo para todos os interessados em herpetologia."
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mr-3">
                  <span className="text-lg font-bold">R</span>
                </div>
                <div>
                  <h4 className="font-bold">Rafael Almeida</h4>
                  <p className="text-sm text-muted-foreground">Estudante de Biologia</p>
                </div>
              </div>
              <p className="italic text-muted-foreground">
                "A comunidade é sensacional! Aprendi muito sobre manejo e ambientação adequada para répteis. Vale cada centavo."
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
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Pronto para começar sua jornada?</h2>
              <p className="text-white/80">Junte-se aos mais de 500 entusiastas que já fazem parte da Academy</p>
            </div>
            <Button size="lg" variant="outline" className="bg-white text-serpente-600 hover:bg-white/90 border-none" asChild>
              <Link to="/confirmacao-inscricao">Assinar Agora</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="docs-section-title">
              <h2 className="text-3xl font-bold">Perguntas Frequentes</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Tire suas dúvidas sobre a Pet Serpentes Academy
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="docs-card p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-2">Como funciona a assinatura?</h3>
              <p className="text-muted-foreground">
                Após a assinatura, você terá acesso imediato a todos os cursos e materiais da plataforma. A cobrança é mensal e você pode cancelar a qualquer momento.
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-2">Posso assistir às aulas no celular?</h3>
              <p className="text-muted-foreground">
                Sim! Nossa plataforma é totalmente responsiva e você pode acessar os conteúdos de qualquer dispositivo: computador, tablet ou smartphone.
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-2">Os cursos têm certificado?</h3>
              <p className="text-muted-foreground">
                Sim, todos os assinantes do plano Premium recebem certificados de conclusão dos cursos, que podem ser baixados diretamente na plataforma.
              </p>
            </div>
            
            <div className="docs-card p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-2">Como funciona o suporte?</h3>
              <p className="text-muted-foreground">
                Os assinantes Premium têm acesso ao suporte via chat e e-mail com tempo de resposta de até 24 horas. Além disso, podem tirar dúvidas diretamente nos fóruns da comunidade.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
