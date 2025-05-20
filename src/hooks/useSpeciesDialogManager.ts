
import { useState, useCallback } from 'react';
import { Species } from '@/types/species';
import { useToast } from '@/components/ui/use-toast';

type SaveSpeciesFunction = (
  speciesData: Omit<Species, 'id' | 'created_at' | 'updated_at'> & { id?: string },
  isNew: boolean,
  imageFile: File | null,
  originalImageUrl?: string | null
) => Promise<boolean>;

interface UseSpeciesDialogManagerProps {
  saveSpeciesFn: SaveSpeciesFunction;
  speciesList: Species[];
  maxOrder: number;
}

export function useSpeciesDialogManager({
  saveSpeciesFn,
  speciesList,
  maxOrder,
}: UseSpeciesDialogManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSpecies, setCurrentSpecies] = useState<Species | null>(null);
  const [isNewSpecies, setIsNewSpecies] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const openNewSpeciesDialog = useCallback(() => {
    setCurrentSpecies({
      id: '', 
      name: '',
      commonName: '',
      description: 'Descrição detalhada a ser preenchida.',
      characteristics: [''],
      curiosities: [''],
      image: null,
      type: 'serpente',
      slug: '',
      order: maxOrder + 1,
    });
    setIsNewSpecies(true);
    setImagePreview(null);
    setImageFile(null);
    setIsDialogOpen(true);
  }, [maxOrder]);

  const openEditSpeciesDialog = useCallback((speciesData: Species) => {
    setCurrentSpecies(speciesData);
    setIsNewSpecies(false);
    setImagePreview(speciesData.image);
    setImageFile(null);
    setIsDialogOpen(true);
  }, []);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    // Optionally reset states if needed, though they are reset on open
    // setCurrentSpecies(null);
    // setImageFile(null);
    // setImagePreview(null);
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
      if (currentSpecies) {
        // No need to set currentSpecies.image to null here,
        // save logic handles precedence of imageFile.
      }
      e.target.value = ''; // Reset file input
    }
  };
  
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (currentSpecies) {
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
        setCurrentSpecies({ ...currentSpecies, [fieldName]: [''] });
      }
    },
  });

  const characteristicsHandler = createArrayHandler('characteristics');
  const curiositiesHandler = createArrayHandler('curiosities');

  const handleSave = async () => {
    if (!currentSpecies) return;
    
    if (!currentSpecies.name || !currentSpecies.commonName || !currentSpecies.description) {
      toast({ title: "Erro de validação", description: "Preencha Nome Popular, Nome Científico e Descrição.", variant: "destructive" });
      return;
    }
    
    const originalImageUrl = isNewSpecies ? null : (speciesList.find(s => s.id === currentSpecies.id)?.image || null);

    const success = await saveSpeciesFn(currentSpecies, isNewSpecies, imageFile, originalImageUrl);

    if (success) {
      handleDialogClose();
      // States like imageFile and imagePreview are reset when dialog opens next or via openNew/Edit
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen: handleDialogClose, // Or pass setIsDialogOpen directly if preferred
    currentSpecies,
    isNewSpecies,
    imagePreview,
    imageFile,
    openNewSpeciesDialog,
    openEditSpeciesDialog,
    handleImageChange,
    handleRemoveImage,
    handleInputChange,
    characteristicsHandler,
    curiositiesHandler,
    handleSave,
  };
}
