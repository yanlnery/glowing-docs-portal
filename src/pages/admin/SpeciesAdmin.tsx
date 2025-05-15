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
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Edit, Plus, Trash2, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Species {
  id: string;
  commonName: string;
  name: string; // Scientific Name
  description: string;
  characteristics: string[];
  curiosities: string[];
  image: string;
  order: number;
  type: string;
  slug: string;
}

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

const defaultPlantelSpecies: Species[] = [
  {
    id: "1",
    name: "Boa constrictor constrictor",
    commonName: "Jiboia Amazônica",
    type: "serpente",
    image: "",
    slug: generateSlug("Boa constrictor constrictor"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Grande porte", "constritora", "noturna", "alimenta-se de roedores"],
    curiosidades: ["Pode viver até 30 anos em cativeiro", "É ovovivípara"],
    order: 1
  },
  {
    id: "2",
    name: "Boa constrictor amarali",
    commonName: "Jiboia do Cerrado",
    type: "serpente",
    image: "",
    slug: generateSlug("Boa constrictor amarali"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Constritora", "terrestre", "noturna", "alimenta-se de roedores"],
    curiosidades: ["Coloração mais clara", "adapta-se bem a ambientes secos"],
    order: 2
  },
  {
    id: "3",
    name: "Boa atlantica",
    commonName: "Jiboia da Mata Atlântica",
    type: "serpente",
    image: "",
    slug: generateSlug("Boa atlantica"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Endêmica da Mata Atlântica", "semi-arborícola"],
    curiosidades: ["Escamas menores", "adapta-se bem a ambientes úmidos"],
    order: 3
  },
  {
    id: "4",
    name: "Epicrates cenchria",
    commonName: "Jiboia Arco-íris da Amazônia",
    type: "serpente",
    image: "",
    slug: generateSlug("Epicrates cenchria"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Colorida", "iridescente", "semi-arborícola", "noturna"],
    curiosidades: ["Muito procurada por sua beleza", "especialmente em programas de educação ambiental"],
    order: 4
  },
  {
    id: "5",
    name: "Epicrates assisi",
    commonName: "Jiboia Arco-íris da Caatinga",
    type: "serpente",
    image: "",
    slug: generateSlug("Epicrates assisi"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Adaptada ao semiárido", "terrestre"],
    curiosidades: ["Dócil e ideal para manuseio em atividades educativas"],
    order: 5
  },
  {
    id: "6",
    name: "Epicrates crassus",
    commonName: "Jiboia Arco-íris do Cerrado",
    type: "serpente",
    image: "",
    slug: generateSlug("Epicrates crassus"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Constritora", "terrestre"],
    curiosidades: ["Possui coloração mais opaca e se adapta bem ao clima seco"],
    order: 6
  },
  {
    id: "7",
    name: "Epicrates maurus",
    commonName: "Jiboia Arco-íris do Norte",
    type: "serpente",
    image: "",
    slug: generateSlug("Epicrates maurus"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Escura", "terrestre"],
    curiosidades: ["Pouco conhecida no mercado", "mas com manejo simples"],
    order: 7
  },
  {
    id: "8",
    name: "Corallus batesii",
    commonName: "Jiboia Esmeralda",
    type: "serpente",
    image: "",
    slug: generateSlug("Corallus batesii"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Verde vibrante", "arborícola", "noturna"],
    curiosidades: ["Alta sensibilidade ao estresse", "exige manejo especializado"],
    order: 8
  },
  {
    id: "9",
    name: "Corallus hortulana",
    commonName: "Suaçuboia",
    type: "serpente",
    image: "",
    slug: generateSlug("Corallus hortulana"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Arborícola", "defensiva"],
    curiosidades: ["Ocorre em todo o Brasil e possui comportamento mais tímido"],
    order: 9
  },
  {
    id: "10",
    name: "Erythrolamprus miliaris",
    commonName: "Cobra d’água",
    type: "serpente",
    image: "",
    slug: generateSlug("Erythrolamprus miliaris"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Semi-aquática", "ativa durante o dia"],
    curiosidades: ["Alimenta-se de peixes e anfíbio", "são super interativas"],
    order: 10
  },
  {
    id: "11",
    name: "Spilotes pullatus",
    commonName: "Caninana",
    type: "serpente",
    image: "",
    slug: generateSlug("Spilotes pullatus"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Ágil", "diurna", "defensiva"],
    curiosidades: ["Pode atingir grande tamanho", "tem comportamento defensivo imponente"],
    order: 11
  },
  {
    id: "12",
    name: "Spilotes sulphureus",
    commonName: "Caninana de Fogo",
    type: "serpente",
    image: "",
    slug: generateSlug("Spilotes sulphureus"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Coloração chamativa", "ativa", "diurna", "semi-arborícola"],
    curiosidades: ["Muito veloz", "exige recintos com espaço e enriquecimento"],
    order: 12
  },
  {
    id: "13",
    name: "Salvator teguixin",
    commonName: "Teiú Dourado",
    type: "lagarto",
    image: "",
    slug: generateSlug("Salvator teguixin"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Onívoro", "terrestre", "escamas laranjas e pretas"],
    curiosidades: ["Bastante ativo", "comportamento semelhante ao merianae"],
    order: 13
  },
  {
    id: "14",
    name: "Salvator merianae",
    commonName: "Teiú",
    type: "lagarto",
    image: "",
    slug: generateSlug("Salvator merianae"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Onívoro", "terrestre", "robusto"],
    curiosidades: ["Um dos lagartos mais criados legalmente no Brasil"],
    order: 14
  },
  {
    id: "15",
    name: "Iguana iguana",
    commonName: "Iguana",
    type: "lagarto",
    image: "",
    slug: generateSlug("Iguana iguana"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Herbívora", "arborícola", "territorial"],
    curiosidades: ["Exige muita luz solar e calor", "comportamento pode variar muito"],
    order: 15
  },
  {
    id: "16",
    name: "Diploglossus lessonae",
    commonName: "Lagarto Coral",
    type: "lagarto",
    image: "",
    slug: generateSlug("Diploglossus lessonae"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Terrestre", "insetívoro", "corpo cilíndrico"],
    curiosidades: ["Pouco conhecido", "se movimenta com rapidez"],
    order: 16
  },
  {
    id: "17",
    name: "Polychrus marmoratus",
    commonName: "Lagarto Preguiça",
    type: "lagarto",
    image: "",
    slug: generateSlug("Polychrus marmoratus"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Arborícola", "insetívoro", "movimentos lentos"],
    curiosidades: ["Se camufla com facilidade", "comportamento muito calmo"],
    order: 17
  },
  {
    id: "18",
    name: "Thecadactylus rapicauda",
    commonName: "Lagartixa Rabo de Nabo",
    type: "lagarto",
    image: "",
    slug: generateSlug("Thecadactylus rapicauda"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Noturna", "arborícola", "adesiva"],
    curiosidades: ["Vocaliza em situações de estresse", "excelente em paredes lisas"],
    order: 18
  },
  {
    id: "19",
    name: "Chelonoidis carbonaria",
    commonName: "Jabuti Piranga",
    type: "quelonio",
    image: "",
    slug: generateSlug("Chelonoidis carbonaria"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Terrestre", "herbívoro", "manchas laranjas, amarelas ou vermelhas"],
    curiosidades: ["Bastante comum em cativeiro", "vive muito tempo"],
    order: 19
  },
  {
    id: "20",
    name: "Chelonoidis denticulata",
    commonName: "Jabuti Tinga",
    type: "quelonio",
    image: "",
    slug: generateSlug("Chelonoidis denticulata"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Terrestre", "herbívoro", "maior que o piranga"],
    curiosidades: ["Preferência por ambientes mais úmidos e sombreados"],
    order: 20
  },
  {
    id: "21",
    name: "Crocodilurus amazonicus",
    commonName: "Jacarerana",
    type: "lagarto",
    image: "",
    slug: generateSlug("Crocodilurus amazonicus"),
    description: "Descrição detalhada a ser preenchida.",
    characteristics: ["Semiaquático", "cauda achatada", "ágil"],
    curiosidades: ["Vive em igarapés e margens de rios", "exige ambiente misto"],
    order: 21
  }
];


export default function SpeciesAdmin() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSpecies, setCurrentSpecies] = useState<Species | null>(null);
  const [isNewSpecies, setIsNewSpecies] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Load species data on component mount
  useEffect(() => {
    const savedSpecies = localStorage.getItem('speciesList');
    if (savedSpecies) {
      const parsedSpecies: Species[] = JSON.parse(savedSpecies);
      // Ensure order is consistent if loading from localStorage
      parsedSpecies.sort((a, b) => a.order - b.order);
      setSpecies(parsedSpecies);
    } else {
      // Use the new default plantel data if nothing in localStorage
      const sortedDefaultSpecies = [...defaultPlantelSpecies].sort((a,b) => a.order - b.order);
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
    setIsDialogOpen(true);
  };

  const openEditSpeciesDialog = (speciesData: Species) => {
    setCurrentSpecies(speciesData);
    setIsNewSpecies(false);
    setImagePreview(speciesData.image);
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (currentSpecies) {
      setCurrentSpecies({
        ...currentSpecies,
        [name]: name === 'order' ? parseInt(value, 10) : value // Ensure order is a number
      });
    }
  };

  const handleCharacteristicChange = (index: number, value: string) => {
    if (currentSpecies) {
      const updatedCharacteristics = [...currentSpecies.characteristics];
      updatedCharacteristics[index] = value;
      setCurrentSpecies({
        ...currentSpecies,
        characteristics: updatedCharacteristics
      });
    }
  };

  const handleAddCharacteristic = () => {
    if (currentSpecies) {
      setCurrentSpecies({
        ...currentSpecies,
        characteristics: [...currentSpecies.characteristics, '']
      });
    }
  };

  const handleRemoveCharacteristic = (index: number) => {
    if (currentSpecies && currentSpecies.characteristics.length > 1) {
      const updatedCharacteristics = currentSpecies.characteristics.filter((_, i) => i !== index);
      setCurrentSpecies({
        ...currentSpecies,
        characteristics: updatedCharacteristics
      });
    }
  };

  const handleCuriosityChange = (index: number, value: string) => {
    if (currentSpecies) {
      const updatedCuriosities = [...currentSpecies.curiosities];
      updatedCuriosities[index] = value;
      setCurrentSpecies({
        ...currentSpecies,
        curiosities: updatedCuriosities
      });
    }
  };

  const handleAddCuriosity = () => {
    if (currentSpecies) {
      setCurrentSpecies({
        ...currentSpecies,
        curiosities: [...currentSpecies.curiosities, '']
      });
    }
  };

  const handleRemoveCuriosity = (index: number) => {
    if (currentSpecies && currentSpecies.curiosities.length > 1) {
      const updatedCuriosities = currentSpecies.curiosities.filter((_, i) => i !== index);
      setCurrentSpecies({
        ...currentSpecies,
        curiosities: updatedCuriosities
      });
    }
  };

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
    
    if (!currentSpecies.slug) {
      currentSpecies.slug = generateSlug(currentSpecies.name);
    }
    
    if (imagePreview && imagePreview.startsWith('data:')) {
      // Placeholder for image upload logic
      // For now, we'll assume the user uploads via another mechanism or image is already a URL
      // If imageFile exists, it implies a new file was selected
      currentSpecies.image = imageFile 
        ? `/lovable-uploads/${Date.now().toString()}-${imageFile.name}` // more unique name
        : currentSpecies.image || ''; // keep existing or empty
    } else if (!imagePreview && currentSpecies.image) {
      // If preview is cleared but there was an image, it means user wants to remove it
      // Or handle this based on specific UI indication for removal
    }
    
    let updatedSpeciesList;
    if (isNewSpecies) {
      const newSpeciesWithOrder = {
        ...currentSpecies,
        order: species.length > 0 ? Math.max(...species.map(s => s.order)) + 1 : 1,
      };
      updatedSpeciesList = [...species, newSpeciesWithOrder];
      toast({
        title: "Espécie cadastrada",
        description: `${currentSpecies.commonName} foi adicionada com sucesso!`
      });
    } else {
      updatedSpeciesList = species.map(s => 
        s.id === currentSpecies.id ? currentSpecies : s
      );
      toast({
        title: "Espécie atualizada",
        description: `${currentSpecies.commonName} foi atualizada com sucesso!`
      });
    }
    
    updatedSpeciesList.sort((a, b) => a.order - b.order);
    
    setSpecies(updatedSpeciesList);
    localStorage.setItem('speciesList', JSON.stringify(updatedSpeciesList));
    
    setIsDialogOpen(false);
    setImageFile(null); // Reset image file
  };

  const handleDeleteSpecies = (id: string) => {
    // Consider using a confirmation dialog from shadcn/ui
    if (confirm("Tem certeza que deseja excluir esta espécie? Esta ação não pode ser desfeita.")) {
      const updatedSpecies = species.filter(s => s.id !== id);
      
      // Re-order remaining species if necessary, though simple removal might be fine.
      // For this example, we'll just remove and rely on existing order numbers for sorting.
      // If strict sequential order is needed after deletion, re-assign order numbers.
      
      setSpecies(updatedSpecies);
      localStorage.setItem('speciesList', JSON.stringify(updatedSpecies));
      toast({
        title: "Espécie removida",
        description: "A espécie foi removida com sucesso!"
      });
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newSpecies = [...species];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSpecies.length) return;

    // Swap order numbers
    const tempOrder = newSpecies[index].order;
    newSpecies[index].order = newSpecies[targetIndex].order;
    newSpecies[targetIndex].order = tempOrder;
    
    newSpecies.sort((a,b) => a.order - b.order);

    setSpecies(newSpecies);
    localStorage.setItem('speciesList', JSON.stringify(newSpecies));
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
                {species.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{item.order}</span>
                        <div className="flex flex-col">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5" 
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5" 
                            onClick={() => handleMoveDown(index)}
                            disabled={index === species.length - 1}
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
                        />
                      ) : (
                        <div className="h-12 w-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          Sem Img
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{item.commonName}</TableCell>
                    <TableCell><em>{item.name}</em></TableCell>
                    <TableCell>
                      {item.type === 'serpente' && 'Serpente'}
                      {item.type === 'lagarto' && 'Lagarto'}
                      {item.type === 'quelonio' && 'Quelônio'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditSpeciesDialog(item)}
                        >
                          <Edit className="h-4 w-4" />
                           <span className="sr-only">Editar</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-destructive hover:text-destructive h-8 w-8" 
                          onClick={() => handleDeleteSpecies(item.id)}
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
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>
              {isNewSpecies ? 'Adicionar Nova Espécie' : 'Editar Espécie'}
            </DialogTitle>
          </DialogHeader>
          
          {currentSpecies && (
            <div className="grid gap-6 pt-4">
              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="commonName">Nome Popular*</Label>
                  <Input 
                    id="commonName" 
                    name="commonName" 
                    value={currentSpecies.commonName} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nome Científico*</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={currentSpecies.name} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="type">Tipo</Label>
                  <select 
                    id="type" 
                    name="type" 
                    value={currentSpecies.type}
                    onChange={handleInputChange}
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
                    value={currentSpecies.slug} 
                    onChange={handleInputChange}
                    placeholder="Gerado do nome científico se vazio"
                  />
                </div>
              </div>
            
              <div className="space-y-1.5">
                <Label htmlFor="image">Imagem Principal</Label>
                <div className="flex items-center gap-4">
                  <div className="border rounded-lg overflow-hidden h-28 w-28 flex items-center justify-center bg-muted shrink-0">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground text-xs p-2 text-center">Sem imagem selecionada</div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor="image-upload" className="cursor-pointer block">
                      <div className="flex items-center justify-center gap-2 p-3 border border-dashed rounded-md hover:bg-accent hover:border-primary transition-colors">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {imageFile ? imageFile.name : 'Selecionar ou arrastar imagem'}
                        </span>
                      </div>
                      <input 
                        id="image-upload" 
                        type="file" 
                        accept="image/*" 
                        className="sr-only" 
                        onChange={handleImageChange}
                      />
                    </Label>
                     {imagePreview && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="mt-1 text-destructive" 
                        onClick={() => { setImagePreview(null); setImageFile(null); if(currentSpecies) currentSpecies.image = '';}}
                      >
                        Remover imagem
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="description">Descrição Geral*</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  rows={4} 
                  value={currentSpecies.description} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Características</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddCharacteristic}>
                    <Plus className="h-4 w-4 mr-1.5" /> Adicionar
                  </Button>
                </div>
                {currentSpecies.characteristics.map((characteristic, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={characteristic} 
                      placeholder={`Característica ${index + 1}`}
                      onChange={(e) => handleCharacteristicChange(index, e.target.value)} 
                    />
                    {currentSpecies.characteristics.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveCharacteristic(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Curiosidades</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddCuriosity}>
                    <Plus className="h-4 w-4 mr-1.5" /> Adicionar
                  </Button>
                </div>
                {currentSpecies.curiosities.map((curiosity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={curiosity} 
                      placeholder={`Curiosidade ${index + 1}`}
                      onChange={(e) => handleCuriosityChange(index, e.target.value)} 
                    />
                    {currentSpecies.curiosities.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveCuriosity(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="order">Ordem de exibição</Label>
                <Input 
                  id="order" 
                  name="order" 
                  type="number" 
                  min="1"
                  value={currentSpecies.order} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="pt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveSpecies}>
              {isNewSpecies ? 'Adicionar Espécie' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
