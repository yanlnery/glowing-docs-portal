
import React from 'react';
import { Button } from '@/components/ui/button';

interface AcademyCTAProps {
  onOpenWaitlistDialog: () => void;
}

const AcademyCTA: React.FC<AcademyCTAProps> = ({ onOpenWaitlistDialog }) => {
  return (
    <div className="bg-serpente-100 dark:bg-serpente-900/20 rounded-2xl p-8 md:p-12 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Pronto para fazer parte da comunidade?</h2>
      <p className="max-w-2xl mx-auto mb-8 text-muted-foreground text-lg">
        Junte-se a centenas de criadores apaixonados e tenha acesso ao melhor conteúdo sobre herpecultura. Vagas limitadas!
      </p>
      <Button
        size="lg"
        className="bg-serpente-600 hover:bg-serpente-700 px-10 py-6 text-lg"
        onClick={onOpenWaitlistDialog}
      >
        Quero fazer parte
      </Button>
    </div>
  );
};

export default AcademyCTA;
