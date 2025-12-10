import React, { useCallback, useEffect, useState } from "react";
import { Product } from "@/types/product";
import FeaturedProductCard from "./FeaturedProductCard";
import FeaturedProductsEmpty from "./FeaturedProductsEmpty";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedProductsGridProps {
  products: Product[];
}

export default function FeaturedProductsGrid({ products }: FeaturedProductsGridProps) {
  const displayedProducts = products.slice(0, 10);
  
  const autoplayPlugin = React.useMemo(
    () => Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "start",
      slidesToScroll: 1,
      dragFree: true,
    },
    [autoplayPlugin]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (displayedProducts.length === 0) {
    return <FeaturedProductsEmpty />;
  }
  
  return (
    <div className="relative mt-6 sm:mt-8">
      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-md hidden sm:flex"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-md hidden sm:flex"
        onClick={scrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Carousel */}
      <div className="overflow-hidden mx-0 sm:mx-10" ref={emblaRef}>
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
    </div>
  );
}
