
import React, { useEffect } from 'react';
import { useCatalogData } from '@/hooks/useCatalogData';
import CatalogHeader from '@/components/catalog/CatalogHeader';
import CatalogFilters from '@/components/catalog/CatalogFilters';
import CatalogLoading from '@/components/catalog/CatalogLoading';
import CatalogEmpty from '@/components/catalog/CatalogEmpty';
import CatalogNoResults from '@/components/catalog/CatalogNoResults';
import CatalogProductsGrid from '@/components/catalog/CatalogProductsGrid';

const Catalog = () => {
  const {
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
  } = useCatalogData();

  // Debug logs para verificar hidratação
  useEffect(() => {
    console.log("📱 CATALOG MOUNT CHECK:", {
      windowExists: typeof window !== "undefined",
      windowWidth: typeof window !== "undefined" ? window.innerWidth : "undefined",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "undefined",
      isMobile: typeof window !== "undefined" && window.innerWidth < 768
    });
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 sm:px-6">
      <CatalogHeader />

      <CatalogFilters
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        subcategoryFilter={subcategoryFilter}
        onSearchChange={handleSearch}
        onFilterClick={handleFilterClick}
      />

      {/* Products Grid */}
      {isLoading ? (
        <CatalogLoading />
      ) : products.length === 0 ? (
        <CatalogEmpty />
      ) : filteredProducts.length === 0 ? (
        <CatalogNoResults onClearFilters={clearFilters} />
      ) : (
        <CatalogProductsGrid products={filteredProducts} />
      )}
    </div>
  );
};

export default Catalog;
