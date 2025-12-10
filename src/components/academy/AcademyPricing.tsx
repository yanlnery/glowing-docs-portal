import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';

interface AcademyPricingProps {
  onOpenWaitlistDialog: () => void;
}

const AcademyPricing: React.FC<AcademyPricingProps> = ({ onOpenWaitlistDialog }) => {
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

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Plano PSA One</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          Tudo o que você precisa em um único plano. Simples, completo e acessível.
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        <Card className="bg-serpente-50 dark:bg-serpente-900/20 border-serpente-200 dark:border-serpente-800 relative overflow-hidden">
          <div className="absolute top-0 right-0">
            <div className="bg-serpente-600 text-white text-xs px-4 py-1.5 rounded-bl-lg font-medium">
              Plano Único
            </div>
          </div>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">PSA One</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">R$ 17,90</span>
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
            <Button 
              className="w-full bg-serpente-600 hover:bg-serpente-700 py-6 text-lg" 
              onClick={onOpenWaitlistDialog}
            >
              Entrar para Lista de Espera
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AcademyPricing;
