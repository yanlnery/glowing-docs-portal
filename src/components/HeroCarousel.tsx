
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
    Autoplay({ delay: 5000, stopOnInteraction: true })
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
    
    // Restart autoplay if it was stopped by interaction and slides changed via dots
    api.on("pointerUp", () => {
      if (autoplayPlugin.current.options.stopOnInteraction) {
         // Small delay to ensure interaction is processed
        setTimeout(() => autoplayPlugin.current.play(true), 100);
      }
    });

  }, [api]);

  const handleIndicatorClick = (index: number) => {
    api?.scrollTo(index);
    // If autoplay stops on interaction, clicking dots should allow it to resume
    // or restart if it was programmatically stopped.
    if (autoplayPlugin.current.options.stopOnInteraction) {
      autoplayPlugin.current.play(true); // Attempt to resume/restart autoplay
    }
  };

  if (carouselImagesData.length === 0) {
    return (
      <div className="relative h-[70vh] overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Carregando carrossel...</p>
      </div>
    );
  }

  const currentSlideData = carouselImagesData[currentImageIndex];

  return (
    <div className="relative h-[70vh] overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
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

      {/* Content Overlay - Positioned above Carousel but below indicators */}
      <div className="absolute inset-0 z-20 flex flex-col items-start justify-center pointer-events-none">
        <div className="container py-10 px-4 sm:px-6 pointer-events-auto">
           {currentSlideData && (
            <>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-2xl animate-slide-in pt-6 sm:pt-0">
                {currentSlideData.title || "Bem-vindo"}
              </h1>
              <p className="text-md md:text-xl text-white/90 max-w-xl mb-8 animate-fade-in">
                {currentSlideData.subtitle || "Conheça nossos animais"}
              </p>
            </>
           )}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center sm:items-start">
            <Button size="lg" className="bg-serpente-600 hover:bg-serpente-700 text-white min-h-[44px] w-full sm:w-auto pointer-events-auto" asChild>
              <Link to="/catalogo">
                Animais Disponíveis <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[44px] w-full sm:w-auto pointer-events-auto" asChild>
              <Link to="/sobre">
                Conheça nossa História
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Carousel Indicators - Positioned above content */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-30">
        {carouselImagesData.map((_, index) => (
          <button
            key={`indicator-${index}`}
            className={cn(
              "w-3 h-3 rounded-full focus:outline-none transition-all",
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
  );
}
