
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
import { Edit, Trash2, ArrowUp, ArrowDown, ImageOff } from 'lucide-react'; // Added ImageOff
import { Species } from '@/types/species';
import { Skeleton } from "@/components/ui/skeleton"; // Added Skeleton

interface SpeciesTableProps {
  speciesList: Species[];
  onEdit: (speciesData: Species) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isLoading?: boolean; // Added isLoading prop
}

export function SpeciesTable({
  speciesList,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isLoading // Destructure isLoading
}: SpeciesTableProps) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Ordem</TableHead>
            <TableHead className="w-[100px]">Imagem</TableHead>
            <TableHead>Nome Popular</TableHead>
            <TableHead>Nome Científico</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right w-[150px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 3 }).map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
              <TableCell><Skeleton className="h-5 w-10" /></TableCell>
              <TableCell><Skeleton className="h-12 w-12 rounded" /></TableCell>
              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Ordem</TableHead>
          <TableHead className="w-[100px]">Imagem</TableHead>
          <TableHead>Nome Popular</TableHead>
          <TableHead>Nome Científico</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right w-[150px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {speciesList.map((item, index) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-center gap-1">
                <span>{item.order}</span>
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => onMoveUp(index)}
                    disabled={index === 0 || isLoading}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => onMoveDown(index)}
                    disabled={index === speciesList.length - 1 || isLoading}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </TableCell>
            <TableCell>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.commonName}
                  className="h-12 w-12 object-cover rounded"
                  loading="lazy"
                />
              ) : (
                <div className="h-12 w-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                  <ImageOff size={24} />
                </div>
              )}
            </TableCell>
            <TableCell>{item.commonName}</TableCell>
            <TableCell><em>{item.name}</em></TableCell>
            <TableCell>
              {item.type === 'serpente' && 'Serpente'}
              {item.type === 'lagarto' && 'Lagarto'}
              {item.type === 'quelonio' && 'Quelônio'}
              {item.type === 'outro' && 'Outro'}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(item)}
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:text-destructive h-8 w-8"
                  onClick={() => onDelete(item.id)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Excluir</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
