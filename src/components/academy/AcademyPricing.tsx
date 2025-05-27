
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
  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Planos de Assinatura</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          Escolha o plano que melhor atende às suas necessidades e objetivos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Premium Plan */}
        <Card className="bg-white dark:bg-gray-800 border-serpente-200 dark:border-serpente-800">
          <CardHeader>
            <CardTitle>Plano Premium</CardTitle>
            <div className="mt-4">
              <span className="text-3xl font-bold">R$9,90</span>
              <span className="text-muted-foreground ml-1">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Acesso a todos os cursos básicos</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Comunidade de discussão</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Certificados de conclusão</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Atualizações de conteúdo</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={onOpenWaitlistDialog}>
              Entrar para Lista de Espera
            </Button>
          </CardFooter>
        </Card>

        {/* Professional Plan */}
        <Card className="bg-serpente-50 dark:bg-serpente-900/10 border-serpente-200 dark:border-serpente-800 relative overflow-hidden">
          <div className="absolute top-0 right-0">
            <div className="bg-serpente-600 text-white text-xs px-3 py-1 rotate-45 translate-x-2 translate-y-3">
              Popular
            </div>
          </div>
          <CardHeader>
            <CardTitle>Plano Professional</CardTitle>
            <div className="mt-4">
              <span className="text-3xl font-bold">R$17,90</span>
              <span className="text-muted-foreground ml-1">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Tudo do Plano Premium</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Cursos avançados e especializados</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Mentorias com especialistas mensais</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Downloads de materiais exclusivos</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Acesso antecipado a novos conteúdos</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-serpente-600 hover:bg-serpente-700"
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
