
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getCarouselImages, CarouselImage as CarouselImageDataType } from "@/services/carouselService";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Import shadcn/ui Carousel components

export default function HeroCarousel() {
  const [carouselImagesData, setCarouselImagesData] = useState<CarouselImageDataType[]>([]);
  
  useEffect(() => {
    setCarouselImagesData(getCarouselImages());
  }, []);

  // Auto-advance can be added with Embla plugins if needed later.
  // For now, focusing on swipe functionality provided by shadcn/ui Carousel.

  if (carouselImagesData.length === 0) {
    return (
      <div className="relative h-[70vh] overflow-hidden flex items-center justify-center bg-gray-200">
        <p className="text-gray-500">Carregando carrossel...</p>
      </div>
    );
  }

  return (
    <Carousel
      className="relative h-[70vh] w-full"
      opts={{
        loop: true,
      }}
    >
      <CarouselContent className="h-full">
        {carouselImagesData.map((image, index) => (
          <CarouselItem key={image.id || index} className="h-full">
            <div
              className="relative w-full h-full"
              style={{
                backgroundImage: `url(${image.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
              {/* Content per slide */}
              <div className="container relative z-20 flex flex-col items-start justify-center h-full py-10 px-4 sm:px-6">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-2xl animate-slide-in pt-6 sm:pt-0">
                  {image.title || "Bem-vindo"}
                </h1>
                <p className="text-md md:text-xl text-white/90 max-w-xl mb-8 animate-fade-in">
                  {image.subtitle || "Conheça nossos animais"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center sm:items-start">
                  <Button size="lg" className="bg-serpente-600 hover:bg-serpente-700 text-white min-h-[44px] w-full sm:w-auto" asChild>
                    <Link to="/catalogo">
                      Animais Disponíveis <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[44px] w-full sm:w-auto" asChild>
                    <Link to="/sobre">
                      Conheça nossa História
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-white bg-black/30 hover:bg-black/50 border-none" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white bg-black/30 hover:bg-black/50 border-none" />
      
      {/* Optional: Custom indicators if needed, embla API can provide current slide index */}
      {/* For simplicity, default embla indicators (if any) or nav buttons are primary */}
    </Carousel>
  );
}
