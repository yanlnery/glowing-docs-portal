
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

const CAROUSEL_STORAGE_KEY = 'carouselImages'; // Defined in carouselService.ts

export default function HeroCarousel() {
  const [carouselImagesData, setCarouselImagesData] = useState<CarouselImageDef[]>(getCarouselImages());
  const [api, setApi] = useState<CarouselApi>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  useEffect(() => {
    // Initial load
    setCarouselImagesData(getCarouselImages());

    // Listen for changes in localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === CAROUSEL_STORAGE_KEY) {
        console.log("Carousel data changed in localStorage, reloading images...");
        const updatedImages = getCarouselImages();
        setCarouselImagesData(updatedImages);
        // If the carousel is empty after update, we might want to stop autoplay or reset index
        if (api && updatedImages.length > 0) {
          api.reInit(); // Reinitialize carousel with new slides
          // autoplayPlugin.current.play(false); // Optionally restart autoplay
        } else if (api && updatedImages.length === 0) {
          api.reInit();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [api]); // Added api to dependency array to re-init if needed

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrentImageIndex(api.selectedScrollSnap());
    };

    const onPointerUp = () => {
      if (autoplayPlugin.current.options.stopOnInteraction) {
        setTimeout(() => {
            if (api.rootNode().contains(document.activeElement)) {
                 // if interaction was on a focusable element inside carousel, let it be
            } else {
                autoplayPlugin.current.play(false);
            }
        }, 100); // Increased delay slightly
      }
    };

    setCurrentImageIndex(api.selectedScrollSnap()); // Set initial index
    api.on("select", onSelect);
    api.on("pointerUp", onPointerUp);

    return () => {
      if (api) {
        api.off("select", onSelect); // Pass the handler function
        api.off("pointerUp", onPointerUp); // Pass the handler function
      }
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
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-800 px-4 text-center">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Nenhuma imagem para exibir.</p>
          <p className="text-sm text-gray-400 dark:text-gray-300">Adicione imagens no painel administrativo para ativar o carrossel.</p>
        </div>
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
            loop: carouselImagesData.length > 1, // Only loop if more than one image
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
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Text Overlay: Adjusted padding and text sizes for mobile */}
        <div className="absolute inset-0 z-20 flex flex-col items-start justify-end md:justify-center pb-20 md:pb-0 pointer-events-none">
          <div className="container py-6 px-4 sm:px-6 md:px-8 lg:px-10 pointer-events-auto"> {/* Consistent padding */}
             {currentSlideData && (
              <>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 max-w-2xl animate-slide-in text-balance">
                  {currentSlideData.title || "Bem-vindo"}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl mb-4 sm:mb-6 animate-fade-in text-balance">
                  {currentSlideData.subtitle || "Conheça nossos animais"}
                </p>
              </>
             )}
          </div>
        </div>
        
        {/* Indicators */}
        {carouselImagesData.length > 1 && (
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
        )}
      </div>

      {/* Buttons Container: Ensured it's part of normal flow on mobile, with appropriate spacing */}
      <div className="container px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 md:absolute md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:z-20 md:py-0 md:pointer-events-auto">
        <div className="flex flex-col sm:flex-row gap-3 w-full items-center justify-center md:justify-start">
          <Button size="lg" className="bg-serpente-600 hover:bg-serpente-700 text-white min-h-[48px] w-full sm:w-auto text-sm md:text-base" asChild>
            <Link to="/catalogo">
              Animais Disponíveis <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10 md:bg-white/20 md:border-white/20 md:hover:bg-white/20 min-h-[48px] w-full sm:w-auto text-sm md:text-base" asChild>
            <Link to="/sobre">
              Conheça nossa História
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

