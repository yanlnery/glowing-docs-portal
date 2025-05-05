
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { productService } from '@/services/productService';
import { Product, ProductFormData, ProductImage } from '@/types/product';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  ArrowLeft, Plus, X, Upload, Image as ImageIcon, Trash2 
} from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Get available species list
const fetchSpecies = () => {
  // For this demo, we're using a static list of species from the Species.tsx file
  return [
    { id: 'boa-constrictor-constrictor', name: 'Boa constrictor constrictor', commonName: 'Jiboia Amazônica' },
    { id: 'boa-constrictor-amarali', name: 'Boa constrictor amarali', commonName: 'Jiboia do Cerrado' },
    { id: 'boa-atlantica', name: 'Boa atlantica', commonName: 'Jiboia da Mata Atlântica' },
    { id: 'epicrates-cenchria', name: 'Epicrates cenchria', commonName: 'Jiboia Arco-íris da Amazônia' },
    { id: 'epicrates-assisi', name: 'Epicrates assisi', commonName: 'Jiboia Arco-íris da Caatinga' },
    { id: 'epicrates-crassus', name: 'Epicrates crassus', commonName: 'Jiboia Arco-íris do Cerrado' },
    { id: 'epicrates-maurus', name: 'Epicrates maurus', commonName: 'Jiboia Arco-íris do Norte' },
    { id: 'corallus-batesii', name: 'Corallus batesii', commonName: 'Jiboia Esmeralda' },
    { id: 'corallus-hortulana', name: 'Corallus hortulana', commonName: 'Suaçuboia' },
    { id: 'erythrolamprus-miliaris', name: 'Erythrolamprus miliaris', commonName: 'Cobra d\'água' },
    { id: 'spilotes-pullatus', name: 'Spilotes pullatus', commonName: 'Caninana' },
    { id: 'spilotes-sulphureus', name: 'Spilotes sulphureus', commonName: 'Caninana de Fogo' },
    { id: 'salvator-teguixin', name: 'Salvator teguixin', commonName: 'Teiú Dourado' },
    { id: 'salvator-merianae', name: 'Salvator merianae', commonName: 'Teiú' },
    { id: 'iguana-iguana', name: 'Iguana iguana', commonName: 'Iguana' },
    { id: 'diploglossus-lessonae', name: 'Diploglossus lessonae', commonName: 'Lagarto Coral' },
    { id: 'polychrus-marmoratus', name: 'Polychrus marmoratus', commonName: 'Lagarto Preguiça' },
    { id: 'thecadactylus-rapicauda', name: 'Thecadactylus rapicauda', commonName: 'Lagartixa Rabo de Nabo' },
    { id: 'chelonoidis-carbonaria', name: 'Chelonoidis carbonaria', commonName: 'Jabuti Piranga' },
    { id: 'chelonoidis-denticulata', name: 'Chelonoidis denticulata', commonName: 'Jabuti Tinga' },
    { id: 'crocodilurus-amazonicus', name: 'Crocodilurus amazonicus', commonName: 'Jacarerana' },
  ];
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  speciesId: z.string().min(1, { message: "Selecione uma espécie" }),
  speciesName: z.string(),
  category: z.enum(['serpente', 'lagarto', 'quelonio'], {
    errorMap: () => ({ message: "Selecione uma categoria" }),
  }),
  subcategory: z.enum(['boideos', 'colubrideos', 'pequenos', 'grandes', 'aquaticos', 'terrestres'], {
    errorMap: () => ({ message: "Selecione uma subcategoria" }),
  }),
  status: z.enum(['disponivel', 'indisponivel', 'vendido'], {
    errorMap: () => ({ message: "Selecione um status" }),
  }),
  price: z.coerce.number().min(0, { message: "Preço deve ser maior ou igual a zero" }),
  paymentLink: z.string().optional(),
  description: z.string().min(10, { message: "Descrição deve ter pelo menos 10 caracteres" }),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  visible: z.boolean().default(true),
  order: z.coerce.number().int().default(999),
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      alt: z.string(),
    })
  ).default([]),
});

