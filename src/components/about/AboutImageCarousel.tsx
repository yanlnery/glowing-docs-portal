import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OptimizedImage } from '@/components/ui/optimized-image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  order_index: number;
}

export function AboutImageCarousel() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 4400, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      skipSnaps: false,
      dragFree: false,
    },
    images.length > 1 ? [autoplayPlugin.current] : []
  );

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('about_gallery')
        .select('*')
        .eq('active', true)
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        setImages(data);
      }
      setIsLoading(false);
    };

    fetchImages();
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  }, [emblaApi]);

  if (isLoading) {
    return (
      <div className="aspect-[4/3] min-h-[260px] sm:min-h-[300px] rounded-2xl bg-muted animate-pulse" />
    );
  }

  if (images.length === 0) {
    // Fallback to existing image if no gallery configured
    return (
      <div className="rounded-2xl shadow-2xl overflow-hidden">
        <OptimizedImage
          src="/lovable-uploads/13113c77-f713-4585-9041-1766e67545b8.png" 
          alt="Pet Serpentes & Companhia"
          className="w-full h-auto min-h-[260px] sm:min-h-[300px] object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl shadow-2xl overflow-hidden">
      {/* Embla Carousel Container - touch-pan-y allows vertical scroll */}
      <div className="overflow-hidden touch-pan-y" ref={emblaRef}>
        <div className="flex">
          {images.map((image) => (
            <div
              key={image.id}
              className="flex-[0_0_100%] min-w-0"
            >
              <div className="relative min-h-[260px] sm:min-h-[300px] md:min-h-[320px] aspect-[4/3]">
                <OptimizedImage
                  src={image.image_url}
                  alt={image.alt_text || 'Imagem do criadouro'}
                  className="w-full h-full absolute inset-0 object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 touch-manipulation ${
                index === selectedIndex 
                  ? 'bg-white w-5' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir para imagem ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Swipe hint for mobile - shows briefly */}
      {images.length > 1 && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/60 text-xs font-medium pointer-events-none animate-fade-in md:hidden">
          Deslize para ver mais
        </div>
      )}
    </div>
  );
}
