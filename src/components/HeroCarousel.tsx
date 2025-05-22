
import React from "react";
import { useHeroCarousel } from "@/hooks/useHeroCarousel";
import HeroCarouselUI from "@/components/carousel/HeroCarouselUI";

export default function HeroCarousel() {
  const {
    isLoading,
    error,
    carouselImagesData,
    currentImageIndex,
    currentSlideData,
    setApi,
    autoplayPlugin,
    handleIndicatorClick,
  } = useHeroCarousel();

  // Log para verificar os dados recebidos do hook
  console.log("HeroCarousel (Main Component): Data from useHeroCarousel", {
    isLoading,
    error,
    carouselImagesDataCount: carouselImagesData.length,
    currentImageIndex,
    currentSlideDataId: currentSlideData.id
  });

  return (
    <HeroCarouselUI
      isLoading={isLoading}
      error={error}
      carouselImagesData={carouselImagesData}
      currentImageIndex={currentImageIndex}
      currentSlideData={currentSlideData}
      setApi={setApi}
      autoplayPlugin={autoplayPlugin}
      handleIndicatorClick={handleIndicatorClick}
    />
  );
}

