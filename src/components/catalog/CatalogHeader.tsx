
import React from "react";

export default function CatalogHeader() {
  return (
    <div className="text-center mb-6 sm:mb-8 md:mb-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-balance">Catálogo de Animais</h1>
      <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2 sm:px-0">
        Explore nossa seleção de animais disponíveis para aquisição. Todos com procedência, documentação e saúde garantida.
      </p>
    </div>
  );
}
