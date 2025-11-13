
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
      {/* Container principal com altura otimizada para mobile */}
      <div className="relative h-[500px] md:h-[60vh] lg:h-[70vh] overflow-hidden">
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
                          height: "500px",
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

        {/* Overlay com conteúdo - posicionamento melhorado */}
        <div className="absolute inset-0 z-30 flex flex-col items-start justify-center pb-24 md:pb-0 pointer-events-none">
          <div className="container py-6 px-4 sm:px-6 md:px-8 lg:px-10 pointer-events-auto">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 max-w-2xl animate-fade-in text-balance drop-shadow-lg">
              {currentSlideData.title || "Bem-vindo à Pet Serpentes"}
            </h1>
            <p className="text-sm sm:text-sm md:text-base lg:text-lg text-white/95 font-medium max-w-xl mb-4 sm:mb-6 animate-fade-in text-balance line-clamp-2 sm:line-clamp-none drop-shadow-md">
              {currentSlideData.subtitle || "Conheça nossa coleção de répteis exóticos"}
            </p>
          </div>
        </div>
        
        {/* Indicadores - posicionamento otimizado para mobile */}
        {carouselImagesData.length > 1 && (
          <div className="absolute bottom-16 sm:bottom-4 md:bottom-6 left-0 right-0 flex justify-center space-x-2 z-40">
            {carouselImagesData.map((_, index) => (
              <button
                key={`indicator-${index}`}
                className={cn(
                  "w-3 h-3 md:w-3 md:h-3 rounded-full focus:outline-none transition-all touch-manipulation",
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

      {/* Botões de ação - posicionamento mais próximo da imagem no mobile */}
      <div className="absolute bottom-2 left-0 right-0 z-30 md:relative md:bottom-auto md:left-auto md:right-auto md:z-auto">
        <div className="container px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-6 md:py-0 md:absolute md:bottom-40 md:left-1/2 md:-translate-x-1/2 md:z-30 md:pointer-events-auto">
          <div className="flex flex-col gap-2 w-full items-center justify-center md:justify-start md:flex-row md:gap-3">
            <Button size="lg" className="bg-serpente-600 hover:bg-serpente-700 text-white min-h-[44px] w-full sm:w-full md:w-auto text-sm md:text-base touch-manipulation" asChild>
              <Link to="/catalogo">
                Animais Disponíveis <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/20 border-white/20 text-white hover:bg-white/30 md:bg-white/20 md:border-white/20 md:hover:bg-white/20 min-h-[44px] w-full sm:w-full md:w-auto text-sm md:text-base touch-manipulation backdrop-blur-sm" asChild>
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
