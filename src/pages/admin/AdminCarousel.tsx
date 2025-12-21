
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
  type CarouselItem,
  type CarouselInsert,
  type CarouselUpdate
} from '@/services/carouselService';
import CarouselItemForm from '@/components/admin/carousel/CarouselItemForm';
import CarouselItemsTable from '@/components/admin/carousel/CarouselItemsTable';

export default function AdminCarousel() {
  const [images, setImages] = useState<CarouselItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<Partial<CarouselItem> & { id?: string } | null>(null);
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
      console.error("Error loading images:", error);
      toast({ 
        title: "Erro ao carregar imagens", 
        description: "Não foi possível buscar as imagens do carrossel.", 
        variant: "destructive" 
      });
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
      focus_desktop: 'center',
      focus_mobile: 'center',
    });
    setIsNewImage(true);
    setImagePreview(null);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const openEditImageDialog = (imageData: CarouselItem) => {
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

  const handleFocusChange = (field: 'focus_desktop' | 'focus_mobile', value: string) => {
    if (currentImage) {
      setCurrentImage({ ...currentImage, [field]: value });
    }
  };

  const handleSaveImage = async () => {
    if (!currentImage || !currentImage.alt_text) {
      toast({ 
        title: "Erro de Validação", 
        description: "Texto alternativo (alt_text) é obrigatório.", 
        variant: "destructive" 
      });
      return;
    }
    
    let finalImageUrl = currentImage.image_url || '';

    if (imageFile) { 
      setIsLoading(true);
      const uploadedUrl = await uploadCarouselImage(imageFile);
      setIsLoading(false);
      if (!uploadedUrl) {
        toast({ 
          title: "Erro de Upload", 
          description: "Falha ao fazer upload da nova imagem.", 
          variant: "destructive" 
        });
        return;
      }
      finalImageUrl = uploadedUrl;
    } else if (isNewImage && !finalImageUrl) {
      toast({ 
        title: "Erro de Validação", 
        description: "Por favor, selecione uma imagem para o novo item.", 
        variant: "destructive" 
      });
      return;
    }

    if (!finalImageUrl) {
      toast({ 
        title: "Erro de Validação", 
        description: "A imagem é obrigatória.", 
        variant: "destructive" 
      });
      return;
    }
    
    const itemData: CarouselInsert | CarouselUpdate = {
      image_url: finalImageUrl,
      alt_text: currentImage.alt_text.trim(),
      title: currentImage.title?.trim() || '',
      subtitle: currentImage.subtitle?.trim() || '',
      item_order: currentImage.item_order || 0,
      focus_desktop: currentImage.focus_desktop || 'center',
      focus_mobile: currentImage.focus_mobile || 'center',
    };

    setIsLoading(true);
    try {
      if (isNewImage) {
        await insertCarouselItem(itemData as CarouselInsert);
        toast({ title: "Sucesso", description: "Imagem adicionada ao carrossel." });
      } else if (currentImage.id) { 
        await updateCarouselItem(currentImage.id, itemData as CarouselUpdate);
        toast({ title: "Sucesso", description: "Imagem do carrossel atualizada." });
      }
      
      setIsDialogOpen(false);
      setImageFile(null);
      setImagePreview(null);
      await loadImages();
    } catch (error) {
      console.error("Save error:", error);
      toast({ 
        title: "Erro", 
        description: isNewImage ? "Falha ao adicionar imagem." : "Falha ao atualizar imagem.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async (id: string, altText: string) => {
    if (window.confirm(`Tem certeza que deseja remover a imagem "${altText}" do carrossel?`)) {
      setIsLoading(true);
      try {
        await deleteCarouselItem(id);
        toast({ title: "Sucesso", description: `Imagem "${altText}" removida.` });
        await loadImages();
      } catch (error) {
        console.error("Delete error:", error);
        toast({ 
          title: "Erro", 
          description: "Falha ao remover imagem.", 
          variant: "destructive" 
        });
      } finally {
        setIsLoading(false);
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
    setImages(newImagesOrder);

    setIsLoading(true);
    try {
      await Promise.all([
        updateCarouselItem(itemToMove.id, { item_order: itemToMove.item_order }),
        updateCarouselItem(itemToSwapWith.id, { item_order: itemToSwapWith.item_order })
      ]);
      toast({title: "Sucesso", description: "Ordem atualizada."});
    } catch (error) {
      console.error("Move error:", error);
      toast({title: "Erro", description: "Falha ao atualizar ordem.", variant: "destructive"});
    } finally {
      setIsLoading(false);
      await loadImages();
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
          onFocusChange={handleFocusChange}
        />
      )}
    </div>
  );
}
