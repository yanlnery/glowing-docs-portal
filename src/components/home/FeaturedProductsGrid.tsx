import React from "react";
import { Product } from "@/types/product";
import FeaturedProductCard from "./FeaturedProductCard";
import FeaturedProductsEmpty from "./FeaturedProductsEmpty";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface FeaturedProductsGridProps {
  products: Product[];
}

export default function FeaturedProductsGrid({ products }: FeaturedProductsGridProps) {
  // Limita para 10 produtos
  const displayedProducts = products.slice(0, 10);
  
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true, 
      align: "start",
      slidesToScroll: 1,
      dragFree: true,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  if (displayedProducts.length === 0) {
    return <FeaturedProductsEmpty />;
  }
  
  return (
    <div className="w-full mt-6 sm:mt-8 overflow-hidden" ref={emblaRef}>
      <div className="flex gap-4">
        {displayedProducts.map((product, index) => (
          <div 
            key={product.id} 
            className="flex-none w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] xl:w-[calc(20%-13px)]"
          >
            <FeaturedProductCard 
              product={product} 
              index={index} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
