import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Crown, Sparkles } from 'lucide-react';

interface AcademyHeroProps {
  onOpenWaitlistDialog: () => void;
}

const AcademyHero: React.FC<AcademyHeroProps> = ({ onOpenWaitlistDialog }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
      <div className="flex-1">
        <img
          src="/lovable-uploads/bf008d0e-9874-4dad-9871-fb0c80c0efd4.png"
          alt="PS Academy - Comunidade de Herpecultura"
          className="rounded-lg shadow-lg border dark:border-gray-800"
          loading="lazy"
        />
      </div>
      <div className="flex-1">
        {/* Exclusive community badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-amber-500/30 rounded-full animate-fade-in">
          <Crown className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 bg-clip-text text-transparent uppercase tracking-wider">
            P.S. Academy
          </span>
          <span className="text-xs text-amber-600/80 dark:text-amber-400/80">•</span>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            Comunidade Exclusiva
          </span>
          <Sparkles className="w-3 h-3 text-amber-500" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          A comunidade que todo criador de répteis precisa conhecer
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Conecte-se com criadores apaixonados, aprenda com especialistas e tenha acesso exclusivo ao melhor conteúdo sobre criação de répteis.
        </p>
        <Button
          size="lg"
          className="btn-premium px-8 py-6 text-base font-semibold"
          onClick={onOpenWaitlistDialog}
        >
          Faça parte da P.S.A
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          Vagas limitadas. Entre para a lista de espera e seja avisado.
        </p>
      </div>
    </div>
  );
};

export default AcademyHero;
