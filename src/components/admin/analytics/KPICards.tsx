import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Eye, 
  ShoppingCart, 
  CreditCard, 
  MessageCircle, 
  TrendingUp, 
  TrendingDown,
  Percent,
  XCircle
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  tooltip: string;
  format?: 'number' | 'percent' | 'currency';
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  change, 
  changeLabel,
  icon: Icon, 
  tooltip,
}) => {
  const isPositiveChange = change !== undefined && change >= 0;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="hover:shadow-md transition-shadow cursor-help">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{title}</p>
                  <p className="text-2xl font-bold mt-1">{value}</p>
                  {change !== undefined && (
                    <div className={`flex items-center mt-1 text-sm ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositiveChange ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span>{isPositiveChange ? '+' : ''}{change.toFixed(1)}%</span>
                      {changeLabel && <span className="text-muted-foreground ml-1">{changeLabel}</span>}
                    </div>
                  )}
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface KPICardsProps {
  data: {
    totalSessions: number;
    uniqueUsers: number;
    productViews: number;
    addToCart: number;
    checkoutStarts: number;
    whatsappRedirects: number;
    conversionRate: number;
    cartConversionRate: number;
    cartAbandonmentRate: number;
  };
  previousData?: {
    totalSessions: number;
    uniqueUsers: number;
    productViews: number;
    addToCart: number;
    checkoutStarts: number;
    whatsappRedirects: number;
  };
}

export const KPICards: React.FC<KPICardsProps> = ({ data, previousData }) => {
  const calculateChange = (current: number, previous?: number): number | undefined => {
    if (previous === undefined || previous === 0) return undefined;
    return ((current - previous) / previous) * 100;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const kpis = [
    {
      title: 'Sessões Totais',
      value: formatNumber(data.totalSessions),
      change: calculateChange(data.totalSessions, previousData?.totalSessions),
      icon: Users,
      tooltip: 'Número total de sessões únicas no período selecionado. Uma sessão representa uma visita ao site.',
    },
    {
      title: 'Usuários Únicos',
      value: formatNumber(data.uniqueUsers),
      change: calculateChange(data.uniqueUsers, previousData?.uniqueUsers),
      icon: Users,
      tooltip: 'Número de usuários logados únicos que visitaram o site no período.',
    },
    {
      title: 'Visualizações de Produto',
      value: formatNumber(data.productViews),
      change: calculateChange(data.productViews, previousData?.productViews),
      icon: Eye,
      tooltip: 'Quantas vezes as páginas de produto foram visualizadas.',
    },
    {
      title: 'Adições ao Carrinho',
      value: formatNumber(data.addToCart),
      change: calculateChange(data.addToCart, previousData?.addToCart),
      icon: ShoppingCart,
      tooltip: 'Número de produtos adicionados ao carrinho.',
    },
    {
      title: 'Inícios de Checkout',
      value: formatNumber(data.checkoutStarts),
      change: calculateChange(data.checkoutStarts, previousData?.checkoutStarts),
      icon: CreditCard,
      tooltip: 'Quantas vezes o formulário de checkout foi iniciado.',
    },
    {
      title: 'Redirecionamentos WhatsApp',
      value: formatNumber(data.whatsappRedirects),
      change: calculateChange(data.whatsappRedirects, previousData?.whatsappRedirects),
      icon: MessageCircle,
      tooltip: 'Número de pedidos que foram redirecionados para o WhatsApp.',
    },
    {
      title: 'Taxa de Conversão',
      value: `${data.conversionRate.toFixed(1)}%`,
      icon: Percent,
      tooltip: 'Porcentagem de sessões que resultaram em redirecionamento para WhatsApp. Fórmula: (WhatsApp / Sessões) × 100',
    },
    {
      title: 'Conversão do Carrinho',
      value: `${data.cartConversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      tooltip: 'Porcentagem de adições ao carrinho que resultaram em checkout. Fórmula: (Checkout / Adições ao Carrinho) × 100',
    },
    {
      title: 'Abandono de Carrinho',
      value: `${data.cartAbandonmentRate.toFixed(1)}%`,
      icon: XCircle,
      tooltip: 'Porcentagem de carrinhos que não completaram o checkout. Fórmula: (1 - Conversão do Carrinho) × 100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <KPICard
          key={kpi.title}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          icon={kpi.icon}
          tooltip={kpi.tooltip}
        />
      ))}
    </div>
  );
};
