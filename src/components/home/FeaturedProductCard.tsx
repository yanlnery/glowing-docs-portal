
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Product } from "@/types/product";
import { getProductImageUrl } from "@/utils/productImageUtils";

interface FeaturedProductCardProps {
  product: Product;
  index: number;
}

export default function FeaturedProductCard({ product, index }: FeaturedProductCardProps) {
  console.log(`📱 MOBILE - Renderizando produto ${index}:`, { 
    id: product.id, 
    name: product.name, 
    hasImages: product.images && product.images.length > 0,
    imageUrl: product.images && product.images.length > 0 ? product.images[0].url : 'none'
  });
  
  const imageUrl = getProductImageUrl(product);
  
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
      <div 
        className="relative overflow-hidden"
        style={{
          height: "160px",
          minHeight: "160px",
          width: "100%"
        }}
      >
        <OptimizedImage
          src={imageUrl || "/placeholder.svg"}
          alt={product.name}
          priority={index === 0}
          quality={80}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="w-full h-full"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            width: "100%",
            height: "100%",
            transform: "scale(1)",
            transition: "transform 0.3s ease"
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
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 line-clamp-1">
          <em>{product.speciesName}</em>
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-1">{product.name}</p>
        <div className="flex justify-end items-center">
          <Button
            variant={product.status === 'indisponivel' ? "secondary" : "outline"}
            size="sm"
            className="min-h-[40px] sm:min-h-[44px] w-full sm:w-auto text-xs sm:text-sm touch-manipulation"
            asChild
            disabled={product.status === 'indisponivel'}
          >
            <Link to={`/produtos/${product.id}`}>
              {product.status === 'indisponivel' ? 'Esgotado' : 'Ver Detalhes'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
