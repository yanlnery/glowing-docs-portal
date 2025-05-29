
import React from "react";

export default function FeaturedProductsLoading() {
  return (
    <section className="py-8 sm:py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-serpente-600"></div>
        </div>
      </div>
    </section>
  );
}
