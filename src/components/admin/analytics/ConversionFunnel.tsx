import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface FunnelStep {
  name: string;
  value: number;
  color: string;
}

interface ConversionFunnelProps {
  data: {
    sessions: number;
    productViews: number;
    addToCart: number;
    checkoutStarts: number;
    whatsappRedirects: number;
  };
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ data }) => {
  const steps: FunnelStep[] = [
    { name: 'Sessões', value: data.sessions, color: 'bg-blue-500' },
    { name: 'Produto Visualizado', value: data.productViews, color: 'bg-indigo-500' },
    { name: 'Adicionou ao Carrinho', value: data.addToCart, color: 'bg-purple-500' },
    { name: 'Iniciou Checkout', value: data.checkoutStarts, color: 'bg-pink-500' },
    { name: 'WhatsApp', value: data.whatsappRedirects, color: 'bg-green-500' },
  ];

  const maxValue = Math.max(...steps.map(s => s.value), 1);

  const calculateDropRate = (current: number, previous: number): string => {
    if (previous === 0) return '0';
    const dropRate = ((previous - current) / previous) * 100;
    return dropRate.toFixed(1);
  };

  const calculateAdvanceRate = (current: number, previous: number): string => {
    if (previous === 0) return '0';
    const advanceRate = (current / previous) * 100;
    return advanceRate.toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Funil de Conversão</CardTitle>
            <CardDescription>
              Acompanhe a jornada do cliente desde a sessão até a conversão
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>O funil mostra quantos usuários passam por cada etapa. A taxa de avanço indica quantos seguem para a próxima etapa. A taxa de queda mostra quantos abandonam.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const widthPercent = (step.value / maxValue) * 100;
            const previousStep = index > 0 ? steps[index - 1] : null;
            const advanceRate = previousStep ? calculateAdvanceRate(step.value, previousStep.value) : '100';
            const dropRate = previousStep ? calculateDropRate(step.value, previousStep.value) : '0';

            return (
              <div key={step.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{step.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">{step.value.toLocaleString('pt-BR')}</span>
                    {previousStep && (
                      <div className="flex gap-2 text-xs">
                        <span className="text-green-600">↑ {advanceRate}%</span>
                        <span className="text-red-600">↓ {dropRate}%</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${step.color} transition-all duration-500 flex items-center justify-end pr-2`}
                    style={{ width: `${Math.max(widthPercent, 2)}%` }}
                  >
                    {widthPercent > 15 && (
                      <span className="text-white text-xs font-medium">
                        {widthPercent.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Conversão Total</p>
              <p className="text-2xl font-bold text-green-600">
                {data.sessions > 0 
                  ? ((data.whatsappRedirects / data.sessions) * 100).toFixed(1)
                  : '0'}%
              </p>
              <p className="text-xs text-muted-foreground">Sessão → WhatsApp</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Maior Queda</p>
              <p className="text-2xl font-bold text-red-600">
                {(() => {
                  let maxDrop = 0;
                  let maxDropStep = '';
                  for (let i = 1; i < steps.length; i++) {
                    if (steps[i - 1].value > 0) {
                      const drop = ((steps[i - 1].value - steps[i].value) / steps[i - 1].value) * 100;
                      if (drop > maxDrop) {
                        maxDrop = drop;
                        maxDropStep = steps[i].name;
                      }
                    }
                  }
                  return `${maxDrop.toFixed(0)}%`;
                })()}
              </p>
              <p className="text-xs text-muted-foreground">
                {(() => {
                  let maxDrop = 0;
                  let maxDropStep = '';
                  for (let i = 1; i < steps.length; i++) {
                    if (steps[i - 1].value > 0) {
                      const drop = ((steps[i - 1].value - steps[i].value) / steps[i - 1].value) * 100;
                      if (drop > maxDrop) {
                        maxDrop = drop;
                        maxDropStep = `${steps[i - 1].name} → ${steps[i].name}`;
                      }
                    }
                  }
                  return maxDropStep || 'N/A';
                })()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
