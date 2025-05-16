
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
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }) // Added stopOnMouseEnter
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
    api.on("pointerUp", () => {
      if (autoplayPlugin.current.options.stopOnInteraction) {
        setTimeout(() => autoplayPlugin.current.play(false), 100); // play(false) to not rewind
      }
    });
     // Listen for slidesToScroll to detect if user swiped far enough
    api.on("slidesToScroll", () => {
      if (autoplayPlugin.current.options.stopOnInteraction) {
        autoplayPlugin.current.play(false); 
      }
    });

  }, [api]);

  const handleIndicatorClick = (index: number) => {
    api?.scrollTo(index);
    if (autoplayPlugin.current.options.stopOnInteraction) {
       autoplayPlugin.current.play(false); 
    }
  };

  if (carouselImagesData.length === 0) {
    return (
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Carregando carrossel...</p>
      </div>
    );
  }

  const currentSlideData = carouselImagesData[currentImageIndex];

  return (
    <div className="relative w-full"> {/* Removed fixed height for mobile */}
      {/* Carousel Visuals */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
            // watchDrag: true, // Default is true, ensures touch interactions
          }}
          plugins={[autoplayPlugin.current]}
          className="h-full"
        >
          <CarouselContent className="h-full">
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

        {/* Text Content Overlay - Positioned above Carousel visuals */}
        <div className="absolute inset-0 z-20 flex flex-col items-start justify-end md:justify-center pb-24 md:pb-0 pointer-events-none">
          <div className="container py-6 px-4 sm:px-6 pointer-events-auto">
             {currentSlideData && (
              <>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 max-w-2xl animate-slide-in text-balance"> {/* Adjusted text size and added text-balance */}
                  {currentSlideData.title || "Bem-vindo"}
                </h1>
                <p className="text-base md:text-lg text-white/90 max-w-xl mb-6 animate-fade-in text-balance"> {/* Adjusted text size and added text-balance */}
                  {currentSlideData.subtitle || "Conheça nossos animais"}
                </p>
              </>
             )}
          </div>
        </div>
        
        {/* Carousel Indicators - Positioned above visuals but potentially below text on some layouts */}
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

      {/* Buttons Section - Below carousel visuals on mobile, part of overlay on desktop */}
      <div className="container px-4 sm:px-6 py-6 md:absolute md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:z-20 md:py-0 md:pointer-events-auto">
        <div className="flex flex-col sm:flex-row gap-3 w-full items-center justify-center md:justify-start">
          <Button size="lg" className="bg-serpente-600 hover:bg-serpente-700 text-white min-h-[48px] w-full sm:w-auto text-sm md:text-base" asChild> {/* Increased min-h for touch */}
            <Link to="/catalogo">
              Animais Disponíveis <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10 md:bg-white/10 md:border-white/20 md:hover:bg-white/20 min-h-[48px] w-full sm:w-auto text-sm md:text-base" asChild> {/* Increased min-h for touch */}
            <Link to="/sobre">
              Conheça nossa História
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

