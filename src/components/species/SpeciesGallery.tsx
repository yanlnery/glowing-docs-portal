import React from 'react';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface SpeciesGalleryProps {
  images: string[];
  mainImage: string | null;
  altText: string;
}

export function SpeciesGallery({ images, mainImage, altText }: SpeciesGalleryProps) {
  // Usar gallery se tiver imagens, senão usar mainImage como fallback
  const galleryImages = images.length > 0 ? images : (mainImage ? [mainImage] : []);
  
  if (galleryImages.length === 0) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Sem imagens disponíveis</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {galleryImages.map((imageUrl, index) => (
        <div 
          key={index} 
          className="aspect-square rounded-lg overflow-hidden border border-border bg-muted"
        >
          <OptimizedImage
            src={imageUrl}
            alt={`${altText} - Foto ${index + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
}
