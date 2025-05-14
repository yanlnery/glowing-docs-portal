
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getCarouselImages, CarouselImage } from "@/services/carouselService"; // Import service

// const carouselImages = [ ... ] // Remove hardcoded array

export default function HeroCarousel() {
  const [carouselImagesData, setCarouselImagesData] = useState<CarouselImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    setCarouselImagesData(getCarouselImages());
  }, []);

  // Auto-advance the carousel
  useEffect(() => {
    if (carouselImagesData.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImagesData.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [carouselImagesData]);

  if (carouselImagesData.length === 0) {
    return (
      <div className="relative h-[70vh] overflow-hidden flex items-center justify-center bg-gray-200">
        <p className="text-gray-500">Carregando carrossel...</p>
      </div>
    );
  }

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Image Carousel */}
      {carouselImagesData.map((image, index) => (
        <div
          key={image.id || index} // Use image.id if available
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          )}
          style={{
            backgroundImage: `url(${image.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        </div>
      ))}

      {/* Content */}
      <div className="container relative z-20 flex flex-col items-start justify-center h-full py-10 px-4 sm:px-6">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-2xl animate-slide-in pt-6 sm:pt-0">
          {carouselImagesData[currentImageIndex]?.title || "Bem-vindo"}
        </h1>
        <p className="text-md md:text-xl text-white/90 max-w-xl mb-8 animate-fade-in">
          {carouselImagesData[currentImageIndex]?.subtitle || "Conheça nossos animais"}
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

      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {carouselImagesData.map((_, index) => (
          <button
            key={`indicator-${index}`}
            className={cn(
              "w-3 h-3 rounded-full focus:outline-none transition-all",
              index === currentImageIndex
                ? "bg-white scale-110"
                : "bg-white/40 hover:bg-white/60"
            )}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
