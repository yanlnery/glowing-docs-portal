
import { Product } from "@/types/product";

const STORAGE_KEY = "pet_serpentes_products";

export const getStoredProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get products from storage", error);
    return [];
  }
};

export const saveStoredProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Failed to save products to storage", error);
    // Depending on requirements, you might want to re-throw or handle this more gracefully
  }
};
