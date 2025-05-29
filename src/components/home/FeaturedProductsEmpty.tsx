
import React from "react";

export default function FeaturedProductsEmpty() {
  return (
    <div className="col-span-full text-center py-8 sm:py-12">
      <p className="text-muted-foreground text-sm sm:text-base">Nenhum animal em destaque disponível no momento.</p>
      <p className="text-xs sm:text-sm text-muted-foreground mt-2">Verifique o painel administrativo para adicionar produtos em destaque.</p>
    </div>
  );
}
