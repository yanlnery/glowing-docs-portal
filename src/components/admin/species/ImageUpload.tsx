
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  imagePreview: string | null;
  imageFile: File | null;
  existingImageUrl?: string; // To display if no new preview
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function ImageUpload({
  imagePreview,
  imageFile,
  existingImageUrl,
  onImageChange,
  onRemoveImage,
}: ImageUploadProps) {
  const displayImage = imagePreview || existingImageUrl;

  return (
    <div className="space-y-1.5">
      <Label htmlFor="image-upload-input">Imagem Principal</Label>
      <div className="flex items-center gap-4">
        <div className="border rounded-lg overflow-hidden h-28 w-28 flex items-center justify-center bg-muted shrink-0">
          {displayImage ? (
            <img
              src={displayImage}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground text-xs p-2 text-center">Sem imagem selecionada</div>
          )}
        </div>

        <div className="flex-1">
          <Label htmlFor="image-upload-input" className="cursor-pointer block">
            <div className="flex items-center justify-center gap-2 p-3 border border-dashed rounded-md hover:bg-accent hover:border-primary transition-colors">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {imageFile ? imageFile.name : 'Selecionar ou arrastar imagem'}
              </span>
            </div>
            <input
              id="image-upload-input"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onImageChange}
            />
          </Label>
          {(imagePreview || existingImageUrl) && ( // Show remove button if there's any image displayed
            <Button
              variant="link"
              size="sm"
              className="mt-1 text-destructive px-0"
              onClick={onRemoveImage}
            >
              Remover imagem
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
