
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Upload, FileText, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Manual {
  id: string;
  title: string;
  description: string;
  pages: number;
  image: string;
  category: string;
  pdfUrl: string;
  pdfFile?: File;
}

export default function ManualsAdmin() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentManual, setCurrentManual] = useState<Manual | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pages, setPages] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    // Load manuals from localStorage
    try {
      const savedManuals = JSON.parse(localStorage.getItem('manuals') || '[]');
      setManuals(savedManuals);
    } catch (error) {
      console.error('Error loading manuals:', error);
      setManuals([]);
    }
  }, []);

  const saveManuals = (updatedManuals: Manual[]) => {
    try {
      localStorage.setItem('manuals', JSON.stringify(updatedManuals));
      setManuals(updatedManuals);
    } catch (error) {
      console.error('Error saving manuals:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar os manuais',
        variant: 'destructive',
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile(file);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPages('');
    setCategory('');
    setImageFile(null);
    setPdfFile(null);
    setImagePreview(null);
    setCurrentManual(null);
  };

  const openDialog = (manual?: Manual) => {
    if (manual) {
      setCurrentManual(manual);
      setTitle(manual.title);
      setDescription(manual.description);
      setPages(manual.pages.toString());
      setCategory(manual.category);
      setImagePreview(manual.image);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !pages || !category) {
      toast({
        title: 'Campos incompletos',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    if (!currentManual && (!imageFile || !pdfFile)) {
      toast({
        title: 'Arquivos faltando',
        description: 'É necessário fornecer uma imagem e um PDF',
        variant: 'destructive',
      });
      return;
    }

    // In a real scenario, we would upload files to a server
    // For now, we'll store them as local object URLs
    const pdfUrl = pdfFile 
      ? URL.createObjectURL(pdfFile)
      : currentManual?.pdfUrl || '';
    
    const imageUrl = imageFile 
      ? URL.createObjectURL(imageFile) 
      : currentManual?.image || '';

    const manualData: Manual = {
      id: currentManual?.id || `manual-${Date.now()}`,
      title,
      description,
      pages: parseInt(pages, 10),
      category,
      image: imageUrl,
      pdfUrl: pdfUrl,
      pdfFile: pdfFile || undefined
    };

    if (currentManual) {
      // Update existing manual
      const updatedManuals = manuals.map(m => 
        m.id === currentManual.id ? manualData : m
      );
      saveManuals(updatedManuals);
      toast({
        title: 'Manual atualizado',
        description: 'O manual foi atualizado com sucesso',
      });
    } else {
      // Add new manual
      saveManuals([...manuals, manualData]);
      toast({
        title: 'Manual adicionado',
        description: 'O manual foi adicionado com sucesso',
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este manual?')) {
      const updatedManuals = manuals.filter(m => m.id !== id);
      saveManuals(updatedManuals);
      toast({
        title: 'Manual excluído',
        description: 'O manual foi excluído com sucesso',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gerenciar Manuais</h1>
          <Button onClick={() => openDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Manual
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manuais de Criação</CardTitle>
            <CardDescription>
              Gerencie os manuais disponíveis para download no site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {manuals.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">Nenhum manual cadastrado</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione manuais para exibição no site.
                </p>
                <Button onClick={() => openDialog()} className="mt-4">
                  Adicionar Primeiro Manual
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Imagem</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="w-[80px]">Páginas</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manuals.map((manual) => (
                    <TableRow key={manual.id}>
                      <TableCell>
                        <div className="w-16 h-16 rounded overflow-hidden">
                          <img 
                            src={manual.image} 
                            alt={manual.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{manual.title}</TableCell>
                      <TableCell>{manual.category}</TableCell>
                      <TableCell>{manual.pages}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => openDialog(manual)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(manual.id)}>
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
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {currentManual ? 'Editar Manual' : 'Novo Manual'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Manual de Criação de..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pages">Número de Páginas</Label>
                  <Input
                    id="pages"
                    type="number"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="serpente">Serpente</SelectItem>
                    <SelectItem value="lagarto">Lagarto</SelectItem>
                    <SelectItem value="quelonio">Quelônio</SelectItem>
                    <SelectItem value="geral">Informação Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descrição do conteúdo..."
                  className="h-20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cover">Imagem de Capa</Label>
                  <div className="flex items-center gap-2">
                    <div className="border rounded p-2 flex-1">
                      {imagePreview ? (
                        <div className="relative w-full aspect-[4/3] rounded overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center rounded">
                          <span className="text-muted-foreground text-sm">Nenhuma imagem</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="cover-upload"
                        className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Label>
                      <Input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        required={!currentManual}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pdf">Arquivo PDF</Label>
                  <div className="flex items-center gap-2 mt-7">
                    <span className="text-sm text-muted-foreground flex-1 truncate">
                      {pdfFile ? pdfFile.name : currentManual?.pdfUrl ? "PDF atual" : "Nenhum arquivo"}
                    </span>
                    <div>
                      <Label
                        htmlFor="pdf-upload"
                        className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Label>
                      <Input
                        id="pdf-upload"
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handlePdfChange}
                        required={!currentManual}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {currentManual ? 'Salvar' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
