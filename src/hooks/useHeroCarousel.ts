
import { useState, useEffect, useRef } from 'react';
import type { CarouselApi } from "@/components/ui/carousel";
import { fetchCarouselItems, type CarouselItemSchema } from "@/services/carouselService";
import Autoplay from "embla-carousel-autoplay";

const FALLBACK_SLIDE_DATA: CarouselItemSchema = {
  id: "fallback-id",
  image_url: "",
  alt_text: "Informação do slide indisponível",
  title: "Título Indisponível",
  subtitle: "Subtítulo indisponível",
  item_order: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function useHeroCarousel() {
  const [carouselImagesData, setCarouselImagesData] = useState<CarouselItemSchema[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  useEffect(() => {
    const loadCarouselData = async () => {
      console.log("useHeroCarousel: Attempting to load carousel data...");
      setIsLoading(true);
      setError(null);
      try {
        const items = await fetchCarouselItems();
        console.log("useHeroCarousel: Fetched items raw response", items);
        
        if (items && Array.isArray(items)) {
          setCarouselImagesData(items);
          if (items.length === 0) {
            console.warn("useHeroCarousel: Fetched data is an empty array. No items to display.");
          }
        } else {
          console.error("useHeroCarousel: Unexpected data format or null/undefined items array:", items);
          setError("Formato de dados inesperado recebido do serviço.");
          setCarouselImagesData([]);
        }
      } catch (fetchError) {
        console.error("useHeroCarousel: Failed to load carousel items in hook:", fetchError);
        setError("Falha ao carregar dados do carrossel.");
        setCarouselImagesData([]);
      } finally {
        setIsLoading(false);
        console.log("useHeroCarousel: Data loading attempt finished.");
      }
    };
    loadCarouselData();
  }, []); // Removed `api` dependency here as it caused re-fetches. Data loading should be independent.

  useEffect(() => {
    if (!api || carouselImagesData.length === 0) {
      setCurrentImageIndex(0); // Reset index if no API or data
      return;
    }

    const onSelect = () => {
      setCurrentImageIndex(api.selectedScrollSnap());
    };

    const onPointerUp = () => {
      if (autoplayPlugin.current.options.stopOnInteraction) {
        setTimeout(() => {
          // Check if play method exists on the plugin instance
          if (autoplayPlugin.current && typeof (autoplayPlugin.current as any).play === 'function') {
            (autoplayPlugin.current as any).play(false); // Attempt to resume autoplay
          }
        }, 100); // Small delay to ensure interaction is complete
      }
    };
    
    setCurrentImageIndex(api.selectedScrollSnap()); // Initialize current index
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
    // If autoplay is active and interaction should stop it, then restart it manually after a delay
    if (autoplayPlugin.current.options.stopOnInteraction) {
       if (autoplayPlugin.current && typeof (autoplayPlugin.current as any).play === 'function') {
         (autoplayPlugin.current as any).play(false); // Attempt to resume autoplay after manual navigation
       }
    }
  };

  const currentSlideData = carouselImagesData[currentImageIndex] ?? FALLBACK_SLIDE_DATA;

  console.log("useHeroCarousel: Hook state:", { 
    isLoading, 
    error,
    itemsCount: carouselImagesData.length,
    currentIndex: currentImageIndex,
    currentSlideData
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

