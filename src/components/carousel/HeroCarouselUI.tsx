
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
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Erro: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Carregando carrossel...</p>
      </div>
    );
  }

  if (carouselImagesData.length === 0) {
    return (
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-800 px-4 text-center">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Nenhuma imagem para exibir no carrossel.</p>
          <p className="text-sm text-gray-400 dark:text-gray-300">Verifique o painel administrativo ou tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{
            loop: carouselImagesData.length > 1,
            align: "start",
          }}
          plugins={carouselImagesData.length > 1 ? [autoplayPlugin.current] : []}
          className="h-full"
        >
          <CarouselContent className="h-full -ml-0">
            {carouselImagesData.map((item, index) => {
              const processedImageUrl = getCarouselImageUrl(item.image_url);
              const isCurrentSlide = index === currentImageIndex;
              const isAdjacentSlide = Math.abs(index - currentImageIndex) <= 1;

              console.log(`Rendering slide ${index}:`, {
                originalImageUrl: item.image_url,
                processedImageUrl: processedImageUrl,
                title: item.title,
                isCurrentSlide,
                isAdjacentSlide
              });

              return (
                <CarouselItem key={item.id || index} className="h-full pl-0">
                  <div className="relative h-full w-full">
                    {processedImageUrl && processedImageUrl !== "/placeholder.svg" ? (
                      <OptimizedImage
                        src={processedImageUrl}
                        alt={item.alt_text || "Imagem do carrossel"}
                        priority={isCurrentSlide}
                        quality={isCurrentSlide ? 85 : 75}
                        sizes="100vw"
                        className="w-full h-full"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                          position: "relative",
                          zIndex: 10,
                        }}
                        onLoad={() => console.log(`✅ Imagem otimizada carregada: ${processedImageUrl}`)}
                        onError={(e) => {
                          console.error(`❌ Falha ao carregar imagem otimizada: ${processedImageUrl}`);
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-gray-300 flex items-center justify-center border-4 border-blue-500">
                        <div className="text-center text-gray-600">
                          <p className="text-lg">⚠️ Imagem indisponível</p>
                          <p className="text-sm">{item.title || "Slide sem título"} ({item.image_url ? "URL inválida" : "URL vazia"})</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-y-0 left-0 w-full sm:w-[55%] bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10" />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Content overlay - ajustado para mobile */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end sm:justify-center pointer-events-none">
          <div className="container py-4 px-4 sm:px-6 md:px-8 lg:px-10 pointer-events-auto">
            <div className="pb-20 sm:pb-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 max-w-2xl animate-slide-in text-balance leading-tight">
                {currentSlideData.title || "Bem-vindo à Pet Serpentes"}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/90 font-medium max-w-xl mb-4 sm:mb-6 animate-fade-in text-balance">
                {currentSlideData.subtitle || "Conheça nossa coleção de répteis exóticos"}
              </p>
            </div>
          </div>
        </div>
        
        {/* Indicators - melhor posicionamento mobile */}
        {carouselImagesData.length > 1 && (
          <div className="absolute bottom-16 sm:bottom-4 md:bottom-6 left-0 right-0 flex justify-center space-x-2 z-30">
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

      {/* Buttons section - fora do carrossel para evitar sobreposição */}
      <div className="bg-background/95 backdrop-blur-sm border-t border-border/50">
        <div className="container px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full items-center justify-center">
            <Button size="lg" className="bg-serpente-600 hover:bg-serpente-700 text-white min-h-[48px] w-full sm:w-auto text-sm md:text-base" asChild>
              <Link to="/catalogo">
                Animais Disponíveis <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="min-h-[48px] w-full sm:w-auto text-sm md:text-base" asChild>
              <Link to="/sobre">
                Conheça nossa História
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
