
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { OptimizedImage } from "@/components/ui/optimized-image";
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
  
  console.log("HeroCarouselUI rendering with:", {
    isLoading, 
    error, 
    itemsCount: carouselImagesData.length, 
    currentIndex: currentImageIndex,
    currentSlideTitle: currentSlideData.title,
    currentSlideImageUrl: currentSlideData.image_url
  });

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
      {/* Container principal com altura otimizada - maior no mobile para ultrapassar o texto */}
      <div className="relative h-[calc(100vh-120px)] sm:h-[calc(100vh-160px)] md:h-[60vh] lg:h-[70vh] overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{
            loop: carouselImagesData.length > 1,
            align: "start",
            dragFree: false,
            containScroll: "trimSnaps",
            watchDrag: true,
            slidesToScroll: 1,
          }}
          plugins={carouselImagesData.length > 1 ? [autoplayPlugin.current] : []}
          className="h-full touch-pan-x"
        >
          <CarouselContent className="h-full -ml-0">
            {carouselImagesData.map((item, index) => {
              const processedImageUrl = getCarouselImageUrl(item.image_url);
              const isCurrentSlide = index === currentImageIndex;
              const shouldPrioritize = Math.abs(index - currentImageIndex) <= 1;

              console.log(`Rendering slide ${index}:`, {
                originalImageUrl: item.image_url,
                processedImageUrl: processedImageUrl,
                title: item.title,
                isCurrentSlide,
                shouldPrioritize
              });

              return (
                <CarouselItem key={item.id || index} className="h-full pl-0">
                  <div className="relative h-full w-full">
                    {processedImageUrl && processedImageUrl !== "/placeholder.svg" ? (
                      <OptimizedImage
                        src={processedImageUrl}
                        alt={item.alt_text || "Imagem do carrossel"}
                        priority={true}
                        quality={85}
                        sizes="100vw"
                        className="w-full h-full opacity-100"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                          position: "relative",
                          zIndex: 10,
                          opacity: 1,
                        }}
                        onLoad={() => console.log(`✅ Imagem carregada: ${processedImageUrl}`)}
                        onError={(e) => {
                          console.error(`❌ Falha ao carregar imagem: ${processedImageUrl}`);
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-gray-300 flex items-center justify-center">
                        <div className="text-center text-gray-600">
                          <p className="text-lg">⚠️ Imagem indisponível</p>
                          <p className="text-sm">{item.title || "Slide sem título"}</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-y-0 left-0 w-full sm:w-[55%] bg-gradient-to-r from-black/70 via-black/50 to-transparent z-20" />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Overlay com conteúdo - posicionamento compacto no mobile */}
        <div className="absolute inset-0 z-30 flex flex-col items-start justify-center pb-20 sm:pb-24 md:pb-0 pointer-events-none">
          <div className="container py-4 px-4 sm:px-6 md:px-8 lg:px-10 pointer-events-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 max-w-2xl animate-fade-in text-balance">
              {currentSlideData.title || "Bem-vindo à Pet Serpentes"}
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 font-medium max-w-xl mb-3 sm:mb-4 animate-fade-in text-balance line-clamp-2 sm:line-clamp-none">
              {currentSlideData.subtitle || "Conheça nossa coleção de répteis exóticos"}
            </p>
          </div>
        </div>
      </div>
        
      {/* Indicadores - posicionamento colado na imagem */}
      {carouselImagesData.length > 1 && (
        <div className="flex justify-center space-x-2 mt-2 mb-2 z-40">
          {carouselImagesData.map((_, index) => (
            <button
              key={`indicator-${index}`}
              className={cn(
                "w-2 h-2 md:w-3 md:h-3 rounded-full focus:outline-none transition-all touch-manipulation",
                index === currentImageIndex
                  ? "bg-serpente-600 scale-110"
                  : "bg-gray-400 hover:bg-gray-500"
              )}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Botões de ação - posicionamento colado aos indicadores */}
      <div className="z-30 px-4 sm:px-6">
        <div className="flex flex-col gap-2 w-full items-center justify-center md:flex-row md:gap-3">
          <Button 
            size="sm" 
            className="bg-serpente-600 hover:bg-serpente-700 text-white h-9 px-4 w-full sm:w-full md:w-auto text-sm touch-manipulation" 
            asChild
          >
            <Link to="/catalogo">
              Animais Disponíveis <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-serpente-600 text-serpente-600 hover:bg-serpente-50 h-9 px-4 w-full sm:w-full md:w-auto text-sm touch-manipulation" 
            asChild
          >
            <Link to="/sobre">
              Conheça nossa História
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
