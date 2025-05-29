
import React from "react";

export default function CatalogEmpty() {
  return (
    <div className="text-center py-8 sm:py-12 px-4">
      <h3 className="text-lg sm:text-xl font-semibold mb-2">Nenhum produto cadastrado</h3>
      <p className="text-muted-foreground mb-4 text-sm sm:text-base">
        Não há animais disponíveis no momento. Verifique o painel administrativo para adicionar produtos.
      </p>
    </div>
  );
}
