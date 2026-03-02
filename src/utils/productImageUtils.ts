import { Product } from "@/types/product";

/**
 * Normaliza uma URL de imagem do Supabase Storage para servir o arquivo original,
 * sem transformações (width, quality, format).
 * - Remove query params (?width=, ?quality=, ?format=)
 * - Converte /render/image/public/ → /object/public/
 */
export const normalizeStorageUrl = (url: string): string => {
  if (!url) return url;
  // Strip query params
  const base = url.split('?')[0];
  // Convert render endpoint to object endpoint
  return base.replace('/storage/v1/render/image/public/', '/storage/v1/object/public/');
};

// Function to get the first valid image URL from product images
export const getProductImageUrl = (product: Product): string | null => {
  if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
    return null;
  }
  
  const firstImage = product.images[0];
  return firstImage?.url || null;
};
