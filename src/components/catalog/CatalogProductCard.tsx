
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/types/product";
import { getProductImageUrl } from "@/utils/productImageUtils";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/hooks/use-toast";
import { Star, AlertCircle, ShoppingCart, Check } from "lucide-react";

interface CatalogProductCardProps {
  product: Product;
  index: number;
}

export default function CatalogProductCard({ product, index }: CatalogProductCardProps) {
  const { addToCart, isProductInCart } = useCartStore();
  const { toast } = useToast();

  const isInCart = isProductInCart(product.id);
  const isUnavailable = product.status === 'indisponivel' || product.status === 'vendido';
  const imageUrl = getProductImageUrl(product);

  const handleAddToCart = (product: Product) => {
    if (isProductInCart(product.id)) {
      toast({
        title: "Produto já no carrinho",
        description: `${product.name} já foi adicionado ao carrinho`,
        variant: "default",
      });
      return;
    }

    addToCart(product);
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho`,
      variant: "default",
    });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Sob consulta";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Card 
      className="flex flex-col h-full docs-card-gradient"
      style={{
        minHeight: "300px",
        height: "auto",
        overflow: "visible"
      }}
    >
      <Link to={`/produtos/${product.id}`} className="block relative cursor-pointer">
        <div 
          className="aspect-square md:aspect-[4/3] overflow-hidden rounded-t-lg"
          style={{
            width: "100%",
            height: "auto"
          }}
        >
          <OptimizedImage
            src={imageUrl || '/placeholder.svg'}
            alt={product.name}
            priority={index < 4}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-full"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              width: "100%",
              height: "100%"
            }}
          />
        </div>
        
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.featured && (
            <Badge variant="secondary" className="bg-yellow-100 hover:bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs px-1.5 py-0.5">
              <Star className="h-3 w-3 mr-1 inline" /> Destaque
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="secondary" className="bg-blue-100 hover:bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-1.5 py-0.5">
              Novidade
            </Badge>
          )}
          {isUnavailable && (
            <Badge variant="secondary" className="bg-red-100 hover:bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs px-1.5 py-0.5">
              <AlertCircle className="h-3 w-3 mr-1 inline" /> 
              {product.status === 'vendido' ? 'Vendido' : 'Indisponível'}
            </Badge>
          )}
          {isInCart && (
            <Badge variant="secondary" className="bg-green-100 hover:bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs px-1.5 py-0.5">
              <Check className="h-3 w-3 mr-1 inline" /> No carrinho
            </Badge>
          )}
        </div>
      </Link>
      
      <CardHeader className="p-2 sm:p-3 pb-1 sm:pb-2">
        <CardTitle className="text-sm sm:text-base text-balance line-clamp-2">
          {product.name}
          {product.meta?.productId && (
            <span className="text-muted-foreground font-normal text-xs ml-1">{product.meta.productId}</span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-2 sm:p-3 pt-0 pb-1 sm:pb-2 flex-1">
        <p className="text-xs sm:text-sm text-muted-foreground italic mb-2 line-clamp-1 opacity-70">{product.speciesName}</p>
        
        <div className="space-y-1">
          {product.originalPrice && (
            <p className="text-[10px] sm:text-xs text-muted-foreground line-through">
              De {formatPrice(product.originalPrice)}
            </p>
          )}
          
          {product.pixPrice && (
            <div className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
              {formatPrice(product.pixPrice)} <span className="text-xs font-semibold">no PIX</span>
            </div>
          )}
          
          <div className="space-y-0">
            <p className="text-[10px] sm:text-xs text-muted-foreground dark:text-gray-300 whitespace-nowrap">
              ou {formatPrice(product.price)} em até 10x s/ juros
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-2 sm:p-3 pt-1 sm:pt-2">
        <div className="flex gap-2 w-full">
          <Button 
            variant="default" 
            className="flex-1 min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm font-semibold touch-manipulation"
            asChild
          >
            <Link to={`/produtos/${product.id}`}>
              Adquirir
            </Link>
          </Button>
          {!isUnavailable && (
            <Button 
              variant={isInCart ? "secondary" : "default"}
              className="min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm touch-manipulation"
              onClick={() => handleAddToCart(product)}
              disabled={isInCart}
            >
              {isInCart ? (
                <Check className="h-4 w-4" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
