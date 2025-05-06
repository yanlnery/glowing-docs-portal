
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  File, 
  ImageIcon,
  Download
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Manual {
  id: string;
  title: string;
  description: string;
  pages: number;
  image: string;
  category: string;
  pdfUrl: string;
}

const ManualsAdmin = () => {
  const navigate = useNavigate();
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentManual, setCurrentManual] = useState<Manual | null>(null);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pages, setPages] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  
  useEffect(() => {
    loadManuals();
  }, []);
  
  const loadManuals = () => {
    try {
      const savedManuals = JSON.parse(localStorage.getItem('manuals') || '[]') as Manual[];
      setManuals(savedManuals);
    } catch (error) {
      console.error("Failed to load manuals:", error);
      setManuals([]);
    }
  };
  
  const saveManuals = (updatedManuals: Manual[]) => {
    localStorage.setItem('manuals', JSON.stringify(updatedManuals));
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPages('');
    setCategory('');
    setImageUrl('');
    setPdfUrl('');
    setCurrentManual(null);
  };
  
  const openManualDialog = (manual?: Manual) => {
    if (manual) {
      // Edit mode
      setCurrentManual(manual);
      setTitle(manual.title);
      setDescription(manual.description);
      setPages(manual.pages.toString());
      setCategory(manual.category);
      setImageUrl(manual.image);
      setPdfUrl(manual.pdfUrl);
    } else {
      // Create mode
      resetForm();
    }
    setIsDialogOpen(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !pages || !category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const manual: Manual = {
      id: currentManual ? currentManual.id : crypto.randomUUID(),
      title,
      description,
      pages: parseInt(pages),
      image: imageUrl || 'https://images.unsplash.com/photo-1598445609092-7c7d80d816dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80', // Default image
      category,
      pdfUrl: pdfUrl || '#', // Default URL
    };
    
    let updatedManuals: Manual[];
    
    if (currentManual) {
      // Update existing manual
      updatedManuals = manuals.map(m => m.id === manual.id ? manual : m);
      toast({
        title: "Manual atualizado",
        description: "As alterações foram salvas com sucesso."
      });
    } else {
      // Add new manual
      updatedManuals = [...manuals, manual];
      toast({
        title: "Manual adicionado",
        description: "O novo manual foi adicionado com sucesso."
      });
    }
    
    setManuals(updatedManuals);
    saveManuals(updatedManuals);
    setIsDialogOpen(false);
    resetForm();
  };
  
  const deleteManual = (id: string) => {
    const updatedManuals = manuals.filter(manual => manual.id !== id);
    setManuals(updatedManuals);
    saveManuals(updatedManuals);
    
    toast({
      title: "Manual excluído",
      description: "O manual foi removido com sucesso."
    });
  };
  
  // Available categories
  const categories = [
    { value: "serpente", label: "Serpentes" },
    { value: "lagarto", label: "Lagartos" },
    { value: "quelonio", label: "Quelônios" },
    { value: "anfibio", label: "Anfíbios" },
    { value: "invertebrado", label: "Invertebrados" },
  ];

  return (
    <AdminLayout requiredRole="admin">
      <div className="p-6">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manuais de Criação</h1>
              <p className="text-muted-foreground">
                Gerencie os manuais disponíveis no site
              </p>
            </div>
            <Button onClick={() => openManualDialog()}>
              <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Manual
            </Button>
          </div>
          
          {manuals.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground mb-4">
                Nenhum manual cadastrado.
              </p>
              <Button variant="outline" onClick={() => openManualDialog()}>
                <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Primeiro Manual
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Páginas</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manuals.map((manual) => (
                    <TableRow key={manual.id}>
                      <TableCell className="font-medium">{manual.title}</TableCell>
                      <TableCell>{manual.category}</TableCell>
                      <TableCell>{manual.pages}</TableCell>
                      <TableCell className="max-w-xs truncate">{manual.description}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => openManualDialog(manual)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o manual "{manual.title}"? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteManual(manual.id)}>Excluir</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Manual form dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{currentManual ? 'Editar Manual' : 'Adicionar Manual'}</DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para {currentManual ? 'atualizar o' : 'adicionar um novo'} manual.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Título do Manual*</label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Manual de Criação de Boídeos"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Descrição*</label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Guia completo para criação e reprodução..."
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="pages" className="text-sm font-medium">Número de Páginas*</label>
                    <Input
                      id="pages"
                      type="number"
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      placeholder="32"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Categoria*</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="imageUrl" className="text-sm font-medium">URL da Imagem</label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deixe vazio para usar uma imagem padrão
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="pdfUrl" className="text-sm font-medium">URL do PDF</label>
                  <div className="flex gap-2">
                    <Input
                      id="pdfUrl"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      placeholder="https://example.com/manual.pdf"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <File className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deixe vazio para criar um link temporário
                  </p>
                </div>
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {currentManual ? 'Atualizar' : 'Adicionar'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManualsAdmin;
