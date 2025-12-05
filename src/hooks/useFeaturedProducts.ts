
import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { Product } from "@/types/product";

export function useFeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await productService.getFeaturedProducts();
        const limitedProducts = products.slice(0, 3);
        setFeaturedProducts(limitedProducts);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        setFeaturedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { featuredProducts, isLoading };
}
