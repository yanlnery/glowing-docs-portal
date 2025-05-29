
import React from "react";
import { Product } from "@/types/product";
import CatalogProductCard from "./CatalogProductCard";

interface CatalogProductsGridProps {
  products: Product[];
}

export default function CatalogProductsGrid({ products }: CatalogProductsGridProps) {
  console.log("📱 CATALOG Render mobile section - produtos filtered count:", products?.length);
  console.log("📱 CATALOG Filtered products data:", products);

  return (
    <div className="w-full min-h-[400px] grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {products.map((product, index) => (
        <CatalogProductCard 
          key={product.id} 
          product={product} 
          index={index} 
        />
      ))}
    </div>
  );
}
