
import React from "react";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WhatsAppIcon from "@/components/home/WhatsAppIcon";
import { HOME_WHATSAPP_URL } from "@/lib/homeConversion";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { getObjectPosition } from "@/components/admin/ImageFocusSelector";

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
  const isMobile = useIsMobile();

  const fallback = !isLoading && (Boolean(error) || carouselImagesData.length === 0);

  return (
    <div className="relative w-full">
      <div className="hero-mobile-flow relative min-h-[480px] sm:h-[450px] sm:min-h-0 md:h-[65vh] lg:h-[75vh] overflow-hidden">
        {isLoading || fallback ? <div className={cn("absolute inset-0", isLoading ? "bg-muted" : "hero-fallback-surface")} /> : <Carousel
          setApi={setApi}
          opts={{ loop: carouselImagesData.length > 1, align: "start", dragFree: false, containScroll: "trimSnaps", watchDrag: true, slidesToScroll: 1 }}
          plugins={carouselImagesData.length > 1 ? [autoplayPlugin.current] : []}
          className="absolute inset-0 h-full touch-pan-x sm:relative"
        >
          <CarouselContent className="h-full -ml-0">
            {carouselImagesData.map((item, index) => {
              const processedImageUrl = getCarouselImageUrl(item.image_url);
              const objectPosition = isMobile ? getObjectPosition(item.focus_mobile) : getObjectPosition(item.focus_desktop);
              return (
                <CarouselItem key={item.id || index} className="h-full pl-0">
                  <div className="relative h-full w-full">
                    {processedImageUrl && processedImageUrl !== "/placeholder.svg" ? (
                      <img
                        src={processedImageUrl}
                        alt={item.alt_text || item.title || "Répteis criados no criadouro legalizado Pet Serpentes & Companhia"}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding={index === 0 ? "sync" : "async"}
                        fetchPriority={index === 0 ? "high" : "auto"}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ objectPosition }}
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-muted flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <p className="text-lg">Imagem indisponível</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="hero-overlay absolute inset-0" />
                    <div className="absolute inset-0 hidden flex-col justify-end sm:flex sm:p-6 sm:pb-36 md:p-8 md:pb-40">
                      <div className="max-w-[90%] sm:max-w-md md:max-w-2xl hero-caption">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2">{item.title || "Bem-vindo à Pet Serpentes"}</h2>
                        <p className="text-sm sm:text-base md:text-lg font-medium line-clamp-2">{item.subtitle || "Répteis nativos de criadouro legalizado"}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>}
        <div className="relative z-10 flex min-h-[480px] flex-col justify-end px-4 pb-5 pt-20 sm:absolute sm:inset-x-0 sm:bottom-16 sm:min-h-0 sm:block sm:px-6 sm:py-0 md:px-8">
          {!isLoading && <div className={cn("mb-5 min-w-0 hero-caption", !fallback && "sm:hidden")}>
            <h2 className="mb-2 break-words text-2xl font-bold sm:text-3xl md:text-4xl">{fallback ? "Répteis nativos de criadouro legalizado" : currentSlideData.title || "Bem-vindo à Pet Serpentes"}</h2>
            <p className="text-sm leading-relaxed sm:text-base">{fallback ? "Pet Serpentes & Companhia" : currentSlideData.subtitle}</p>
          </div>}
          <div className="flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row">
            <Button size="lg" className="min-h-12 w-full px-5 sm:w-auto" asChild><Link to="/catalogo">Ver animais disponíveis</Link></Button>
            <Button size="lg" variant="hero-outline" className="min-h-12 w-full px-5 sm:w-auto" asChild><a href={HOME_WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Falar no WhatsApp</a></Button>
          </div>
          {!fallback && carouselImagesData.length > 1 && <div className="mt-4 flex justify-center space-x-2 sm:absolute sm:bottom-[-40px] md:bottom-[-32px] sm:left-0 sm:right-0 sm:mt-0 z-10">
            {carouselImagesData.map((_, index) => <Button variant="ghost" size="icon" key={`indicator-${index}`} className={cn("h-3 w-3 min-w-0 rounded-full p-0 md:h-4 md:w-4 touch-manipulation shadow-lg", index === currentImageIndex ? "hero-indicator hero-indicator-active scale-110" : "hero-indicator")} onClick={() => handleIndicatorClick(index)} aria-label={`Ir para o slide ${index + 1}`} aria-pressed={index === currentImageIndex} />)}
          </div>}
        </div>
      </div>

      {/* Species section - OUTSIDE the carousel */}
      <div className="bg-muted/20 py-6 sm:py-8 md:py-10 pb-12 sm:pb-16 md:pb-20">
        <div className="container px-4 sm:px-6 md:px-8 lg:px-10">
          {/* Centered title */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="docs-section-title">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Nossas Espécies
              </h2>
            </div>
          </div>
          
          {/* Grid with 3 images */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12 max-w-5xl mx-auto">
            
            {/* Serpentes Card */}
            <Link 
              to="/catalogo?category=serpente" 
              className="flex flex-col items-center justify-center touch-manipulation"
            >
              <div className="relative w-full max-w-[280px] aspect-square mb-1 transition-transform duration-200 hover:scale-110">
                <img
                  src="/lovable-uploads/species-snake.png"
                  alt="Serpente"
                  className="w-full h-full object-contain drop-shadow-xl"
                  loading="lazy"
                />
              </div>
              
              <span className="text-xl sm:text-2xl font-bold text-foreground">
                Serpentes
              </span>
            </Link>

            {/* Lagartos Card */}
            <Link 
              to="/catalogo?category=lagarto" 
              className="flex flex-col items-center justify-center touch-manipulation"
            >
              <div className="relative w-full max-w-[280px] aspect-square mb-1 transition-transform duration-200 hover:scale-110">
                <img
                  src="/lovable-uploads/species-lizard.png"
                  alt="Lagarto"
                  className="w-full h-full object-contain drop-shadow-xl"
                  loading="lazy"
                />
              </div>
              
              <span className="text-xl sm:text-2xl font-bold text-foreground">
                Lagartos
              </span>
            </Link>

            {/* Quelônios Card */}
            <Link 
              to="/catalogo?category=quelonio" 
              className="flex flex-col items-center justify-center touch-manipulation"
            >
              <div className="relative w-full max-w-[280px] aspect-square mb-1 transition-transform duration-200 hover:scale-110">
                <img
                  src="/lovable-uploads/species-turtle.png"
                  alt="Quelônio"
                  className="w-full h-full object-contain drop-shadow-xl"
                  loading="lazy"
                />
              </div>
              
              <span className="text-xl sm:text-2xl font-bold text-foreground">
                Quelônios
              </span>
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
}
