
import { Product } from "@/types/product";

// Function to get the first valid image URL from product images
export const getProductImageUrl = (product: Product): string | null => {
  if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
    return null;
  }
  
  const firstImage = product.images[0];
  return firstImage?.url || null;
};
