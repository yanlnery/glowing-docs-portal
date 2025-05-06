
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from '@/layouts/WebsiteLayout';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Trash2, ShoppingCart, ArrowLeft, AlertCircle } from 'lucide-react';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Record cart view for analytics
    const recordCartView = () => {
      const now = new Date().toISOString();
      const analyticsData = JSON.parse(localStorage.getItem('cartAnalytics') || '[]');
      
      analyticsData.push({
        timestamp: now,
        action: 'view_cart',
        productId: '',
        productName: '',
        quantity: 0,
        price: 0,
        referrer: document.referrer || 'direct'
      });
      
      localStorage.setItem('cartAnalytics', JSON.stringify(analyticsData));
    };
    
    recordCartView();
  }, []);
  
  // Calculate total
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Format price
  const formatPrice = (price: number) => {
    if (price === 0) return "Sob consulta";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  return (
    <WebsiteLayout>
      <div className="container px-4 py-12 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Carrinho de Compras</h1>
        
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Adicione produtos ao carrinho explorando nosso catálogo de animais disponíveis
            </p>
            <Button asChild>
              <Link to="/catalogo">
                <ArrowLeft className="mr-2 h-4 w-4" /> Ver Catálogo
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.product.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-40 h-40 sm:h-auto">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img 
                            src={item.product.images[0].url} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">Sem imagem</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h3 className="font-bold text-lg">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              <em>{item.product.speciesName}</em>
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            <select 
                              className="h-8 rounded-md border border-input px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                            >
                              {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <div className="text-lg font-semibold">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => clearCart()}>
                  Limpar Carrinho
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/catalogo">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Continuar Comprando
                  </Link>
                </Button>
              </div>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span>{item.product.name} x {item.quantity}</span>
                      <span>{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md flex gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-800 dark:text-yellow-300">
                      Para adquirir um animal, é necessário apresentar documentação. Entre em contato para mais informações.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button className="w-full">
                    Finalizar Compra
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/contato">
                      Falar com um Especialista
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </WebsiteLayout>
  );
};

export default CartPage;
