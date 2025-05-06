
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO, subDays, isAfter } from 'date-fns';
import { 
  CartIcon, 
  BarChart, 
  PieChart, 
  LineChart, 
  Calendar, 
  Clock, 
  ExternalLink
} from 'lucide-react';
import { PieChart as RechartsPie, Pie, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Define types for analytics data
interface CartAnalyticsEntry {
  timestamp: string;
  action: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  referrer: string;
}

const ShoppingCartAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<CartAnalyticsEntry[]>([]);
  const [timeFilter, setTimeFilter] = useState('all');
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  useEffect(() => {
    loadAnalytics();
  }, []);
  
  const loadAnalytics = () => {
    try {
      const data = JSON.parse(localStorage.getItem('cartAnalytics') || '[]') as CartAnalyticsEntry[];
      setAnalyticsData(data);
    } catch (error) {
      console.error("Failed to load cart analytics:", error);
      setAnalyticsData([]);
    }
  };
  
  const getFilteredData = () => {
    if (timeFilter === 'all') {
      return analyticsData;
    }
    
    const cutoffDate = subDays(new Date(), parseInt(timeFilter));
    return analyticsData.filter(entry => {
      try {
        return isAfter(parseISO(entry.timestamp), cutoffDate);
      } catch {
        return false;
      }
    });
  };
  
  const filteredData = getFilteredData();
  
  // Calculate metrics
  const totalCartVisits = filteredData.filter(entry => entry.action === 'view_cart').length;
  const totalAddToCart = filteredData.filter(entry => entry.action === 'add_to_cart').length;
  const totalProducts = filteredData.filter(entry => entry.action === 'add_to_cart')
    .reduce((sum, entry) => sum + entry.quantity, 0);
  
  // Most added products
  const productCounts = filteredData
    .filter(entry => entry.action === 'add_to_cart')
    .reduce((acc: {[key: string]: number}, entry) => {
      const productName = entry.productName || 'Unknown Product';
      acc[productName] = (acc[productName] || 0) + entry.quantity;
      return acc;
    }, {});
  
  const topProducts = Object.entries(productCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Referrers
  const referrerCounts = filteredData
    .reduce((acc: {[key: string]: number}, entry) => {
      const referrer = entry.referrer || 'direct';
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {});
  
  const topReferrers = Object.entries(referrerCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Format date for display
  const formatDateTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy HH:mm:ss');
    } catch {
      return dateString;
    }
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <AdminLayout requiredRole="admin">
      <div className="p-6">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Análise do Carrinho de Compras</h1>
            <p className="text-muted-foreground">
              Monitore o comportamento dos usuários e as interações com o carrinho de compras
            </p>
          </div>
          
          <div className="flex justify-end">
            <Select
              value={timeFilter}
              onValueChange={setTimeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo o período</SelectItem>
                <SelectItem value="1">Últimas 24 horas</SelectItem>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visualizações do Carrinho</CardTitle>
                <CartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCartVisits}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Adições ao Carrinho</CardTitle>
                <CartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAddToCart}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Products Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Adicionados</CardTitle>
                <CardDescription>Top 5 produtos adicionados ao carrinho</CardDescription>
              </CardHeader>
              <CardContent>
                {topProducts.length > 0 ? (
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBar
                        data={topProducts}
                        margin={{ top: 5, right: 20, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Quantidade" />
                      </RechartsBar>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-[300px] bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">Sem dados suficientes</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Referrers Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Fontes de Tráfego</CardTitle>
                <CardDescription>De onde os usuários chegam ao carrinho</CardDescription>
              </CardHeader>
              <CardContent>
                {topReferrers.length > 0 ? (
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={topReferrers}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {topReferrers.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-[300px] bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">Sem dados suficientes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>Últimas interações com o carrinho</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredData.length === 0 ? (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Nenhuma atividade registrada no período selecionado.</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Origem</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.slice(0, 10).map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              {formatDateTime(entry.timestamp)}
                            </div>
                          </TableCell>
                          <TableCell>{
                            entry.action === 'add_to_cart' ? 'Adição ao Carrinho' :
                            entry.action === 'remove_from_cart' ? 'Remoção do Carrinho' :
                            entry.action === 'update_quantity' ? 'Atualização de Quantidade' :
                            entry.action === 'view_cart' ? 'Visualização do Carrinho' :
                            entry.action
                          }</TableCell>
                          <TableCell>{entry.productName || '-'}</TableCell>
                          <TableCell>{entry.quantity || '-'}</TableCell>
                          <TableCell>{entry.price ? formatPrice(entry.price) : '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <ExternalLink className="h-4 w-4 mr-1 text-muted-foreground" />
                              {entry.referrer || 'Acesso direto'}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ShoppingCartAnalytics;
