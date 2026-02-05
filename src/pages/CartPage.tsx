
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Trash2, ShoppingCart, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
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
import { toast } from '@/hooks/use-toast';
import { orderService } from '@/services/orderService';
import { orderEventsService } from '@/services/orderEventsService';
import { cartAnalyticsService } from '@/services/cartAnalyticsService';
import { siteAnalyticsService } from '@/services/siteAnalyticsService';
import { CheckoutAbandonmentDialog } from '@/components/cart/CheckoutAbandonmentDialog';
import { supabase } from '@/integrations/supabase/client';

// Define proper interfaces for our form data and errors
interface CheckoutFormData {
  fullName: string;
  cpf: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface FormErrors {
  [key: string]: string;
}

// CPF validation with verification digits
const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  
  // Reject CPFs with all same digits
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validate first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF[9])) return false;
  
  // Validate second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF[10])) return false;
  
  return true;
};

const CartPage = () => {
  const { items, removeFromCart, clearCart } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const cepDebounceRef = useRef<NodeJS.Timeout | null>(null);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formOpenTime, setFormOpenTime] = useState<number | null>(null);
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);
  const [pendingClose, setPendingClose] = useState(false);
  
  useEffect(() => {
    // Record cart view for analytics
    const totalValue = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    cartAnalyticsService.recordEvent({
      action: 'view_cart',
      item_count: items.length,
      total_value: totalValue,
      items: items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        productCode: item.product.meta?.productId
      }))
    });

    // Track view cart in site analytics
    siteAnalyticsService.trackViewCart({
      itemCount: items.length,
      totalValue,
    });
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

  // Mask functions for CPF and CEP
  const formatCPF = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatCEP = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    return digits.replace(/(\d{5})(\d)/, '$1-$2');
  };

  // Fetch address from ViaCEP
  const fetchAddressFromCEP = useCallback(async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return;
    
    setIsFetchingCep(true);
    setFormErrors(prev => ({ ...prev, cep: '' }));
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        setFormErrors(prev => ({ ...prev, cep: 'CEP não encontrado' }));
        // Clear auto-filled fields on error
        setFormData(prev => ({
          ...prev,
          street: '',
          neighborhood: '',
          city: '',
          state: ''
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
        }));
        // Clear any previous CEP error
        setFormErrors(prev => ({ ...prev, cep: '' }));
      }
    } catch (error) {
      console.error('Error fetching CEP:', error);
      setFormErrors(prev => ({ ...prev, cep: 'Não foi possível buscar o CEP' }));
    } finally {
      setIsFetchingCep(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'cep') {
      formattedValue = formatCEP(value);
      
      // Clear auto-filled address fields when CEP changes
      const cleanCEP = value.replace(/\D/g, '');
      if (cleanCEP.length < 8) {
        setFormData(prev => ({
          ...prev,
          cep: formattedValue,
          street: '',
          neighborhood: '',
          city: '',
          state: ''
        }));
        setFormErrors(prev => ({ ...prev, cep: '' }));
      }
      
      // Debounced CEP lookup
      if (cepDebounceRef.current) {
        clearTimeout(cepDebounceRef.current);
      }
      
      if (cleanCEP.length === 8) {
        cepDebounceRef.current = setTimeout(() => {
          fetchAddressFromCEP(cleanCEP);
        }, 300);
      }
    }
    
    if (name !== 'cep') {
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        cep: formattedValue
      }));
    }
    
    // Clear error for this field when user starts typing
    if (formErrors[name] && name !== 'cep') {
      setFormErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCpfBlur = () => {
    const cleanCPF = formData.cpf.replace(/\D/g, '');
    if (cleanCPF.length > 0 && !validateCPF(cleanCPF)) {
      setFormErrors(prev => ({ ...prev, cpf: 'CPF inválido' }));
    } else {
      setFormErrors(prev => ({ ...prev, cpf: '' }));
    }
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.fullName.trim()) errors.fullName = "Nome completo é obrigatório";
    
    const cleanCPF = formData.cpf.replace(/\D/g, '');
    if (!cleanCPF) {
      errors.cpf = "CPF é obrigatório";
    } else if (!validateCPF(cleanCPF)) {
      errors.cpf = "CPF inválido";
    }
    
    const cleanCEP = formData.cep.replace(/\D/g, '');
    if (!cleanCEP) {
      errors.cep = "CEP é obrigatório";
    } else if (cleanCEP.length !== 8) {
      errors.cep = "CEP deve ter 8 dígitos";
    }
    
    if (!formData.street.trim()) errors.street = "Rua é obrigatória";
    if (!formData.number.trim()) errors.number = "Número é obrigatório";
    if (!formData.neighborhood.trim()) errors.neighborhood = "Bairro é obrigatório";
    if (!formData.city.trim()) errors.city = "Cidade é obrigatória";
    if (!formData.state.trim()) errors.state = "Estado é obrigatório";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async () => {
    // Check authentication first - redirect to checkout auth page
    if (!user) {
      navigate('/checkout-cadastro');
      return;
    }

    // Track checkout start
    siteAnalyticsService.trackCheckoutStart({
      itemCount: items.length,
      totalValue: total,
    });

    if (!validateForm()) {
      console.log("❌ Form validation failed");
      
      // Track form validation errors
      const errorTypes = Object.keys(formErrors);
      if (errorTypes.length > 0) {
        errorTypes.forEach(errorType => {
          siteAnalyticsService.trackCheckoutFormError(errorType, formErrors[errorType]);
        });
      }
      
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
      const formattedAddress = `${formData.street}, ${formData.number}${formData.complement ? ` - ${formData.complement}` : ''}, ${formData.neighborhood}, ${formData.city} - ${formData.state}, CEP: ${formData.cep}`;
      
      const orderData = {
        user_id: user.id,
        customer_name: formData.fullName.trim(),
        customer_cpf: formData.cpf.trim(),
        customer_phone: '',
        shipping_address: {
          street: formData.street.trim(),
          number: formData.number.trim(),
          complement: formData.complement.trim(),
          neighborhood: formData.neighborhood.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipcode: formData.cep.replace(/\D/g, '')
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
        product_code: item.product.meta?.productId || null,
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

      // Create 'created' event
      await orderEventsService.createEvent({
        order_id: orderResult.id,
        event_type: 'created',
        event_data: { item_count: items.length, total: total },
      });

      // Prepare WhatsApp message with formatted address and order_number
      const fullAddress = `${formData.street}, ${formData.number}${formData.complement ? ` - ${formData.complement}` : ''}, ${formData.neighborhood}, ${formData.city} - ${formData.state}, CEP: ${formData.cep}`;
      
      const orderNumber = orderResult.order_number || `#${orderResult.id.substring(0, 8)}`;
      
      const message = 
        `Olá! Acabei de finalizar um pedido no site Pet Serpentes.\n\n` +
        `Pedido: ${orderNumber}\n` +
        `Nome do comprador: ${formData.fullName}\n` +
        `CPF: ${formData.cpf}\n` +
        `Endereço: ${fullAddress}\n\n` +
        `Animal(is) solicitado(s):\n${items.map(item => `- ${item.product.name} (${item.product.speciesName || "Não especificado"}) - ${formatPrice(item.product.price)}`).join('\n')}\n\n` +
        `Total: ${formatPrice(total)}\n\n` +
        `Gostaria de confirmar o pedido e combinar os detalhes do envio.`;

      const whatsappUrl = `https://wa.me/5521967802174?text=${encodeURIComponent(message)}`;

      // Persist order data before redirect (for recovery if needed)
      localStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          createdAt: Date.now(),
          orderId: orderResult.id,
          cartItems: items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price
          })),
          formData,
          message
        })
      );

      // Track checkout success
      siteAnalyticsService.trackCheckoutSuccess({
        orderId: orderResult.id,
        totalValue: total,
        itemCount: items.length,
      });

      // Close dialog and show success message
      setIsDialogOpen(false);
      
      toast({
        title: "Pedido criado com sucesso!",
        description: "Abrindo o WhatsApp...",
        duration: 2000,
      });

      console.log("✅ Checkout completed successfully, redirecting to WhatsApp...");
      
      // Record whatsapp_clicked_at and create event
      await supabase
        .from('orders')
        .update({ whatsapp_clicked_at: new Date().toISOString() })
        .eq('id', orderResult.id);
      
      await orderEventsService.createEvent({
        order_id: orderResult.id,
        event_type: 'whatsapp_redirect',
        event_data: { whatsapp_url: whatsappUrl.substring(0, 100) },
      });
      
      // Track WhatsApp redirect
      siteAnalyticsService.trackWhatsAppRedirect({
        orderId: orderResult.id,
        totalValue: total,
      });
      
      // Clear cart and reset form before redirect
      clearCart();
      setFormOpenTime(null);
      setFormData({
        fullName: '',
        cpf: '',
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
      });

      // Immediate redirect - mobile-safe (no setTimeout, no window.open)
      window.location.assign(whatsappUrl);
      
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
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      ease: "easeOut"
                    }}
                    layout
                  >
                    <Card className="overflow-hidden">
                      <div className="flex flex-row">
                        {/* Imagem compacta */}
                        <div className="w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0">
                          {item.product.images && item.product.images.length > 0 ? (
                            <img 
                              src={item.product.images[0].url} 
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-muted-foreground text-xs">Sem imagem</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Conteúdo */}
                        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-sm sm:text-base line-clamp-1">{item.product.name}</h3>
                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                                <em>{item.product.speciesName}</em>
                              </p>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 flex-shrink-0"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          
                          <div className="flex justify-end mt-2">
                            <div className="text-sm sm:text-base font-semibold">
                              {formatPrice(item.product.price)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
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
                      navigate('/checkout-cadastro');
                      return;
                    }
                    // Track checkout form open
                    siteAnalyticsService.trackCheckoutFormOpen({
                      itemCount: items.length,
                      totalValue: total,
                    });
                    setFormOpenTime(Date.now());
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

      {/* Abandonment Confirmation Dialog */}
      <CheckoutAbandonmentDialog
        open={showAbandonDialog}
        filledFieldsCount={Object.values(formData).filter(v => v.trim() !== '').length}
        onConfirmLeave={() => {
          // Track abandonment
          const filledFields = Object.entries(formData)
            .filter(([_, value]) => value.trim() !== '')
            .map(([key]) => key);
          
          const timeSpent = formOpenTime 
            ? Math.round((Date.now() - formOpenTime) / 1000) 
            : undefined;
          
          siteAnalyticsService.trackCheckoutFormAbandon({
            itemCount: items.length,
            totalValue: total,
            filledFields,
            timeSpentSeconds: timeSpent,
          });
          
          setFormOpenTime(null);
          setShowAbandonDialog(false);
          setIsDialogOpen(false);
        }}
        onContinue={() => {
          setShowAbandonDialog(false);
        }}
      />

      <Dialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          if (!open && isDialogOpen) {
            // User is trying to close the dialog
            const filledFieldsCount = Object.values(formData).filter(v => v.trim() !== '').length;
            
            if (filledFieldsCount > 0) {
              // Show confirmation dialog
              setShowAbandonDialog(true);
              return; // Don't close yet
            }
            
            // No fields filled, track and close directly
            const timeSpent = formOpenTime 
              ? Math.round((Date.now() - formOpenTime) / 1000) 
              : undefined;
            
            siteAnalyticsService.trackCheckoutFormAbandon({
              itemCount: items.length,
              totalValue: total,
              filledFields: [],
              timeSpentSeconds: timeSpent,
            });
            setFormOpenTime(null);
          }
          setIsDialogOpen(open);
        }}
      >
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
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleInputChange}
                onBlur={handleCpfBlur}
                className={formErrors.cpf ? "border-destructive focus-visible:ring-destructive" : ""}
                disabled={isProcessing}
              />
              {formErrors.cpf && (
                <p className="text-destructive text-xs">{formErrors.cpf}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cep">CEP</Label>
              <div className="relative">
                <Input
                  id="cep"
                  name="cep"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={handleInputChange}
                  className={formErrors.cep ? "border-destructive focus-visible:ring-destructive pr-8" : "pr-8"}
                  disabled={isProcessing}
                />
                {isFetchingCep && (
                  <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {formErrors.cep && (
                <p className="text-destructive text-xs">{formErrors.cep}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="street">Rua / Logradouro</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className={formErrors.street ? "border-destructive focus-visible:ring-destructive" : ""}
                disabled={isProcessing}
              />
              {formErrors.street && (
                <p className="text-destructive text-xs">{formErrors.street}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  className={formErrors.number ? "border-destructive focus-visible:ring-destructive" : ""}
                  disabled={isProcessing}
                />
                {formErrors.number && (
                  <p className="text-destructive text-xs">{formErrors.number}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  name="complement"
                  placeholder="Opcional"
                  value={formData.complement}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleInputChange}
                className={formErrors.neighborhood ? "border-destructive focus-visible:ring-destructive" : ""}
                disabled={isProcessing}
              />
              {formErrors.neighborhood && (
                <p className="text-destructive text-xs">{formErrors.neighborhood}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={formErrors.city ? "border-destructive focus-visible:ring-destructive" : ""}
                  disabled={isProcessing}
                />
                {formErrors.city && (
                  <p className="text-destructive text-xs">{formErrors.city}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">UF</Label>
                <Input
                  id="state"
                  name="state"
                  maxLength={2}
                  value={formData.state}
                  onChange={handleInputChange}
                  className={formErrors.state ? "border-destructive focus-visible:ring-destructive" : ""}
                  disabled={isProcessing}
                />
                {formErrors.state && (
                  <p className="text-destructive text-xs">{formErrors.state}</p>
                )}
              </div>
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
