
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Species } from '@/types/species';
import { ArrayFieldManager } from './ArrayFieldManager';
import { ImageUpload } from './ImageUpload';

interface SpeciesFormFieldsProps {
  speciesData: Species; // currentSpecies is always non-null when dialog is open
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  
  onCharacteristicChange: (index: number, value: string) => void;
  onAddCharacteristic: () => void;
  onRemoveCharacteristic: (index: number) => void;
  
  onCuriosityChange: (index: number, value: string) => void;
  onAddCuriosity: () => void;
  onRemoveCuriosity: (index: number) => void;
  
  imagePreview: string | null;
  imageFile: File | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function SpeciesFormFields({
  speciesData,
  onInputChange,
  onCharacteristicChange,
  onAddCharacteristic,
  onRemoveCharacteristic,
  onCuriosityChange,
  onAddCuriosity,
  onRemoveCuriosity,
  imagePreview,
  imageFile,
  onImageChange,
  onRemoveImage,
}: SpeciesFormFieldsProps) {
  if (!speciesData) return null; // Should not happen if dialog is open

  return (
    <div className="grid gap-6 pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="commonName">Nome Popular*</Label>
          <Input
            id="commonName"
            name="commonName"
            value={speciesData.commonName}
            onChange={onInputChange}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome Científico*</Label>
          <Input
            id="name"
            name="name"
            value={speciesData.name}
            onChange={onInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="type">Tipo</Label>
          <select
            id="type"
            name="type"
            value={speciesData.type}
            onChange={onInputChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="serpente">Serpente</option>
            <option value="lagarto">Lagarto</option>
            <option value="quelonio">Quelônio</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            name="slug"
            value={speciesData.slug}
            onChange={onInputChange}
            placeholder="Gerado do nome científico se vazio"
          />
        </div>
      </div>

      <ImageUpload 
        imagePreview={imagePreview}
        imageFile={imageFile}
        existingImageUrl={speciesData.image}
        onImageChange={onImageChange}
        onRemoveImage={onRemoveImage}
      />

      <div className="space-y-1.5">
        <Label htmlFor="description">Descrição Geral*</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          value={speciesData.description}
          onChange={onInputChange}
        />
      </div>

      <ArrayFieldManager
        label="Características"
        items={speciesData.characteristics}
        placeholderPrefix="Característica"
        onItemChange={onCharacteristicChange}
        onAddItem={onAddCharacteristic}
        onRemoveItem={onRemoveCharacteristic}
      />

      <ArrayFieldManager
        label="Curiosidades"
        items={speciesData.curiosities}
        placeholderPrefix="Curiosidade"
        onItemChange={onCuriosityChange}
        onAddItem={onAddCuriosity}
        onRemoveItem={onRemoveCuriosity}
      />
      
      <div className="space-y-1.5">
        <Label htmlFor="order">Ordem de exibição</Label>
        <Input
          id="order"
          name="order"
          type="number"
          min="1"
          value={speciesData.order}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
}
