
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
