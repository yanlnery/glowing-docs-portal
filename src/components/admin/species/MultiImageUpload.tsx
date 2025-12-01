import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X } from 'lucide-react';

interface MultiImageUploadProps {
  galleryPreviews: string[];
  galleryFiles: File[];
  existingGalleryUrls: string[];
  onGalleryAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryRemove: (index: number) => void;
}

export function MultiImageUpload({
  galleryPreviews,
  galleryFiles,
  existingGalleryUrls,
  onGalleryAdd,
  onGalleryRemove,
}: MultiImageUploadProps) {
  // Combinar previews de novos arquivos + URLs existentes
  const allPreviews = [...existingGalleryUrls, ...galleryPreviews];
  const maxImages = 6;
  const canAddMore = allPreviews.length < maxImages;

  return (
    <div className="space-y-3">
      <Label>Galeria de Fotos (3-6 imagens)</Label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {allPreviews.map((preview, index) => (
          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
            <img 
              src={preview} 
              alt={`Galeria ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onGalleryRemove(index)}
              className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        
        {canAddMore && (
          <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground text-center px-2">
              Adicionar Foto
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={onGalleryAdd}
              className="hidden"
            />
          </label>
        )}
      </div>

      {allPreviews.length < 3 && (
        <p className="text-xs text-muted-foreground">
          Mínimo recomendado: 3 imagens
        </p>
      )}
      {allPreviews.length >= maxImages && (
        <p className="text-xs text-muted-foreground">
          Máximo de {maxImages} imagens atingido
        </p>
      )}
    </div>
  );
}
