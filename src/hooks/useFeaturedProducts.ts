
import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { Product } from "@/types/product";

export function useFeaturedProducts() {
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
    const loadProducts = async () => {
      try {
        console.log("📱 Mobile rendering? Window width:", typeof window !== "undefined" ? window.innerWidth : "No window");
        console.log("🔄 Carregando produtos em destaque do Supabase...");
        const products = await productService.getFeaturedProducts();
        const limitedProducts = products.slice(0, 3);
        console.log("📦 Produtos carregados:", limitedProducts.length);
        console.log("📦 Produtos detalhes:", limitedProducts.map(p => ({ id: p.id, name: p.name, visible: p.visible, featured: p.featured })));
        setFeaturedProducts(limitedProducts);
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

  return { featuredProducts, isLoading };
}
