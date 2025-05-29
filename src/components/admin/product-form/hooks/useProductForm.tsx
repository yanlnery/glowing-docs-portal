
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/components/ui/use-toast';
import { productService } from '@/services/productService';
import { ProductFormData, ProductImage } from '@/types/product';

const productFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  speciesName: z.string().min(1, 'Nome científico é obrigatório'),
  speciesId: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Preço deve ser positivo'),
  category: z.enum(['serpente', 'lagarto', 'quelonio'], {
    required_error: 'Categoria é obrigatória',
  }),
  subcategory: z.enum(['colubrideos', 'boideos', 'pequenos', 'grandes', 'terrestres', 'aquaticos'], {
    required_error: 'Subcategoria é obrigatória',
  }),
  status: z.enum(['disponivel', 'indisponivel', 'vendido']).default('disponivel'),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  visible: z.boolean().default(true),
  order: z.number().default(0),
  paymentLink: z.string().optional(),
  images: z.array(z.any()).default([]),
  details: z.array(z.any()).default([]),
  meta: z.record(z.any()).default({}),
});

export const useProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState<ProductImage[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const isEditMode = Boolean(id);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      speciesName: '',
      description: '',
      price: 0,
      category: 'serpente',
      subcategory: 'colubrideos',
      status: 'disponivel',
      featured: false,
      isNew: false,
      visible: true,
      order: 0,
      paymentLink: '',
      images: [],
      details: [],
      meta: {},
    },
  });

  // Load product data if editing
  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          setLoading(true);
          console.log(`🔄 Loading product ${id} for editing...`);
          
          const product = await productService.getById(id);
          if (product) {
            console.log("✅ Product loaded for editing:", product);
            
            form.reset({
              name: product.name,
              speciesName: product.speciesName,
              speciesId: product.speciesId,
              description: product.description,
              price: product.price,
              category: product.category,
              subcategory: product.subcategory,
              status: product.status || 'disponivel',
              featured: product.featured,
              isNew: product.isNew,
              visible: product.visible !== undefined ? product.visible : true,
              order: product.order || 0,
              paymentLink: product.paymentLink || '',
              images: product.images || [],
              details: product.details || [],
              meta: product.meta || {},
            });

            // Set existing images
            if (product.images && product.images.length > 0) {
              setImageList(product.images);
            }
          } else {
            toast({
              title: "Erro",
              description: "Produto não encontrado",
              variant: "destructive",
            });
            navigate('/admin/products');
          }
        } catch (error) {
          console.error("Error loading product:", error);
          toast({
            title: "Erro",
            description: "Erro ao carregar produto",
            variant: "destructive",
          });
          navigate('/admin/products');
        } finally {
          setLoading(false);
        }
      }
    };

    loadProduct();
  }, [id, form, navigate]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);
      console.log("🔄 Submitting product form...", data);

      // Combine existing images with new images
      const allImages = [
        ...imageList,
        ...imageFiles.map((file, index) => ({
          id: crypto.randomUUID(),
          url: imagePreviewUrls[index],
          filename: file.name,
          alt: data.name || 'Product image',
        })),
      ];

      const productData = {
        ...data,
        images: allImages,
      };

      if (isEditMode && id) {
        await productService.update(id, productData);
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!",
        });
      } else {
        await productService.create(productData);
        toast({
          title: "Sucesso",
          description: "Produto criado com sucesso!",
        });
      }

      navigate('/admin/products');
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar produto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const confirmed = window.confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.');
    
    if (confirmed) {
      try {
        setLoading(true);
        console.log(`🔄 Deleting product ${id}...`);
        
        const success = await productService.delete(id);
        if (success) {
          toast({
            title: "Sucesso",
            description: "Produto excluído com sucesso!",
          });
          navigate('/admin/products');
        } else {
          toast({
            title: "Erro",
            description: "Erro ao excluir produto",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast({
          title: "Erro",
          description: "Erro ao excluir produto",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
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
