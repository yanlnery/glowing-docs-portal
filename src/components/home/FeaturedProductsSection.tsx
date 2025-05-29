
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { productService } from "@/services/productService";
import { Product } from "@/types/product";

export default function FeaturedProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Debug logs para verificar hidratação e window object
  useEffect(() => {
    console.log("📱 FeaturedProductsSection MOUNT CHECK:", {
      windowExists: typeof window !== "undefined",
      windowWidth: typeof window !== "undefined" ? window.innerWidth : "undefined",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "undefined",
      isMobile: typeof window !== "undefined" && window.innerWidth < 768
    });
  }, []);

  useEffect(() => {
    const loadProducts = () => {
      try {
        console.log("📱 Mobile rendering? Window width:", typeof window !== "undefined" ? window.innerWidth : "No window");
        console.log("🔄 Carregando produtos em destaque...");
        const products = productService.getFeaturedProducts().slice(0, 3);
        console.log("📦 Produtos carregados:", products.length);
        console.log("📦 Produtos detalhes:", products.map(p => ({ id: p.id, name: p.name, visible: p.visible, featured: p.featured })));
        setFeaturedProducts(products);
      } catch (error) {
        console.error("❌ Erro ao carregar produtos:", error);
        setFeaturedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Log adicional para verificar render do mobile
  useEffect(() => {
    console.log("📱 Render mobile section - produtos count:", featuredProducts?.length);
    console.log("📱 Featured products data:", featuredProducts);
  }, [featuredProducts]);

  console.log("🔍 FeaturedProductsSection render:", { 
    isLoading, 
    featuredProductsCount: featuredProducts.length,
    featuredProducts: featuredProducts.map(p => p.name)
  });

  if (isLoading) {
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

  return (
    <section className="py-8 sm:py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center mb-6 sm:mb-8 md:mb-12 text-center">
          <div className="docs-section-title">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Espécies em Destaque</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mt-3 sm:mt-4 text-sm sm:text-base">
            Conheça algumas das serpentes e lagartos disponíveis no nosso criadouro, todos com certificação de origem e documentação legal.
          </p>
        </div>

        {/* Grid com debug styles forçados e logs específicos */}
        <div 
          className="w-full min-h-[300px] grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8"
          style={{ 
            minHeight: "300px", 
            height: "auto",
            overflow: "visible",
            zIndex: 1 
          }}
          onLoad={() => console.log("📱 Grid container loaded")}
        >
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product, index) => {
              console.log(`📱 MOBILE - Renderizando produto ${index}:`, { 
                id: product.id, 
                name: product.name, 
                hasImages: product.images && product.images.length > 0,
                imageUrl: product.images && product.images.length > 0 ? product.images[0].url : 'none'
              });
              
              return (
                <div 
                  key={product.id} 
                  className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group w-full"
                  style={{
                    minHeight: "200px",
                    height: "auto",
                    overflow: "visible"
                  }}
                  onLoad={() => console.log(`📱 Product ${index} container loaded`)}
                >
                  <div 
                    className="relative overflow-hidden"
                    style={{
                      height: "160px",
                      minHeight: "160px",
                      width: "100%"
                    }}
                  >
                    <OptimizedImage
                      src={product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"}
                      alt={product.name}
                      priority={index === 0}
                      quality={80}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="w-full h-full"
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                        width: "100%",
                        height: "100%",
                        transform: "scale(1)",
                        transition: "transform 0.3s ease"
                      }}
                      onLoad={() => console.log(`✅ MOBILE - Produto ${product.name} imagem carregada na home`)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
                      {product.status === 'disponivel' ? (
                        <span className="inline-block bg-serpente-600 text-white text-xs px-2 py-1 rounded">Disponível</span>
                      ) : (
                        <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded">Indisponível</span>
                      )}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 line-clamp-1">
                      <em>{product.speciesName}</em>
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-1">{product.name}</p>
                    <div className="flex justify-end items-center">
                      <Button
                        variant={product.status === 'indisponivel' ? "secondary" : "outline"}
                        size="sm"
                        className="min-h-[40px] sm:min-h-[44px] w-full sm:w-auto text-xs sm:text-sm touch-manipulation"
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
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 sm:py-12">
              <p className="text-muted-foreground text-sm sm:text-base">Nenhum animal em destaque disponível no momento.</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">Verifique o painel administrativo para adicionar produtos em destaque.</p>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
          <Button size="lg" className="min-h-[44px] w-full sm:w-auto text-sm sm:text-base touch-manipulation" asChild>
            <Link to="/catalogo">Ver Catálogo Completo <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
