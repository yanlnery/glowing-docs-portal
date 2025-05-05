
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CircleDollarSign, Package, ShoppingCart, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [productStats, setProductStats] = useState({
    total: 0,
    available: 0,
    unavailable: 0,
    sold: 0
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get products and calculate stats
    const products = productService.getAll();
    setProductStats({
      total: products.length,
      available: products.filter(p => p.status === 'disponivel').length,
      unavailable: products.filter(p => p.status === 'indisponivel').length,
      sold: products.filter(p => p.status === 'vendido').length
    });
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button asChild>
            <Link to="/admin/products/new">Adicionar Produto</Link>
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Produtos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{productStats.total}</div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{productStats.available}</div>
                <CircleDollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{productStats.sold}</div>
                <ShoppingCart className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Indisponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{productStats.unavailable}</div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Button asChild variant="outline" className="h-24 flex flex-col">
              <Link to="/admin/products" className="space-y-2">
                <Package className="h-6 w-6" />
                <span>Gerenciar Produtos</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex flex-col">
              <Link to="/admin/products?status=disponivel" className="space-y-2">
                <CircleDollarSign className="h-6 w-6" />
                <span>Ver Disponíveis</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex flex-col">
              <Link to="/admin/settings" className="space-y-2">
                <Settings className="h-6 w-6" />
                <span>Configurações</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
