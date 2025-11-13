
import React from "react";
import { Waves, Footprints, Shell } from "lucide-react";
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
      <div className="relative h-[500px] md:h-[65vh] lg:h-[75vh] overflow-hidden">
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
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "65% center",
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
                    <div className="hidden md:block absolute inset-y-0 left-0 w-full sm:w-[55%] bg-gradient-to-r from-black/70 via-black/50 to-transparent z-20" />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Overlay com conteúdo - inferior esquerdo */}
        <div className="absolute inset-0 z-30 flex flex-col items-start justify-end pb-20 md:pb-24 pointer-events-none bg-gradient-to-r from-black/30 via-black/5 to-transparent">
          <div className="container py-4 px-4 sm:px-6 md:px-8 lg:px-10 pointer-events-auto flex justify-start">
            <div className="p-3 md:p-4">
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 sm:mb-3 max-w-[250px] md:max-w-2xl animate-fade-in text-balance text-left">
                {currentSlideData.title || "Bem-vindo à Pet Serpentes"}
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/95 font-medium max-w-[200px] md:max-w-xl mb-0 animate-fade-in text-balance line-clamp-3 sm:line-clamp-none text-left">
                {currentSlideData.subtitle || "Conheça nossa coleção de répteis exóticos"}
              </p>
            </div>
          </div>
        </div>
        
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
      <div className="bg-background py-6 sm:py-8 md:py-10">
        <div className="container px-4 sm:px-6 md:px-8 lg:px-10">
          {/* Título centralizado */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 text-foreground">
            Nossas Espécies
          </h2>
          
          {/* Grid com 3 ícones */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {/* Card Serpentes */}
            <Link 
              to="/catalogo?category=serpente" 
              className="group flex flex-col items-center justify-center bg-gradient-to-br from-serpente-50 to-serpente-100 dark:from-serpente-900/20 dark:to-serpente-800/20 rounded-xl p-6 sm:p-8 border-2 border-serpente-200 dark:border-serpente-700 hover:border-serpente-500 dark:hover:border-serpente-500 hover:shadow-xl transition-all duration-300 hover:scale-105 touch-manipulation min-h-[180px] sm:min-h-[200px]"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 rounded-full bg-serpente-500/10 flex items-center justify-center group-hover:bg-serpente-500/20 transition-colors">
                <Waves className="w-8 h-8 sm:w-10 sm:h-10 text-serpente-600 dark:text-serpente-400" strokeWidth={2.5} />
              </div>
              <span className="text-lg sm:text-xl font-bold text-serpente-700 dark:text-serpente-300 group-hover:text-serpente-800 dark:group-hover:text-serpente-200 transition-colors">
                Serpentes
              </span>
              <span className="text-xs sm:text-sm text-serpente-600/70 dark:text-serpente-400/70 mt-2 text-center">
                Ver todas as serpentes
              </span>
            </Link>

            {/* Card Lagartos */}
            <Link 
              to="/catalogo?category=lagarto" 
              className="group flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 sm:p-8 border-2 border-green-200 dark:border-green-700 hover:border-green-500 dark:hover:border-green-500 hover:shadow-xl transition-all duration-300 hover:scale-105 touch-manipulation min-h-[180px] sm:min-h-[200px]"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <Footprints className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" strokeWidth={2.5} />
              </div>
              <span className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-300 group-hover:text-green-800 dark:group-hover:text-green-200 transition-colors">
                Lagartos
              </span>
              <span className="text-xs sm:text-sm text-green-600/70 dark:text-green-400/70 mt-2 text-center">
                Ver todos os lagartos
              </span>
            </Link>

            {/* Card Quelônios */}
            <Link 
              to="/catalogo?category=quelonio" 
              className="group flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 sm:p-8 border-2 border-amber-200 dark:border-amber-700 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-xl transition-all duration-300 hover:scale-105 touch-manipulation min-h-[180px] sm:min-h-[200px]"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <Shell className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 dark:text-amber-400" strokeWidth={2.5} />
              </div>
              <span className="text-lg sm:text-xl font-bold text-amber-700 dark:text-amber-300 group-hover:text-amber-800 dark:group-hover:text-amber-200 transition-colors">
                Quelônios
              </span>
              <span className="text-xs sm:text-sm text-amber-600/70 dark:text-amber-400/70 mt-2 text-center">
                Ver todos os quelônios
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
