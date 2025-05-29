
import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/productService';
import { Product, ProductCategory, ProductSubcategory } from '@/types/product';

export const useCatalogData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState<ProductSubcategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const applyFilters = useCallback((
    productList: Product[],
    query: string,
    category: ProductCategory | 'all',
    subcategory: ProductSubcategory | 'all'
  ) => {
    console.log("🔄 Aplicando filtros:", { totalProducts: productList.length, query, category, subcategory });
    
    if (!productList || productList.length === 0) {
      console.log("📭 Nenhum produto para filtrar");
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
    
    console.log(`✅ Filtros aplicados: ${result.length} produtos restantes`);
    setFilteredProducts(result);
  }, []);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    console.log("📱 Catalog Mobile rendering? Window width:", typeof window !== "undefined" ? window.innerWidth : "No window");
    console.log("🔄 Carregando produtos do catálogo do Supabase...");
    try {
      const visibleProducts = await productService.getAvailableProducts();
      console.log("📦 Produtos carregados:", visibleProducts.length);
      console.log("📱 CATALOG - produtos visíveis:", visibleProducts.map(p => ({ id: p.id, name: p.name, visible: p.visible })));
      setProducts(visibleProducts);
      applyFilters(visibleProducts, searchQuery, categoryFilter, subcategoryFilter);
    } catch (error) {
      console.error("❌ Erro ao carregar produtos:", error);
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
