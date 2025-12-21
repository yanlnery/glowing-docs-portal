import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Crown, Sparkles, Loader2 } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface AcademyHeroProps {
  onAction: () => void;
  isLoading?: boolean;
  hasAccess?: boolean;
  isOpenForSubscription?: boolean;
}

const AcademyHero: React.FC<AcademyHeroProps> = ({ onAction, isLoading, hasAccess, isOpenForSubscription }) => {
  const getButtonText = () => {
    if (isLoading) return 'Carregando...';
    if (isOpenForSubscription) return 'Assinar Agora - R$17,90/mês';
    return 'Faça parte da PSA';
  };

  const getSubtext = () => {
    if (isOpenForSubscription) return 'Cancele a qualquer momento. Sem compromisso.';
    return 'Vagas limitadas. Entre para a lista de espera e seja avisado.';
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
      <div className="flex-1">
        <OptimizedImage
          src="/lovable-uploads/bf008d0e-9874-4dad-9871-fb0c80c0efd4.png"
          alt="PS Academy - Comunidade de Herpecultura"
          className="rounded-lg shadow-lg border dark:border-gray-800"
          priority={true}
        />
      </div>
      <div className="flex-1">
        {/* Exclusive community badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-amber-500/30 rounded-full animate-fade-in">
          <Crown className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 bg-clip-text text-transparent uppercase tracking-wider">
            PS Academy
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
        
        {hasAccess ? (
          <Button
            size="lg"
            className="btn-premium px-8 py-6 text-base font-semibold"
            onClick={() => {}}
          >
            Acessar Conteúdo
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <>
            <Button
              size="lg"
              className="btn-premium px-8 py-6 text-base font-semibold"
              onClick={onAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  {getButtonText()}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              {getSubtext()}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AcademyHero;
