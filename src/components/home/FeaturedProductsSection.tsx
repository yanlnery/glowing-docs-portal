
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { productService } from "@/services/productService";
import { Product } from "@/types/product";

export default function FeaturedProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const products = productService.getFeaturedProducts().slice(0, 3);
    setFeaturedProducts(products);
  }, []);

  return (
    <section className="py-10 sm:py-16 bg-background">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col items-center mb-8 sm:mb-12 text-center">
          <div className="docs-section-title">
            <h2 className="text-2xl sm:text-3xl font-bold">Espécies em Destaque</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mt-4">
            Conheça algumas das serpentes e lagartos disponíveis no nosso criadouro, todos com certificação de origem e documentação legal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <div key={product.id} className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
                <div className="relative h-48 sm:h-64 overflow-hidden">
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    {product.status === 'disponivel' ? (
                      <span className="inline-block bg-serpente-600 text-white text-xs px-2 py-1 rounded">Disponível</span>
                    ) : (
                      <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded">Indisponível</span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1"><em>{product.speciesName}</em></h3>
                  <p className="text-muted-foreground text-sm mb-3">{product.name}</p>
                  <div className="flex justify-end items-center">
                    <Button
                      variant={product.status === 'indisponivel' ? "secondary" : "outline"}
                      size="sm"
                      className="min-h-[44px] w-full sm:w-auto"
                      asChild
                      disabled={product.status === 'indisponivel'}
                    >
                      <Link to={`/produtos/${product.id}`}>
                        {product.status === 'indisponivel' ? 'Esgotado' : 'Ver Detalhes'}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">Nenhum animal em destaque disponível no momento.</p>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-8 sm:mt-10">
          <Button size="lg" className="min-h-[44px] w-full sm:w-auto" asChild>
            <Link to="/catalogo">Ver Catálogo Completo <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
