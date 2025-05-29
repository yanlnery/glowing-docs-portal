
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productService } from '@/services/productService';
import { ProductImage, ProductFormData, ProductCategory, ProductSubcategory, ProductStatus } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

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

export type FormValues = z.infer<typeof formSchema>;

export const useProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState<ProductImage[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

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
      const loadProduct = async () => {
        try {
          const productData = await productService.getById(id);
          if (productData) {
            setImageList(productData.images || []);
            
            form.reset({
              name: productData.name,
              speciesId: productData.speciesId || "",
              speciesName: productData.speciesName,
              category: productData.category,
              subcategory: productData.subcategory,
              status: productData.status || "disponivel",
              price: productData.price,
              paymentLink: productData.paymentLink,
              description: productData.description,
              featured: productData.featured,
              isNew: productData.isNew,
              visible: productData.visible ?? true,
              order: productData.order || 0,
            });
          } else {
            toast({
              title: "Erro",
              description: "Produto não encontrado",
              variant: "destructive"
            });
            navigate('/admin/products');
          }
        } catch (error) {
          console.error("Error loading product:", error);
          toast({
            title: "Erro",
            description: "Erro ao carregar produto",
            variant: "destructive"
          });
          navigate('/admin/products');
        }
      };

      loadProduct();
    }
  }, [id, isEditMode, navigate, toast, form]);

  const handleDelete = async () => {
    if (isEditMode && id && window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await productService.delete(id);
        toast({
          title: "Produto excluído",
          description: "O produto foi removido com sucesso.",
        });
        navigate('/admin/products');
      } catch (error) {
        console.error("Error deleting product:", error);
        toast({
          title: "Erro",
          description: "Erro ao excluir produto",
          variant: "destructive"
        });
      }
    }
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    
    let newProcessedImages: ProductImage[] = [];
    if (imageFiles.length > 0) {
      const newImageDataPromises = imageFiles.map(async (file) => {
        try {
          const dataUrl = await fileToDataUrl(file);
          return {
            id: crypto.randomUUID(),
            url: dataUrl,
            filename: file.name,
            alt: `Imagem de ${values.name}`
          };
        } catch (error) {
          console.error("Erro ao converter arquivo para data URL:", error);
          toast({ title: "Erro de Imagem", description: `Falha ao processar ${file.name}. Tente novamente.`, variant: "destructive" });
          return null; 
        }
      });

      const results = await Promise.all(newImageDataPromises);
      newProcessedImages = results.filter(img => img !== null) as ProductImage[];

      if (newProcessedImages.length !== imageFiles.length) {
        setLoading(false);
        return;
      }
    }
    
    const allImages = [...imageList, ...newProcessedImages];
    
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
      available: values.status === 'disponivel',
    };
    
    try {
      if (isEditMode && id) {
        await productService.update(id, formData);
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!",
        });
      } else {
        await productService.create(formData);
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
      console.error("Erro ao salvar produto:", error);
      toast({
        title: "Erro",
        description: (error instanceof Error && error.message) || "Ocorreu um erro ao salvar o produto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    isEditMode,
    id,
    imageList,
    setImageList,
    imageFiles,
    setImageFiles,
    imagePreviewUrls,
    setImagePreviewUrls,
    navigate,
    onSubmit,
    handleDelete,
  };
};
