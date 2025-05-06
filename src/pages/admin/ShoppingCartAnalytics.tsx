
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
            productName: activity.productName || 'Unknown Product',
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
    // Generate mock product analytics
    const mockProducts: ProductAnalytics[] = [
      {
        productId: 'p1',
        productName: 'Corn Snake',
        views: 120,
        addedToCart: 30,
        purchased: 15
      },
      {
        productId: 'p2',
        productName: 'Ball Python',
        views: 200,
        addedToCart: 50,
        purchased: 25
      },
      {
        productId: 'p3',
        productName: 'California King Snake',
        views: 80,
        addedToCart: 20,
        purchased: 10
      },
      {
        productId: 'p4',
        productName: 'Milk Snake',
        views: 150,
        addedToCart: 40,
        purchased: 20
      }
    ];
    
    setProductAnalytics(mockProducts);
    
    // Generate mock cart activities
    const activities: CartActivity[] = [];
    const actions = ['view_product', 'add_to_cart', 'remove_from_cart', 'checkout'];
    
    // Generate activities for the past 7 days
    for (let i = 0; i < 100; i++) {
      const daysAgo = Math.floor(Math.random() * 7);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      const productIndex = Math.floor(Math.random() * mockProducts.length);
      const product = mockProducts[productIndex];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      activities.push({
        timestamp: date.toISOString(),
        action,
        productId: product.productId,
        productName: product.productName,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: Math.floor(Math.random() * 200) + 50,
        referrer: Math.random() > 0.5 ? 'direct' : 'catalog'
      });
    }
    
    setCartActivities(activities);
    
    // Generate mock checkouts
    const mockCheckouts: CheckoutData[] = [];
    for (let i = 0; i < 10; i++) {
      const daysAgo = Math.floor(Math.random() * 7);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      mockCheckouts.push({
        timestamp: date.toISOString(),
        paymentMethod: Math.random() > 0.5 ? 'credit-card' : 'pix',
        totalAmount: Math.floor(Math.random() * 1000) + 100,
        items: [
          {
            id: mockProducts[Math.floor(Math.random() * mockProducts.length)].productId,
            name: mockProducts[Math.floor(Math.random() * mockProducts.length)].productName,
            price: Math.floor(Math.random() * 200) + 50,
            quantity: Math.floor(Math.random() * 3) + 1
          }
        ]
      });
    }
    
    setCheckouts(mockCheckouts);
    setVisitCount(120);
    setAddToCartCount(40);
    setCheckoutCount(10);
    setConversionRate(8.33);
    
    // Generate daily data
    generateDailyData();
  };
  
  const generateDailyData = () => {
    // Generate data for the past 7 days
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      // Count activities for this day
      let views = 0;
      let adds = 0;
      let checkoutsCount = 0;
      
      cartActivities.forEach(activity => {
        const activityDate = new Date(activity.timestamp);
        if (isWithinInterval(activityDate, { start: dayStart, end: dayEnd })) {
          if (activity.action === 'view_product') views++;
          if (activity.action === 'add_to_cart') adds++;
        }
      });
      
      // Fix: Use checkouts state instead of this.checkouts
      checkouts.forEach(checkout => {
        const checkoutDate = new Date(checkout.timestamp);
        if (isWithinInterval(checkoutDate, { start: dayStart, end: dayEnd })) {
          checkoutsCount++;
        }
      });
      
      data.push({
        date: format(date, 'dd/MM', { locale: pt }),
        views,
        adds,
        checkouts: checkoutsCount,
        conversionRate: views > 0 ? (checkoutsCount / views) * 100 : 0
      });
    }
    
    setDailyData(data);
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: pt });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // COLORS for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Análise do Carrinho de Compras</h1>
        </div>
        
        {/* Dashboard stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Visualizações</p>
                  <p className="text-2xl font-bold">{visitCount}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Adições ao Carrinho</p>
                  <p className="text-2xl font-bold">{addToCartCount}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full text-green-600 dark:bg-green-900/20 dark:text-green-400">
                  <ShoppingCart className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Checkouts</p>
                  <p className="text-2xl font-bold">{checkoutCount}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                  <CreditCard className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                  <p className="text-2xl font-bold">{conversionRate}%</p>
                </div>
                <div className="p-2 bg-amber-100 rounded-full text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Diária</CardTitle>
              <CardDescription>Visualizações, adições e checkouts nos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyData}
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" name="Visualizações" fill="#0088FE" />
                    <Bar dataKey="adds" name="Adições" fill="#00C49F" />
                    <Bar dataKey="checkouts" name="Checkouts" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Produtos</CardTitle>
              <CardDescription>Produtos mais visualizados e adicionados ao carrinho</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productAnalytics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="addedToCart"
                      nameKey="productName"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {productAnalytics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Product Analytics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Análise de Produtos</CardTitle>
            <CardDescription>Desempenho de produtos por visualizações, adições e compras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Visualizações</TableHead>
                    <TableHead className="text-right">Adições ao Carrinho</TableHead>
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
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Checkouts */}
        <Card>
          <CardHeader>
            <CardTitle>Checkouts Recentes</CardTitle>
            <CardDescription>Pedidos concluídos recentemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Método de Pagamento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Itens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkouts.slice(0, 5).map((checkout, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(checkout.timestamp)}</TableCell>
                      <TableCell>
                        {checkout.paymentMethod === 'credit-card' ? 'Cartão de Crédito' : 'PIX'}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(checkout.totalAmount)}</TableCell>
                      <TableCell>
                        {checkout.items && checkout.items.map((item, i) => (
                          <div key={i} className="text-sm text-muted-foreground">
                            {item.name} x {item.quantity}
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ShoppingCartAnalytics;
