import React, { useEffect } from 'react';
import { SEO } from '@/components/SEO';
import { useCatalogData } from '@/hooks/useCatalogData';
import CatalogHeader from '@/components/catalog/CatalogHeader';
import CatalogFilters from '@/components/catalog/CatalogFilters';
import CatalogLoading from '@/components/catalog/CatalogLoading';
import CatalogEmpty from '@/components/catalog/CatalogEmpty';
import CatalogNoResults from '@/components/catalog/CatalogNoResults';
import CatalogProductsGrid from '@/components/catalog/CatalogProductsGrid';
import { Sprout } from 'lucide-react';
import { isHomeAnimalAvailable, needsUpcomingLitters } from '@/lib/homeConversion';
import SpeciesWaitlistInvitation from '@/components/species/SpeciesWaitlistInvitation';

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

  const availableCount = filteredProducts.filter(isHomeAnimalAvailable).length;
  const waitlistInvitation = !isLoading && needsUpcomingLitters(availableCount) ? (
    <section className={`upcoming-litters ${availableCount === 0 ? 'mb-6' : 'mt-6'} flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6`}>
      <div className="flex items-start gap-3"><Sprout className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" /><div><h2 className="text-xl font-bold">Próximas ninhadas no fim do ano</h2><p className="mt-2 text-sm text-muted-foreground">Entre na lista e seja avisado quando houver novos filhotes.</p></div></div>
      <SpeciesWaitlistInvitation />
    </section>
  ) : null;

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
    <>
      <SEO
        title="Catálogo de Répteis | Pet Serpentes & Companhia"
        description="Confira nosso catálogo de répteis silvestres nativos disponíveis. Serpentes, lagartos e quelônios com procedência legal, certificados pelo IBAMA."
        canonical="/catalogo"
      />
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
      {availableCount === 0 && waitlistInvitation}
      {isLoading ? (
        <CatalogLoading />
      ) : products.length === 0 ? (
        <CatalogEmpty />
      ) : filteredProducts.length === 0 ? (
        <CatalogNoResults onClearFilters={clearFilters} />
      ) : (
        <CatalogProductsGrid products={filteredProducts} />
      )}
      {availableCount > 0 && waitlistInvitation}
      </div>
    </>
  );
};

export default Catalog;
