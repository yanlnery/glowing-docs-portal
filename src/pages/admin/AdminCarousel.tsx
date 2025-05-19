
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Edit, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'; // Upload icon removed as file input handles it
import { useToast } from '@/components/ui/use-toast';
import { 
  CarouselImage, // This is now the UI-facing type
  CarouselItemDB, // This is the DB-facing type
  getCarouselImages,
  addCarouselItem,
  updateCarouselItem,
  deleteCarouselItem,
  uploadCarouselImageFile,
  deleteCarouselImageFile,
  updateCarouselItemsOrder
} from '@/services/carouselService';
import { useAdminAuth } from '@/contexts/AdminAuthContext'; // For checking auth state

// Helper to map CarouselImage (UI) to CarouselItemDB (DB) for saving
const mapToDbItem = (uiItem: Partial<CarouselImage>, existingDbItem?: CarouselItemDB): Omit<CarouselItemDB, 'id' | 'created_at' | 'updated_at'> => {
  return {
    image_url: uiItem.url ?? null,
    alt_text: uiItem.alt || 'Carousel Image', // Ensure alt_text is not empty
    title: uiItem.title || null,
    subtitle: uiItem.subtitle || null,
    item_order: uiItem.order || 0,
  };
};


export default function AdminCarousel() {
  const [images, setImages] = useState<CarouselImage[]>([]); // UI state uses CarouselImage
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // currentImageForDialog will store data for the dialog, matching CarouselImage structure
  const [currentImageForDialog, setCurrentImageForDialog] = useState<Partial<CarouselImage> | null>(null);
  const [isNewImage, setIsNewImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { isAdminLoggedIn } = useAdminAuth();

  const fetchImages = useCallback(async () => {
    if (!isAdminLoggedIn) return;
    setIsLoading(true);
    const fetchedImages = await getCarouselImages();
    setImages(fetchedImages);
    setIsLoading(false);
  }, [isAdminLoggedIn]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const openNewImageDialog = () => {
    setCurrentImageForDialog({
      id: crypto.randomUUID(), // Temporary client-side ID for new items if needed, Supabase will generate one
      url: '',
      alt: '',
      title: '',
      subtitle: '',
      order: images.length > 0 ? Math.max(...images.map(img => img.order)) + 1 : 1,
    });
    setIsNewImage(true);
    setImagePreview(null);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const openEditImageDialog = (imageData: CarouselImage) => {
    setCurrentImageForDialog(imageData);
    setIsNewImage(false);
    setImagePreview(imageData.url); // imageData.url can be null
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
        if (currentImageForDialog) {
            // Update currentImageForDialog's url with the preview for optimistic UI update
            // The actual URL will be from Supabase storage after upload
            // setCurrentImageForDialog({ ...currentImageForDialog, url: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (currentImageForDialog) {
      const val = name === 'order' ? parseInt(value, 10) : value;
      setCurrentImageForDialog({ ...currentImageForDialog, [name]: val });
    }
  };

  const handleSaveImage = async () => {
    if (!currentImageForDialog || !currentImageForDialog.alt) {
      toast({ title: "Erro", description: "Texto alternativo (alt) é obrigatório.", variant: "destructive" });
      return;
    }
    if (!isAdminLoggedIn) {
      toast({ title: "Acesso Negado", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    let newImageUrl = currentImageForDialog.url ?? null; // Start with existing URL or null
    const originalImageUrl = isNewImage ? null : images.find(img => img.id === currentImageForDialog.id)?.url ?? null;

    // 1. Handle Image Upload/Removal
    if (imageFile) { // New file selected
      if (originalImageUrl) { // If there was an old image, delete it
        await deleteCarouselImageFile(originalImageUrl);
      }
      newImageUrl = await uploadCarouselImageFile(imageFile);
      if (!newImageUrl) {
        toast({ title: "Erro", description: "Falha no upload da imagem.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
    } else if (!imagePreview && originalImageUrl && !isNewImage) { 
      // Image explicitly removed (preview is null, there was an original image, and not a new item)
      await deleteCarouselImageFile(originalImageUrl);
      newImageUrl = null;
    }
    
    const itemToSaveCommon = mapToDbItem({ ...currentImageForDialog, url: newImageUrl });

    if (isNewImage) {
      const addedItem = await addCarouselItem(itemToSaveCommon);
      if (addedItem) {
        toast({ title: "Sucesso", description: "Imagem adicionada ao carrossel." });
      } else {
        toast({ title: "Erro", description: "Não foi possível adicionar a imagem.", variant: "destructive" });
        if (newImageUrl && imageFile) await deleteCarouselImageFile(newImageUrl); // Rollback upload
      }
    } else if (currentImageForDialog.id) {
      const updatedItem = await updateCarouselItem(currentImageForDialog.id, itemToSaveCommon);
      if (updatedItem) {
        toast({ title: "Sucesso", description: "Imagem do carrossel atualizada." });
      } else {
        toast({ title: "Erro", description: "Não foi possível atualizar a imagem.", variant: "destructive" });
         // More complex rollback for update: if newImageUrl was from a new upload that replaced an old one,
         // and DB update failed, the old image is already deleted.
         // We might need to re-upload the original imageFile if we had it, or leave as is.
         // For now, if a *new* image was uploaded for an update and DB failed, delete that *new* image.
        if (imageFile && newImageUrl && newImageUrl !== originalImageUrl) {
            await deleteCarouselImageFile(newImageUrl);
            // Potentially try to restore originalImageUrl to the item if we revert UI state
        }
      }
    }

    await fetchImages(); // Refresh list
    setIsLoading(false);
    setIsDialogOpen(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDeleteImage = async (id: string) => {
    if (!isAdminLoggedIn) {
      toast({ title: "Acesso Negado", variant: "destructive" });
      return;
    }
    const imageToDelete = images.find(img => img.id === id);
    if (!imageToDelete) return;

    if (window.confirm(`Tem certeza que deseja remover "${imageToDelete.title || imageToDelete.alt}" do carrossel?`)) {
      setIsLoading(true);
      const success = await deleteCarouselItem(id); // This service fn also handles storage deletion
      if (success) {
        toast({ title: "Sucesso", description: "Imagem removida do carrossel." });
        await fetchImages();
      } else {
        toast({ title: "Erro", description: "Não foi possível remover a imagem.", variant: "destructive" });
      }
      setIsLoading(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!isAdminLoggedIn) return;
    
    const newImagesList = [...images];
    const itemToMove = newImagesList[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= newImagesList.length) return;

    const itemToSwapWith = newImagesList[swapIndex];

    // Swap order properties
    const newOrderForMovedItem = itemToSwapWith.order;
    const newOrderForSwappedItem = itemToMove.order;

    newImagesList[index] = { ...itemToMove, order: newOrderForMovedItem };
    newImagesList[swapIndex] = { ...itemToSwapWith, order: newOrderForSwappedItem };
    
    newImagesList.sort((a,b) => a.order - b.order); // Visually update order immediately
    setImages(newImagesList);


    setIsLoading(true);
    // Update only the two affected items in the DB
    const success = await updateCarouselItemsOrder([
      { id: itemToMove.id, item_order: newOrderForMovedItem },
      { id: itemToSwapWith.id, item_order: newOrderForSwappedItem }
    ]);
    
    if (success) {
      toast({title: "Ordem atualizada"});
    } else {
      toast({title: "Erro ao atualizar ordem", variant: "destructive"});
    }
    await fetchImages(); // Refresh from DB to ensure consistency
    setIsLoading(false);
  };


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Carrossel da Home</h1>
        <Button onClick={openNewImageDialog} disabled={isLoading || !isAdminLoggedIn}>
          <Plus className="mr-2 h-4 w-4" /> Nova Imagem
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Imagens do Carrossel</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && images.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Carregando imagens...</p>
          ) : !isLoading && images.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Nenhuma imagem no carrossel.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Ordem</TableHead>
                  <TableHead className="w-[100px]">Imagem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Subtítulo</TableHead>
                  <TableHead>Texto Alternativo (Alt)</TableHead>
                  <TableHead className="text-right w-[180px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((img, index) => (
                  <TableRow key={img.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{img.order}</span>
                        <div className="flex flex-col">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'up')} disabled={index === 0 || isLoading}>
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={index === images.length - 1 || isLoading}>
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {img.url ? (
                        <img src={img.url} alt={img.alt} className="h-16 w-24 object-cover rounded" />
                      ) : (
                        <div className="h-16 w-24 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">Sem Imagem</div>
                      )}
                    </TableCell>
                    <TableCell>{img.title}</TableCell>
                    <TableCell className="text-sm max-w-xs truncate">{img.subtitle}</TableCell>
                    <TableCell>{img.alt}</TableCell>
                    <TableCell className="text-right">
                       <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditImageDialog(img)} disabled={isLoading}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(img.id)} disabled={isLoading}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isNewImage ? 'Adicionar Nova Imagem' : 'Editar Imagem do Carrossel'}</DialogTitle>
          </DialogHeader>
          {currentImageForDialog && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="image-upload-input">Imagem Principal</Label>
                <Input id="image-upload-input" type="file" accept="image/*" onChange={handleFileChange} />
                {imagePreview && (
                  <div className="mt-2 border rounded-lg overflow-hidden h-40 w-full flex items-center justify-center bg-muted">
                    <img src={imagePreview} alt="Pré-visualização" className="h-full w-auto object-contain" />
                  </div>
                )}
                 {!imagePreview && currentImageForDialog.url && ( // Show existing image if no new preview
                  <div className="mt-2 border rounded-lg overflow-hidden h-40 w-full flex items-center justify-center bg-muted">
                    <img src={currentImageForDialog.url} alt="Imagem Atual" className="h-full w-auto object-contain" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" value={currentImageForDialog.title || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Textarea id="subtitle" name="subtitle" value={currentImageForDialog.subtitle || ''} onChange={handleInputChange} rows={2}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alt">Texto Alternativo (Alt)*</Label>
                <Input id="alt" name="alt" value={currentImageForDialog.alt || ''} onChange={handleInputChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="order">Ordem</Label>
                <Input id="order" name="order" type="number" value={currentImageForDialog.order || ''} onChange={handleInputChange} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>Cancelar</Button>
            <Button onClick={handleSaveImage} disabled={isLoading}>
              {isLoading ? 'Salvando...' : (isNewImage ? 'Adicionar Imagem' : 'Salvar Alterações')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
