import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '@/services/productService';
import { Product, ProductCategory, ProductSubcategory } from '@/types/product';

export const useCatalogData = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar filtros diretamente dos searchParams
  const getInitialCategory = (): ProductCategory | 'all' => {
    const param = searchParams.get('category');
    if (param && ['serpente', 'lagarto', 'quelonio'].includes(param)) {
      return param as ProductCategory;
    }
    return 'all';
  };

  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>(getInitialCategory);
  const [subcategoryFilter, setSubcategoryFilter] = useState<ProductSubcategory | 'all'>('all');
  const [speciesFilter, setSpeciesFilter] = useState<string | null>(
    searchParams.get('especie') || null
  );

  // Sincronizar com mudanças na URL (navegação browser)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const speciesParam = searchParams.get('especie');

    if (categoryParam && ['serpente', 'lagarto', 'quelonio'].includes(categoryParam)) {
      setCategoryFilter(categoryParam as ProductCategory);
    } else if (!categoryParam) {
      setCategoryFilter('all');
    }

    setSpeciesFilter(speciesParam || null);
  }, [searchParams]);

  // Carregar produtos (apenas uma vez)
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const visibleProducts = await productService.getAvailableProducts();
      console.log('📦 Produtos carregados:', visibleProducts.length);
      setProducts(visibleProducts);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Aplicar filtros sempre que produtos ou filtros mudarem
  useEffect(() => {
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    console.log('🔍 Aplicando filtros:', { 
      category: categoryFilter, 
      subcategory: subcategoryFilter, 
      species: speciesFilter,
      search: searchQuery 
    });

    let result = [...products];

    // Filtro por espécie
    if (speciesFilter) {
      result = result.filter(product => product.speciesId === speciesFilter);
    }

    // Filtro por busca
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.speciesName.toLowerCase().includes(lowerQuery) ||
        (product.description && product.description.toLowerCase().includes(lowerQuery))
      );
    }

    // Filtro por categoria
    if (categoryFilter !== 'all') {
      result = result.filter(product => product.category === categoryFilter);
    }

    // Filtro por subcategoria
    if (subcategoryFilter !== 'all') {
      result = result.filter(product => product.subcategory === subcategoryFilter);
    }

    console.log('✅ Produtos filtrados:', result.length);
    setFilteredProducts(result);
  }, [products, searchQuery, categoryFilter, subcategoryFilter, speciesFilter]);

  // Handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterClick = (category: ProductCategory | 'all', subcategory: ProductSubcategory | 'all') => {
    setCategoryFilter(category);
    setSubcategoryFilter(subcategory);
    // Limpar filtro de espécie quando mudar categoria manualmente
    setSpeciesFilter(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setSubcategoryFilter('all');
    setSpeciesFilter(null);
  };

  return {
    products,
    filteredProducts,
    searchQuery,
    categoryFilter,
    subcategoryFilter,
    speciesFilter,
    isLoading,
    loadProducts,
    handleSearch,
    handleFilterClick,
    clearFilters
  };
};
