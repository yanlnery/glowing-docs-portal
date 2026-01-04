import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShoppingCart, TrendingUp, Package } from 'lucide-react';

interface ProductStats {
  id: string;
  name: string;
  addedCount: number;
  abandonedCount: number;
}

interface CartSizeDistribution {
  size: string;
  count: number;
}

interface CartAnalysisProps {
  data: {
    topAddedProducts: ProductStats[];
    topAbandonedProducts: ProductStats[];
    cartSizeDistribution: CartSizeDistribution[];
    avgTimeToCheckout: number; // in minutes
  };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const CartAnalysis: React.FC<CartAnalysisProps> = ({ data }) => {
  const formatTime = (minutes: number): string => {
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
  };

  return (
    <div className="space-y-6">
      {/* Cart Size Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Distribuição de Carrinhos
          </CardTitle>
          <CardDescription>
            Quantidade de itens por carrinho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.cartSizeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="size"
                    label={({ size, count }) => `${size}: ${count}`}
                  >
                    {data.cartSizeDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {data.cartSizeDistribution.map((item, index) => {
                const total = data.cartSizeDistribution.reduce((sum, i) => sum + i.count, 0);
                const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
                
                return (
                  <div 
                    key={item.size}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium">{item.size}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{item.count}</span>
                      <span className="text-xs text-muted-foreground ml-1">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Average Time to Checkout */}
          {data.avgTimeToCheckout > 0 && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-700 dark:text-blue-400">
                  Tempo Médio até Checkout: {formatTime(data.avgTimeToCheckout)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Added Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Package className="h-5 w-5" />
              Mais Adicionados
            </CardTitle>
            <CardDescription>
              Produtos mais populares no carrinho
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.topAddedProducts.length > 0 ? (
              <div className="space-y-3">
                {data.topAddedProducts.slice(0, 5).map((product, index) => (
                  <div 
                    key={product.id}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium truncate max-w-[180px]" title={product.name}>
                        {product.name}
                      </span>
                    </div>
                    <span className="font-bold text-green-600">{product.addedCount}x</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Nenhum dado disponível
              </p>
            )}
          </CardContent>
        </Card>

        {/* Most Abandoned Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Package className="h-5 w-5" />
              Mais Abandonados
            </CardTitle>
            <CardDescription>
              Produtos que ficam no carrinho sem conversão
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.topAbandonedProducts.length > 0 ? (
              <div className="space-y-3">
                {data.topAbandonedProducts.slice(0, 5).map((product, index) => (
                  <div 
                    key={product.id}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium truncate max-w-[180px]" title={product.name}>
                        {product.name}
                      </span>
                    </div>
                    <span className="font-bold text-red-600">{product.abandonedCount}x</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Nenhum dado disponível
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
