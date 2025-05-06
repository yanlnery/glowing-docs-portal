
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { productService } from '@/services/productService';
import { Product, ProductImage, ProductFormData, ProductCategory, ProductSubcategory, ProductStatus } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Upload, X, ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [imageList, setImageList] = useState<ProductImage[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const formSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    speciesId: z.string().min(1, "Espécie é obrigatória"),
    speciesName: z.string().min(1, "Nome da espécie é obrigatório"),
    category: z.enum(['serpente', 'lagarto', 'quelonio']),
    subcategory: z.enum(['boideos', 'colubrideos', 'pequenos', 'grandes', 'aquaticos', 'terrestres']),
    status: z.enum(['disponivel', 'indisponivel', 'vendido']),
    price: z.preprocess(
      (val) => (val === '' ? 0 : Number(val)),
      z.number().min(0)
    ),
    paymentLink: z.string().optional(),
    description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
    featured: z.boolean().default(false),
    isNew: z.boolean().default(false),
    visible: z.boolean().default(true),
    order: z.preprocess(
      (val) => (val === '' ? 0 : Number(val)),
      z.number().min(0)
    ),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      speciesId: "",
      speciesName: "",
      category: "serpente" as ProductCategory,
      subcategory: "boideos" as ProductSubcategory,
      status: "disponivel" as ProductStatus,
      price: 0,
      paymentLink: "",
      description: "",
      featured: false,
      isNew: true,
      visible: true,
      order: 0,
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      const productData = productService.getProductById(id);
      if (productData) {
        setProduct(productData);
        setImageList(productData.images || []);
        
        form.reset({
          name: productData.name,
          speciesId: productData.speciesId,
          speciesName: productData.speciesName,
          category: productData.category,
          subcategory: productData.subcategory,
          status: productData.status,
          price: productData.price,
          paymentLink: productData.paymentLink,
          description: productData.description,
          featured: productData.featured,
          isNew: productData.isNew,
          visible: productData.visible,
          order: productData.order,
        });
      } else {
        toast({
          title: "Erro",
          description: "Produto não encontrado",
          variant: "destructive"
        });
        navigate('/admin/products');
      }
    }
  }, [id, isEditMode, navigate, toast, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      const newImageFiles = [...imageFiles, ...filesArray];
      setImageFiles(newImageFiles);
      
      const newImageUrls = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviewUrls([...imagePreviewUrls, ...newImageUrls]);
    }
  };

  const removeImage = (index: number) => {
    // Remove from preview
    const newPreviewUrls = [...imagePreviewUrls];
    newPreviewUrls.splice(index, 1);
    setImagePreviewUrls(newPreviewUrls);
    
    // Remove from files list
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
  };

  const removeExistingImage = (index: number) => {
    const newImageList = [...imageList];
    newImageList.splice(index, 1);
    setImageList(newImageList);
  };

  const onSubmit = (values: FormValues) => {
    setLoading(true);
    
    // In a real implementation, we would upload images to a server and get URLs back
    // For now, we'll simulate this by using placeholder URLs
    const newImages: ProductImage[] = imageFiles.map((file, index) => ({
      id: `new-image-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      alt: `Image of ${values.name}`
    }));
    
    // Combine existing and new images
    const allImages = [...imageList, ...newImages];
    
    const formData: ProductFormData = {
      name: values.name,
      speciesId: values.speciesId,
      speciesName: values.speciesName,
      category: values.category,
      subcategory: values.subcategory,
      status: values.status,
      price: values.price,
      paymentLink: values.paymentLink || "",
      images: allImages,
      description: values.description,
      featured: values.featured,
      isNew: values.isNew,
      visible: values.visible,
      order: values.order,
    };
    
    try {
      if (isEditMode && id) {
        productService.updateProduct(id, formData);
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!",
        });
      } else {
        productService.addProduct(formData);
        toast({
          title: "Sucesso",
          description: "Produto criado com sucesso!",
        });
        form.reset();
        setImagePreviewUrls([]);
        setImageFiles([]);
        setImageList([]);
      }
      navigate('/admin/products');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o produto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/admin/products')} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">{isEditMode ? 'Editar Produto' : 'Novo Produto'}</h1>
          </div>
          
          {isEditMode && (
            <Button variant="destructive" onClick={() => {
              if (window.confirm('Tem certeza que deseja excluir este produto?')) {
                productService.deleteProduct(id as string);
                toast({
                  title: "Produto excluído",
                  description: "O produto foi removido com sucesso.",
                });
                navigate('/admin/products');
              }
            }}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Animal</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Python Regius Albino" {...field} />
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
                          <FormLabel>ID da Espécie</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: boa-constrictor-constrictor" {...field} />
                          </FormControl>
                          <FormDescription>
                            ID da espécie conforme definido na seção Espécies
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="speciesName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Científico</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Python regius" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
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
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
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
                      
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço (R$)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                {...field}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <FormDescription>
                              Use 0 para "Sob consulta"
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
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Link do C6 Bank ou outro gateway para pagamento direto
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
                              placeholder="0" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
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
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva o animal, suas características, história, etc."
                              className="min-h-32" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                            <div className="space-y-0.5">
                              <FormLabel>Destaque</FormLabel>
                              <FormDescription>
                                Mostrar como destaque
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isNew"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                            <div className="space-y-0.5">
                              <FormLabel>Novidade</FormLabel>
                              <FormDescription>
                                Marcar como novo
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="visible"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                          <div className="space-y-0.5">
                            <FormLabel>Visível no site</FormLabel>
                            <FormDescription>
                              Mostrar este animal no catálogo público
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-4">
                      <Label>Imagens do Animal</Label>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {imageList.map((image, index) => (
                          <div key={image.id} className="relative group aspect-square">
                            <img 
                              src={image.url}
                              alt={image.alt}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        
                        {imagePreviewUrls.map((url, index) => (
                          <div key={`preview-${index}`} className="relative group aspect-square">
                            <img 
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="bg-red-600 text-white rounded-full p-1"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        <label className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors aspect-square">
                          <Upload className="h-6 w-6 text-gray-400" />
                          <span className="mt-2 text-sm text-gray-500">Adicionar foto</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            multiple
                          />
                        </label>
                      </div>
                      
                      <Alert>
                        <AlertDescription>
                          Recomendamos imagens no formato quadrado, de preferência com 800x800 pixels.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => navigate('/admin/products')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
