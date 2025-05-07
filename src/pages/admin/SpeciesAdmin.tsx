
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
  name: string;
  description: string;
  characteristics: string[];
  curiosities: string[];
  image: string;
  order: number;
  type: string;
  slug: string;
}

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
      setSpecies(JSON.parse(savedSpecies));
    } else {
      // Use the default data if nothing in localStorage
      fetch('/api/species')
        .then(response => response.json())
        .catch(() => {
          // Fallback to hardcoded data if API request fails
          const defaultSpecies = [
            {
              id: '1',
              name: 'Boa constrictor constrictor',
              commonName: 'Jiboia Amazônica',
              type: 'serpente',
              image: '/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png',
              slug: 'boa-constrictor-constrictor',
              description: 'Uma das maiores serpentes do Brasil, podendo atingir até 4 metros de comprimento. Habita florestas úmidas da Amazônia.',
              characteristics: ['Não-venenosa', 'Constritora', 'Noturna', 'Alimenta-se principalmente de roedores'],
              curiosities: ['Pode viver até 30 anos em cativeiro', 'É ovovivípara, dando à luz filhotes já formados'],
              order: 1
            },
            {
              id: '2',
              name: 'Epicrates cenchria',
              commonName: 'Jiboia Arco-íris da Amazônia',
              type: 'serpente',
              image: '/lovable-uploads/f7bc5a30-657d-418c-8b25-7b0494f36029.png',
              slug: 'epicrates-cenchria',
              description: 'Uma serpente de médio porte conhecida por suas iridescências quando exposta à luz do sol.',
              characteristics: ['Não-venenosa', 'Constritora', 'Coloração avermelhada com padrões circulares'],
              curiosities: ['Seu nome vem do reflexo iridescente que sua pele produz sob a luz', 'Prefere habitats arbóreos'],
              order: 2
            }
          ];
          setSpecies(defaultSpecies);
          localStorage.setItem('speciesList', JSON.stringify(defaultSpecies));
        });
    }
  }, []);

  const openNewSpeciesDialog = () => {
    setCurrentSpecies({
      id: Date.now().toString(),
      name: '',
      commonName: '',
      description: '',
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
        [name]: value
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
    
    // Validate required fields
    if (!currentSpecies.name || !currentSpecies.commonName || !currentSpecies.description) {
      toast({
        title: "Erro de validação",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    // Generate slug from scientific name if empty
    if (!currentSpecies.slug) {
      const slug = currentSpecies.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
      currentSpecies.slug = slug;
    }
    
    // If we have a new image, we would upload it to the server here
    // For now, we'll just update the path directly
    if (imagePreview && imagePreview.startsWith('data:')) {
      // In a real implementation, we would upload the file to a server
      // and get back a URL. For now, we'll just use a placeholder.
      currentSpecies.image = imageFile 
        ? `/lovable-uploads/${Date.now().toString()}.png` 
        : '/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png';
    }
    
    let updatedSpecies;
    if (isNewSpecies) {
      // Add new species
      updatedSpecies = [...species, currentSpecies];
      toast({
        title: "Espécie cadastrada",
        description: `${currentSpecies.commonName} foi adicionada com sucesso!`
      });
    } else {
      // Update existing species
      updatedSpecies = species.map(s => 
        s.id === currentSpecies.id ? currentSpecies : s
      );
      toast({
        title: "Espécie atualizada",
        description: `${currentSpecies.commonName} foi atualizada com sucesso!`
      });
    }
    
    // Sort by order
    updatedSpecies.sort((a, b) => a.order - b.order);
    
    // Save to state and localStorage
    setSpecies(updatedSpecies);
    localStorage.setItem('speciesList', JSON.stringify(updatedSpecies));
    
    // Close the dialog
    setIsDialogOpen(false);
  };

  const handleDeleteSpecies = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta espécie?")) {
      const updatedSpecies = species.filter(s => s.id !== id);
      setSpecies(updatedSpecies);
      localStorage.setItem('speciesList', JSON.stringify(updatedSpecies));
      toast({
        title: "Espécie removida",
        description: "A espécie foi removida com sucesso!"
      });
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const updatedSpecies = [...species];
    const temp = updatedSpecies[index].order;
    updatedSpecies[index].order = updatedSpecies[index - 1].order;
    updatedSpecies[index - 1].order = temp;
    
    updatedSpecies.sort((a, b) => a.order - b.order);
    setSpecies(updatedSpecies);
    localStorage.setItem('speciesList', JSON.stringify(updatedSpecies));
  };

  const handleMoveDown = (index: number) => {
    if (index === species.length - 1) return;
    
    const updatedSpecies = [...species];
    const temp = updatedSpecies[index].order;
    updatedSpecies[index].order = updatedSpecies[index + 1].order;
    updatedSpecies[index + 1].order = temp;
    
    updatedSpecies.sort((a, b) => a.order - b.order);
    setSpecies(updatedSpecies);
    localStorage.setItem('speciesList', JSON.stringify(updatedSpecies));
  };

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
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Nome Popular</TableHead>
                  <TableHead>Nome Científico</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {species.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{item.order}</span>
                        <div className="flex flex-col">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleMoveDown(index)}
                            disabled={index === species.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <img 
                        src={item.image} 
                        alt={item.commonName} 
                        className="h-12 w-12 object-cover rounded"
                      />
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
                          size="sm" 
                          onClick={() => openEditSpeciesDialog(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:text-destructive" 
                          onClick={() => handleDeleteSpecies(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isNewSpecies ? 'Adicionar Nova Espécie' : 'Editar Espécie'}
            </DialogTitle>
          </DialogHeader>
          
          {currentSpecies && (
            <div className="grid gap-6 py-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="commonName">Nome Popular*</Label>
                    <Input 
                      id="commonName" 
                      name="commonName" 
                      value={currentSpecies.commonName} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
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
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <select 
                      id="type" 
                      name="type" 
                      value={currentSpecies.type}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="serpente">Serpente</option>
                      <option value="lagarto">Lagarto</option>
                      <option value="quelonio">Quelônio</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input 
                      id="slug" 
                      name="slug" 
                      value={currentSpecies.slug} 
                      onChange={handleInputChange}
                      placeholder="Gerado automaticamente se em branco"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Imagem Principal</Label>
                <div className="flex items-center gap-4">
                  <div className="border rounded-lg overflow-hidden h-28 w-28 flex items-center justify-center bg-muted">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">Sem imagem</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 p-2 border border-dashed rounded-md hover:bg-accent">
                        <Upload className="h-4 w-4" />
                        <span>Selecionar imagem</span>
                      </div>
                      <input 
                        id="image-upload" 
                        type="file" 
                        accept="image/*" 
                        className="sr-only" 
                        onChange={handleImageChange}
                      />
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição Geral*</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  rows={3} 
                  value={currentSpecies.description} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Características</Label>
                  <Button type="button" size="sm" onClick={handleAddCharacteristic}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </div>
                {currentSpecies.characteristics.map((characteristic, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={characteristic} 
                      onChange={(e) => handleCharacteristicChange(index, e.target.value)} 
                    />
                    {currentSpecies.characteristics.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveCharacteristic(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Curiosidades</Label>
                  <Button type="button" size="sm" onClick={handleAddCuriosity}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </div>
                {currentSpecies.curiosities.map((curiosity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={curiosity} 
                      onChange={(e) => handleCuriosityChange(index, e.target.value)} 
                    />
                    {currentSpecies.curiosities.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveCuriosity(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
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
          
          <DialogFooter>
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
