import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { toast } from '@/components/ui/use-toast';
import { orderService } from '@/services/orderService';
import { cartAnalyticsService } from '@/services/cartAnalyticsService';
import { validateCPF, formatCPF, cleanCPF } from '@/utils/cpfValidator';
import { fetchAddressByCep, formatCEP, cleanCEP } from '@/services/viaCepService';

interface CheckoutFormData {
  fullName: string;
  cpf: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
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
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [cpfTouched, setCpfTouched] = useState(false);
  
  // Debounce ref for CEP search
  const cepDebounceRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    cartAnalyticsService.recordEvent({
      action: 'view_cart',
      item_count: items.length,
      total_value: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      items: items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price
      }))
    });
  }, []);

  // CEP auto-fill with debounce
  useEffect(() => {
    const cleanedCep = cleanCEP(formData.cep);
    
    // Clear previous timeout
    if (cepDebounceRef.current) {
      clearTimeout(cepDebounceRef.current);
    }

    // Only search when CEP has 8 digits
    if (cleanedCep.length === 8) {
      setCepError(null);
      setIsLoadingCep(true);
      
      cepDebounceRef.current = setTimeout(async () => {
        const address = await fetchAddressByCep(cleanedCep);
        setIsLoadingCep(false);
        
        if (address) {
          setFormData(prev => ({
            ...prev,
            logradouro: address.logradouro,
            bairro: address.bairro,
            cidade: address.cidade,
            uf: address.uf
          }));
          setCepError(null);
          // Clear address errors since we auto-filled
          setFormErrors(prev => {
            const { logradouro, bairro, cidade, uf, ...rest } = prev;
            return rest;
          });
        } else {
          setCepError('CEP não encontrado');
        }
      }, 300);
    } else {
      setIsLoadingCep(false);
      setCepError(null);
      // Clear auto-filled fields when CEP changes
      if (cleanedCep.length < 8) {
        setFormData(prev => ({
          ...prev,
          logradouro: '',
          bairro: '',
          cidade: '',
          uf: ''
        }));
      }
    }

    return () => {
      if (cepDebounceRef.current) {
        clearTimeout(cepDebounceRef.current);
      }
    };
  }, [formData.cep]);
  
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  const formatPrice = (price: number) => {
    if (price === 0) return "Sob consulta";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'cep') {
      formattedValue = formatCEP(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue
    }));
    
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCpfBlur = useCallback(() => {
    setCpfTouched(true);
    const cleanedCpf = cleanCPF(formData.cpf);
    
    if (cleanedCpf.length === 11 && !validateCPF(cleanedCpf)) {
      setFormErrors(prev => ({ ...prev, cpf: 'CPF inválido' }));
    } else if (cleanedCpf.length > 0 && cleanedCpf.length < 11) {
      setFormErrors(prev => ({ ...prev, cpf: 'CPF incompleto' }));
    } else {
      setFormErrors(prev => ({ ...prev, cpf: '' }));
    }
  }, [formData.cpf]);

  const validateForm = () => {
    const errors: FormErrors = {};
    
    if (!formData.fullName.trim()) errors.fullName = "Nome completo é obrigatório";
    
    // CPF validation
    const cleanedCpf = cleanCPF(formData.cpf);
    if (!cleanedCpf) {
      errors.cpf = "CPF é obrigatório";
    } else if (cleanedCpf.length !== 11) {
      errors.cpf = "CPF incompleto";
    } else if (!validateCPF(cleanedCpf)) {
      errors.cpf = "CPF inválido";
    }
    
    // CEP validation
    const cleanedCep = cleanCEP(formData.cep);
    if (!cleanedCep) {
      errors.cep = "CEP é obrigatório";
    } else if (cleanedCep.length !== 8) {
      errors.cep = "CEP incompleto";
    }
    
    // Address fields
    if (!formData.logradouro.trim()) errors.logradouro = "Logradouro é obrigatório";
    if (!formData.numero.trim()) errors.numero = "Número é obrigatório";
    if (!formData.bairro.trim()) errors.bairro = "Bairro é obrigatório";
    if (!formData.cidade.trim()) errors.cidade = "Cidade é obrigatória";
    if (!formData.uf.trim()) errors.uf = "UF é obrigatória";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/checkout-cadastro');
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const cleanedCep = cleanCEP(formData.cep);
      const cleanedCpf = cleanCPF(formData.cpf);
      
      const orderData = {
        user_id: user.id,
        customer_name: formData.fullName.trim(),
        customer_cpf: cleanedCpf,
        customer_phone: '',
        shipping_address: {
          street: formData.logradouro.trim(),
          number: formData.numero.trim(),
          complement: formData.complemento.trim(),
          neighborhood: formData.bairro.trim(),
          city: formData.cidade.trim(),
          state: formData.uf.trim().toUpperCase(),
          zipcode: cleanedCep
        },
        payment_method: 'whatsapp',
        total_amount: total,
        status: 'pending' as const
      };

      const { data: orderResult, error: orderError } = await orderService.createOrder(orderData);
      
      if (orderError) {
        throw new Error(`Erro ao criar pedido: ${orderError.message}`);
      }

      if (!orderResult?.id) {
        throw new Error("Erro ao criar pedido: ID não retornado");
      }

      const orderItems = items.map(item => ({
        order_id: orderResult.id,
        product_id: item.product.id,
        product_name: item.product.name,
        species_name: item.product.speciesName || 'Não especificado',
        product_image_url: item.product.images?.[0]?.url || null,
        quantity: item.quantity,
        price: item.product.price
      }));

      const { error: itemsError } = await orderService.addOrderItems(orderItems);
      
      if (itemsError) {
        throw new Error(`Erro ao adicionar itens do pedido: ${itemsError.message}`);
      }

      // Build formatted address for WhatsApp
      const enderecoCompleto = [
        `${formData.logradouro}, ${formData.numero}`,
        formData.complemento ? `Complemento: ${formData.complemento}` : '',
        `Bairro: ${formData.bairro}`,
        `${formData.cidade} - ${formData.uf.toUpperCase()}`,
        `CEP: ${formData.cep}`
      ].filter(Boolean).join('\n');

      const message = 
        `Olá! Acabei de finalizar um pedido no site Pet Serpentes.\n\n` +
        `Pedido: #${orderResult.id.substring(0, 8)}\n` +
        `Nome do comprador: ${formData.fullName}\n` +
        `CPF: ${formData.cpf}\n\n` +
        `Endereço de entrega:\n${enderecoCompleto}\n\n` +
        `Animal(is) solicitado(s):\n${items.map(item => `- ${item.product.name} (${item.product.speciesName || "Não especificado"}) - ${formatPrice(item.product.price)}`).join('\n')}\n\n` +
        `Total: ${formatPrice(total)}\n\n` +
        `Gostaria de confirmar o pedido e combinar os detalhes do envio.`;

      const whatsappUrl = `https://wa.me/5521967802174?text=${encodeURIComponent(message)}`;

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

      setIsDialogOpen(false);
      
      toast({
        title: "Pedido criado com sucesso!",
        description: "Abrindo o WhatsApp...",
        duration: 2000,
      });
      
      clearCart();
      setFormData({
        fullName: '',
        cpf: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: ''
      });

      window.location.assign(whatsappUrl);
      
    } catch (error) {
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
                      navigate('/checkout-cadastro');
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
            {/* Nome completo */}
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={formErrors.fullName ? "border-destructive" : ""}
                disabled={isProcessing}
              />
              {formErrors.fullName && (
                <p className="text-destructive text-xs">{formErrors.fullName}</p>
              )}
            </div>

            {/* CPF */}
            <div className="grid gap-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleInputChange}
                onBlur={handleCpfBlur}
                className={formErrors.cpf && cpfTouched ? "border-destructive" : ""}
                disabled={isProcessing}
              />
              {formErrors.cpf && cpfTouched && (
                <p className="text-destructive text-xs">{formErrors.cpf}</p>
              )}
            </div>

            {/* CEP */}
            <div className="grid gap-2">
              <Label htmlFor="cep">CEP</Label>
              <div className="relative">
                <Input
                  id="cep"
                  name="cep"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={handleInputChange}
                  className={formErrors.cep || cepError ? "border-destructive pr-10" : "pr-10"}
                  disabled={isProcessing}
                />
                {isLoadingCep && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              {formErrors.cep && (
                <p className="text-destructive text-xs">{formErrors.cep}</p>
              )}
              {cepError && !formErrors.cep && (
                <p className="text-yellow-600 dark:text-yellow-400 text-xs">{cepError} - preencha o endereço manualmente</p>
              )}
            </div>

            {/* Logradouro + Número */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 grid gap-2">
                <Label htmlFor="logradouro">Logradouro</Label>
                <Input
                  id="logradouro"
                  name="logradouro"
                  placeholder="Rua, Avenida..."
                  value={formData.logradouro}
                  onChange={handleInputChange}
                  className={formErrors.logradouro ? "border-destructive" : ""}
                  disabled={isProcessing}
                />
                {formErrors.logradouro && (
                  <p className="text-destructive text-xs">{formErrors.logradouro}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  name="numero"
                  placeholder="Nº"
                  value={formData.numero}
                  onChange={handleInputChange}
                  className={formErrors.numero ? "border-destructive" : ""}
                  disabled={isProcessing}
                />
                {formErrors.numero && (
                  <p className="text-destructive text-xs">{formErrors.numero}</p>
                )}
              </div>
            </div>

            {/* Complemento */}
            <div className="grid gap-2">
              <Label htmlFor="complemento">Complemento <span className="text-muted-foreground">(opcional)</span></Label>
              <Input
                id="complemento"
                name="complemento"
                placeholder="Apto, Bloco..."
                value={formData.complemento}
                onChange={handleInputChange}
                disabled={isProcessing}
              />
            </div>

            {/* Bairro + Cidade + UF */}
            <div className="grid grid-cols-6 gap-3">
              <div className="col-span-2 grid gap-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                  className={formErrors.bairro ? "border-destructive" : ""}
                  disabled={isProcessing}
                />
                {formErrors.bairro && (
                  <p className="text-destructive text-xs">{formErrors.bairro}</p>
                )}
              </div>
              <div className="col-span-3 grid gap-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  className={formErrors.cidade ? "border-destructive" : ""}
                  disabled={isProcessing}
                />
                {formErrors.cidade && (
                  <p className="text-destructive text-xs">{formErrors.cidade}</p>
                )}
              </div>
              <div className="col-span-1 grid gap-2">
                <Label htmlFor="uf">UF</Label>
                <Input
                  id="uf"
                  name="uf"
                  maxLength={2}
                  value={formData.uf}
                  onChange={handleInputChange}
                  className={formErrors.uf ? "border-destructive" : ""}
                  disabled={isProcessing}
                />
                {formErrors.uf && (
                  <p className="text-destructive text-xs">{formErrors.uf}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
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
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Finalizar e enviar por WhatsApp"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartPage;
