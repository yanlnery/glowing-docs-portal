import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Species } from '@/types/species'; // Import from new types file
import { SpeciesTable } from '@/components/admin/species/SpeciesTable';
import { SpeciesDialog } from '@/components/admin/species/SpeciesDialog';

// This data could be moved to a separate data file if it grows larger or is used elsewhere.
const defaultPlantelSpecies: Species[] = [
  { id: "1", name: "Boa constrictor constrictor", commonName: "Jiboia Amazônica", type: "serpente", image: "", slug: "boa-constrictor-constrictor", description: "Descrição detalhada a ser preenchida.", characteristics: ["Grande porte", "constritora", "noturna", "alimenta-se de roedores"], curiosities: ["Pode viver até 30 anos em cativeiro", "É ovovivípara"], order: 1 },
  { id: "2", name: "Boa constrictor amarali", commonName: "Jiboia do Cerrado", type: "serpente", image: "", slug: "boa-constrictor-amarali", description: "Descrição detalhada a ser preenchida.", characteristics: ["Constritora", "terrestre", "noturna", "alimenta-se de roedores"], curiosities: ["Coloração mais clara", "adapta-se bem a ambientes secos"], order: 2 },
  { id: "3", name: "Boa atlantica", commonName: "Jiboia da Mata Atlântica", type: "serpente", image: "", slug: "boa-atlantica", description: "Descrição detalhada a ser preenchida.", characteristics: ["Endêmica da Mata Atlântica", "semi-arborícola"], curiosities: ["Escamas menores", "adapta-se bem a ambientes úmidos"], order: 3 },
  { id: "4", name: "Epicrates cenchria", commonName: "Jiboia Arco-íris da Amazônia", type: "serpente", image: "", slug: "epicrates-cenchria", description: "Descrição detalhada a ser preenchida.", characteristics: ["Colorida", "iridescente", "semi-arborícola", "noturna"], curiosities: ["Muito procurada por sua beleza", "especialmente em programas de educação ambiental"], order: 4 },
  { id: "5", name: "Epicrates assisi", commonName: "Jiboia Arco-íris da Caatinga", type: "serpente", image: "", slug: "epicrates-assisi", description: "Descrição detalhada a ser preenchida.", characteristics: ["Adaptada ao semiárido", "terrestre"], curiosities: ["Dócil e ideal para manuseio em atividades educativas"], order: 5 },
  { id: "6", name: "Epicrates crassus", commonName: "Jiboia Arco-íris do Cerrado", type: "serpente", image: "", slug: "epicrates-crassus", description: "Descrição detalhada a ser preenchida.", characteristics: ["Constritora", "terrestre"], curiosities: ["Possui coloração mais opaca e se adapta bem ao clima seco"], order: 6 },
  { id: "7", name: "Epicrates maurus", commonName: "Jiboia Arco-íris do Norte", type: "serpente", image: "", slug: "epicrates-maurus", description: "Descrição detalhada a ser preenchida.", characteristics: ["Escura", "terrestre"], curiosities: ["Pouco conhecida no mercado", "mas com manejo simples"], order: 7 },
  { id: "8", name: "Corallus batesii", commonName: "Jiboia Esmeralda", type: "serpente", image: "", slug: "corallus-batesii", description: "Descrição detalhada a ser preenchida.", characteristics: ["Verde vibrante", "arborícola", "noturna"], curiosities: ["Alta sensibilidade ao estresse", "exige manejo especializado"], order: 8 },
  { id: "9", name: "Corallus hortulana", commonName: "Suaçuboia", type: "serpente", image: "", slug: "corallus-hortulana", description: "Descrição detalhada a ser preenchida.", characteristics: ["Arborícola", "defensiva"], curiosities: ["Ocorre em todo o Brasil e possui comportamento mais tímido"], order: 9 },
  { id: "10", name: "Erythrolamprus miliaris", commonName: "Cobra d’água", type: "serpente", image: "", slug: "erythrolamprus-miliaris", description: "Descrição detalhada a ser preenchida.", characteristics: ["Semi-aquática", "ativa durante o dia"], curiosities: ["Alimenta-se de peixes e anfíbio", "são super interativas"], order: 10 },
  { id: "11", name: "Spilotes pullatus", commonName: "Caninana", type: "serpente", image: "", slug: "spilotes-pullatus", description: "Descrição detalhada a ser preenchida.", characteristics: ["Ágil", "diurna", "defensiva"], curiosities: ["Pode atingir grande tamanho", "tem comportamento defensivo imponente"], order: 11 },
  { id: "12", name: "Spilotes sulphureus", commonName: "Caninana de Fogo", type: "serpente", image: "", slug: "spilotes-sulphureus", description: "Descrição detalhada a ser preenchida.", characteristics: ["Coloração chamativa", "ativa", "diurna", "semi-arborícola"], curiosities: ["Muito veloz", "exige recintos com espaço e enriquecimento"], order: 12 },
  { id: "13", name: "Salvator teguixin", commonName: "Teiú Dourado", type: "lagarto", image: "", slug: "salvator-teguixin", description: "Descrição detalhada a ser preenchida.", characteristics: ["Onívoro", "terrestre", "escamas laranjas e pretas"], curiosities: ["Bastante ativo", "comportamento semelhante ao merianae"], order: 13 },
  { id: "14", name: "Salvator merianae", commonName: "Teiú", type: "lagarto", image: "", slug: "salvator-merianae", description: "Descrição detalhada a ser preenchida.", characteristics: ["Onívoro", "terrestre", "robusto"], curiosities: ["Um dos lagartos mais criados legalmente no Brasil"], order: 14 },
  { id: "15", name: "Iguana iguana", commonName: "Iguana", type: "lagarto", image: "", slug: "iguana-iguana", description: "Descrição detalhada a ser preenchida.", characteristics: ["Herbívora", "arborícola", "territorial"], curiosities: ["Exige muita luz solar e calor", "comportamento pode variar muito"], order: 15 },
  { id: "16", name: "Diploglossus lessonae", commonName: "Lagarto Coral", type: "lagarto", image: "", slug: "diploglossus-lessonae", description: "Descrição detalhada a ser preenchida.", characteristics: ["Terrestre", "insetívoro", "corpo cilíndrico"], curiosities: ["Pouco conhecido", "se movimenta com rapidez"], order: 16 },
  { id: "17", name: "Polychrus marmoratus", commonName: "Lagarto Preguiça", type: "lagarto", image: "", slug: "polychrus-marmoratus", description: "Descrição detalhada a ser preenchida.", characteristics: ["Arborícola", "insetívoro", "movimentos lentos"], curiosities: ["Se camufla com facilidade", "comportamento muito calmo"], order: 17 },
  { id: "18", name: "Thecadactylus rapicauda", commonName: "Lagartixa Rabo de Nabo", type: "lagarto", image: "", slug: "thecadactylus-rapicauda", description: "Descrição detalhada a ser preenchida.", characteristics: ["Noturna", "arborícola", "adesiva"], curiosities: ["Vocaliza em situações de estresse", "excelente em paredes lisas"], order: 18 },
  { id: "19", name: "Chelonoidis carbonaria", commonName: "Jabuti Piranga", type: "quelonio", image: "", slug: "chelonoidis-carbonaria", description: "Descrição detalhada a ser preenchida.", characteristics: ["Terrestre", "herbívoro", "manchas laranjas, amarelas ou vermelhas"], curiosities: ["Bastante comum em cativeiro", "vive muito tempo"], order: 19 },
  { id: "20", name: "Chelonoidis denticulata", commonName: "Jabuti Tinga", type: "quelonio", image: "", slug: "chelonoidis-denticulata", description: "Descrição detalhada a ser preenchida.", characteristics: ["Terrestre", "herbívoro", "maior que o piranga"], curiosities: ["Preferência por ambientes mais úmidos e sombreados"], order: 20 },
  { id: "21", name: "Crocodilurus amazonicus", commonName: "Jacarerana", type: "lagarto", image: "", slug: "crocodilurus-amazonicus", description: "Descrição detalhada a ser preenchida.", characteristics: ["Semiaquático", "cauda achatada", "ágil"], curiosities: ["Vive em igarapés e margens de rios", "exige ambiente misto"], order: 21 }
];

