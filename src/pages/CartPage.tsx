
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore, CartItem } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Trash2, ShoppingCart, ArrowLeft, AlertCircle, CreditCard, QrCode } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { orderEventsService } from '@/services/orderEventsService';
import { cartAnalyticsService } from '@/services/cartAnalyticsService';
import { siteAnalyticsService } from '@/services/siteAnalyticsService';
import { CheckoutAbandonmentDialog } from '@/components/cart/CheckoutAbandonmentDialog';
import CouponInput from '@/components/cart/CouponInput';
import { Coupon } from '@/services/couponService';
import { supabase } from '@/integrations/supabase/client';
import { guestOrderService } from '@/services/guestOrderService';
import { formatPhoneMask } from '@/components/product/GuestWhatsAppDialog';

// Checkout enxuto: apenas nome e WhatsApp. Sem CPF e sem endereço — esses
// detalhes passam a ser tratados na conversa do WhatsApp.
interface CheckoutFormData {
  fullName: string;
  phone: string;
}

interface FormErrors {
  [key: string]: string;
}

const CartPage = () => {
  const { items, removeFromCart, clearCart } = useCartStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('pix');
  const [consent, setConsent] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formOpenTime, setFormOpenTime] = useState<number | null>(null);
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);
  const [pendingClose, setPendingClose] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [showNotice, setShowNotice] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !sessionStorage.getItem("cart-notice-seen");
  });

  const handleDismissNotice = () => {
    sessionStorage.setItem("cart-notice-seen", "true");
    setShowNotice(false);
  };

  // Dados pessoais (CPF, telefone, endereço) não podem ficar guardados para sempre:
  // expiram em 24h e são apagados assim que o pedido é concluído.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pendingOrder");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const createdAt = Number(parsed?.createdAt) || 0;
      if (!createdAt || Date.now() - createdAt > 24 * 60 * 60 * 1000) {
        localStorage.removeItem("pendingOrder");
      }
    } catch {
      localStorage.removeItem("pendingOrder");
    }
  }, []);

  
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
  const subtotal = items.reduce((sum, item) => {
    if (paymentMethod === 'pix' && item.product.pixPrice) {
      return sum + item.product.pixPrice * item.quantity;
    }
    return sum + item.product.price * item.quantity;
  }, 0);

  // Recalculate coupon discount when subtotal or payment method changes
  const effectiveDiscount = appliedCoupon
    ? appliedCoupon.discount_type === 'percentage'
      ? subtotal * (appliedCoupon.discount_value / 100)
      : Math.min(appliedCoupon.discount_value, subtotal)
    : 0;

  const total = Math.max(subtotal - effectiveDiscount, 0);

  const getItemPrice = (item: CartItem) => {
    if (paymentMethod === 'pix' && item.product.pixPrice) {
      return item.product.pixPrice;
    }
    return item.product.price;
  };
  
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
    const formattedValue = name === 'phone' ? formatPhoneMask(value) : value;

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.fullName.trim()) errors.fullName = "Nome completo é obrigatório";

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone) {
      errors.phone = "WhatsApp é obrigatório";
    } else if (cleanPhone.length < 10) {
      errors.phone = "WhatsApp inválido";
    }

    if (!consent) {
      errors.consent = "É preciso aceitar a política de privacidade";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async () => {
    // Track checkout start
    siteAnalyticsService.trackCheckoutStart({
      itemCount: items.length,
      totalValue: total,
    });

    if (!validateForm()) {
      const errorTypes = Object.keys(formErrors);
      errorTypes.forEach(errorType => {
        siteAnalyticsService.trackCheckoutFormError(errorType, formErrors[errorType]);
      });
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const result = await guestOrderService.createGuestCartOrder({
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        customerName: formData.fullName.trim(),
        customerPhone: formData.phone.trim(),
        couponCode: appliedCoupon?.code ?? null,
      });

      if (result.error) {
        const raw = String(result.error.message ?? '');
        if (raw.toLowerCase().includes('disponive')) {
          toast({
            title: "Animal indisponível",
            description: "Um ou mais animais do carrinho não estão mais disponíveis. Revise seu carrinho.",
            variant: "destructive",
            duration: 6000,
          });
          setIsDialogOpen(false);
          return;
        }
        throw new Error(raw || 'Erro ao criar pedido');
      }

      const orderId = result.orderId!;
      const orderNumber = result.orderNumber || `#${orderId.substring(0, 8)}`;
      // Valores finais vêm do servidor — nunca recalculados aqui.
      const serverSubtotal = Number(result.subtotalAmount ?? 0);
      const serverTotal = Number(result.totalAmount ?? 0);
      const serverDiscount = Number(result.couponDiscount ?? 0);
      const couponApplied = result.couponApplied === true;

      await orderEventsService.createEvent({
        order_id: orderId,
        event_type: 'created',
        event_data: { item_count: items.length, total: serverTotal },
      });

      const paymentLabel = paymentMethod === 'pix' ? 'PIX' : 'Cartão (até 10x sem juros)';

      const couponSection = couponApplied
        ? `\n\n🎟️ Cupom aplicado: ${appliedCoupon?.code}` +
          `\nSubtotal: ${formatPrice(serverSubtotal)}` +
          `\nDesconto: -${formatPrice(serverDiscount)}` +
          `\n\n📍 Retirada exclusiva no evento MEX Festival — 18/04/2026, São Paulo.`
        : '';

      const message =
        `Olá! Acabei de finalizar um pedido no site Pet Serpentes.\n\n` +
        `Pedido: ${orderNumber}\n` +
        `Nome: ${formData.fullName}\n` +
        `WhatsApp: ${formData.phone}\n` +
        `Forma de pagamento: ${paymentLabel}\n\n` +
        `Animal(is) solicitado(s):\n${items.map(item => `- ${item.product.meta?.productId ? `#${item.product.meta.productId} - ` : ''}${item.product.name} (${item.product.speciesName || "Não especificado"})`).join('\n')}\n\n` +
        `Total: ${formatPrice(serverTotal)}` +
        couponSection +
        (couponApplied
          ? `\n\nGostaria de confirmar o pedido.`
          : `\n\nGostaria de confirmar o pedido e combinar os detalhes do envio.`);

      const whatsappNumber = await guestOrderService.getWhatsAppNumber();
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      siteAnalyticsService.trackCheckoutSuccess({
        orderId,
        totalValue: serverTotal,
        itemCount: items.length,
      });

      setIsDialogOpen(false);

      toast({
        title: "Pedido criado com sucesso!",
        description: "Abrindo o WhatsApp...",
        duration: 2000,
      });

      await supabase
        .from('orders')
        .update({ whatsapp_clicked_at: new Date().toISOString() })
        .eq('id', orderId);

      await orderEventsService.createEvent({
        order_id: orderId,
        event_type: 'whatsapp_redirect',
        event_data: { whatsapp_url: whatsappUrl.substring(0, 100) },
      });

      siteAnalyticsService.trackWhatsAppRedirect({
        orderId,
        totalValue: serverTotal,
      });

      clearCart();
      setFormOpenTime(null);
      setFormData({ fullName: '', phone: '' });
      setConsent(false);

      localStorage.removeItem("pendingOrder");

      window.location.assign(whatsappUrl);
    } catch (error) {
      console.error("❌ Checkout process failed:", error);

      toast({
        title: "Erro ao processar pedido",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado. Por favor, tente novamente.",
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
        <div className="relative">
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
                              {formatPrice(getItemPrice(item))}
                              {paymentMethod === 'pix' && item.product.pixPrice && item.product.pixPrice < item.product.price && (
                                <span className="text-xs text-muted-foreground line-through ml-2">
                                  {formatPrice(item.product.price)}
                                </span>
                              )}
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
                {/* Payment method selector */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Forma de pagamento</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v as 'pix' | 'cartao')}
                    className="grid grid-cols-2 gap-3"
                  >
                    <label
                      className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                        paymentMethod === 'pix'
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border hover:border-muted-foreground/40'
                      }`}
                    >
                      <RadioGroupItem value="pix" id="pix" />
                      <div className="flex items-center gap-1.5">
                        <QrCode className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium">PIX</span>
                      </div>
                    </label>
                    <label
                      className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                        paymentMethod === 'cartao'
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border hover:border-muted-foreground/40'
                      }`}
                    >
                      <RadioGroupItem value="cartao" id="cartao" />
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm font-medium">Cartão</span>
                      </div>
                    </label>
                  </RadioGroup>
                  {paymentMethod === 'cartao' && (
                    <p className="text-xs text-muted-foreground">Até 10x sem juros</p>
                  )}
                </div>

                <div className="border-t pt-3 space-y-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="truncate mr-2">{item.product.meta?.productId ? `#${item.product.meta.productId} - ` : ''}{item.product.name}</span>
                      <span className="flex-shrink-0">{formatPrice(getItemPrice(item))}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon Input */}
                <div className="border-t pt-3">
                  <CouponInput
                    cartTotal={subtotal}
                    appliedCoupon={appliedCoupon}
                    discountAmount={effectiveDiscount}
                    onApply={(coupon, amount) => {
                      setAppliedCoupon(coupon);
                      setCouponDiscount(amount);
                    }}
                    onRemove={() => {
                      setAppliedCoupon(null);
                      setCouponDiscount(0);
                    }}
                  />
                </div>
                
                <div className="border-t pt-4 mt-2">
                  {appliedCoupon && (
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span className="line-through text-muted-foreground">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>Cupom {appliedCoupon.code}{appliedCoupon.discount_type === 'percentage' ? ` (${appliedCoupon.discount_value}%)` : ''}</span>
                        <span>-{formatPrice(effectiveDiscount)}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className={paymentMethod === 'pix' ? 'text-green-600 dark:text-green-400' : ''}>
                      {formatPrice(total)}
                    </span>
                  </div>
                  {paymentMethod === 'cartao' && (
                    <p className="text-xs text-muted-foreground text-right mt-1">
                      ou 10x de {formatPrice(total / 10)} sem juros
                    </p>
                  )}
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md flex gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-800 dark:text-yellow-300">
                    {appliedCoupon
                      ? '🎉 Este cupom é exclusivo para retirada no evento MEX Festival, que irá ocorrer no dia 18/04/2026 em São Paulo.'
                      : '⚠️ O frete é sujeito à disponibilidade logística e valores variam por região. Finalize para consultar a disponibilidade.'}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => {
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

        {showNotice && items.length > 0 && (
          <div className="absolute inset-0 z-20 flex items-start justify-center bg-background/80 backdrop-blur-sm p-4 pt-8">
            <motion.div
              key="cart-notice"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="w-full max-w-md rounded-lg border border-primary/20 bg-primary/5 p-4 shadow-lg"
            >
              <p className="text-sm font-semibold text-foreground">Quase lá! 🐍</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Para finalizar, confirme seus dados. Precisamos deles para emitir a documentação do animal.
              </p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Ao clicar em <span className="font-medium text-foreground">Finalizar pedido</span>, você será direcionado ao nosso WhatsApp para confirmar o frete e realizar o pagamento. Simples assim.
              </p>
              <button
                onClick={handleDismissNotice}
                className="mt-3 inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Entendi
              </button>
            </motion.div>
          </div>
        )}
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirmar pedido</DialogTitle>
            <DialogDescription>
              Só precisamos de nome e WhatsApp para confirmar seu pedido.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md flex gap-2 text-sm mb-4">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-800 dark:text-yellow-300">
              ⚠️ Os detalhes de documentação, frete e pagamento são combinados na conversa do WhatsApp.
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
              <Label htmlFor="phone">WhatsApp</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="(00) 00000-0000"
                type="tel"
                inputMode="numeric"
                value={formData.phone}
                onChange={handleInputChange}
                className={formErrors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                disabled={isProcessing}
              />
              {formErrors.phone && (
                <p className="text-destructive text-xs">{formErrors.phone}</p>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => {
                    setConsent(checked === true);
                    if (checked === true) setFormErrors(prev => ({ ...prev, consent: '' }));
                  }}
                  disabled={isProcessing}
                />
                <Label htmlFor="consent" className="text-sm font-normal leading-snug">
                  Li e aceito a{' '}
                  <Link
                    to="/politica-de-privacidade"
                    className="text-serpente-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    política de privacidade
                  </Link>
                  .
                </Label>
              </div>
              {formErrors.consent && (
                <p className="text-destructive text-xs">{formErrors.consent}</p>
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
