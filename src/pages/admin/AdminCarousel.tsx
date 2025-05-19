import React, { useState, useEffect } from 'react';
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
import { Edit, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
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

export default function AdminCarousel() {
  const [images, setImages] = useState<CarouselItemSchema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<Partial<CarouselItemSchema> & { id?: string } | null>(null);
  const [isNewImage, setIsNewImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const loadImages = async () => {
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
  };

  useEffect(() => {
    loadImages();
  }, []);

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
    setCurrentImage({...imageData}); // Spread to make it mutable for form
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
        // Clear existing image_url if a new file is selected for upload
        // The save logic will prioritize imageFile
        setCurrentImage(prev => ({...prev, image_url: ''})); 
      }
      e.target.value = ''; // Reset file input
    }
  };
  
  const handleRemoveImagePreview = () => {
      setImageFile(null);
      // If editing, restore original preview, otherwise clear it
      if (currentImage && !isNewImage) {
        const originalImage = images.find(img => img.id === currentImage.id);
        setImagePreview(originalImage?.image_url || null);
      } else {
        setImagePreview(null);
      }
       if (currentImage) {
        // If user removes preview, signal that the image should be removed or not uploaded
        // This is mainly for the new image case. For edit, if they want to remove image, they'd ideally have a "remove image" button
        // For now, if they re-select the input, it will override. If they save without imageFile and it's a new item, it's an error.
        // If they save without imageFile and it's an edit, it keeps the old image_url unless explicitly cleared.
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
    
    let finalImageUrl = currentImage.image_url || ''; // Keep existing URL if no new file and editing

    if (imageFile) { 
      setIsLoading(true);
      const uploadedUrl = await uploadCarouselImage(imageFile);
      setIsLoading(false);
      if (!uploadedUrl) {
        toast({ title: "Erro de Upload", description: "Falha ao fazer upload da nova imagem.", variant: "destructive" });
        return;
      }
      finalImageUrl = uploadedUrl;
    } else if (isNewImage && !finalImageUrl) { // New image must have an image
        toast({ title: "Erro de Validação", description: "Por favor, selecione uma imagem para o novo item.", variant: "destructive" });
        return;
    }

    // If editing and no new imageFile, finalImageUrl would be currentImage.image_url
    // If new and no imageFile, it's an error (caught above)
    // If imageFile was provided, finalImageUrl is the new uploaded URL

    if (!finalImageUrl) { // Final check, mostly for new items
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

    // Optimistic UI update
    const tempOrder = itemToMove.item_order;
    itemToMove.item_order = itemToSwapWith.item_order;
    itemToSwapWith.item_order = tempOrder;
    
    // Sort locally for immediate feedback
    newImagesOrder.sort((a, b) => (a.item_order || 0) - (b.item_order || 0));
    setImages(newImagesOrder);

    setIsLoading(true);
    // Update in Supabase
    const update1 = updateCarouselItem(itemToMove.id, { item_order: itemToMove.item_order });
    const update2 = updateCarouselItem(itemToSwapWith.id, { item_order: itemToSwapWith.item_order });

    Promise.all([update1, update2]).then(async (results) => {
      setIsLoading(false);
      if (results.every(res => res !== null)) {
        toast({title: "Sucesso", description: "Ordem atualizada."});
      } else {
        toast({title: "Erro", description: "Falha ao atualizar ordem no banco. Revertendo UI.", variant: "destructive"});
      }
      await loadImages(); // Always reload from DB to ensure consistency
    }).catch(async () => {
        setIsLoading(false);
        toast({title: "Erro Crítico", description: "Falha ao comunicar com o servidor para reordenar.", variant: "destructive"});
        await loadImages(); // Revert UI to DB state
    });
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
          {isLoading && images.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Carregando imagens...</p>
          ) : !isLoading && images.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Nenhuma imagem no carrossel.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Ordem</TableHead>
                  <TableHead className="w-[100px]">Imagem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="max-w-[200px] truncate">Subtítulo</TableHead>
                  <TableHead>Texto Alternativo (Alt)</TableHead>
                  <TableHead className="text-right w-[180px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((img, index) => (
                  <TableRow key={img.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{img.item_order}</span>
                        <div className="flex flex-col ml-2">
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
                      {img.image_url && <img src={img.image_url} alt={img.alt_text} className="h-16 w-24 object-cover rounded" />}
                    </TableCell>
                    <TableCell>{img.title}</TableCell>
                    <TableCell className="text-sm max-w-xs truncate">{img.subtitle}</TableCell>
                    <TableCell>{img.alt_text}</TableCell>
                    <TableCell className="text-right">
                       <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditImageDialog(img)} disabled={isLoading}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(img.id, img.alt_text)} disabled={isLoading}>
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

      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!isLoading) setIsDialogOpen(open); }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isNewImage ? 'Adicionar Nova Imagem' : 'Editar Imagem do Carrossel'}</DialogTitle>
          </DialogHeader>
          {currentImage && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="image-upload-input">Imagem Principal*</Label>
                <div className="flex items-center gap-2">
                    <Input id="image-upload-input" type="file" accept="image/*" onChange={handleFileChange} className="flex-grow" disabled={isLoading}/>
                    {(imagePreview || imageFile) && <Button variant="ghost" size="sm" onClick={handleRemoveImagePreview} disabled={isLoading}><Trash2 className="h-4 w-4 text-red-500"/></Button>}
                </div>
                {imagePreview && (
                  <div className="mt-2 border rounded-lg overflow-hidden h-40 w-full flex items-center justify-center bg-muted">
                    <img src={imagePreview} alt="Pré-visualização" className="h-full w-auto object-contain" />
                  </div>
                )}
                {!imagePreview && isNewImage && <p className="text-xs text-muted-foreground">Nenhuma imagem selecionada.</p>}
                {!imagePreview && !isNewImage && currentImage.image_url && <p className="text-xs text-muted-foreground">Imagem atual será mantida se nenhuma nova for selecionada.</p>}
                 {!imagePreview && !isNewImage && !currentImage.image_url && <p className="text-xs text-muted-foreground">Sem imagem associada.</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" value={currentImage.title || ''} onChange={handleInputChange} disabled={isLoading}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Textarea id="subtitle" name="subtitle" value={currentImage.subtitle || ''} onChange={handleInputChange} rows={2} disabled={isLoading}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alt_text">Texto Alternativo (Alt)*</Label>
                <Input id="alt_text" name="alt_text" value={currentImage.alt_text || ''} onChange={handleInputChange} required disabled={isLoading}/>
              </div>
               <div className="space-y-2">
                <Label htmlFor="item_order">Ordem</Label>
                <Input id="item_order" name="item_order" type="number" value={currentImage.item_order === undefined ? '' : currentImage.item_order} onChange={handleInputChange} disabled={isLoading}/>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>Cancelar</Button>
            <Button onClick={handleSaveImage} disabled={isLoading}>
              {isLoading? 'Salvando...' : (isNewImage ? 'Adicionar Imagem' : 'Salvar Alterações')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
