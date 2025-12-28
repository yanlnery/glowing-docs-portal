import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  order_index: number;
}

export function AboutImageCarousel() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

  const nextSlide = useCallback(() => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  }, [images.length]);

  // Auto-advance every 4.4 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(nextSlide, 4400);
    return () => clearInterval(interval);
  }, [images.length, nextSlide]);

  if (isLoading) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
    );
  }

  if (images.length === 0) {
    // Fallback to existing image if no gallery configured
    return (
      <div className="rounded-2xl shadow-2xl overflow-hidden">
        <OptimizedImage
          src="/lovable-uploads/13113c77-f713-4585-9041-1766e67545b8.png" 
          alt="Pet Serpentes & Companhia"
          className="w-full h-auto"
          style={{ objectFit: 'contain' }}
        />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl shadow-2xl overflow-hidden">
      {/* Images with fade transition */}
      <div className="relative aspect-[4/3]">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <OptimizedImage
              src={image.image_url}
              alt={image.alt_text || 'Imagem do criadouro'}
              className="w-full h-full"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-4' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir para imagem ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
