
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getCarouselImages, CarouselImage as CarouselImageDef } from "@/services/carouselService";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function HeroCarousel() {
  const [carouselImagesData, setCarouselImagesData] = useState<CarouselImageDef[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  useEffect(() => {
    setCarouselImagesData(getCarouselImages());
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrentImageIndex(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrentImageIndex(api.selectedScrollSnap());
    });
    
    const onPointerUp = () => {
      if (autoplayPlugin.current.options.stopOnInteraction) {
        // Small delay to ensure click events on slides (if any) are processed
        // Then restart autoplay without rewinding
        setTimeout(() => {
            // Check if the interaction was on a focusable element inside the carousel
            if (api.rootNode().contains(document.activeElement)) {
                 // if interaction was on a focusable element inside carousel, let it be
            } else {
                autoplayPlugin.current.play(false);
            }
        }, 100);
      }
    };

    api.on("pointerUp", onPointerUp);

    return () => {
      api.off("select", () => setCurrentImageIndex(api.selectedScrollSnap()));
      api.off("pointerUp", onPointerUp);
    };
  }, [api]);

  const handleIndicatorClick = (index: number) => {
    api?.scrollTo(index);
    if (autoplayPlugin.current.options.stopOnInteraction) {
       autoplayPlugin.current.play(false); 
    }
  };

  if (carouselImagesData.length === 0) {
    return (
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-800 px-4">
        <p className="text-gray-500 dark:text-gray-400">Carregando carrossel...</p>
      </div>
    );
  }

  const currentSlideData = carouselImagesData[currentImageIndex];

  return (
    <div className="relative w-full">
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
          plugins={[autoplayPlugin.current]}
          className="h-full"
        >
          <CarouselContent className="h-full" style={{ touchAction: 'pan-x' }}>
            {carouselImagesData.map((image, index) => (
              <CarouselItem key={image.id || index} className="h-full">
                <div className="relative h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                    style={{ backgroundImage: `url(${image.url})` }}
                    aria-label={image.alt}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Text Overlay: Adjusted padding and text sizes for mobile */}
        <div className="absolute inset-0 z-20 flex flex-col items-start justify-end md:justify-center pb-20 md:pb-0 pointer-events-none"> {/* Increased pb slightly from pb-24 if needed, or ensure buttons are further down*/}
          <div className="container py-6 px-4 sm:px-6 pointer-events-auto">
             {currentSlideData && (
              <>
                <h1 className="text-lg sm:text-xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 max-w-2xl animate-slide-in text-balance"> {/* Slightly reduced base text size */}
                  {currentSlideData.title || "Bem-vindo"}
                </h1>
                <p className="text-xs sm:text-sm md:text-lg text-white/90 max-w-xl mb-4 sm:mb-6 animate-fade-in text-balance"> {/* Slightly reduced base text size and mb */}
                  {currentSlideData.subtitle || "Conheça nossos animais"}
                </p>
              </>
             )}
          </div>
        </div>
        
        {/* Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-30 md:bottom-6">
          {carouselImagesData.map((_, index) => (
            <button
              key={`indicator-${index}`}
              className={cn(
                "w-2.5 h-2.5 md:w-3 md:h-3 rounded-full focus:outline-none transition-all",
                index === currentImageIndex
                  ? "bg-white scale-110"
                  : "bg-white/40 hover:bg-white/60"
              )}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Buttons Container: Ensured it's part of normal flow on mobile, with appropriate spacing */}
      <div className="container px-4 sm:px-6 py-4 sm:py-6 md:absolute md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:z-20 md:py-0 md:pointer-events-auto"> {/* py-4 for mobile */}
        <div className="flex flex-col sm:flex-row gap-3 w-full items-center justify-center md:justify-start">
          <Button size="lg" className="bg-serpente-600 hover:bg-serpente-700 text-white min-h-[48px] w-full sm:w-auto text-sm md:text-base" asChild>
            <Link to="/catalogo">
              Animais Disponíveis <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10 md:bg-white/10 md:border-white/20 md:hover:bg-white/20 min-h-[48px] w-full sm:w-auto text-sm md:text-base" asChild>
            <Link to="/sobre">
              Conheça nossa História
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

