
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid 
} from 'recharts';
import { ShoppingCart, Users, CreditCard, Activity } from 'lucide-react';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { pt } from 'date-fns/locale';

type ProductAnalytics = {
  productId: string;
  productName: string;
  views: number;
  addedToCart: number;
  purchased: number;
};

type CartActivity = {
  timestamp: string;
  action: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  referrer: string;
};

type CheckoutData = {
  timestamp: string;
  paymentMethod: 'credit-card' | 'pix';
  totalAmount: number;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
};

const ShoppingCartAnalytics = () => {
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics[]>([]);
  const [cartActivities, setCartActivities] = useState<CartActivity[]>([]);
  const [checkouts, setCheckouts] = useState<CheckoutData[]>([]);
  
  const [visitCount, setVisitCount] = useState(0);
  const [addToCartCount, setAddToCartCount] = useState(0);
  const [checkoutCount, setCheckoutCount] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  
  // Generate daily analytics data for the past 7 days
  const [dailyData, setDailyData] = useState<any[]>([]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // In a real app, this would fetch data from your API
    // For now, we'll generate mock data or use localStorage data
    
    // Try to get actual cart analytics from localStorage
    const storedAnalytics = localStorage.getItem('cartAnalytics');
    const parsedAnalytics = storedAnalytics ? JSON.parse(storedAnalytics) : [];
    
    // If we have real data, use it - otherwise generate mock data
    if (parsedAnalytics.length > 0) {
      setCartActivities(parsedAnalytics);
      
      // Extract checkouts from analytics data
      const checkoutData = parsedAnalytics.filter((item: any) => item.items);
      setCheckouts(checkoutData);
      
      // Generate product analytics from the cart activities
      const products: Record<string, ProductAnalytics> = {};
      
      parsedAnalytics.forEach((activity: CartActivity) => {
        if (!activity.productId || activity.productId === 'all') return;
        
        if (!products[activity.productId]) {
          products[activity.productId] = {
            productId: activity.productId,
            productName: activity.productName,
            views: 0,
            addedToCart: 0,
            purchased: 0
          };
        }
        
        if (activity.action === 'view_product') {
          products[activity.productId].views++;
        } else if (activity.action === 'add_to_cart') {
          products[activity.productId].addedToCart += activity.quantity;
        } else if (activity.action === 'checkout' || activity.action === 'purchase') {
          products[activity.productId].purchased += activity.quantity;
        }
      });
      
      setProductAnalytics(Object.values(products));
    } else {
      generateMockData();
    }
  }, []);
  
  // When we have cart activities, generate derived data
  useEffect(() => {
    if (cartActivities.length === 0) return;
    
    // Count metrics
    let views = 0;
    let adds = 0;
    
    cartActivities.forEach(activity => {
      if (activity.action === 'view_product') views++;
      if (activity.action === 'add_to_cart') adds++;
    });
    
    setVisitCount(views);
    setAddToCartCount(adds);
    setCheckoutCount(checkouts.length);
    
    // Calculate conversion rate (checkout / view)
    const rate = views > 0 ? (checkouts.length / views) * 100 : 0;
    setConversionRate(parseFloat(rate.toFixed(2)));
    
    // Generate daily data for the past 7 days
    generateDailyData();
  }, [cartActivities, checkouts]);
  
  const generateMockData = () => {
    const mockProducts = [
      { id: 'p1', name: 'Python Regius', price: 1500 },
      { id: 'p2', name: 'Boa Constrictor', price: 2200 },
      { id: 'p3', name: 'Corn Snake', price: 800 },
      { id: 'p4', name: 'Leopard Gecko', price: 350 },
    ];
    
    const mockActivities: CartActivity[] = [];
    const mockCheckouts: CheckoutData[] = [];
    
    // Generate 7 days of data
    for (let i = 7; i >= 0; i--) {
      const day = subDays(new Date(), i);
      const dayActivities = Math.floor(Math.random() * 10) + 5; // 5-15 activities per day
      
      for (let j = 0; j < dayActivities; j++) {
        const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
        const action = Math.random() > 0.5 ? 'view_product' : 'add_to_cart';
        const quantity = action === 'add_to_cart' ? Math.floor(Math.random() * 3) + 1 : 1;
        
        mockActivities.push({
          timestamp: day.toISOString(),
          action,
          productId: product.id,
          productName: product.name,
          quantity,
          price: product.price,
          referrer: Math.random() > 0.7 ? 'direct' : 'catalog'
        });
      }
      
      // Add some checkouts
      if (Math.random() > 0.3) {
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const items = [];
        
        for (let k = 0; k < itemCount; k++) {
          const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
          const quantity = Math.floor(Math.random() * 2) + 1;
          
          items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity
          });
        }
        
        mockCheckouts.push({
          timestamp: day.toISOString(),
          paymentMethod: Math.random() > 0.5 ? 'credit-card' : 'pix',
          totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          items
        });
      }
    }
    
    setCartActivities(mockActivities);
    setCheckouts(mockCheckouts);
    
    const productMap: Record<string, ProductAnalytics> = {};
    mockProducts.forEach(product => {
      productMap[product.id] = {
        productId: product.id,
        productName: product.name,
        views: Math.floor(Math.random() * 50) + 10,
        addedToCart: Math.floor(Math.random() * 30) + 5,
        purchased: Math.floor(Math.random() * 10) + 1
      };
    });
    
    setProductAnalytics(Object.values(productMap));
  };
  
  const generateDailyData = () => {
    const data = [];
    
    // Generate data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const day = subDays(new Date(), i);
      const startOfDayDate = startOfDay(day);
      const endOfDayDate = endOfDay(day);
      
      let views = 0;
      let adds = 0;
      let checkouts = 0;
      
      // Count activities for this day
      cartActivities.forEach(activity => {
        const activityDate = new Date(activity.timestamp);
        if (isWithinInterval(activityDate, { start: startOfDayDate, end: endOfDayDate })) {
          if (activity.action === 'view_product') views++;
          if (activity.action === 'add_to_cart') adds++;
        }
      });
      
      // Count checkouts for this day
      this.checkouts.forEach(checkout => {
        const checkoutDate = new Date(checkout.timestamp);
        if (isWithinInterval(checkoutDate, { start: startOfDayDate, end: endOfDayDate })) {
          checkouts++;
        }
      });
      
      data.push({
        name: format(day, 'dd/MM', { locale: pt }),
        views,
        adds,
        checkouts
      });
    }
    
    setDailyData(data);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analytics do Carrinho de Compras</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Visualizações</p>
                  <h2 className="text-2xl font-bold">{visitCount}</h2>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Items no Carrinho</p>
                  <h2 className="text-2xl font-bold">{addToCartCount}</h2>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="bg-amber-100 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Checkouts</p>
                  <h2 className="text-2xl font-bold">{checkoutCount}</h2>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                  <h2 className="text-2xl font-bold">{conversionRate}%</h2>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendências Diárias</CardTitle>
              <CardDescription>
                Atividades dos últimos 7 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#8884d8" 
                      name="Visualizações" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="adds" 
                      stroke="#82ca9d" 
                      name="Adições ao Carrinho" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="checkouts" 
                      stroke="#ffc658" 
                      name="Checkouts" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pagamento</CardTitle>
              <CardDescription>
                Distribuição de métodos de pagamento utilizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { 
                          name: 'Cartão de Crédito', 
                          value: checkouts.filter(c => c.paymentMethod === 'credit-card').length 
                        },
                        { 
                          name: 'PIX', 
                          value: checkouts.filter(c => c.paymentMethod === 'pix').length 
                        }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {[0, 1].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Quantidade']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Product Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho dos Produtos</CardTitle>
            <CardDescription>
              Análise de visualizações, adições ao carrinho e compras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productAnalytics}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="productName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" name="Visualizações" fill="#8884d8" />
                  <Bar dataKey="addedToCart" name="Adições ao Carrinho" fill="#82ca9d" />
                  <Bar dataKey="purchased" name="Compras" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <Table>
              <TableCaption>Detalhes de desempenho dos produtos</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Visualizações</TableHead>
                  <TableHead className="text-right">Adicionado ao Carrinho</TableHead>
                  <TableHead className="text-right">Compras</TableHead>
                  <TableHead className="text-right">Taxa de Conversão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productAnalytics.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell className="font-medium">{product.productName}</TableCell>
                    <TableCell className="text-right">{product.views}</TableCell>
                    <TableCell className="text-right">{product.addedToCart}</TableCell>
                    <TableCell className="text-right">{product.purchased}</TableCell>
                    <TableCell className="text-right">
                      {product.views > 0 ? `${((product.purchased / product.views) * 100).toFixed(1)}%` : '0%'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Recent Checkouts */}
        <Card>
          <CardHeader>
            <CardTitle>Checkouts Recentes</CardTitle>
            <CardDescription>
              Últimas transações realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data e Hora</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Método de Pagamento</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checkouts.slice(0, 5).map((checkout, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {format(new Date(checkout.timestamp), "dd/MM/yyyy HH:mm", { locale: pt })}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {checkout.items.map((item, i) => (
                          <div key={i} className="text-sm">
                            {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {checkout.paymentMethod === 'credit-card' ? 'Cartão de Crédito' : 'PIX'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(checkout.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))}
                {checkouts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      Nenhum checkout registrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ShoppingCartAnalytics;
