
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { productService } from '@/services/productService';
import { Product, ProductStatus } from '@/types/product';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, DollarSign, BarChart as BarChartIcon, Settings as SettingsIcon } from 'lucide-react';

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [statsData, setStatsData] = useState({
    total: 0,
    available: 0,
    unavailable: 0,
    sold: 0
  });

  useEffect(() => {
    // Fetch products for the dashboard
    const allProducts = productService.getAll();
    setProducts(allProducts);
    
    // Calculate stats
    const available = allProducts.filter(p => p.status === 'disponivel').length;
    const unavailable = allProducts.filter(p => p.status === 'indisponivel').length;
    const sold = allProducts.filter(p => p.status === 'vendido').length;
    
    setStatsData({
      total: allProducts.length,
      available,
      unavailable,
      sold
    });
  }, []);

  // Generate data for charts
  const generateCategoryData = () => {
    const categoryMap: Record<string, number> = {};
    
    products.forEach(product => {
      if (categoryMap[product.category]) {
        categoryMap[product.category]++;
      } else {
        categoryMap[product.category] = 1;
      }
    });
    
    return Object.keys(categoryMap).map(category => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      quantidade: categoryMap[category]
    }));
  };

  const generateStatusData = () => {
    const statusMap: Record<string, number> = {};
    
    products.forEach(product => {
      if (statusMap[product.status]) {
        statusMap[product.status]++;
      } else {
        statusMap[product.status] = 1;
      }
    });
    
    return Object.keys(statusMap).map(status => {
      let label = status;
      if (status === 'disponivel') label = 'Disponível';
      if (status === 'indisponivel') label = 'Indisponível';
      if (status === 'vendido') label = 'Vendido';
      
      return {
        name: label,
        quantidade: statusMap[status]
      };
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Link to="/admin/products" className="bg-serpente-600 hover:bg-serpente-700 text-white font-medium px-4 py-2 rounded-lg flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Ver Produtos
            </Link>
            <Link to="/admin/settings" className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg flex items-center">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Configurações
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Animais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statsData.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{statsData.available}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{statsData.sold}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="categories">
          <TabsList>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>
          <TabsContent value="categories" className="p-4 bg-white rounded-lg border mt-2">
            <h3 className="text-lg font-medium mb-4">Distribuição por Categorias</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={generateCategoryData()}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantidade" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="status" className="p-4 bg-white rounded-lg border mt-2">
            <h3 className="text-lg font-medium mb-4">Distribuição por Status</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={generateStatusData()}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantidade" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
