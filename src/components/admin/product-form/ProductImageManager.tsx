
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, Loader2 } from 'lucide-react';
import { ProductImage } from '@/types/product';
import { uploadFileToStorage, ToastFunction } from '@/services/fileStorageService';

interface ProductImageManagerProps {
  imageList: ProductImage[];
  onRemoveExistingImage: (index: number) => void;
  onImageUpload: (newImages: ProductImage[]) => void;
  toast: ToastFunction;
}

export const ProductImageManager: React.FC<ProductImageManagerProps> = ({
  imageList,
  onRemoveExistingImage,
  onImageUpload,
  toast,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const files = Array.from(e.target.files);
    const uploadedImages: ProductImage[] = [];

    try {
      for (const file of files) {
        const publicUrl = await uploadFileToStorage(file, 'product_images', toast);
        if (publicUrl) {
          uploadedImages.push({
            id: crypto.randomUUID(),
            url: publicUrl,
            filename: file.name,
            alt: file.name.split('.')[0],
          });
        }
      }

      if (uploadedImages.length > 0) {
        onImageUpload(uploadedImages);
        toast({
          title: "Sucesso",
          description: `${uploadedImages.length} imagem(ns) enviada(s) com sucesso!`,
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar imagens. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };
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
        
        
        <label htmlFor="image-upload" className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors aspect-square p-2 text-center">
          {uploading ? (
            <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
          ) : (
            <Upload className="h-6 w-6 text-gray-400" />
          )}
          <span className="mt-2 text-sm text-gray-500">
            {uploading ? 'Enviando...' : 'Adicionar foto(s)'}
          </span>
          <input 
            id="image-upload"
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageChange}
            multiple
            disabled={uploading}
          />
        </label>
      </div>
      
      <Alert>
        <AlertDescription>
          Recomendamos imagens no formato quadrado, de preferência com 800x800 pixels. As imagens são armazenadas no Supabase Storage e ficam disponíveis em todos os dispositivos.
        </AlertDescription>
      </Alert>
    </div>
  );
};
