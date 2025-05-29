
import React from "react";

export default function FeaturedProductsHeader() {
  return (
    <div className="flex flex-col items-center mb-6 sm:mb-8 md:mb-12 text-center">
      <div className="docs-section-title">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Espécies em Destaque</h2>
      </div>
      <p className="text-muted-foreground max-w-2xl mt-3 sm:mt-4 text-sm sm:text-base">
        Conheça algumas das serpentes e lagartos disponíveis no nosso criadouro, todos com certificação de origem e documentação legal.
      </p>
    </div>
  );
}
