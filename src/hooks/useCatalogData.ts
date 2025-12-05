
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '@/services/productService';
import { Product, ProductCategory, ProductSubcategory } from '@/types/product';

export const useCatalogData = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState<ProductSubcategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Ler filtro da URL na montagem do componente
  useEffect(() => {
    const categoryParam = searchParams.get('category') as ProductCategory | null;
    if (categoryParam && ['serpente', 'lagarto', 'quelonio'].includes(categoryParam)) {
      setCategoryFilter(categoryParam);
    }
  }, [searchParams]);

  const applyFilters = useCallback((
    productList: Product[],
    query: string,
    category: ProductCategory | 'all',
    subcategory: ProductSubcategory | 'all'
  ) => {
    if (!productList || productList.length === 0) {
      setFilteredProducts([]);
      return;
    }
    
    let result = [...productList];
    
    // Apply search filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.speciesName.toLowerCase().includes(lowerQuery) ||
        (product.description && product.description.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Apply category filter
    if (category !== 'all') {
      result = result.filter(product => product.category === category);
    }
    
    // Apply subcategory filter
    if (subcategory !== 'all') {
      result = result.filter(product => product.subcategory === subcategory);
    }
    
    setFilteredProducts(result);
  }, []);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const visibleProducts = await productService.getAvailableProducts();
      setProducts(visibleProducts);
      applyFilters(visibleProducts, searchQuery, categoryFilter, subcategoryFilter);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [applyFilters, searchQuery, categoryFilter, subcategoryFilter]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(products, query, categoryFilter, subcategoryFilter);
  };

  const handleFilterClick = (category: ProductCategory | 'all', subcategory: ProductSubcategory | 'all') => {
    setCategoryFilter(category);
    setSubcategoryFilter(subcategory);
    applyFilters(products, searchQuery, category, subcategory);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setSubcategoryFilter('all');
    applyFilters(products, '', 'all', 'all');
  };

  return {
    products,
    filteredProducts,
    searchQuery,
    categoryFilter,
    subcategoryFilter,
    isLoading,
    loadProducts,
    handleSearch,
    handleFilterClick,
    clearFilters
  };
};
