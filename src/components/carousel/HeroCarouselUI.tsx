
import React from "react";

import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

import type { CarouselItem as CarouselItemData } from "@/services/carouselService";
import { getCarouselImageUrl } from "@/services/carouselService";
import type { AutoplayType } from "embla-carousel-autoplay";

interface HeroCarouselUIProps {
  isLoading: boolean;
  error: string | null;
  carouselImagesData: CarouselItemData[];
  currentImageIndex: number;
  currentSlideData: CarouselItemData;
  setApi: (api: CarouselApi | undefined) => void;
  autoplayPlugin: React.MutableRefObject<AutoplayType>;
  handleIndicatorClick: (index: number) => void;
}

export default function HeroCarouselUI({
  isLoading,
  error,
  carouselImagesData,
  currentImageIndex,
  currentSlideData,
  setApi,
  autoplayPlugin,
  handleIndicatorClick,
}: HeroCarouselUIProps) {

  if (error) {
    return (
      <div className="relative min-h-[calc(100vh-200px)] md:h-[60vh] lg:h-[70vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Erro: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative min-h-[calc(100vh-200px)] md:h-[60vh] lg:h-[70vh] overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Carregando carrossel...</p>
      </div>
    );
  }

  if (carouselImagesData.length === 0) {
    return (
      <div className="relative min-h-[calc(100vh-200px)] md:h-[60vh] lg:h-[70vh] overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-800 px-4 text-center">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Nenhuma imagem para exibir no carrossel.</p>
          <p className="text-sm text-gray-400 dark:text-gray-300">Verifique o painel administrativo ou tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Container principal com altura fixa para uniformidade */}
      <div className="relative h-[400px] sm:h-[450px] md:h-[65vh] lg:h-[75vh] overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{
            loop: carouselImagesData.length > 1,
            align: "start",
            // Melhor suporte para navegação por toque no mobile
            dragFree: false,
            containScroll: "trimSnaps",
            // Ativar suporte a toque
            watchDrag: true,
            slidesToScroll: 1,
          }}
          plugins={carouselImagesData.length > 1 ? [autoplayPlugin.current] : []}
          className="h-full touch-pan-x"
        >
          <CarouselContent className="h-full -ml-0">
            {carouselImagesData.map((item, index) => {
              const processedImageUrl = getCarouselImageUrl(item.image_url);

              return (
                <CarouselItem key={item.id || index} className="h-full pl-0">
                  <div className="relative h-full w-full">
                    {/* Imagem do slide */}
                    {processedImageUrl && processedImageUrl !== "/placeholder.svg" ? (
                      <img
                        src={processedImageUrl}
                        alt={item.alt_text || "Imagem do carrossel"}
                        loading={index === 0 ? "eager" : "lazy"}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-gray-300 flex items-center justify-center">
                        <div className="text-center text-gray-600">
                          <p className="text-lg">Imagem indisponível</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Gradiente sobre a imagem */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Texto sobre a imagem - dentro de cada slide */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 pb-16 sm:p-6 sm:pb-20 md:p-8 md:pb-24">
                      <div className="max-w-[90%] sm:max-w-md md:max-w-2xl">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                          {item.title || "Bem-vindo à Pet Serpentes"}
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-white/90 font-medium line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                          {item.subtitle || "Conheça nossa coleção de répteis exóticos"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
        
        {/* Indicadores - DENTRO do carrossel, na parte inferior sobre a imagem */}
        {carouselImagesData.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 flex justify-center space-x-2 z-50">
            {carouselImagesData.map((_, index) => (
              <button
                key={`indicator-${index}`}
                className={cn(
                  "w-3 h-3 md:w-4 md:h-4 rounded-full focus:outline-none transition-all touch-manipulation shadow-lg",
                  index === currentImageIndex
                    ? "bg-white scale-110"
                    : "bg-white/50 hover:bg-white/70"
                )}
                onClick={() => handleIndicatorClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

      </div>

      {/* Seção Nossas Espécies - FORA do carrossel, logo abaixo */}
      <div className="bg-muted/20 py-6 sm:py-8 md:py-10 pb-12 sm:pb-16 md:pb-20">
        <div className="container px-4 sm:px-6 md:px-8 lg:px-10">
          {/* Título centralizado com barrinha verde */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="docs-section-title">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Nossas Espécies
              </h2>
            </div>
          </div>
          
          {/* Grid com 3 imagens */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12 max-w-5xl mx-auto">
            
            {/* Card Serpentes */}
            <Link 
              to="/catalogo?category=serpente" 
              className="group flex flex-col items-center justify-center touch-manipulation"
            >
              {/* Container da imagem com efeito hover */}
              <div className="relative w-full max-w-[280px] aspect-square mb-1 transition-transform duration-300 group-hover:scale-110">
                <img
                  src="/lovable-uploads/species-snake.png"
                  alt="Serpente"
                  className="w-full h-full object-contain drop-shadow-xl"
                  loading="lazy"
                />
              </div>
              
              {/* Título */}
              <span className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                Serpentes
              </span>
            </Link>

            {/* Card Lagartos */}
            <Link 
              to="/catalogo?category=lagarto" 
              className="group flex flex-col items-center justify-center touch-manipulation"
            >
              {/* Container da imagem com efeito hover */}
              <div className="relative w-full max-w-[280px] aspect-square mb-1 transition-transform duration-300 group-hover:scale-110">
                <img
                  src="/lovable-uploads/species-lizard.png"
                  alt="Lagarto"
                  className="w-full h-full object-contain drop-shadow-xl"
                  loading="lazy"
                />
              </div>
              
              {/* Título */}
              <span className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                Lagartos
              </span>
            </Link>

            {/* Card Quelônios */}
            <Link 
              to="/catalogo?category=quelonio" 
              className="group flex flex-col items-center justify-center touch-manipulation"
            >
              {/* Container da imagem com efeito hover */}
              <div className="relative w-full max-w-[280px] aspect-square mb-1 transition-transform duration-300 group-hover:scale-110">
                <img
                  src="/lovable-uploads/species-turtle.png"
                  alt="Quelônio"
                  className="w-full h-full object-contain drop-shadow-xl"
                  loading="lazy"
                />
              </div>
              
              {/* Título */}
              <span className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                Quelônios
              </span>
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
}