type FormValues = z.infer<typeof formSchema>;

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [species, setSpecies] = useState<{ id: string; name: string; commonName: string }[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ProductImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      speciesId: '',
      speciesName: '',
      category: 'serpente',
      subcategory: 'boideos',
      status: 'disponivel',
      price: 0,
      paymentLink: '',
      description: '',
      featured: false,
      isNew: true,
      visible: true,
      order: 999,
      images: [],
    },
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load species list
    const speciesList = fetchSpecies();
    setSpecies(speciesList);
    
    // If edit mode, load product data
    if (isEditMode && id) {
      const product = productService.getById(id);
      if (product) {
        form.reset({
          ...product,
        });
        setUploadedImages(product.images);
        setSelectedSpecies(product.speciesId);
      } else {
        toast({
          title: "Produto não encontrado",
          description: "O produto que você está tentando editar não existe.",
          variant: "destructive",
        });
        navigate('/admin/products');
      }
    }
  }, [id, isEditMode, navigate]);

  const handleSpeciesChange = (speciesId: string) => {
    const selectedSpecies = species.find(s => s.id === speciesId);
    if (selectedSpecies) {
      form.setValue('speciesId', speciesId);
      form.setValue('speciesName', selectedSpecies.name);
      setSelectedSpecies(speciesId);
      
      // Set category based on species
      if (
        speciesId.includes('boa') || 
        speciesId.includes('epicrates') || 
        speciesId.includes('corallus') || 
        speciesId.includes('erythrolamprus') || 
        speciesId.includes('spilotes')
      ) {
        form.setValue('category', 'serpente');
      } else if (
        speciesId.includes('chelonoidis')
      ) {
        form.setValue('category', 'quelonio');
      } else {
        form.setValue('category', 'lagarto');
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoadingImages(true);
    
    const newImages: ProductImage[] = [];
    
    // In a real app, you would upload these to a server
    // For this demo, we'll create data URLs from the files
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const newImage: ProductImage = {
            id: crypto.randomUUID(),
            url: e.target.result.toString(),
            alt: file.name,
          };
          newImages.push(newImage);
          
          // If all files have been processed
          if (newImages.length === files.length) {
            setUploadedImages(prev => [...prev, ...newImages]);
            form.setValue('images', [...uploadedImages, ...newImages]);
            setIsLoadingImages(false);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (imageId: string) => {
    const updatedImages = uploadedImages.filter(img => img.id !== imageId);
    setUploadedImages(updatedImages);
    form.setValue('images', updatedImages);
  };

  const onSubmit = (data: FormValues) => {
    // Ensure images are included
    const productData: ProductFormData = {
      ...data,
      images: uploadedImages,
    };
    
    try {
      if (isEditMode && id) {
        productService.update(id, productData);
        toast({
          title: "Produto atualizado",
          description: "O produto foi atualizado com sucesso",
          variant: "default",
        });
      } else {
        productService.create(productData);
        toast({
          title: "Produto criado",
          description: "O produto foi criado com sucesso",
          variant: "default",
        });
      }
      navigate('/admin/products');
    } catch (error) {
      toast({
        title: "Erro ao salvar produto",
        description: "Ocorreu um erro ao salvar o produto",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/products')}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Editar Produto' : 'Novo Produto'}
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Preencha as informações básicas do produto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Animal</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Macho Jiboia Amazônica 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="speciesId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Espécie</FormLabel>
                      <Select
                        value={selectedSpecies || ''}
                        onValueChange={handleSpeciesChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma espécie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {species.map((species) => (
                            <SelectItem key={species.id} value={species.id}>
                              <span className="italic">{species.name}</span> ({species.commonName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="serpente">Serpente</SelectItem>
                            <SelectItem value="lagarto">Lagarto</SelectItem>
                            <SelectItem value="quelonio">Quelônio</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategoria</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma subcategoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="boideos">Boídeos</SelectItem>
                            <SelectItem value="colubrideos">Colubrídeos</SelectItem>
                            <SelectItem value="pequenos">Pequenos</SelectItem>
                            <SelectItem value="grandes">Grandes</SelectItem>
                            <SelectItem value="aquaticos">Aquáticos</SelectItem>
                            <SelectItem value="terrestres">Terrestres</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="disponivel">Disponível</SelectItem>
                          <SelectItem value="indisponivel">Indisponível</SelectItem>
                          <SelectItem value="vendido">Vendido</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                          <Input
                            type="number" 
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Use 0 para exibir "Preço sob consulta"
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ordem de Exibição</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            placeholder="999"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Números menores aparecem primeiro
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="paymentLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link de Pagamento</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://..."
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Cole aqui o link para pagamento do produto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descrição detalhada do animal..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imagens</CardTitle>
                <CardDescription>
                  Adicione imagens do animal (Tamanho recomendado: 800x600px)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="image-upload" className="block mb-2">
                    Upload de Imagens
                  </Label>
                  <div className="flex items-center gap-4">
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer flex items-center justify-center gap-2 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                    >
                      <Upload className="h-4 w-4" />
                      Selecionar Arquivos
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                    {isLoadingImages && (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                    )}
                  </div>
                </div>

                {uploadedImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nenhuma imagem adicionada
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Clique em "Selecionar Arquivos" para adicionar imagens
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image) => (
                      <div 
                        key={image.id}
                        className="relative group aspect-square overflow-hidden rounded-md border border-gray-200 dark:border-gray-800"
                      >
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(image.id)}
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Opções de Visibilidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="visible"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Visível no site</FormLabel>
                          <FormDescription>
                            Exibir este produto no site público
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Destaque</FormLabel>
                          <FormDescription>
                            Exibir em posições de destaque
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isNew"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Novidade</FormLabel>
                          <FormDescription>
                            Marcar como novo produto
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/admin/products')}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {isEditMode ? 'Atualizar Produto' : 'Criar Produto'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
