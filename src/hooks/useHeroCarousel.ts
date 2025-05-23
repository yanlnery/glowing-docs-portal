
import { useState, useEffect, useRef } from 'react';
import type { CarouselApi } from "@/components/ui/carousel";
import { fetchCarouselItems, type CarouselItem } from "@/services/carouselService";
import Autoplay from "embla-carousel-autoplay";

const FALLBACK_SLIDE_DATA: CarouselItem = {
  id: "fallback-id",
  image_url: "/placeholder.svg",
  alt_text: "Bem-vindo à Pet Serpentes",
  title: "Bem-vindo à Pet Serpentes",
  subtitle: "Conheça nossa coleção de répteis exóticos",
  item_order: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function useHeroCarousel() {
  const [carouselImagesData, setCarouselImagesData] = useState<CarouselItem[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  useEffect(() => {
    const loadCarouselData = async () => {
      console.log("Loading carousel data...");
      setIsLoading(true);
      setError(null);
      
      try {
        const items = await fetchCarouselItems();
        console.log("Fetched carousel items:", items);
        setCarouselImagesData(items);
      } catch (fetchError) {
        console.error("Failed to load carousel items:", fetchError);
        setError("Falha ao carregar dados do carrossel.");
        setCarouselImagesData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCarouselData();
  }, []);

  useEffect(() => {
    if (!api || carouselImagesData.length === 0) {
      setCurrentImageIndex(0);
      return;
    }

    const onSelect = () => {
      setCurrentImageIndex(api.selectedScrollSnap());
    };

    const onPointerUp = () => {
      if (autoplayPlugin.current.options.stopOnInteraction) {
        setTimeout(() => {
          if (autoplayPlugin.current && typeof (autoplayPlugin.current as any).play === 'function') {
            (autoplayPlugin.current as any).play(false);
          }
        }, 100);
      }
    };
    
    setCurrentImageIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("pointerUp", onPointerUp);

    return () => {
      if (api) {
        api.off("select", onSelect);
        api.off("pointerUp", onPointerUp);
      }
    };
  }, [api, carouselImagesData.length]);

  const handleIndicatorClick = (index: number) => {
    api?.scrollTo(index);
    if (autoplayPlugin.current.options.stopOnInteraction) {
      if (autoplayPlugin.current && typeof (autoplayPlugin.current as any).play === 'function') {
        (autoplayPlugin.current as any).play(false);
      }
    }
  };

  const currentSlideData = carouselImagesData[currentImageIndex] ?? FALLBACK_SLIDE_DATA;

  console.log("Hook state:", { 
    isLoading, 
    error,
    itemsCount: carouselImagesData.length,
    currentIndex: currentImageIndex,
    currentSlideData: currentSlideData.id
  });

  return {
    isLoading,
    error,
    carouselImagesData,
    currentImageIndex,
    currentSlideData,
    api,
    setApi,
    autoplayPlugin,
    handleIndicatorClick,
  };
}
