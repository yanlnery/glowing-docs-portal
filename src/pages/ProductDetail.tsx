import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, ArrowLeft, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Package, FileText, MessageCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ProductImageZoom } from '@/components/product/ProductImageZoom';
import { siteAnalyticsService } from '@/services/siteAnalyticsService';
import { useAddToCartAnimation } from '@/hooks/useAddToCartAnimation';
import { cartIconRef, cartRingRef } from '@/components/header/HeaderActions';
import { DEFAULT_OG_IMAGE, restoreSeoDefaults } from '@/lib/seoDefaults';
import { useCheckoutV2Enabled } from '@/hooks/useCheckoutV2';
import { guestOrderService } from '@/services/guestOrderService';
import { GuestWhatsAppDialog, GuestWhatsAppFormData } from '@/components/product/GuestWhatsAppDialog';

const getAnimalEmoji = (category?: string): string => {
  switch (category) {
    case 'lagarto': return '🦎';
    case 'quelonio': return '🐢';
    case 'serpente':
    default: return '🐍';
  }
};

// Caminho canônico de um produto: sempre a URL nova (/animais/{new_slug})
export const getProductPath = (product: Pick<Product, 'id' | 'newSlug'>) =>
  product.newSlug ? `/animais/${product.newSlug}` : `/produtos/${product.id}`;

interface ProductSeoProps {
  routeKey?: string;
  product: Product | null;
  loading: boolean;
}

