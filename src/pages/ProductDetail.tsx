import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, ArrowLeft, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Package, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ProductImageZoom } from '@/components/product/ProductImageZoom';
import { siteAnalyticsService } from '@/services/siteAnalyticsService';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSpeciesDetails, setShowSpeciesDetails] = useState(false);
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (id) {
      const loadProduct = async () => {
        try {
          setLoading(true);
          const foundProduct = await productService.getProductById(id);
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
  }, [id]);
  
  if (loading) {
    return (
      <div className="container px-4 py-12 sm:px-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-serpente-600"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
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
  
  const handleAddToCart = () => {
    if (!product) return;
    try {
      addToCart(product);
      
      toast({
        title: "Produto adicionado ao carrinho",
        description: `${product.name} foi adicionado ao seu carrinho.`,
        duration: 2000,
      });

      // Automatically redirect to cart after 2 seconds
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
  
  return (
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
              images={product.images}
              productName={product.name}
              selectedIndex={selectedImageIndex}
              onIndexChange={setSelectedImageIndex}
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
              <Badge variant={product.available ? "default" : "outline"} className="text-sm">
                {product.available ? "Disponível" : "Indisponível"}
              </Badge>
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
              {product.originalPrice && (
                <div className="text-sm text-muted-foreground line-through">
                  De {formatPrice(product.originalPrice)}
                </div>
              )}
              
              <div className="text-3xl font-bold text-serpente-600 dark:text-serpente-400">
                {formatPrice(product.price)}
              </div>
              <p className="text-sm text-muted-foreground dark:text-gray-300">
                em até 10x sem juros
              </p>
              
              {product.pixPrice && (
                <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                  {formatPrice(product.pixPrice)} no PIX (10% OFF)
                </div>
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
                <li>Nota Fiscal.</li>
                <li>Certificado de Origem (Emitido via Sisfauna - Sistema Nacional de Gestão de Fauna Silvestre).</li>
                <li>Licença de Transporte (Emitido via Sisfauna).</li>
              </ul>
            </div>
            
            {/* Add to Cart */}
            <div className="pt-6 border-t">
              <div className="flex gap-4 mb-4">
                <Button 
                  className="w-full h-10"
                  onClick={handleAddToCart}
                  disabled={!product.available}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Adicionar ao Carrinho
                </Button>
              </div>
              
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
  );
};

export default ProductDetail;
