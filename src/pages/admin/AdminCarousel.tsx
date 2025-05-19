
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
import { Textarea } from '@/components/ui/textarea'; // Added for title/subtitle
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Edit, Plus, Trash2, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CarouselImage, getCarouselImages, saveCarouselImages } from '@/services/carouselService';

export default function AdminCarousel() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<Partial<CarouselImage> | null>(null);
  const [isNewImage, setIsNewImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // To store the actual file for new uploads
  const { toast } = useToast();

  useEffect(() => {
    setImages(getCarouselImages());
  }, []);

  const openNewImageDialog = () => {
    setCurrentImage({
      id: crypto.randomUUID(),
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
    setCurrentImage(imageData);
    setIsNewImage(false);
    setImagePreview(imageData.url);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file); // Store the file
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
      setCurrentImage({ ...currentImage, [name]: value });
    }
  };

  const handleSaveImage = () => {
    if (!currentImage || !currentImage.alt ) {
      toast({ title: "Erro", description: "Texto alternativo (alt) é obrigatório.", variant: "destructive" });
      return;
    }
    
    let imageUrlToSave = currentImage.url;

    if (imageFile && imagePreview && imagePreview.startsWith('data:')) {
      // For now, we use the data URL directly. In a real app, upload imageFile to a server
      // and get back a URL. Here, imagePreview (data URL) serves as the new URL.
      imageUrlToSave = imagePreview;
    } else if (isNewImage && !imageFile) {
        toast({ title: "Erro", description: "Por favor, selecione uma imagem.", variant: "destructive" });
        return;
    }


    const imageToSave: CarouselImage = {
      id: currentImage.id || crypto.randomUUID(),
      url: imageUrlToSave || '',
      alt: currentImage.alt || '',
      title: currentImage.title || '',
      subtitle: currentImage.subtitle || '',
      order: currentImage.order || (images.length > 0 ? Math.max(...images.map(img => img.order)) + 1 : 1),
    };
    
    let updatedImages;
    if (isNewImage) {
      updatedImages = [...images, imageToSave];
      toast({ title: "Sucesso", description: "Imagem adicionada ao carrossel." });
    } else {
      updatedImages = images.map(img => img.id === imageToSave.id ? imageToSave : img);
      toast({ title: "Sucesso", description: "Imagem do carrossel atualizada." });
    }
    
    updatedImages.sort((a, b) => a.order - b.order);
    setImages(updatedImages);
    saveCarouselImages(updatedImages);
    setIsDialogOpen(false);
    setImageFile(null);
  };

  const handleDeleteImage = (id: string) => {
    if (window.confirm("Tem certeza que deseja remover esta imagem do carrossel?")) {
      const updatedImages = images.filter(img => img.id !== id);
      setImages(updatedImages);
      saveCarouselImages(updatedImages);
      toast({ title: "Sucesso", description: "Imagem removida do carrossel." });
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const item = newImages[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= newImages.length) return;

    // Swap order property
    const tempOrder = item.order;
    item.order = newImages[swapIndex].order;
    newImages[swapIndex].order = tempOrder;
    
    // Sort array based on new order
    newImages.sort((a,b) => a.order - b.order);

    setImages(newImages);
    saveCarouselImages(newImages);
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
                      <img src={img.url} alt={img.alt} className="h-16 w-24 object-cover rounded" />
                    </TableCell>
                    <TableCell>{img.title}</TableCell>
                    <TableCell className="text-sm max-w-xs truncate">{img.subtitle}</TableCell>
                    <TableCell>{img.alt}</TableCell>
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
                <Input id="image-upload-input" type="file" accept="image/*" onChange={handleFileChange} />
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
                <Label htmlFor="alt">Texto Alternativo (Alt)*</Label>
                <Input id="alt" name="alt" value={currentImage.alt || ''} onChange={handleInputChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="order">Ordem</Label>
                <Input id="order" name="order" type="number" value={currentImage.order || ''} onChange={handleInputChange} />
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