// This function can be moved to a utils file if used elsewhere.
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

export default function SpeciesAdmin() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSpecies, setCurrentSpecies] = useState<Species | null>(null);
  const [isNewSpecies, setIsNewSpecies] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedSpecies = localStorage.getItem('speciesList');
    if (savedSpecies) {
      const parsedSpecies: Species[] = JSON.parse(savedSpecies);
      const normalizedSpecies = parsedSpecies.map(s => ({
        ...s,
        curiosities: s.curiosities || (s as any).curiosidades || [''] 
      })).sort((a, b) => a.order - b.order);
      setSpecies(normalizedSpecies);
    } else {
      const sortedDefaultSpecies = [...defaultPlantelSpecies].map(s => ({
        ...s,
        slug: s.slug || generateSlug(s.name) // Ensure slug for default data
      })).sort((a,b) => a.order - b.order);
      setSpecies(sortedDefaultSpecies);
      localStorage.setItem('speciesList', JSON.stringify(sortedDefaultSpecies));
    }
  }, []);

  const openNewSpeciesDialog = () => {
    setCurrentSpecies({
      id: Date.now().toString(),
      name: '',
      commonName: '',
      description: 'Descrição detalhada a ser preenchida.',
      characteristics: [''],
      curiosities: [''],
      image: '',
      type: 'serpente',
      slug: '',
      order: species.length > 0 ? Math.max(...species.map(s => s.order)) + 1 : 1
    });
    setIsNewSpecies(true);
    setImagePreview(null);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const openEditSpeciesDialog = (speciesData: Species) => {
    setCurrentSpecies(speciesData);
    setIsNewSpecies(false);
    setImagePreview(null); // Reset preview, existing image will be shown via speciesData.image
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
    }
  };
  
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (currentSpecies) {
      // This ensures that if an existing image was displayed and "remove" is clicked,
      // the 'image' field in currentSpecies is cleared, so it won't be saved.
      setCurrentSpecies({ ...currentSpecies, image: '' }); 
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (currentSpecies) {
      setCurrentSpecies({
        ...currentSpecies,
        [name]: name === 'order' ? parseInt(value, 10) || 1 : value // Ensure order is a number, default to 1 if invalid
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
      }
    },
  });

  const characteristicsHandler = createArrayHandler('characteristics');
  const curiositiesHandler = createArrayHandler('curiosities');

  const handleSaveSpecies = () => {
    if (!currentSpecies) return;

    if (!currentSpecies.name || !currentSpecies.commonName || !currentSpecies.description) {
      toast({
        title: "Erro de validação",
        description: "Preencha todos os campos obrigatórios (Nome Popular, Nome Científico, Descrição).",
        variant: "destructive"
      });
      return;
    }

    let speciesToSave = { ...currentSpecies };
    if (!speciesToSave.slug) {
      speciesToSave.slug = generateSlug(speciesToSave.name);
    }

    // Image handling:
    // If imageFile exists, it means a new image was uploaded.
    // Its path will be a placeholder like `/lovable-uploads/timestamp-filename`.
    // If no imageFile, but speciesToSave.image is already set (and wasn't cleared by handleRemoveImage), keep it.
    // If imageFile is null AND speciesToSave.image was cleared by handleRemoveImage, it will be ''.
    if (imageFile) {
       // Actual upload should happen here or be triggered.
       // For now, using a placeholder path structure.
      speciesToSave.image = `/lovable-uploads/${Date.now()}-${imageFile.name.replace(/\s+/g, '_')}`;
    }
    // If !imageFile, speciesToSave.image already holds the correct value 
    // (either existing image URL or '' if removed).

    let updatedSpeciesList;
    if (isNewSpecies) {
       // Ensure new species gets a unique order if not manually set or if it conflicts
      const newOrder = speciesToSave.order;
      const orderExists = species.some(s => s.order === newOrder);
      if (orderExists || !newOrder || newOrder < 1) {
        speciesToSave.order = species.length > 0 ? Math.max(...species.map(s => s.order)) + 1 : 1;
      }
      updatedSpeciesList = [...species, speciesToSave];
      toast({
        title: "Espécie cadastrada",
        description: `${speciesToSave.commonName} foi adicionada com sucesso!`
      });
    } else {
      updatedSpeciesList = species.map(s =>
        s.id === speciesToSave.id ? speciesToSave : s
      );
      toast({
        title: "Espécie atualizada",
        description: `${speciesToSave.commonName} foi atualizada com sucesso!`
      });
    }

    updatedSpeciesList.sort((a, b) => a.order - b.order);
    // Re-assign order sequentially after sorting to ensure no gaps/duplicates from manual edits
    const finalOrderedList = updatedSpeciesList.map((s, index) => ({ ...s, order: index + 1 }));


    setSpecies(finalOrderedList);
    localStorage.setItem('speciesList', JSON.stringify(finalOrderedList));

    setIsDialogOpen(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDeleteSpecies = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta espécie? Esta ação não pode ser desfeita.")) {
      const updatedSpecies = species.filter(s => s.id !== id);
      // Re-order remaining species
      const finalOrderedList = updatedSpecies
        .sort((a,b) => a.order - b.order)
        .map((s, index) => ({...s, order: index + 1}));

      setSpecies(finalOrderedList);
      localStorage.setItem('speciesList', JSON.stringify(finalOrderedList));
      toast({
        title: "Espécie removida",
        description: "A espécie foi removida com sucesso!"
      });
    }
  };

  const handleMove = (currentIndex: number, direction: 'up' | 'down') => {
    const newSpeciesList = [...species];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= newSpeciesList.length) return;

    // Swap items in the array
    [newSpeciesList[currentIndex], newSpeciesList[targetIndex]] = [newSpeciesList[targetIndex], newSpeciesList[currentIndex]];
    
    // Re-assign order based on new array positions
    const finalOrderedList = newSpeciesList.map((s, index) => ({ ...s, order: index + 1 }));

    setSpecies(finalOrderedList);
    localStorage.setItem('speciesList', JSON.stringify(finalOrderedList));
  };
  
  const handleMoveUp = (index: number) => handleMove(index, 'up');
  const handleMoveDown = (index: number) => handleMove(index, 'down');

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
          {species.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma espécie cadastrada.</p>
              <Button onClick={openNewSpeciesDialog} className="mt-4">
                Adicionar Primeira Espécie
              </Button>
            </div>
          ) : (
            <SpeciesTable
              speciesList={species}
              onEdit={openEditSpeciesDialog}
              onDelete={handleDeleteSpecies}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
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
          imagePreview={imagePreview}
          imageFile={imageFile}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
        />
      )}
    </div>
  );
}
