import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Species } from '@/types/species';
import { SpeciesFormFields } from './SpeciesFormFields';

interface SpeciesDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isNewSpecies: boolean;
  currentSpeciesData: Species | null;
  onSave: () => void;
  isLoading?: boolean;
  
  // Props for SpeciesFormFields
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
  galleryPreviews: string[];
  galleryFiles: File[];
  onGalleryAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryRemove: (index: number) => void;
}

export function SpeciesDialog({
  isOpen,
  onOpenChange,
  isNewSpecies,
  currentSpeciesData,
  onSave,
  isLoading, // Destructure isLoading
  ...formProps 
}: SpeciesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>
            {isNewSpecies ? 'Adicionar Nova Espécie' : 'Editar Espécie'}
          </DialogTitle>
        </DialogHeader>

        {currentSpeciesData && (
          <SpeciesFormFields
            speciesData={currentSpeciesData}
            {...formProps}
          />
        )}

        <DialogFooter className="pt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={isLoading}>
            {isLoading ? 'Salvando...' : (isNewSpecies ? 'Adicionar Espécie' : 'Salvar Alterações')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
