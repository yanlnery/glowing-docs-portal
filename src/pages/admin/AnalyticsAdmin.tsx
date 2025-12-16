import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart,
  DollarSign,
  Package,
  Calendar,
  Eye,
  Download
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AnalyticsAdmin() {
  const [cartAnalytics, setCartAnalytics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    
    try {
      // Buscar dados de analytics do banco de dados (requer admin)
      const { data, error } = await supabase
        .from('cart_analytics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar analytics:', error);
        setCartAnalytics([]);
      } else {
        // Transform database format to expected format
        const transformedData = (data || []).map(item => ({
          timestamp: item.created_at,
          action: item.action,
          productId: item.items?.[0]?.id,
          productName: item.items?.[0]?.name,
          price: item.items?.[0]?.price || 0,
          itemCount: item.item_count,
          totalValue: item.total_value
        }));
        setCartAnalytics(transformedData);
      }
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
      setCartAnalytics([]);
    }
    
    setIsLoading(false);
  };

  const processAnalyticsData = () => {
    if (!cartAnalytics.length) return null;

    // Agrupar por data
    const dailyStats = cartAnalytics.reduce((acc, item) => {
      const date = new Date(item.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, views: 0, adds: 0, products: new Set() };
      }
      if (item.action === 'view_cart') acc[date].views++;
      if (item.action === 'add_to_cart') {
        acc[date].adds++;
        acc[date].products.add(item.productId);
      }
      return acc;
    }, {});

    // Converter para array
    const dailyData = Object.values(dailyStats).map((day: any) => ({
      ...day,
      uniqueProducts: day.products.size,
      products: undefined
    }));

    // Produtos mais adicionados
    const productStats = cartAnalytics
      .filter(item => item.action === 'add_to_cart' && item.productName)
      .reduce((acc, item) => {
        if (!acc[item.productName]) {
          acc[item.productName] = { name: item.productName, count: 0, price: item.price };
        }
        acc[item.productName].count++;
        return acc;
      }, {});

    const topProducts = Object.values(productStats)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);

    // Estatísticas gerais
    const totalViews = cartAnalytics.filter(item => item.action === 'view_cart').length;
    const totalAdds = cartAnalytics.filter(item => item.action === 'add_to_cart').length;
    const conversionRate = totalViews > 0 ? (totalAdds / totalViews * 100).toFixed(1) : '0';
    const uniqueProducts = new Set(cartAnalytics.filter(item => item.productId).map(item => item.productId)).size;

    return {
      dailyData,
      topProducts,
      totalViews,
      totalAdds,
      conversionRate,
      uniqueProducts
    };
  };

  const analytics = processAnalyticsData();

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando dados de analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics e Relatórios</h1>
        <p className="text-muted-foreground">
          Análise detalhada do comportamento dos usuários no carrinho de compras
        </p>
      </div>

      {!analytics || cartAnalytics.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum dado de analytics disponível</h3>
            <p className="text-muted-foreground">
              Os dados de analytics do carrinho aparecerão aqui quando os usuários começarem a interagir com a loja.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Métricas Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visualizações do Carrinho</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalViews}</div>
                <p className="text-xs text-muted-foreground">
                  Total de visualizações
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos Adicionados</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalAdds}</div>
                <p className="text-xs text-muted-foreground">
                  Total de adições ao carrinho
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Adições por visualização
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos Únicos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.uniqueProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Produtos diferentes adicionados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Atividade Diária */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Atividade Diária
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" name="Visualizações" />
                  <Bar dataKey="adds" fill="#82ca9d" name="Adições" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Produtos Mais Populares */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Adicionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topProducts.map((product: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.price > 0 ? `R$ ${product.price.toFixed(2)}` : 'Sob consulta'}
                        </p>
                      </div>
                      <Badge variant="secondary">{product.count} adições</Badge>
                    </div>
                  ))}
                  {analytics.topProducts.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Nenhum produto foi adicionado ainda
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.topProducts.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.topProducts}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, count }) => `${name} (${count})`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.topProducts.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">Dados insuficientes para o gráfico</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Insights e Recomendações */}
          <Card>
            <CardHeader>
              <CardTitle>Insights e Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    Taxa de Conversão
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {Number(analytics.conversionRate) > 20 
                      ? "Excelente! Sua taxa de conversão está acima da média."
                      : Number(analytics.conversionRate) > 10
                      ? "Boa taxa de conversão. Considere otimizar o processo de checkout."
                      : "Taxa de conversão baixa. Analise possíveis melhorias na experiência do usuário."
                    }
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                    Produtos Populares
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    {analytics.topProducts.length > 0
                      ? `O produto "${(analytics.topProducts[0] as any).name}" está se destacando com ${(analytics.topProducts[0] as any).count} adições.`
                      : "Ainda não há dados suficientes sobre produtos populares."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}