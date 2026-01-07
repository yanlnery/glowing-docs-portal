import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check, Loader2, Settings } from 'lucide-react';

interface AcademyPricingProps {
  onAction: () => void;
  isLoading?: boolean;
  hasAccess?: boolean;
  onManageSubscription?: () => void;
  isOpenForSubscription?: boolean;
}

const AcademyPricing: React.FC<AcademyPricingProps> = ({ 
  onAction, 
  isLoading, 
  hasAccess,
  onManageSubscription,
  isOpenForSubscription
}) => {
  const benefits = [
    'Acesso a todos os cursos de herpecultura',
    'Comunidade exclusiva de discussão',
    'Certificados de conclusão',
    'Atualizações de conteúdo',
    'Mentorias com especialistas',
    'Download de materiais exclusivos',
    'Acesso antecipado a novos conteúdos',
    'Acesso antecipado ao plantel',
    'Preferência na compra de animais',
  ];

  const getButtonText = () => {
    if (isLoading) return 'Carregando...';
    if (isOpenForSubscription) return 'Assinar Agora';
    return 'Entrar para Lista de Espera';
  };

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Plano PSA One</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          Tudo o que você precisa em um único plano. Simples, completo e acessível.
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        <Card className={`bg-serpente-50 dark:bg-serpente-900/20 border-serpente-200 dark:border-serpente-800 relative overflow-hidden ${hasAccess ? 'ring-2 ring-serpente-500' : ''}`}>
          <div className="absolute top-0 right-0">
            <div className="bg-serpente-600 text-white text-xs px-4 py-1.5 rounded-bl-lg font-medium">
              {hasAccess ? 'Seu Plano' : 'Plano Único'}
            </div>
          </div>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">PSA One</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">R$ 27,90</span>
              <span className="text-muted-foreground ml-1">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="pt-4">
            {hasAccess ? (
              <Button 
                className="w-full py-6 text-lg font-semibold" 
                variant="outline"
                onClick={onManageSubscription}
              >
                <Settings className="mr-2 h-5 w-5" />
                Gerenciar Assinatura
              </Button>
            ) : (
              <Button 
                className="w-full btn-premium py-6 text-lg font-semibold" 
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
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AcademyPricing;
