
import React from 'react';

const AcademyFeatures: React.FC = () => {
  return (
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
  );
};

export default AcademyFeatures;
