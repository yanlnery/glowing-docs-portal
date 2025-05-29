
import React from 'react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X } from 'lucide-react';
import { ProductImage } from '@/types/product';

interface ProductImageManagerProps {
  imageList: ProductImage[];
  imagePreviewUrls: string[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onRemoveExistingImage: (index: number) => void;
}

export const ProductImageManager: React.FC<ProductImageManagerProps> = ({
  imageList,
  imagePreviewUrls,
  onImageChange,
  onRemoveImage,
  onRemoveExistingImage,
}) => {
  return (
    <div className="space-y-4">
      <Label>Imagens do Animal</Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {imageList.map((image, index) => (
          <div key={image.id || `existing-${index}`} className="relative group aspect-square">
            <img 
              src={image.url}
              alt={image.alt || 'Imagem do produto'}
              className="w-full h-full object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => onRemoveExistingImage(index)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs z-10"
              aria-label="Remover imagem existente"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        {imagePreviewUrls.map((url, index) => (
          <div key={`preview-${index}`} className="relative group aspect-square">
            <img 
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover rounded-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="bg-red-600 text-white rounded-full p-1"
                aria-label="Remover nova imagem"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        
        <label htmlFor="image-upload" className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors aspect-square p-2 text-center">
          <Upload className="h-6 w-6 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500">Adicionar foto(s)</span>
          <input 
            id="image-upload"
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={onImageChange}
            multiple
          />
        </label>
      </div>
      
      <Alert>
        <AlertDescription>
          Recomendamos imagens no formato quadrado, de preferência com 800x800 pixels. As imagens são salvas como Data URLs no localStorage.
        </AlertDescription>
      </Alert>
    </div>
  );
};
