
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Product } from "@/types/product";
import { getProductImageUrl } from "@/utils/productImageUtils";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";

interface FeaturedProductCardProps {
  product: Product;
  index: number;
}

export default function FeaturedProductCard({ product, index }: FeaturedProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [isAdding, setIsAdding] = useState(false);
  
  console.log(`📱 MOBILE - Renderizando produto ${index}:`, { 
    id: product.id, 
    name: product.name, 
    hasImages: product.images && product.images.length > 0,
    imageUrl: product.images && product.images.length > 0 ? product.images[0].url : 'none'
  });
  
  const imageUrl = getProductImageUrl(product);
  
  const handleAddToCart = () => {
    if (product.status === 'disponivel') {
      setIsAdding(true);
      addToCart(product, 1);
      toast.success(`${product.name} adicionado ao carrinho!`, {
        duration: 2000,
      });
      
      setTimeout(() => {
        setIsAdding(false);
      }, 1500);
    }
  };
  
  return (
    <div 
      key={product.id} 
      className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group w-full"
      style={{
        minHeight: "200px",
        height: "auto",
        overflow: "visible"
      }}
      onLoad={() => console.log(`📱 Product ${index} container loaded`)}
    >
      <Link to={`/produtos/${product.id}`} className="block relative overflow-hidden aspect-square group/image cursor-pointer">
        <OptimizedImage
          src={imageUrl || "/placeholder.svg"}
          alt={product.name}
          priority={index === 0}
          quality={95}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="w-full h-full group-hover/image:scale-105 transition-transform duration-300"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            width: "100%",
            height: "100%"
          }}
          onLoad={() => console.log(`✅ MOBILE - Produto ${product.name} imagem carregada na home`)}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
          {product.status === 'disponivel' ? (
            <span className="inline-block bg-serpente-600 text-white text-xs px-2 py-1 rounded">Disponível</span>
          ) : (
            <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded">Indisponível</span>
          )}
        </div>
      </Link>
      <div className="p-3 sm:p-4">
        <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 line-clamp-1">
          <em>{product.speciesName}</em>
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-2 line-clamp-1">{product.name}</p>
        
        {/* Preços - PIX em destaque primeiro */}
        <div className="space-y-1 mb-3">
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">
              De R$ {product.originalPrice.toFixed(2).replace('.', ',')}
            </p>
          )}
          
          {/* Preço PIX em destaque */}
          {product.pixPrice && (
            <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
              R$ {product.pixPrice.toFixed(2).replace('.', ',')} <span className="text-sm font-semibold">no PIX</span>
            </p>
          )}
          
          {/* Preço parcelado */}
          <p className="text-xs text-muted-foreground dark:text-gray-300">
            ou R$ {product.price.toFixed(2).replace('.', ',')} em até 10x sem juros
          </p>
        </div>
        
        <Button
          variant={product.status === 'indisponivel' ? "secondary" : "default"}
          size="sm"
          className={`w-full min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm touch-manipulation transition-all ${
            isAdding ? 'animate-pulse bg-green-600 hover:bg-green-600' : ''
          }`}
          onClick={handleAddToCart}
          disabled={product.status === 'indisponivel'}
        >
          {product.status === 'indisponivel' ? (
            'Esgotado'
          ) : isAdding ? (
            <>
              <Check className="w-4 h-4 mr-1 animate-bounce" />
              Adicionado!
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-1" />
              Adicionar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
