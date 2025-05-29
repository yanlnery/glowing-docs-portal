
import React from "react";
import { Product } from "@/types/product";
import FeaturedProductCard from "./FeaturedProductCard";
import FeaturedProductsEmpty from "./FeaturedProductsEmpty";

interface FeaturedProductsGridProps {
  products: Product[];
}

export default function FeaturedProductsGrid({ products }: FeaturedProductsGridProps) {
  return (
    <div 
      className="w-full min-h-[300px] grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8"
      style={{ 
        minHeight: "300px", 
        height: "auto",
        overflow: "visible",
        zIndex: 1 
      }}
      onLoad={() => console.log("📱 Grid container loaded")}
    >
      {products.length > 0 ? (
        products.map((product, index) => (
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
