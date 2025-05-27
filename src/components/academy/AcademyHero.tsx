
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface AcademyHeroProps {
  onOpenWaitlistDialog: () => void;
}

const AcademyHero: React.FC<AcademyHeroProps> = ({ onOpenWaitlistDialog }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
      <div className="flex-1">
        <img
          src="/lovable-uploads/bf008d0e-9874-4dad-9871-fb0c80c0efd4.png"
          alt="PS Academy - Répteis e conhecimento"
          className="rounded-lg shadow-lg border dark:border-gray-800"
          loading="lazy"
        />
      </div>
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
          onClick={onOpenWaitlistDialog}
        >
          Entrar para a Lista de Espera
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          Seja notificado quando abrirmos novas vagas para nossos cursos.
        </p>
      </div>
    </div>
  );
};

export default AcademyHero;
