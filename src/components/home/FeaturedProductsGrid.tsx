
import React from "react";
import { Product } from "@/types/product";
import FeaturedProductCard from "./FeaturedProductCard";
import FeaturedProductsEmpty from "./FeaturedProductsEmpty";

interface FeaturedProductsGridProps {
  products: Product[];
}

export default function FeaturedProductsGrid({ products }: FeaturedProductsGridProps) {
  // Limita para 8 produtos (2 fileiras x 4 colunas)
  const displayedProducts = products.slice(0, 8);
  
  return (
    <div 
      className="w-full min-h-[300px] grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8"
      style={{ 
        minHeight: "300px", 
        height: "auto",
        overflow: "visible",
        zIndex: 1 
      }}
      onLoad={() => console.log("📱 Grid container loaded")}
    >
      {displayedProducts.length > 0 ? (
        displayedProducts.map((product, index) => (
          <FeaturedProductCard 
            key={product.id} 
            product={product} 
            index={index} 
          />
        ))
      ) : (
        <FeaturedProductsEmpty />
      )}
    </div>
  );
}
