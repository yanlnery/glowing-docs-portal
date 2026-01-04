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
  ShoppingCart, 
  BarChart, 
  Clock, 
  Monitor,
  Smartphone,
  Tablet,
  User
} from 'lucide-react';
import { PieChart as RechartsPie, Pie, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { cartAnalyticsService, CartAnalyticsEntry } from '@/services/cartAnalyticsService';
import { toast } from 'sonner';

const ShoppingCartAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<CartAnalyticsEntry[]>([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const [visitorFilter, setVisitorFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  useEffect(() => {
    loadAnalytics();
  }, []);
  
  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await cartAnalyticsService.getAllEntries();
      if (error) throw error;
      setAnalyticsData(data || []);
    } catch (error) {
      toast.error("Erro ao carregar dados de analytics");
      setAnalyticsData([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getFilteredData = () => {
    let data = analyticsData;
    
    // Time filter
    if (timeFilter !== 'all') {
      const cutoffDate = subDays(new Date(), parseInt(timeFilter));
      data = data.filter(entry => {
        try {
          return entry.created_at && isAfter(parseISO(entry.created_at), cutoffDate);
        } catch {
          return false;
        }
      });
    }
    
    // Visitor type filter
    if (visitorFilter === 'logged') {
      data = data.filter(entry => entry.user_email);
    } else if (visitorFilter === 'visitor') {
      data = data.filter(entry => !entry.user_email);
    }
    
    return data;
  };
  
  const filteredData = getFilteredData();
  
  // Device distribution for chart
  const deviceCounts = filteredData.reduce((acc: {[key: string]: number}, entry) => {
    const device = entry.device_type || 'Desconhecido';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});
  
  const deviceDistribution = Object.entries(deviceCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  // Calculate metrics
  const totalCartVisits = filteredData.filter(entry => entry.action === 'view_cart').length;
  const totalAddToCart = filteredData.filter(entry => entry.action === 'add_to_cart').length;
  const totalProducts = filteredData.reduce((sum, entry) => sum + (entry.item_count || 0), 0);
  
  // Get product names from items array
  const getProductName = (entry: CartAnalyticsEntry) => {
    if (entry.items && Array.isArray(entry.items) && entry.items.length > 0) {
      return entry.items.map((item: any) => item.name || 'Produto').join(', ');
    }
    return '-';
  };
  
  // Most viewed/accessed sessions
  const sessionCounts = filteredData
    .reduce((acc: {[key: string]: number}, entry) => {
      const sessionId = entry.session_id || 'unknown';
      acc[sessionId] = (acc[sessionId] || 0) + 1;
      return acc;
    }, {});
  
  const topSessions = Object.entries(sessionCounts)
    .map(([name, count]) => ({ name: name.substring(0, 12) + '...', count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Action distribution
  const actionCounts = filteredData
    .reduce((acc: {[key: string]: number}, entry) => {
      const action = entry.action || 'unknown';
      acc[action] = (acc[action] || 0) + 1;
      return acc;
    }, {});
  
  const actionDistribution = Object.entries(actionCounts)
    .map(([name, count]) => ({ 
      name: name === 'view_cart' ? 'Visualização' : 
            name === 'add_to_cart' ? 'Adição' : name, 
      count 
    }))
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
          
          <div className="flex flex-wrap justify-end gap-3">
            <Select
              value={visitorFilter}
              onValueChange={setVisitorFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de visitante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="logged">Usuários logados</SelectItem>
                <SelectItem value="visitor">Visitantes</SelectItem>
              </SelectContent>
            </Select>
            
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
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCartVisits}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Adições ao Carrinho</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Device Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Dispositivos</CardTitle>
                <CardDescription>Distribuição por tipo de dispositivo</CardDescription>
              </CardHeader>
              <CardContent>
                {deviceDistribution.length > 0 ? (
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={deviceDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {deviceDistribution.map((entry, index) => (
                            <Cell key={`cell-device-${index}`} fill={COLORS[index % COLORS.length]} />
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
            
            {/* Actions Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Ações</CardTitle>
                <CardDescription>Tipos de interações no carrinho</CardDescription>
              </CardHeader>
              <CardContent>
                {actionDistribution.length > 0 ? (
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={actionDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {actionDistribution.map((entry, index) => (
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
            
            {/* Sessions Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sessões Mais Ativas</CardTitle>
                <CardDescription>Top 5 sessões com mais interações</CardDescription>
              </CardHeader>
              <CardContent>
                {topSessions.length > 0 ? (
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBar
                        data={topSessions}
                        margin={{ top: 5, right: 20, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Interações" />
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
                        <TableHead>Itens</TableHead>
                        <TableHead>Qtd</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead>Cliente</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.slice(0, 10).map((entry, index) => {
                        const DeviceIcon = entry.device_type === 'Mobile' ? Smartphone : 
                                          entry.device_type === 'Tablet' ? Tablet : Monitor;
                        
                        return (
                          <TableRow key={entry.id || index}>
                            <TableCell>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                {entry.created_at ? formatDateTime(entry.created_at) : '-'}
                              </div>
                            </TableCell>
                            <TableCell>{
                              entry.action === 'add_to_cart' ? 'Adição ao Carrinho' :
                              entry.action === 'remove_from_cart' ? 'Remoção do Carrinho' :
                              entry.action === 'update_quantity' ? 'Atualização de Quantidade' :
                              entry.action === 'view_cart' ? 'Visualização do Carrinho' :
                              entry.action
                            }</TableCell>
                            <TableCell>{getProductName(entry)}</TableCell>
                            <TableCell>{entry.item_count || '-'}</TableCell>
                            <TableCell>{entry.total_value ? formatPrice(entry.total_value) : '-'}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {entry.user_email ? (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3 text-primary" />
                                    <span className="text-xs font-medium">{entry.user_email}</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground">Visitante</span>
                                )}
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <DeviceIcon className="h-3 w-3" />
                                  {entry.browser && (
                                    <span className="text-[10px]">{entry.browser}</span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
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
