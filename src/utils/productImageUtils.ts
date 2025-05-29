
import { Product } from "@/types/product";

// Function to get the first valid image URL from product images
export const getProductImageUrl = (product: Product): string | null => {
  console.log(`🖼️ HOME - Verificando imagens para produto ${product.name}:`, product.images);
  
  if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
    console.log(`❌ HOME - Produto ${product.name} não tem imagens`);
    return null;
  }
  
  const firstImage = product.images[0];
  const imageUrl = firstImage?.url || null;
  
  console.log(`🖼️ HOME - URL da primeira imagem do produto ${product.name}:`, imageUrl);
  return imageUrl;
};
