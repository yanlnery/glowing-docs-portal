
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { CarouselItemSchema } from '@/services/carouselService';

interface CarouselItemsTableProps {
  images: CarouselItemSchema[];
  isLoading: boolean;
  onEditItem: (item: CarouselItemSchema) => void;
  onDeleteItem: (id: string, altText: string) => Promise<void>;
  onMoveItem: (index: number, direction: 'up' | 'down') => Promise<void>;
}

export default function CarouselItemsTable({
  images,
  isLoading,
  onEditItem,
  onDeleteItem,
  onMoveItem,
}: CarouselItemsTableProps) {
  if (isLoading && images.length === 0) {
    return <p className="text-center text-muted-foreground py-4">Carregando imagens...</p>;
  }
  if (!isLoading && images.length === 0) {
    return <p className="text-center text-muted-foreground py-4">Nenhuma imagem no carrossel.</p>;
  }

  return (
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
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onMoveItem(index, 'up')} disabled={index === 0 || isLoading}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onMoveItem(index, 'down')} disabled={index === images.length - 1 || isLoading}>
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
                <Button variant="outline" size="sm" onClick={() => onEditItem(img)} disabled={isLoading}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDeleteItem(img.id, img.alt_text)} disabled={isLoading}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
