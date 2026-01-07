
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  
  const imageUrl = getProductImageUrl(product);
  
  const handleAddToCart = () => {
    if (product.status === 'disponivel') {
      setIsAdding(true);
      addToCart(product, 1);
      toast.success(`${product.name} adicionado ao carrinho!`, {
        duration: 2000,
      });
      
      // Redirecionar para o carrinho
      setTimeout(() => {
        navigate('/carrinho');
      }, 400);
    }
  };
  
  return (
    <div 
      key={product.id} 
      className="docs-card-gradient border rounded-lg overflow-hidden w-full"
      style={{
        minHeight: "280px",
        height: "auto",
        overflow: "visible"
      }}
    >
      <Link to={`/produtos/${product.id}`} className="block relative overflow-hidden aspect-square cursor-pointer">
        <OptimizedImage
          src={imageUrl || "/placeholder.svg"}
          alt={product.name}
          priority={index < 4}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 320px"
          className="w-full h-full object-cover"
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
          {product.name}
          {product.meta?.productId && (
            <span className="text-muted-foreground font-normal text-xs ml-1">{product.meta.productId}</span>
          )}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-2 line-clamp-1 opacity-70">
          <em>{product.speciesName}</em>
        </p>
        
        <div className="space-y-1 mb-3">
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">
              De R$ {product.originalPrice.toFixed(2).replace('.', ',')}
            </p>
          )}
          
          {product.pixPrice && (
            <p className="text-base sm:text-xl font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
              R$ {product.pixPrice.toFixed(2).replace('.', ',')} <span className="text-xs sm:text-sm font-semibold">no PIX</span>
            </p>
          )}
          
          <p className="text-xs text-muted-foreground dark:text-gray-300">
            ou R$ {product.price.toFixed(2).replace('.', ',')} em até 10x sem juros
          </p>
        </div>
        
        <Button
          variant={product.status === 'indisponivel' ? "secondary" : "default"}
          size="sm"
          className={`w-full min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm touch-manipulation ${
            isAdding ? 'bg-green-600 hover:bg-green-600' : ''
          }`}
          onClick={handleAddToCart}
          disabled={product.status === 'indisponivel'}
        >
          {product.status === 'indisponivel' ? (
            'Esgotado'
          ) : isAdding ? (
            <>
              <Check className="w-4 h-4 mr-1" />
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
