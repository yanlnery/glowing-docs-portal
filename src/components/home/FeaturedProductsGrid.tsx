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
      containScroll: false,
    },
    [autoplayPlugin]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        scrollNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext]);

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

      {/* Grid no mobile (2 colunas), Carousel no desktop */}
      {/* Mobile: Grid 2 colunas */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {displayedProducts.slice(0, 6).map((product, index) => (
          <FeaturedProductCard 
            key={product.id}
            product={product} 
            index={index} 
          />
        ))}
      </div>

      {/* Desktop: Carousel */}
      <div className="hidden sm:block overflow-hidden mx-0 sm:mx-12" ref={emblaRef}>
        <div className="flex">
          {displayedProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="flex-none sm:w-[45%] lg:w-[30%] xl:w-[30%] pr-6 lg:pr-8"
            >
              <FeaturedProductCard 
                product={product} 
                index={index} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicators - apenas desktop */}
      <div className="hidden sm:flex justify-center gap-2 mt-6">
        {displayedProducts.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex 
                ? "bg-primary w-8" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2"
            }`}
            onClick={() => scrollTo(index)}
            aria-label={`Ir para produto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
