
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
    Autoplay({ 
      delay: 5000, 
      stopOnInteraction: false, 
      stopOnMouseEnter: true,
      rootNode: (emblaRoot) => emblaRoot.parentElement,
    })
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
      const newIndex = api.selectedScrollSnap();
      console.log("Carousel slide changed to index:", newIndex);
      setCurrentImageIndex(newIndex);
    };

    const onPointerUp = () => {
      // Resume autoplay after user interaction
      if (autoplayPlugin.current && carouselImagesData.length > 1) {
        setTimeout(() => {
          autoplayPlugin.current.play();
        }, 1000);
      }
    };
    
    setCurrentImageIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("pointerUp", onPointerUp);

    // Start autoplay if there are multiple items
    if (carouselImagesData.length > 1) {
      autoplayPlugin.current.play();
    }

    return () => {
      if (api) {
        api.off("select", onSelect);
        api.off("pointerUp", onPointerUp);
      }
    };
  }, [api, carouselImagesData.length]);

  const handleIndicatorClick = (index: number) => {
    if (api) {
      console.log("Manual slide change to index:", index);
      api.scrollTo(index);
      // Resume autoplay after manual navigation
      if (autoplayPlugin.current && carouselImagesData.length > 1) {
        setTimeout(() => {
          autoplayPlugin.current.play();
        }, 1000);
      }
    }
  };

  const currentSlideData = carouselImagesData[currentImageIndex] ?? FALLBACK_SLIDE_DATA;

  console.log("Hook state:", { 
    isLoading, 
    error,
    itemsCount: carouselImagesData.length,
    currentIndex: currentImageIndex,
    currentSlideData: currentSlideData.id,
    autoplayRunning: carouselImagesData.length > 1
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
