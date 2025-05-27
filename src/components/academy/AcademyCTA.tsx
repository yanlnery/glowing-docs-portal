
import React from 'react';
import { Button } from '@/components/ui/button';

interface AcademyCTAProps {
  onOpenWaitlistDialog: () => void;
}

const AcademyCTA: React.FC<AcademyCTAProps> = ({ onOpenWaitlistDialog }) => {
  return (
    <div className="bg-serpente-100 dark:bg-serpente-900/20 rounded-2xl p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Pronto para elevar seus conhecimentos?</h2>
      <p className="max-w-2xl mx-auto mb-6 text-muted-foreground">
        Junte-se à nossa lista de espera e seja o primeiro a saber quando as matrículas estiverem abertas. Vagas limitadas!
      </p>
      <Button
        size="lg"
        className="bg-serpente-600 hover:bg-serpente-700"
        onClick={onOpenWaitlistDialog}
      >
        Entrar para Lista de Espera
      </Button>
    </div>
  );
};

export default AcademyCTA;
