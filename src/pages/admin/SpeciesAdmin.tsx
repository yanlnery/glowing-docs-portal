import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Species } from '@/types/species';
import { SpeciesTable } from '@/components/admin/species/SpeciesTable';
import { SpeciesDialog } from '@/components/admin/species/SpeciesDialog';
import { useSpeciesManagement } from '@/hooks/useSpeciesManagement';
import { useAdminAuth } from '@/contexts/AdminAuthContext'; // For checking auth state

const generateSlug = (name: string) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

const BUCKET_NAME = 'species_images';

export default function SpeciesAdmin() {
  // Use the hook for species data and operations
  const { 
    speciesList, 
    isLoading: speciesLoading, 
    fetchSpecies, 
    saveSpecies: saveSpeciesHook, 
    deleteSpecies: deleteSpeciesHook,
    reorderSpecies,
    maxOrder
  } = useSpeciesManagement();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSpecies, setCurrentSpecies] = useState<Species | null>(null);
  const [isNewSpecies, setIsNewSpecies] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { isAdminLoggedIn } = useAdminAuth();

  // fetchSpecies is called by the hook's useEffect

  const openNewSpeciesDialog = () => {
    setCurrentSpecies({
      id: '', 
      name: '',
      commonName: '',
      description: 'Descrição detalhada a ser preenchida.',
      characteristics: [''],
      curiosities: [''],
      image: null, // Changed from '' to null
      type: 'serpente',
      slug: '',
      order: maxOrder + 1,
    });
    setIsNewSpecies(true);
    setImagePreview(null);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const openEditSpeciesDialog = (speciesData: Species) => {
    setCurrentSpecies(speciesData);
    setIsNewSpecies(false);
    setImagePreview(speciesData.image); // Show existing image if available
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // If a new image is selected, we might want to clear the existing URL from currentSpecies state
      // This will be handled by saveSpecies logic: if imageFile exists, it takes precedence
      if (currentSpecies) {
         // setCurrentSpecies({ ...currentSpecies, image: null }); // Tentatively clear, will be replaced by new upload
      }
      e.target.value = ''; // Reset file input
    }
  };
  
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (currentSpecies) {
      // Important: Set image to null to indicate removal
      setCurrentSpecies({ ...currentSpecies, image: null }); 
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (currentSpecies) {
      let processedValue: string | number | string[] | null = value;
      if (name === 'order') {
        processedValue = parseInt(value, 10);
        if (isNaN(processedValue as number)) processedValue = currentSpecies.order; 
      }
      setCurrentSpecies({
        ...currentSpecies,
        [name]: processedValue
      });
    }
  };

  const createArrayHandler = (fieldName: 'characteristics' | 'curiosities') => ({
    handleChange: (index: number, value: string) => {
      if (currentSpecies) {
        const updatedArray = [...currentSpecies[fieldName]];
        updatedArray[index] = value;
        setCurrentSpecies({ ...currentSpecies, [fieldName]: updatedArray });
      }
    },
    handleAdd: () => {
      if (currentSpecies) {
        setCurrentSpecies({ ...currentSpecies, [fieldName]: [...currentSpecies[fieldName], ''] });
      }
    },
    handleRemove: (index: number) => {
      if (currentSpecies && currentSpecies[fieldName].length > 1) {
        const updatedArray = currentSpecies[fieldName].filter((_, i) => i !== index);
        setCurrentSpecies({ ...currentSpecies, [fieldName]: updatedArray });
      } else if (currentSpecies && currentSpecies[fieldName].length === 1) {
        // Optionally allow clearing the last item instead of preventing removal
        setCurrentSpecies({ ...currentSpecies, [fieldName]: [''] });
      }
    },
  });

  const characteristicsHandler = createArrayHandler('characteristics');
  const curiositiesHandler = createArrayHandler('curiosities');

  const handleSaveSpecies = async () => {
    if (!currentSpecies || !isAdminLoggedIn) {
      toast({ title: "Acesso Negado", variant: "destructive" });
      return;
    }
    
    // Validation already in hook, but can keep basic client-side check
    if (!currentSpecies.name || !currentSpecies.commonName || !currentSpecies.description) {
      toast({ title: "Erro de validação", description: "Preencha Nome Popular, Nome Científico e Descrição.", variant: "destructive" });
      return;
    }
    
    // The originalImageUrl is the image URL that the species had when the dialog was opened for editing
    // or null if it's a new species or had no image.
    const originalImageUrl = isNewSpecies ? null : (speciesList.find(s => s.id === currentSpecies.id)?.image || null);

    const success = await saveSpeciesHook(currentSpecies, isNewSpecies, imageFile, originalImageUrl);

    if (success) {
      setIsDialogOpen(false);
      setImageFile(null); // Reset image file state
      setImagePreview(null); // Reset preview
      // currentSpecies will be updated by the fetchSpecies in the hook
    }
  };

  const handleDeleteSpecies = async (id: string) => {
    // ... keep existing code (handleDeleteSpecies - now calls deleteSpeciesHook)
    if (!isAdminLoggedIn) {
      toast({ title: "Acesso Negado", description: "Você precisa estar logado como administrador.", variant: "destructive" });
      return;
    }
    // Confirmation is in the hook
    await deleteSpeciesHook(id);
    // List will be refreshed by the hook
  };
  
  const handleMove = async (currentIndex: number, direction: 'up' | 'down') => {
    await reorderSpecies(currentIndex, direction);
  };
  // ... keep existing code (handleMoveUp, handleMoveDown)
  const handleMoveUp = (index: number) => handleMove(index, 'up');
  const handleMoveDown = (index: number) => handleMove(index, 'down');

  if (speciesLoading && isAdminLoggedIn) {
    return <div className="p-6">Carregando espécies...</div>;
  }
  
  if (!isAdminLoggedIn && !speciesLoading) {
     return <div className="p-6 text-center">Por favor, <a href="/admin" className="underline text-primary">faça login</a> para gerenciar as espécies.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Espécies Criadas</h1>
        <Button onClick={openNewSpeciesDialog}>
          <Plus className="mr-2 h-4 w-4" /> Nova Espécie
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Espécies</CardTitle>
        </CardHeader>
        <CardContent>
          {speciesList.length === 0 && !speciesLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma espécie cadastrada.</p>
              <Button onClick={openNewSpeciesDialog} className="mt-4">
                Adicionar Primeira Espécie
              </Button>
            </div>
          ) : (
            <SpeciesTable
              speciesList={speciesList}
              onEdit={openEditSpeciesDialog}
              onDelete={handleDeleteSpecies}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              isLoading={speciesLoading}
            />
          )}
        </CardContent>
      </Card>

      {currentSpecies && (
        <SpeciesDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          isNewSpecies={isNewSpecies}
          currentSpeciesData={currentSpecies}
          onSave={handleSaveSpecies}
          onInputChange={handleInputChange}
          onCharacteristicChange={characteristicsHandler.handleChange}
          onAddCharacteristic={characteristicsHandler.handleAdd}
          onRemoveCharacteristic={characteristicsHandler.handleRemove}
          onCuriosityChange={curiositiesHandler.handleChange}
          onAddCuriosity={curiositiesHandler.handleAdd}
          onRemoveCuriosity={curiositiesHandler.handleRemove}
          imagePreview={imagePreview || currentSpecies.image} // Show form preview or existing image
          imageFile={imageFile} // Pass the file itself
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
          isLoading={speciesLoading} // Pass loading state to dialog if needed for submit button
        />
      )}
    </div>
  );
}
