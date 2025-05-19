
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
import { Edit, Plus, Trash2, Upload, ArrowUp, ArrowDown } from 'lucide-react';
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
} from '@/services/carouselService'; // Imports atualizados

export default function AdminCarousel() {
  const [images, setImages] = useState<CarouselItemSchema[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<Partial<CarouselItemSchema> | null>(null); // Usando Partial para edição
  const [isNewImage, setIsNewImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const loadImages = async () => {
    const fetchedImages = await fetchCarouselItems();
    setImages(fetchedImages);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const openNewImageDialog = () => {
    setCurrentImage({ // id será gerado pelo Supabase ou pode ser omitido aqui
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
    setCurrentImage(imageData);
    setIsNewImage(false);
    setImagePreview(imageData.image_url); // Assumindo que image_url existe
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
      toast({ title: "Erro", description: "Texto alternativo (alt_text) é obrigatório.", variant: "destructive" });
      return;
    }
    
    let finalImageUrl = currentImage.image_url || '';

    if (imageFile) { // Se um novo arquivo foi selecionado
      const uploadedUrl = await uploadCarouselImage(imageFile);
      if (!uploadedUrl) {
        toast({ title: "Erro de Upload", description: "Falha ao fazer upload da nova imagem.", variant: "destructive" });
        return;
      }
      finalImageUrl = uploadedUrl;
    } else if (isNewImage && !imageFile) { // Se é novo e nenhum arquivo foi selecionado
        toast({ title: "Erro", description: "Por favor, selecione uma imagem para o novo item.", variant: "destructive" });
        return;
    }

    if (!finalImageUrl && isNewImage) { // Checagem adicional para garantir que a URL da imagem exista para novos itens
        toast({ title: "Erro", description: "A imagem é obrigatória para um novo item.", variant: "destructive" });
        return;
    }

    const itemDataToSave = {
      // id: currentImage.id, // id é tratado pelo Supabase ou na função de update
      image_url: finalImageUrl,
      alt_text: currentImage.alt_text,
      title: currentImage.title || '',
      subtitle: currentImage.subtitle || '',
      item_order: currentImage.item_order || (images.length > 0 ? Math.max(...images.map(img => img.item_order || 0)) + 1 : 0),
    };

    if (isNewImage) {
      const newItem = await insertCarouselItem(itemDataToSave as CarouselItemInsert);
      if (newItem) {
        toast({ title: "Sucesso", description: "Imagem adicionada ao carrossel." });
        await loadImages(); // Recarrega as imagens
      } else {
        toast({ title: "Erro", description: "Falha ao adicionar imagem.", variant: "destructive" });
      }
    } else if (currentImage.id) { // Se for edição, currentImage.id deve existir
      const updatedItem = await updateCarouselItem(currentImage.id, itemDataToSave as CarouselItemUpdate);
      if (updatedItem) {
        toast({ title: "Sucesso", description: "Imagem do carrossel atualizada." });
        await loadImages(); // Recarrega as imagens
      } else {
        toast({ title: "Erro", description: "Falha ao atualizar imagem.", variant: "destructive" });
      }
    }
    
    setIsDialogOpen(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDeleteImage = async (id: string) => {
    if (window.confirm("Tem certeza que deseja remover esta imagem do carrossel?")) {
      const success = await deleteCarouselItem(id);
      if (success) {
        toast({ title: "Sucesso", description: "Imagem removida do carrossel." });
        await loadImages(); // Recarrega as imagens
      } else {
        toast({ title: "Erro", description: "Falha ao remover imagem.", variant: "destructive" });
      }
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const itemToMove = newImages[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= newImages.length) return;

    const itemToSwapWith = newImages[swapIndex];

    // Troca as ordens
    const newOrderForItemToMove = itemToSwapWith.item_order;
    const newOrderForItemToSwapWith = itemToMove.item_order;

    // Atualiza no Supabase
    const update1 = updateCarouselItem(itemToMove.id, { item_order: newOrderForItemToMove });
    const update2 = updateCarouselItem(itemToSwapWith.id, { item_order: newOrderForItemToSwapWith });

    Promise.all([update1, update2]).then(async (results) => {
      if (results[0] && results[1]) {
        toast({title: "Sucesso", description: "Ordem atualizada."});
        await loadImages(); // Recarrega e reordena
      } else {
        toast({title: "Erro", description: "Falha ao atualizar ordem.", variant: "destructive"});
      }
    });
  };


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Carrossel da Home</h1>
        <Button onClick={openNewImageDialog}>
          <Plus className="mr-2 h-4 w-4" /> Nova Imagem
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Imagens do Carrossel</CardTitle>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Nenhuma imagem no carrossel.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Ordem</TableHead> {/* Aumentado para caber os botões */}
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
                        <span>{img.item_order}</span>
                        <div className="flex flex-col ml-2">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'up')} disabled={index === 0}>
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={index === images.length - 1}>
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
                        <Button variant="outline" size="sm" onClick={() => openEditImageDialog(img)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(img.id)}>
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
          {currentImage && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="image-upload-input">Imagem Principal</Label>
                <div className="flex items-center gap-2">
                    <Input id="image-upload-input" type="file" accept="image/*" onChange={handleFileChange} className="flex-grow" />
                    {imageFile && <Button variant="ghost" size="sm" onClick={() => { setImageFile(null); setImagePreview(currentImage.image_url || null); }}><Trash2 className="h-4 w-4 text-red-500"/></Button>}
                </div>
                {imagePreview && (
                  <div className="mt-2 border rounded-lg overflow-hidden h-40 w-full flex items-center justify-center bg-muted">
                    <img src={imagePreview} alt="Pré-visualização" className="h-full w-auto object-contain" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" value={currentImage.title || ''} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Textarea id="subtitle" name="subtitle" value={currentImage.subtitle || ''} onChange={handleInputChange} rows={2}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alt_text">Texto Alternativo (Alt)*</Label>
                <Input id="alt_text" name="alt_text" value={currentImage.alt_text || ''} onChange={handleInputChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="item_order">Ordem</Label>
                <Input id="item_order" name="item_order" type="number" value={currentImage.item_order || ''} onChange={handleInputChange} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveImage}>{isNewImage ? 'Adicionar Imagem' : 'Salvar Alterações'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
