
import React from 'react';
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
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useSpeciesDialogManager } from '@/hooks/useSpeciesDialogManager'; // Novo hook

// A função generateSlug e a constante BUCKET_NAME não são usadas aqui e foram removidas.
// generateSlug é tratado pelo speciesService.ts
// BUCKET_NAME é usado internamente pelo speciesService.ts

export default function SpeciesAdmin() {
  const { 
    speciesList, 
    isLoading: speciesLoading, 
    // fetchSpecies, // fetchSpecies é chamado pelo useEffect do useSpeciesManagement
    saveSpecies: saveSpeciesHook, 
    deleteSpecies: deleteSpeciesHook,
    reorderSpecies,
    maxOrder
  } = useSpeciesManagement();
  
  const { isAdminLoggedIn } = useAdminAuth();
  const { toast } = useToast(); // Ainda pode ser usado para toasts não relacionados ao dialog

  const dialogManager = useSpeciesDialogManager({
    saveSpeciesFn: saveSpeciesHook,
    speciesList,
    maxOrder,
  });

  const handleDeleteSpecies = async (id: string) => {
    if (!isAdminLoggedIn) {
      toast({ title: "Acesso Negado", description: "Você precisa estar logado como administrador.", variant: "destructive" });
      return;
    }
    await deleteSpeciesHook(id);
  };
  
  const handleMove = async (currentIndex: number, direction: 'up' | 'down') => {
    await reorderSpecies(currentIndex, direction);
  };

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
        <Button onClick={dialogManager.openNewSpeciesDialog}>
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
              <Button onClick={dialogManager.openNewSpeciesDialog} className="mt-4">
                Adicionar Primeira Espécie
              </Button>
            </div>
          ) : (
            <SpeciesTable
              speciesList={speciesList}
              onEdit={dialogManager.openEditSpeciesDialog}
              onDelete={handleDeleteSpecies}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              isLoading={speciesLoading}
            />
          )}
        </CardContent>
      </Card>

      {dialogManager.currentSpecies && (
        <SpeciesDialog
          isOpen={dialogManager.isDialogOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) dialogManager.setIsDialogOpen(); // Chama a função de fechar do hook
            // Se precisar de lógica mais complexa para onOpenChange, ajuste o hook
          }}
          isNewSpecies={dialogManager.isNewSpecies}
          currentSpeciesData={dialogManager.currentSpecies}
          onSave={dialogManager.handleSave}
          onInputChange={dialogManager.handleInputChange}
          onCharacteristicChange={dialogManager.characteristicsHandler.handleChange}
          onAddCharacteristic={dialogManager.characteristicsHandler.handleAdd}
          onRemoveCharacteristic={dialogManager.characteristicsHandler.handleRemove}
          onCuriosityChange={dialogManager.curiositiesHandler.handleChange}
          onAddCuriosity={dialogManager.curiositiesHandler.handleAdd}
          onRemoveCuriosity={dialogManager.curiositiesHandler.handleRemove}
          imagePreview={dialogManager.imagePreview || dialogManager.currentSpecies.image}
          imageFile={dialogManager.imageFile}
          onImageChange={dialogManager.handleImageChange}
          onRemoveImage={dialogManager.handleRemoveImage}
          isLoading={speciesLoading} 
        />
      )}
    </div>
  );
}
