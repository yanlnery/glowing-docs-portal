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
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast'; // Changed from '@/hooks/use-toast'
import { Pencil, Trash2, Upload, FileText, PlusCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Manual, ManualFormData, ManualCategory } from '@/types/manual';
import { useManualsManagement } from '@/hooks/useManualsManagement';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const initialManualFormData: ManualFormData = {
  title: '',
  description: '',
  pages: null, // Allow null
  category: null, // Allow null
  image: null,
  pdf_url: null,
  imageFile: null,
  pdfFile: null,
  originalImageUrl: null,
  originalPdfUrl: null,
};

export default function ManualsAdmin() {
  const { manuals, isLoading: manualsLoading, saveManual, deleteManual } = useManualsManagement();
  const { isAdminLoggedIn } = useAdminAuth();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentManualForm, setCurrentManualForm] = useState<ManualFormData>(initialManualFormData);
  const [isNew, setIsNew] = useState(true);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCurrentManualForm(prev => ({ ...prev, imageFile: file, image: null })); // Clear existing image URL if new file
      setImagePreview(URL.createObjectURL(file));
      e.target.value = ''; // Reset file input
    }
  };
  
  const handleRemoveImage = () => {
    setCurrentManualForm(prev => ({ ...prev, imageFile: null, image: null, originalImageUrl: prev.image || prev.originalImageUrl }));
    setImagePreview(null);
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCurrentManualForm(prev => ({ ...prev, pdfFile: file, pdf_url: null })); // Clear existing pdf_url if new file
      setPdfFileName(file.name);
      e.target.value = ''; // Reset file input
    }
  };
  
  const handleRemovePdf = () => {
    setCurrentManualForm(prev => ({ ...prev, pdfFile: null, pdf_url: null, originalPdfUrl: prev.pdf_url || prev.originalPdfUrl }));
    setPdfFileName(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentManualForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: keyof ManualFormData, value: string | null) => {
     if (name === 'pages' && value !== null) {
        const numPages = parseInt(value, 10);
        setCurrentManualForm(prev => ({ ...prev, [name]: isNaN(numPages) ? null : numPages }));
    } else {
        setCurrentManualForm(prev => ({ ...prev, [name]: value }));
    }
  };


  const openDialog = (manual?: Manual) => {
    if (manual) {
      setIsNew(false);
      setCurrentManualForm({
        id: manual.id,
        title: manual.title,
        description: manual.description || '',
        pages: manual.pages,
        category: manual.category,
        image: manual.image,
        pdf_url: manual.pdf_url,
        imageFile: null,
        pdfFile: null,
        originalImageUrl: manual.image, // Store original to know if it changed
        originalPdfUrl: manual.pdf_url,   // Store original
      });
      setImagePreview(manual.image);
      setPdfFileName(manual.pdf_url ? (manual.pdf_url.substring(manual.pdf_url.lastIndexOf('/') + 1).split('?')[0] || "Arquivo PDF atual") : null);
    } else {
      setIsNew(true);
      setCurrentManualForm(initialManualFormData);
      setImagePreview(null);
      setPdfFileName(null);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminLoggedIn) {
        toast({ title: "Acesso Negado", variant: "destructive" });
        return;
    }
    if (!currentManualForm.title) {
      toast({ title: 'Título obrigatório', description: 'O título do manual é obrigatório.', variant: 'destructive' });
      return;
    }
    // If new, require files unless URLs are somehow pre-filled (not typical for new)
    if (isNew && !currentManualForm.imageFile && !currentManualForm.image) {
        // For new items, usually an image is expected. Can adjust this logic.
        // toast({ title: 'Imagem de capa obrigatória', description: 'Adicione uma imagem de capa para o novo manual.', variant: 'destructive'});
        // return;
    }
     if (isNew && !currentManualForm.pdfFile && !currentManualForm.pdf_url) {
        // Similar for PDF.
        // toast({ title: 'Arquivo PDF obrigatório', description: 'Adicione um arquivo PDF para o novo manual.', variant: 'destructive'});
        // return;
    }

    const success = await saveManual(currentManualForm, isNew);
    if (success) {
      setIsDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdminLoggedIn) {
        toast({ title: "Acesso Negado", variant: "destructive" });
        return;
    }
    await deleteManual(id);
  };
  
  if (manualsLoading && isAdminLoggedIn) {
    return <AdminLayout><div className="p-6">Carregando manuais...</div></AdminLayout>;
  }
  
  if (!isAdminLoggedIn && !manualsLoading) {
     return <AdminLayout><div className="p-6 text-center">Por favor, <a href="/admin" className="underline text-primary">faça login</a> para gerenciar os manuais.</div></AdminLayout>;
  }


  return (
    <AdminLayout>
      <div className="space-y-6 p-4 md:p-6">
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
              // ... keep existing code (empty state UI)
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
                    <TableHead>PDF</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manuals.map((manual) => (
                    <TableRow key={manual.id}>
                      <TableCell>
                        <div className="w-16 h-16 rounded overflow-hidden bg-muted">
                          {manual.image ? (
                            <img 
                              src={manual.image} 
                              alt={manual.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="w-full h-full text-muted-foreground p-4"/>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{manual.title}</TableCell>
                      <TableCell>{manual.category || 'N/A'}</TableCell>
                      <TableCell>{manual.pages || 'N/A'}</TableCell>
                       <TableCell>
                        {manual.pdf_url ? (
                          <a href={manual.pdf_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">
                            Ver PDF <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        ) : (
                          'Nenhum'
                        )}
                      </TableCell>
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
          <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isNew ? 'Novo Manual' : 'Editar Manual'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Título*</Label>
                  <Input
                    id="title"
                    name="title"
                    value={currentManualForm.title}
                    onChange={handleInputChange}
                    placeholder="Manual de Criação de..."
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pages">Número de Páginas</Label>
                  <Input
                    id="pages"
                    name="pages"
                    type="number"
                    value={currentManualForm.pages === null ? '' : currentManualForm.pages}
                    onChange={(e) => handleSelectChange('pages', e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={currentManualForm.category || ''} 
                  onValueChange={(value) => handleSelectChange('category', value as ManualCategory)}
                >
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

              <div className="space-y-1.5">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={currentManualForm.description || ''}
                  onChange={handleInputChange}
                  placeholder="Breve descrição do conteúdo..."
                  className="h-20"
                />
              </div>
              
              {/* Image Upload Section */}
              <div className="space-y-1.5">
                <Label>Imagem de Capa</Label>
                <div className="flex items-center gap-4">
                    <div className="border rounded-lg overflow-hidden h-28 w-28 flex items-center justify-center bg-muted shrink-0">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                            <FileText className="h-10 w-10 text-muted-foreground" />
                        )}
                    </div>
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="cover-upload" className="cursor-pointer w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium">
                            <Upload className="h-4 w-4 mr-2" /> {currentManualForm.imageFile ? currentManualForm.imageFile.name : "Selecionar Imagem"}
                        </Label>
                        <Input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        {(imagePreview || currentManualForm.image) && (
                            <Button type="button" variant="link" size="sm" className="text-destructive px-0 h-auto py-0" onClick={handleRemoveImage}>
                                Remover imagem
                            </Button>
                        )}
                    </div>
                </div>
              </div>

              {/* PDF Upload Section */}
               <div className="space-y-1.5">
                <Label>Arquivo PDF</Label>
                 <div className="flex items-center gap-4">
                    <div className="border rounded-lg overflow-hidden h-28 w-28 flex items-center justify-center bg-muted shrink-0 p-2 text-center">
                        <FileText className="h-10 w-10 text-muted-foreground" />
                         <span className="text-xs mt-1 text-muted-foreground truncate block w-full">
                           {pdfFileName || (currentManualForm.pdf_url ? "PDF Atual" : "Nenhum PDF")}
                        </span>
                    </div>
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="pdf-upload" className="cursor-pointer w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium">
                            <Upload className="h-4 w-4 mr-2" /> {currentManualForm.pdfFile ? currentManualForm.pdfFile.name : "Selecionar PDF"}
                        </Label>
                        <Input id="pdf-upload" type="file" accept="application/pdf" className="hidden" onChange={handlePdfChange} />
                         {(pdfFileName || currentManualForm.pdf_url) && (
                            <Button type="button" variant="link" size="sm" className="text-destructive px-0 h-auto py-0" onClick={handleRemovePdf}>
                                Remover PDF
                            </Button>
                        )}
                    </div>
                </div>
                {currentManualForm.pdf_url && !pdfFileName && (
                     <a href={currentManualForm.pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center mt-1">
                        Ver PDF atual <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                )}
              </div>


              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={manualsLoading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={manualsLoading}>
                  {manualsLoading ? 'Salvando...' : (isNew ? 'Adicionar Manual' : 'Salvar Alterações')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
