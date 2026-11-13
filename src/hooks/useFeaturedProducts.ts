
import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { Product } from "@/types/product";
import { isHomeAnimalAvailable } from "@/lib/homeConversion";

export function useFeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await productService.getFeaturedProducts();
        const limitedProducts = products.filter(isHomeAnimalAvailable).slice(0, 10);
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
