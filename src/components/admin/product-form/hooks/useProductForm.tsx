
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/components/ui/use-toast';
import { productService } from '@/services/productService';
import { ProductFormData, ProductImage, ProductCategory } from '@/types/product';
import { Species } from '@/types/species';
import { supabase } from '@/integrations/supabase/client';

const productFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  speciesName: z.string().min(1, 'Nome científico é obrigatório'),
  speciesId: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Preço deve ser positivo'),
  originalPrice: z.number().min(0, 'Preço original deve ser positivo').optional(),
  pixPrice: z.number().min(0, 'Preço PIX deve ser positivo').optional(),
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
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [loadingSpecies, setLoadingSpecies] = useState(false);

  const isEditMode = Boolean(id);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      speciesName: '',
      description: '',
      price: 0,
      originalPrice: undefined,
      pixPrice: undefined,
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

  // Load species list
  useEffect(() => {
    const fetchSpecies = async () => {
      setLoadingSpecies(true);
      try {
        const { data, error } = await supabase
          .from('species')
          .select('*')
          .order('order', { ascending: true });

        if (error) throw error;

        const mappedSpecies: Species[] = (data || []).map((item) => ({
          id: item.id,
          name: item.name,
          commonname: item.commonname,
          slug: item.slug,
          type: (item.type as 'serpente' | 'lagarto' | 'quelonio' | 'outro') || 'serpente',
          image: item.image || '',
          description: item.description || '',
          characteristics: Array.isArray(item.characteristics) ? item.characteristics as string[] : [],
          curiosities: Array.isArray(item.curiosities) ? item.curiosities as string[] : [],
          gallery: Array.isArray(item.gallery) ? item.gallery as string[] : [],
          order: item.order || 0,
        }));

        setSpeciesList(mappedSpecies);
      } catch (error) {
        console.error('Error fetching species:', error);
      } finally {
        setLoadingSpecies(false);
      }
    };

    fetchSpecies();
  }, []);

  // Handle species selection - auto-fill form fields
  const handleSpeciesSelect = (speciesId: string) => {
    const selectedSpecies = speciesList.find(s => s.id === speciesId);
    if (!selectedSpecies) return;

    // Map species type to product category
    const categoryMap: Record<string, ProductCategory> = {
      'serpente': 'serpente',
      'lagarto': 'lagarto',
      'quelonio': 'quelonio',
    };

    const category = categoryMap[selectedSpecies.type] || 'serpente';

    // Build description from species info
    let description = selectedSpecies.description || '';
    
    if (selectedSpecies.characteristics && selectedSpecies.characteristics.length > 0) {
      description += '\n\nCaracterísticas:\n• ' + selectedSpecies.characteristics.join('\n• ');
    }
    
    if (selectedSpecies.curiosities && selectedSpecies.curiosities.length > 0) {
      description += '\n\nCuriosidades:\n• ' + selectedSpecies.curiosities.join('\n• ');
    }

    // Update form fields
    form.setValue('speciesId', selectedSpecies.id);
    form.setValue('name', selectedSpecies.commonname);
    form.setValue('speciesName', selectedSpecies.name);
    form.setValue('description', description.trim());
    form.setValue('category', category);
    form.setValue('meta', {
      characteristics: selectedSpecies.characteristics,
      curiosities: selectedSpecies.curiosities,
    });

    toast({
      title: "Espécie selecionada",
      description: `Informações de "${selectedSpecies.commonname}" aplicadas ao produto.`,
    });
  };

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
              originalPrice: product.originalPrice,
              pixPrice: product.pixPrice,
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

      const productData = {
        ...data,
        images: imageList,
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

  const handleImageUpload = (newImages: ProductImage[]) => {
    setImageList(prev => [...prev, ...newImages]);
  };

  return {
    form,
    loading,
    isEditMode,
    id,
    imageList,
    setImageList,
    handleImageUpload,
    navigate,
    onSubmit,
    handleDelete,
    speciesList,
    loadingSpecies,
    handleSpeciesSelect,
  };
};