const ProductSeo = ({ routeKey, product, loading }: ProductSeoProps) => {
  const canonicalUrl = product
    ? `https://petserpentes.com.br${getProductPath(product)}`
    : routeKey
      ? `https://petserpentes.com.br/animais/${routeKey}`
      : 'https://petserpentes.com.br/catalogo';

  const isSold = product?.status === 'vendido';
  const primaryImage = product?.images?.[0]?.url;
  const metaTitle = product
    ? `${product.name} | ${product.speciesName} à venda | Pet Serpentes`
    : loading
      ? 'Carregando produto | Pet Serpentes'
      : 'Produto não encontrado | Pet Serpentes';
  const metaDescription = product
    ? (
        product.description?.replace(/\s+/g, ' ').trim() ||
        `${product.name} (${product.speciesName}) disponível no Pet Serpentes & Companhia, criadouro legalizado pelo IBAMA no Rio de Janeiro.`
      ).slice(0, 155)
    : loading
      ? 'Consulte informações, fotos, disponibilidade e documentação deste animal no Pet Serpentes.'
      : 'O produto procurado não está disponível no catálogo do Pet Serpentes.';


  const productJsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: metaDescription,
    ...(primaryImage ? { image: [primaryImage] } : {}),
    ...(product.meta?.productId ? { sku: product.meta.productId } : {}),
    category: product.category,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Espécie', value: product.speciesName },
    ],
    brand: { '@type': 'Brand', name: 'Pet Serpentes & Companhia' },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'BRL',
      price: (product.pixPrice ?? product.price).toFixed(2),
      availability: isSold
        ? 'https://schema.org/SoldOut'
        : product.available
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',

      seller: { '@type': 'Organization', name: 'Pet Serpentes & Companhia' },
    },
  } : null;

  const breadcrumbJsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://petserpentes.com.br/' },
      { '@type': 'ListItem', position: 2, name: 'Catálogo', item: 'https://petserpentes.com.br/catalogo' },
      { '@type': 'ListItem', position: 3, name: product.name, item: canonicalUrl },
    ],
  } : null;

  useLayoutEffect(() => {
    const upsertMeta = (attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    document.title = metaTitle;
    upsertMeta('name', 'description', metaDescription);
    upsertMeta('name', 'robots', (!loading && !product) || isSold ? 'noindex, follow' : 'index, follow');
    upsertMeta('property', 'og:type', product ? 'product' : 'website');
    upsertMeta('property', 'og:title', metaTitle);
    upsertMeta('property', 'og:description', metaDescription);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('name', 'twitter:title', metaTitle);
    upsertMeta('name', 'twitter:description', metaDescription);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    upsertMeta('property', 'og:image', primaryImage || DEFAULT_OG_IMAGE);
    upsertMeta('name', 'twitter:image', primaryImage || DEFAULT_OG_IMAGE);

    document.head.querySelectorAll('script[data-product-seo]').forEach((script) => script.remove());
    [productJsonLd, breadcrumbJsonLd].forEach((schema, index) => {
      if (!schema) return;
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.productSeo = index === 0 ? 'product' : 'breadcrumb';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      document.head.querySelectorAll('script[data-product-seo]').forEach((script) => script.remove());
      restoreSeoDefaults();
    };
  }, [breadcrumbJsonLd, canonicalUrl, loading, metaDescription, metaTitle, primaryImage, product, productJsonLd]);

  return null;
};

const ProductDetail = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const location = useLocation();
  const routeKey = slug || id;
  const isLegacyRoute = location.pathname.startsWith('/produtos/');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSpeciesDetails, setShowSpeciesDetails] = useState(false);
  const { addToCart } = useCartStore();
  const navigate = useNavigate();
  const productImageRef = useRef<HTMLDivElement>(null);
  const { triggerFlyAnimation } = useAddToCartAnimation();
  const checkoutV2Enabled = useCheckoutV2Enabled();
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [guestSubmitting, setGuestSubmitting] = useState(false);

  const handleGuestWhatsAppClick = () => {
    if (!product) return;
    siteAnalyticsService.trackEvent({
      event_type: 'whatsapp_direct_click',
      event_category: 'conversion',
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      metadata: { product_code: product.meta?.productId },
    });
    siteAnalyticsService.trackEvent({
      event_type: 'checkout_v2_open',
      event_category: 'checkout',
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
    });
    setGuestDialogOpen(true);
  };

  const handleGuestWhatsAppSubmit = async (data: GuestWhatsAppFormData) => {
    if (!product) return;
    setGuestSubmitting(true);
    try {
      const { orderNumber, error } = await guestOrderService.createGuestLeadOrder({
        productId: product.id,
        customerName: data.name,
        customerPhone: data.phone,
      });

      if (error) {
        toast({
          title: 'Não foi possível registrar seu interesse',
          description: error.message?.includes('disponivel')
            ? 'Este animal não está mais disponível.'
            : 'Tente novamente em instantes.',
          variant: 'destructive',
        });
        return;
      }

      siteAnalyticsService.trackEvent({
        event_type: 'checkout_v2_submit',
        event_category: 'checkout',
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        metadata: { order_number: orderNumber },
      });

      const whatsappNumber = await guestOrderService.getWhatsAppNumber();
      const emoji = getAnimalEmoji(product.category);
      const code = product.meta?.productId ?? '';
      const sexLabel = getSexLabel(product.meta?.sex) ?? 'Indefinido';
      const price = product.price.toFixed(2).replace('.', ',');
      const pixPrice = (product.pixPrice ?? product.price).toFixed(2).replace('.', ',');
      const productPath = getProductPath(product);
      const message = [
        'Olá! Tenho interesse neste animal:',
        `${emoji} ${product.name} (${product.speciesName})`,
        `Código: ${code} · ${sexLabel}`,
        `Valor: R$ ${price} (R$ ${pixPrice} no PIX)`,
        `Pedido: ${orderNumber}`,
        `petserpentes.com.br${productPath}`,
      ].join('\n');

      setGuestDialogOpen(false);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Guest checkout error:', err);
      toast({
        title: 'Erro inesperado',
        description: 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    } finally {
      setGuestSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (routeKey) {
      const loadProduct = async () => {
        try {
          setLoading(true);
          const foundProduct = await productService.getProductById(routeKey);
          setProduct(foundProduct);
          setSelectedImageIndex(0);
          
          // Track product view
          if (foundProduct) {
            siteAnalyticsService.trackProductView({
              id: foundProduct.id,
              name: foundProduct.name,
              price: foundProduct.price,
            });
          }
        } catch (error) {
          console.error("Error loading product:", error);
        } finally {
          setLoading(false);
        }
      };
      
      loadProduct();
    }
  }, [routeKey]);
  
  if (loading) {
    return (
      <>
        <ProductSeo routeKey={routeKey} product={product} loading />
        <div className="container px-4 py-12 sm:px-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-serpente-600"></div>
        </div>
      </>
    );
  }

  // Rota antiga (/produtos/...) redireciona para a URL semântica nova
  if (product?.newSlug && isLegacyRoute) {
    return <Navigate to={`/animais/${product.newSlug}${location.search}`} replace />;
  }
  
  if (!product) {
    return (
      <>
        <ProductSeo routeKey={routeKey} product={product} loading={false} />
        <div className="container px-4 py-12 sm:px-6 flex flex-col items-center">

          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <Button asChild>
            <Link to="/catalogo">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Catálogo
            </Link>
          </Button>
        </div>
      </>
    );
  }
  
  const formatPrice = (price: number) => {
    if (price === 0) return "Sob consulta";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getSexLabel = (sex: string | undefined) => {
    if (!sex) return null;
    switch (sex) {
      case 'male': return 'Macho';
      case 'female': return 'Fêmea';
      case 'undefined': return 'Indefinido';
      default: return sex;
    }
  };
  
  const handleAddToCart = async () => {
    if (!product) return;

    const addProduct = () => {
      try {
        addToCart(product);

        toast({
          title: "Produto adicionado ao carrinho",
          description: `${product.name} foi adicionado ao seu carrinho.`,
          duration: 2000,
        });

        setTimeout(() => {
          navigate('/carrinho');
        }, 2000);
      } catch (error) {
        console.error("Error adding product to cart:", error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o produto ao carrinho.",
          variant: "destructive",
        });
      }
    };

    if (productImageRef.current && cartIconRef.current && cartRingRef.current) {
      triggerFlyAnimation(
        productImageRef.current,
        cartIconRef.current,
        cartRingRef.current,
        addProduct
      );
    } else {
      addProduct();
    }
  };
  
  return (
    <>
      <ProductSeo routeKey={routeKey} product={product} loading={false} />
      <div className="container px-4 py-12 sm:px-6">
        <div className="mb-4">
        <div className="flex items-center text-muted-foreground text-sm mb-8">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/catalogo" className="hover:underline">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images with In-place Zoom */}
          {product.images && product.images.length > 0 && (
            <ProductImageZoom
              ref={productImageRef}
              images={product.images}
              productName={product.name}
              selectedIndex={selectedImageIndex}
              onIndexChange={setSelectedImageIndex}
              style={{ willChange: "transform, opacity" }}
            />
          )}
          
          {/* Product Information */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.featured && (
                <Badge variant="secondary" className="bg-yellow-100 hover:bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-sm">
                  <Star className="h-3 w-3 mr-1 inline" /> Destaque
                </Badge>
              )}
              {product.isNew && (
                <Badge variant="secondary" className="bg-blue-100 hover:bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm">
                  Novidade
                </Badge>
              )}
              {product.status === 'vendido' ? (
                <Badge variant="destructive" className="text-sm">Vendido</Badge>
              ) : (
                <Badge variant={product.available ? "default" : "outline"} className="text-sm">
                  {product.available ? "Disponível" : "Indisponível"}
                </Badge>
              )}

            </div>
            
            <div>
              <h1 className="text-3xl font-bold">
                {product.name}
                {product.meta?.productId && (
                  <span className="text-lg text-muted-foreground ml-2 font-normal">
                    #{product.meta.productId}
                  </span>
                )}
              </h1>
              <p className="text-xl text-muted-foreground italic mt-1">
                <em>{product.speciesName}</em>
              </p>
            </div>
            
            <div className="space-y-2">
              {product.originalPrice && product.originalPrice > (product.pixPrice || product.price) && (
                <div className="text-sm text-muted-foreground line-through">
                  De {formatPrice(product.originalPrice)}
                </div>
              )}
              
              {product.pixPrice ? (
                <>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {formatPrice(product.pixPrice)} no PIX
                    </span>
                    {(() => {
                      const base = product.originalPrice || product.price;
                      const discount = Math.round((1 - product.pixPrice / base) * 100);
                      return discount > 0 ? (
                        <Badge className="bg-green-600 hover:bg-green-600 text-white text-xs">
                          {discount}% OFF
                        </Badge>
                      ) : null;
                    })()}
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    ou {formatPrice(product.price)} em até 10x sem juros
                  </p>
                </>
              ) : (
                <>
                  <div className="text-3xl font-bold text-serpente-600 dark:text-serpente-400">
                    {formatPrice(product.price)}
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    em até 10x sem juros
                  </p>
                </>
              )}
            </div>
            
            {/* Species Details - Collapsible */}
            {product.description && (
              <Collapsible open={showSpeciesDetails} onOpenChange={setShowSpeciesDetails}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Detalhes da Espécie</span>
                    {showSpeciesDetails ? (
                      <ChevronUp className="h-4 w-4 ml-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h2 className="font-semibold mb-2">Descrição</h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
            
            <div className="pt-4 border-t">
              <h2 className="font-semibold mb-2">Características</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <p className="font-medium capitalize">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subcategoria</p>
                  <p className="font-medium capitalize">{product.subcategory}</p>
                </div>
                {product.meta?.sex && (
                  <div>
                    <p className="text-sm text-muted-foreground">Sexo</p>
                    <p className="font-medium">{getSexLabel(product.meta.sex)}</p>
                  </div>
                )}
                {product.meta?.age && (
                  <div>
                    <p className="text-sm text-muted-foreground">Idade</p>
                    <p className="font-medium">{product.meta.age}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Shipping Section */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-serpente-600" />
                <h2 className="font-semibold">Envio</h2>
              </div>
              <p className="text-sm font-medium mb-2">Custo do envio por conta do comprador.</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Serviço de envio garantido com as companhias aéreas Gollog e Latam.</li>
                <li>Custos adicionais de envio variam conforme região e horário de chegada do voo.</li>
                <li>Custos de envio: <strong className="text-foreground">Valores mínimos de R$250,00 e máximos de R$365,00</strong>, incluindo consulta prévia com veterinário, emissão de GTA (Guia de Trânsito Animal), Caixa de Transporte e Aéreo.</li>
              </ul>
            </div>

            {/* Fixed Documents Section */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-serpente-600" />
                <h2 className="font-semibold">Documentos Inclusos</h2>
              </div>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Nota Fiscal (Inclui numeração do Microchip do Animal).</li>
                <li>Certificado de Origem (Emitido via Sisfauna - Sistema Nacional de Gestão de Fauna Silvestre).</li>
                <li>Licença de Transporte (Emitido via Sisfauna).</li>
                <li>GTA - Guia de Transporte Animal (Interestadual).</li>
                <li>Atestado Sanitário (Interestadual).</li>
              </ul>
            </div>
            
            {/* Add to Cart / Animal vendido */}
            <div className="pt-6 border-t">
              {product.status === 'vendido' ? (
                <div className="mb-4 space-y-3">
                  <div className="bg-muted/50 p-4 rounded-md">
                    <p className="font-semibold mb-1">Este animal já foi vendido.</p>
                    <p className="text-sm text-muted-foreground">
                      Entre na lista de espera ou fale com a gente no WhatsApp para saber dos próximos nascimentos de {product.speciesName}.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="w-full h-10">
                      <Link to="/lista-de-espera">Entrar na lista de espera</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full h-10">
                      <a
                        href={`https://wa.me/5521967802174?text=${encodeURIComponent(
                          `Olá! Vi o animal ${product.name}${product.meta?.productId ? ` (#${product.meta.productId})` : ''} no site, mas está vendido. Gostaria de saber sobre disponibilidade de ${product.speciesName}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" /> Falar no WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mb-4">
                  <Button
                    className="w-full h-10"
                    onClick={handleAddToCart}
                    disabled={!product.available}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Adicionar ao Carrinho
                  </Button>
                  {checkoutV2Enabled && (
                    <Button
                      variant="outline"
                      className="w-full h-10"
                      onClick={handleGuestWhatsAppClick}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" /> Falar sobre este animal no WhatsApp
                    </Button>
                  )}
                </div>
              )}

              
              <div className="space-y-3">
                <div className="bg-muted/50 p-3 rounded-md text-sm flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-serpente-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Todos os animais são registrados no IBAMA e possuem documentação legal completa.
                    <Link to="/contato" className="text-serpente-600 hover:underline ml-1">Saiba mais</Link>
                  </p>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md text-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-800 dark:text-yellow-300">
                    ⚠️ O frete é sujeito à disponibilidade logística e valores variam por região. Prossiga para mais detalhes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
