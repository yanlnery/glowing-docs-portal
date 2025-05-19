
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import type { CarouselItemSchema } from '@/services/carouselService';

interface CarouselItemFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isNewImage: boolean;
  currentImage: Partial<CarouselItemSchema> & { id?: string } | null;
  imagePreview: string | null;
  isLoading: boolean;
  onSave: () => Promise<void>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImagePreview: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function CarouselItemForm({
  isOpen,
  onOpenChange,
  isNewImage,
  currentImage,
  imagePreview,
  isLoading,
  onSave,
  onFileChange,
  onRemoveImagePreview,
  onInputChange,
}: CarouselItemFormProps) {
  if (!currentImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) onOpenChange(open); }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isNewImage ? 'Adicionar Nova Imagem' : 'Editar Imagem do Carrossel'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="image-upload-input">Imagem Principal*</Label>
            <div className="flex items-center gap-2">
              <Input id="image-upload-input" type="file" accept="image/*" onChange={onFileChange} className="flex-grow" disabled={isLoading} />
              {(imagePreview) && <Button variant="ghost" size="sm" onClick={onRemoveImagePreview} disabled={isLoading}><Trash2 className="h-4 w-4 text-red-500" /></Button>}
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
            <Input id="title" name="title" value={currentImage.title || ''} onChange={onInputChange} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Textarea id="subtitle" name="subtitle" value={currentImage.subtitle || ''} onChange={onInputChange} rows={2} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alt_text">Texto Alternativo (Alt)*</Label>
            <Input id="alt_text" name="alt_text" value={currentImage.alt_text || ''} onChange={onInputChange} required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="item_order">Ordem</Label>
            <Input id="item_order" name="item_order" type="number" value={currentImage.item_order === undefined ? '' : currentImage.item_order} onChange={onInputChange} disabled={isLoading} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancelar</Button>
          <Button onClick={onSave} disabled={isLoading}>
            {isLoading ? 'Salvando...' : (isNewImage ? 'Adicionar Imagem' : 'Salvar Alterações')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
