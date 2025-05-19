
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  fetchCarouselItems, 
  uploadCarouselImage, 
  insertCarouselItem,
  updateCarouselItem,
  deleteCarouselItem,
  type CarouselItemSchema,
  type CarouselItemInsert,
  type CarouselItemUpdate
} from '@/services/carouselService';
import CarouselItemForm from '@/components/admin/carousel/CarouselItemForm';
import CarouselItemsTable from '@/components/admin/carousel/CarouselItemsTable';

export default function AdminCarousel() {
  const [images, setImages] = useState<CarouselItemSchema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<Partial<CarouselItemSchema> & { id?: string } | null>(null);
  const [isNewImage, setIsNewImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const loadImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedImages = await fetchCarouselItems();
      setImages(fetchedImages);
    } catch (error) {
      toast({ title: "Erro ao carregar imagens", description: "Não foi possível buscar as imagens do carrossel.", variant: "destructive" });
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const openNewImageDialog = () => {
    setCurrentImage({ 
      image_url: '',
      alt_text: '',
      title: '',
      subtitle: '',
      item_order: images.length > 0 ? Math.max(...images.map(img => img.item_order || 0)) + 1 : 1,
    });
    setIsNewImage(true);
    setImagePreview(null);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const openEditImageDialog = (imageData: CarouselItemSchema) => {
    setCurrentImage({...imageData});
    setIsNewImage(false);
    setImagePreview(imageData.image_url || null); 
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      if (currentImage) {
        setCurrentImage(prev => ({...prev, image_url: ''})); 
      }
      e.target.value = ''; 
    }
  };
  
  const handleRemoveImagePreview = () => {
    setImageFile(null);
    if (currentImage && !isNewImage) {
      const originalImage = images.find(img => img.id === currentImage.id);
      setImagePreview(originalImage?.image_url || null);
    } else {
      setImagePreview(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (currentImage) {
      if (name === "item_order") {
        setCurrentImage({ ...currentImage, [name]: parseInt(value, 10) || 0 });
      } else {
        setCurrentImage({ ...currentImage, [name]: value });
      }
    }
  };

  const handleSaveImage = async () => {
    if (!currentImage || !currentImage.alt_text) {
      toast({ title: "Erro de Validação", description: "Texto alternativo (alt_text) é obrigatório.", variant: "destructive" });
      return;
    }
    
    let finalImageUrl = currentImage.image_url || '';

    if (imageFile) { 
      setIsLoading(true);
      const uploadedUrl = await uploadCarouselImage(imageFile);
      setIsLoading(false);
      if (!uploadedUrl) {
        toast({ title: "Erro de Upload", description: "Falha ao fazer upload da nova imagem.", variant: "destructive" });
        return;
      }
      finalImageUrl = uploadedUrl;
    } else if (isNewImage && !finalImageUrl) {
        toast({ title: "Erro de Validação", description: "Por favor, selecione uma imagem para o novo item.", variant: "destructive" });
        return;
    }

    if (!finalImageUrl) {
        toast({ title: "Erro de Validação", description: "A imagem é obrigatória.", variant: "destructive" });
        return;
    }
    
    const itemData: CarouselItemInsert | CarouselItemUpdate = {
      image_url: finalImageUrl,
      alt_text: currentImage.alt_text.trim(),
      title: currentImage.title?.trim() || '',
      subtitle: currentImage.subtitle?.trim() || '',
      item_order: currentImage.item_order || 0,
    };

    setIsLoading(true);
    let success = false;
    let message = "";

    if (isNewImage) {
      const newItem = await insertCarouselItem(itemData as CarouselItemInsert);
      if (newItem) {
        success = true;
        message = "Imagem adicionada ao carrossel.";
      } else {
        message = "Falha ao adicionar imagem.";
      }
    } else if (currentImage.id) { 
      const updatedItem = await updateCarouselItem(currentImage.id, itemData as CarouselItemUpdate);
      if (updatedItem) {
        success = true;
        message = "Imagem do carrossel atualizada.";
      } else {
        message = "Falha ao atualizar imagem.";
      }
    }
    
    setIsLoading(false);
    toast({ title: success ? "Sucesso" : "Erro", description: message, variant: success ? "default" : "destructive" });

    if (success) {
      setIsDialogOpen(false);
      setImageFile(null);
      setImagePreview(null);
      await loadImages(); 
    }
  };

  const handleDeleteImage = async (id: string, altText: string) => {
    if (window.confirm(`Tem certeza que deseja remover a imagem "${altText}" do carrossel?`)) {
      setIsLoading(true);
      const success = await deleteCarouselItem(id);
      setIsLoading(false);
      toast({ 
        title: success ? "Sucesso" : "Erro", 
        description: success ? `Imagem "${altText}" removida.` : "Falha ao remover imagem.", 
        variant: success ? "default" : "destructive" 
      });
      if (success) {
        await loadImages(); 
      }
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newImagesOrder = [...images];
    const itemToMove = newImagesOrder[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= newImagesOrder.length) return;

    const itemToSwapWith = newImagesOrder[swapIndex];

    const tempOrder = itemToMove.item_order;
    itemToMove.item_order = itemToSwapWith.item_order;
    itemToSwapWith.item_order = tempOrder;
    
    newImagesOrder.sort((a, b) => (a.item_order || 0) - (b.item_order || 0));
    setImages(newImagesOrder); // Optimistic UI update

    setIsLoading(true);
    const update1 = updateCarouselItem(itemToMove.id, { item_order: itemToMove.item_order });
    const update2 = updateCarouselItem(itemToSwapWith.id, { item_order: itemToSwapWith.item_order });

    try {
      const results = await Promise.all([update1, update2]);
      if (results.every(res => res !== null)) {
        toast({title: "Sucesso", description: "Ordem atualizada."});
      } else {
        toast({title: "Erro", description: "Falha ao atualizar ordem no banco.", variant: "destructive"});
      }
    } catch (error) {
        toast({title: "Erro Crítico", description: "Falha ao comunicar com o servidor para reordenar.", variant: "destructive"});
    } finally {
        setIsLoading(false);
        await loadImages(); // Always reload from DB to ensure consistency
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Carrossel da Home</h1>
        <Button onClick={openNewImageDialog} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" /> Nova Imagem
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Imagens do Carrossel</CardTitle>
        </CardHeader>
        <CardContent>
          <CarouselItemsTable
            images={images}
            isLoading={isLoading}
            onEditItem={openEditImageDialog}
            onDeleteItem={handleDeleteImage}
            onMoveItem={handleMove}
          />
        </CardContent>
      </Card>

      {isDialogOpen && currentImage && (
        <CarouselItemForm
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          isNewImage={isNewImage}
          currentImage={currentImage}
          imagePreview={imagePreview}
          isLoading={isLoading}
          onSave={handleSaveImage}
          onFileChange={handleFileChange}
          onRemoveImagePreview={handleRemoveImagePreview}
          onInputChange={handleInputChange}
        />
      )}
    </div>
  );
}
