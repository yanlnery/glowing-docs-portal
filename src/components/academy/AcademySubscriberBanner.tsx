import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Settings } from 'lucide-react';

interface AcademySubscriberBannerProps {
  subscriptionEnd: string | null;
  onManageSubscription: () => void;
}

const AcademySubscriberBanner: React.FC<AcademySubscriberBannerProps> = ({
  subscriptionEnd,
  onManageSubscription,
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="mb-8 p-4 bg-gradient-to-r from-serpente-500 to-serpente-600 rounded-lg text-white flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Crown className="h-6 w-6" />
        <div>
          <p className="font-semibold">Você é assinante da PS Academy!</p>
          <p className="text-sm opacity-90">
            Acesso válido até {formatDate(subscriptionEnd)}
          </p>
        </div>
      </div>
      <Button 
        variant="outline" 
        className="bg-white/10 border-white/30 hover:bg-white/20 text-white"
        onClick={onManageSubscription}
      >
        <Settings className="h-4 w-4 mr-2" />
        Gerenciar Assinatura
      </Button>
    </div>
  );
};

export default AcademySubscriberBanner;
