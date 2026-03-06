
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
  
  const rawImageUrl = getProductImageUrl(product);
  const imageUrl = rawImageUrl
    ? `${rawImageUrl.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/')}${rawImageUrl.includes('?') ? '&' : '?'}width=960&height=720&quality=95`
    : '/placeholder.svg';
  
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
      className="docs-card-gradient border rounded-lg overflow-hidden w-full flex flex-col"
    >
      <Link to={`/produtos/${product.id}`} className="block relative cursor-pointer group">
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            loading={index < 8 ? 'eager' : 'lazy'}
            decoding={index < 8 ? 'sync' : 'async'}
            className="w-full h-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>
        {product.status !== 'disponivel' && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
            <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded">Indisponível</span>
          </div>
        )}
      </Link>
      <div className="p-3 sm:p-4">
        <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 line-clamp-1">
          <Link to={`/produtos/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
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
        
        {product.status === 'vendido' ? (
          <Button
            variant="secondary"
            size="sm"
            className="w-full min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm touch-manipulation opacity-60 cursor-not-allowed"
            disabled
          >
            Vendido
          </Button>
        ) : (
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
        )}
      </div>
    </div>
  );
}
