
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WebsiteLayout from '@/layouts/WebsiteLayout';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft,
  CircleDollarSign,
  ImageIcon,
  ShoppingCart,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Get settings from localStorage
const getSettings = () => {
  try {
    const settingsData = localStorage.getItem('pet_serpentes_admin_settings');
    return settingsData 
      ? JSON.parse(settingsData) 
      : {
          whatsappNumber: '5521999999999',
          whatsappDefaultMessage: 'Olá! Acabei de realizar a compra do [NOME DO ANIMAL] no site PetSerpentes. Este é o comprovante/link que recebi: [URL DO PAGAMENTO]. Aguardando confirmação. Obrigado!',
        };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return {
      whatsappNumber: '5521999999999',
      whatsappDefaultMessage: 'Olá! Acabei de realizar a compra do [NOME DO ANIMAL] no site PetSerpentes. Este é o comprovante/link que recebi: [URL DO PAGAMENTO]. Aguardando confirmação. Obrigado!',
    };
  }
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProduct();
  }, [id]);

  const loadProduct = () => {
    setIsLoading(true);
    
    // Check if id exists
    if (!id) {
      setIsLoading(false);
      toast({
        title: "Produto não encontrado",
        description: "O produto que você está procurando não existe.",
        variant: "destructive",
      });
      navigate('/catalogo');
      return;
    }
    
    // Try to find the product
    const foundProduct = productService.getById(id);
    
    if (!foundProduct) {
      setIsLoading(false);
      toast({
        title: "Produto não encontrado",
        description: "O produto que você está procurando não existe.",
        variant: "destructive",
      });
      navigate('/catalogo');
      return;
    }
    
    // Check if product is visible and available
    if (!foundProduct.visible) {
      setIsLoading(false);
      toast({
        title: "Produto indisponível",
        description: "Este produto não está mais disponível para visualização.",
        variant: "destructive",
      });
      navigate('/catalogo');
      return;
    }
    
    setProduct(foundProduct);
    setIsLoading(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBuyNow = () => {
    setShowPaymentDialog(true);
  };

  const handleExternalPayment = () => {
    if (!product || !product.paymentLink) return;
    
    // Open the payment link in a new tab
    window.open(product.paymentLink, '_blank');
    setShowPaymentDialog(false);
  };

  const handleWhatsAppRedirect = () => {
    if (!product) return;
    
    const settings = getSettings();
    const phoneNumber = settings.whatsappNumber;
    
    // Replace placeholders in the message
    let message = settings.whatsappDefaultMessage
      .replace('[NOME DO ANIMAL]', product.name)
      .replace('[URL DO PAGAMENTO]', product.paymentLink || 'não disponível');
    
    // Encode message for URL
    message = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Sob consulta";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'indisponivel':
        return 'Indisponível';
      case 'vendido':
        return 'Vendido';
      default:
        return 'Status desconhecido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'bg-green-500';
      case 'indisponivel':
        return 'bg-yellow-500';
      case 'vendido':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <WebsiteLayout>
        <div className="container py-12 min-h-[70vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-serpente-600"></div>
        </div>
      </WebsiteLayout>
    );
  }

  if (!product) {
    return (
      <WebsiteLayout>
        <div className="container py-12 min-h-[70vh] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
          <p className="text-muted-foreground mb-6">
            O produto que você está procurando não está disponível.
          </p>
          <Button onClick={handleGoBack}>Voltar para a lista</Button>
        </div>
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout>
      <div className="container py-6 md:py-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 aspect-square">
                <img
                  src={product.images[currentImageIndex].url}
                  alt={product.images[currentImageIndex].alt || product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-3 py-1.5 text-xs font-medium text-white rounded-full ${getStatusColor(product.status)}`}>
                    {getStatusText(product.status)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center border border-gray-200 dark:border-gray-800 rounded-lg aspect-square bg-gray-100 dark:bg-gray-800">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}

            {product.images && product.images.length > 1 && (
              <Carousel className="w-full max-w-sm mx-auto">
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={image.id} className="basis-1/4 md:basis-1/5">
                      <div 
                        className={`relative aspect-square cursor-pointer overflow-hidden rounded border ${
                          index === currentImageIndex 
                            ? 'border-serpente-600 ring-2 ring-serpente-600 ring-offset-2' 
                            : 'border-gray-200 dark:border-gray-800'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={image.url}
                          alt={image.alt || `${product.name} - Imagem ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-lg italic text-muted-foreground mt-1">
                {product.speciesName}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-serpente-600">
                {formatPrice(product.price)}
              </div>
              {product.status === 'disponivel' && (
                <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300">
                  <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
                  Disponível
                </span>
              )}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {product.status === 'disponivel' && (
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleBuyNow}
                  disabled={!product.paymentLink}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Comprar Agora
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleWhatsAppRedirect}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Entrar em Contato
                </Button>
              </div>
            )}

            {product.status !== 'disponivel' && (
              <div className="pt-4">
                <Button 
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleWhatsAppRedirect}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Falar com o Criador
                </Button>
              </div>
            )}

            <div className="p-4 rounded-lg border bg-muted/30 text-sm text-muted-foreground">
              <p>
                A venda só será confirmada após verificação manual via WhatsApp ou e-mail. 
                Após o pagamento, entre em contato para confirmação.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar Compra</DialogTitle>
            <DialogDescription>
              Você está comprando o produto: <strong>{product.name}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                {formatPrice(product.price)}
              </div>
              <p className="text-sm text-muted-foreground">
                Clique no botão abaixo para prosseguir para o pagamento.
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleExternalPayment} className="flex-1">
              <CircleDollarSign className="mr-2 h-4 w-4" />
              Prosseguir para Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WebsiteLayout>
  );
};

export default ProductDetail;
