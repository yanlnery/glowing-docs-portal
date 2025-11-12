
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Trash2, ShoppingCart, ArrowLeft, AlertCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { orderService } from '@/services/orderService';

// Define proper interfaces for our form data and errors
interface CheckoutFormData {
  fullName: string;
  cpf: string;
  cep: string;
  address: string;
}

interface FormErrors {
  [key: string]: string;
}

const CartPage = () => {
  const { items, removeFromCart, clearCart } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    cpf: '',
    cep: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  useEffect(() => {
    // Record cart view for analytics
    const recordCartView = () => {
      try {
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
      } catch (error) {
        console.error("Error recording cart view:", error);
      }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.fullName.trim()) errors.fullName = "Nome completo é obrigatório";
    if (!formData.cpf.trim()) errors.cpf = "CPF é obrigatório";
    if (!formData.cep.trim()) errors.cep = "CEP é obrigatório";
    if (!formData.address.trim()) errors.address = "Endereço completo é obrigatório";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async () => {
    // Check authentication first
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para finalizar a compra. Redirecionando para o login...",
        variant: "destructive",
        duration: 3000,
      });
      
      setTimeout(() => {
        navigate('/auth/login', { state: { from: '/carrinho' } });
      }, 1500);
      
      return;
    }

    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }

    if (isProcessing) {
      console.log("⚠️ Already processing checkout, ignoring duplicate request");
      return;
    }

    console.log("🔄 Starting checkout process...");
    setIsProcessing(true);

    try {
      // Prepare order data with user_id
      const orderData = {
        user_id: user.id,
        customer_name: formData.fullName.trim(),
        customer_cpf: formData.cpf.trim(),
        customer_phone: '',
        shipping_address: {
          street: formData.address.split(',')[0]?.trim() || formData.address.trim(),
          number: '0',
          complement: '',
          neighborhood: '',
          city: formData.address.split(',')[1]?.trim() || '',
          state: '',
          zipcode: formData.cep.trim()
        },
        payment_method: 'whatsapp',
        total_amount: total,
        status: 'pending' as const // Order starts as pending until confirmed via WhatsApp
      };

      console.log("🔄 Creating order in database...", orderData);

      // Create order in database
      const { data: orderResult, error: orderError } = await orderService.createOrder(orderData);
      
      if (orderError) {
        console.error("❌ Error creating order:", orderError);
        throw new Error(`Erro ao criar pedido: ${orderError.message}`);
      }

      if (!orderResult?.id) {
        console.error("❌ Order creation returned no ID");
        throw new Error("Erro ao criar pedido: ID não retornado");
      }

      console.log("✅ Order created successfully:", orderResult.id);

      // Add order items
      const orderItems = items.map(item => ({
        order_id: orderResult.id,
        product_id: item.product.id,
        product_name: item.product.name,
        species_name: item.product.speciesName || 'Não especificado',
        product_image_url: item.product.images?.[0]?.url || null,
        quantity: item.quantity,
        price: item.product.price
      }));

      console.log("🔄 Adding order items...", orderItems);
      const { error: itemsError } = await orderService.addOrderItems(orderItems);
      
      if (itemsError) {
        console.error("❌ Error adding order items:", itemsError);
        throw new Error(`Erro ao adicionar itens do pedido: ${itemsError.message}`);
      }

      console.log("✅ Order items added successfully");

      // Prepare WhatsApp message
      const message = encodeURIComponent(
        `Olá! Acabei de finalizar um pedido no site Pet Serpentes.\n\n` +
        `Pedido: #${orderResult.id.substring(0, 8)}\n` +
        `Nome do comprador: ${formData.fullName}\n` +
        `CPF: ${formData.cpf}\n` +
        `CEP: ${formData.cep}\n` +
        `Endereço: ${formData.address}\n\n` +
        `Animal(is) adquirido(s):\n${items.map(item => `- ${item.product.name} (${item.product.speciesName || "Não especificado"}) - ${formatPrice(item.product.price)}`).join('\n')}\n\n` +
        `Total: ${formatPrice(total)}\n\n` +
        `Gostaria de confirmar o pedido e combinar os detalhes do envio.`
      );

      // Close dialog and show success message
      setIsDialogOpen(false);
      
      toast({
        title: "Pedido criado com sucesso!",
        description: "Você será redirecionado para o WhatsApp para confirmar o pedido.",
        duration: 3000,
      });

      console.log("✅ Checkout completed successfully, redirecting to WhatsApp...");
      
      // Redirect to WhatsApp and clear cart
      setTimeout(() => {
        window.open(`https://wa.me/5521967802174?text=${message}`, '_blank');
        clearCart();
        
        // Reset form for next use
        setFormData({
          fullName: '',
          cpf: '',
          cep: '',
          address: ''
        });
      }, 1500);
      
    } catch (error) {
      console.error("❌ Checkout process failed:", error);
      
      let errorMessage = "Ocorreu um erro inesperado. Por favor, tente novamente.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro ao processar pedido",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
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
                          {formatPrice(item.product.price)}
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
                    <span>{item.product.name}</span>
                    <span>{formatPrice(item.product.price)}</span>
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
                    ⚠️ O frete é sujeito à disponibilidade logística e valores variam por região. Consulte condições antes de finalizar a compra.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    if (!user) {
                      toast({
                        title: "Login necessário",
                        description: "Você precisa estar logado para finalizar a compra.",
                        variant: "destructive",
                      });
                      navigate('/auth/login', { state: { from: '/carrinho' } });
                      return;
                    }
                    setIsDialogOpen(true);
                  }}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processando..." : "Finalizar Compra"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Informações de envio</DialogTitle>
            <DialogDescription>
              Preencha seus dados para finalizar a compra.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md flex gap-2 text-sm mb-4">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-800 dark:text-yellow-300">
              ⚠️ Estas informações são obrigatórias para emissão legal da documentação e transporte do animal.
            </p>
          </div>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={formErrors.fullName ? "border-red-500" : ""}
                disabled={isProcessing}
              />
              {formErrors.fullName && (
                <p className="text-red-500 text-xs">{formErrors.fullName}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                className={formErrors.cpf ? "border-red-500" : ""}
                disabled={isProcessing}
              />
              {formErrors.cpf && (
                <p className="text-red-500 text-xs">{formErrors.cpf}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleInputChange}
                className={formErrors.cep ? "border-red-500" : ""}
                disabled={isProcessing}
              />
              {formErrors.cep && (
                <p className="text-red-500 text-xs">{formErrors.cep}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Endereço completo</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={formErrors.address ? "border-red-500" : ""}
                disabled={isProcessing}
              />
              {formErrors.address && (
                <p className="text-red-500 text-xs">{formErrors.address}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? "Processando..." : "Finalizar e enviar por WhatsApp"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartPage;
