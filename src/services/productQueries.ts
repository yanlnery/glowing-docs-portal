
import { Product } from "@/types/product";
import { getStoredProducts } from "./productStorage";

// Get all products
export const getAllProducts = (): Product[] => {
  return getStoredProducts();
};

// Get product by ID
export const getProductById = (id: string): Product | null => {
  try {
    const products = getAllProducts();
    return products.find(product => product.id === id) || null;
  } catch (error) {
    console.error(`Failed to get product with ID ${id}`, error);
    return null;
  }
};

// Get available products (visible and sorted)
export const getAvailableProducts = (): Product[] => {
  try {
    const products = getStoredProducts();
    return products
      .filter(product => product.visible === true)
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (a.order || 0) - (b.order || 0);
      });
  } catch (error) {
    console.error("Failed to get available products", error);
    return [];
  }
};

// Get featured products (visible, featured, and sorted)
export const getFeaturedProducts = (): Product[] => {
  try {
    const products = getStoredProducts();
    return products
      .filter(product => product.visible === true && product.featured === true)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error("Failed to get featured products", error);
    return [];
  }
};
