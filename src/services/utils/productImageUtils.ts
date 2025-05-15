
import { ProductImage } from "@/types/product";

// Helper function to ensure an image object conforms to ProductImage type
export const ensureProductImage = (
  img: string | Partial<ProductImage>, // Can receive a URL string or a partial image object
  defaultAltText: string
): ProductImage => {
  if (typeof img === 'string') {
    // If img is just a URL string
    const url = img;
    const filename = url.split('/').pop() || 'unknown_image.jpg';
    return {
      id: crypto.randomUUID(),
      url,
      filename,
      alt: defaultAltText,
    };
  }

  // If img is an object, ensure all required fields are present
  const url = img.url || '/placeholder.svg'; // Provide a fallback URL if missing
  const filename = img.filename || url.split('/').pop() || 'unknown_image.jpg';
  const id = img.id || crypto.randomUUID();
  const alt = img.alt || (img as any).altText || defaultAltText; // Kept altText for potential backward compatibility from data

  return { id, url, filename, alt };
};
