import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Package, 
  Users, 
  MessageCircle,
  DollarSign,
  ShoppingCart,
  BarChart3,
  PieChart
} from "lucide-react";
import { orderService } from "@/services/orderService";
import { contactService } from "@/services/contactService";
import { productService } from "@/services/productService";
import { Link } from 'react-router-dom';

export default function DashboardAdmin() {
  const [salesStats, setSalesStats] = useState<any>(null);
  const [messageStats, setMessageStats] = useState<any>(null);
  const [productStats, setProductStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    try {
      // Buscar estatísticas de vendas
      const { data: sales } = await orderService.getSalesStats();
      setSalesStats(sales);

      // Buscar estatísticas de mensagens
      const { data: messages } = await contactService.getMessageStats();
      setMessageStats(messages);

      // Buscar estatísticas de produtos
      const products = await productService.getAll();
      if (products) {
        const stats = {
          total: products.length,
          available: products.filter(p => p.available).length,
          featured: products.filter(p => p.featured).length,
          outOfStock: products.filter(p => !p.available).length
        };
        setProductStats(stats);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
    
    setIsLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral das principais métricas da loja
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {salesStats ? formatPrice(salesStats.totalSales) : 'R$ 0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              {salesStats ? `${salesStats.totalOrders} pedidos` : '0 pedidos'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {salesStats ? salesStats.pendingOrders : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando processamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Disponíveis</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productStats ? productStats.available : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {productStats ? `${productStats.total} produtos cadastrados` : '0 produtos'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens Novas</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messageStats ? messageStats.new : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {messageStats ? `${messageStats.total} mensagens totais` : '0 mensagens'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Receita Mensal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Receita do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {salesStats ? formatPrice(salesStats.monthlyRevenue) : 'R$ 0,00'}
            </div>
            <p className="text-muted-foreground">
              Receita gerada no mês atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Status dos Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Pendentes</span>
                <span className="font-medium">{salesStats ? salesStats.pendingOrders : 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Entregues</span>
                <span className="font-medium">{salesStats ? salesStats.completedOrders : 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total</span>
                <span className="font-medium">{salesStats ? salesStats.totalOrders : 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild className="h-auto p-4 flex flex-col items-center space-y-2">
              <Link to="/admin/orders">
                <ShoppingCart className="h-6 w-6" />
                <span>Gerenciar Pedidos</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Link to="/admin/products">
                <Package className="h-6 w-6" />
                <span>Gerenciar Produtos</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Link to="/admin/contact">
                <MessageCircle className="h-6 w-6" />
                <span>Ver Mensagens</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Link to="/admin/settings">
                <PieChart className="h-6 w-6" />
                <span>Configurações</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alertas e Notificações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Produtos em Destaque</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {productStats ? productStats.featured : 0}
            </p>
            <p className="text-muted-foreground">
              Produtos marcados como destaque
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos Indisponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {productStats ? productStats.outOfStock : 0}
            </p>
            <p className="text-muted-foreground">
              Produtos fora de estoque
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}