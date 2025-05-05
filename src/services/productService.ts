
import { Product, ProductFormData } from "@/types/product";

// In a real application, this would be connected to a backend
// For now, we'll use localStorage to persist data

const STORAGE_KEY = "pet_serpentes_products";

export const productService = {
  // Get all products
  getAll: (): Product[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to get products", error);
      return [];
    }
  },

  // Get product by ID
  getById: (id: string): Product | null => {
    try {
      const products = productService.getAll();
      return products.find(product => product.id === id) || null;
    } catch (error) {
      console.error(`Failed to get product with ID ${id}`, error);
      return null;
    }
  },

  // Create new product
  create: (productData: ProductFormData): Product => {
    try {
      const products = productService.getAll();
      const newProduct: Product = {
        ...productData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedProducts = [...products, newProduct];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
      return newProduct;
    } catch (error) {
      console.error("Failed to create product", error);
      throw new Error("Failed to create product");
    }
  },

  // Update existing product
  update: (id: string, productData: Partial<ProductFormData>): Product => {
    try {
      const products = productService.getAll();
      const productIndex = products.findIndex(product => product.id === id);
      
      if (productIndex === -1) {
        throw new Error(`Product with ID ${id} not found`);
      }
      
      const updatedProduct = {
        ...products[productIndex],
        ...productData,
        updatedAt: new Date().toISOString(),
      };
      
      products[productIndex] = updatedProduct;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      return updatedProduct;
    } catch (error) {
      console.error(`Failed to update product with ID ${id}`, error);
      throw new Error(`Failed to update product with ID ${id}`);
    }
  },

  // Delete product
  delete: (id: string): boolean => {
    try {
      let products = productService.getAll();
      const initialLength = products.length;
      products = products.filter(product => product.id !== id);
      
      if (products.length === initialLength) {
        return false; // No product was removed
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      return true;
    } catch (error) {
      console.error(`Failed to delete product with ID ${id}`, error);
      return false;
    }
  },

  // Get available products for the public site
  getAvailableProducts: (): Product[] => {
    try {
      const products = productService.getAll();
      return products
        .filter(product => product.visible && product.status === 'disponivel')
        .sort((a, b) => {
          // Sort by featured first, then by order
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.order - b.order;
        });
    } catch (error) {
      console.error("Failed to get available products", error);
      return [];
    }
  },

  // Get featured products
  getFeaturedProducts: (): Product[] => {
    try {
      const products = productService.getAll();
      return products
        .filter(product => product.visible && product.featured && product.status === 'disponivel')
        .sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error("Failed to get featured products", error);
      return [];
    }
  }
};
