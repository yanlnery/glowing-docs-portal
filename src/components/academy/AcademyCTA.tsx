import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AcademyCTAProps {
  onAction: () => void;
  isLoading?: boolean;
  isOpenForSubscription?: boolean;
}

const AcademyCTA: React.FC<AcademyCTAProps> = ({ onAction, isLoading, isOpenForSubscription }) => {
  const getButtonText = () => {
    if (isLoading) return 'Carregando...';
    if (isOpenForSubscription) return 'Começar Agora - R$17,90/mês';
    return 'Entrar para Lista de Espera';
  };

  const getDescription = () => {
    if (isOpenForSubscription) {
      return 'Junte-se a centenas de criadores apaixonados e tenha acesso ao melhor conteúdo sobre herpecultura. Cancele quando quiser!';
    }
    return 'Junte-se a centenas de criadores apaixonados e tenha acesso ao melhor conteúdo sobre herpecultura. Vagas limitadas!';
  };

  return (
    <div className="bg-serpente-100 dark:bg-serpente-900/20 rounded-2xl p-8 md:p-12 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Pronto para fazer parte da comunidade?</h2>
      <p className="max-w-2xl mx-auto mb-8 text-muted-foreground text-lg">
        {getDescription()}
      </p>
      <Button
        size="lg"
        className="btn-premium px-12 py-7 text-lg font-semibold"
        onClick={onAction}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Carregando...
          </>
        ) : (
          getButtonText()
        )}
      </Button>
    </div>
  );
};

export default AcademyCTA;
