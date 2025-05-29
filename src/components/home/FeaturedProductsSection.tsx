
import React from "react";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import FeaturedProductsLoading from "./FeaturedProductsLoading";
import FeaturedProductsHeader from "./FeaturedProductsHeader";
import FeaturedProductsGrid from "./FeaturedProductsGrid";
import FeaturedProductsCTA from "./FeaturedProductsCTA";

export default function FeaturedProductsSection() {
  const { featuredProducts, isLoading } = useFeaturedProducts();

  if (isLoading) {
    return <FeaturedProductsLoading />;
  }

  return (
    <section className="py-8 sm:py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <FeaturedProductsHeader />
        <FeaturedProductsGrid products={featuredProducts} />
        <FeaturedProductsCTA />
      </div>
    </section>
  );
}
