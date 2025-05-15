import { Product, ProductFormData, ProductImage, ProductCategory, ProductSubcategory, ProductStatus } from "@/types/product";

// In a real application, this would be connected to a backend
// For now, we'll use localStorage to persist data

const STORAGE_KEY = "pet_serpentes_products";

// Helper function to ensure an image object conforms to ProductImage type
const ensureProductImage = (
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

  getById: (id: string): Product | null => {
    try {
      const products = productService.getAll();
      return products.find(product => product.id === id) || null;
    } catch (error) {
      console.error(`Failed to get product with ID ${id}`, error);
      return null;
    }
  },

  getProductById: (id: string): Product | null => {
    return productService.getById(id);
  },

  create: (productData: ProductFormData): Product => {
    try {
      const products = productService.getAll();
      
      const processedImages: ProductImage[] = productData.images?.map(imageInput =>
        ensureProductImage(imageInput as string | Partial<ProductImage>, productData.name || 'Product image')
      ) || [];
      
      const newProduct: Product = {
        ...productData,
        images: processedImages,
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
      
      const existingProduct = products[productIndex];
      // Destructure images from productData to handle them separately
      const { images: incomingImages, ...restOfProductDataFromInput } = productData;

      let processedProductData = { ...restOfProductDataFromInput };

      // If status is being updated, ensure 'available' is consistent
      // and also ensure status is one of the valid ProductStatus types
      if (processedProductData.hasOwnProperty('status') && processedProductData.status !== undefined) {
        const validStatuses: ProductStatus[] = ['disponivel', 'indisponivel', 'vendido'];
        if (validStatuses.includes(processedProductData.status as ProductStatus)) {
            processedProductData.available = processedProductData.status === 'disponivel';
        } else {
            // Handle invalid status if necessary, or rely on type checking
            console.warn(`Invalid status provided: ${processedProductData.status}. Status not changed.`);
            delete processedProductData.status; // Or revert to existingProduct.status
        }
      }

      let finalImages: ProductImage[] | undefined = existingProduct.images; // Default to existing images

      // Check if 'images' property was part of the productData payload
      if (productData.hasOwnProperty('images')) {
        if (Array.isArray(incomingImages) && incomingImages.length > 0) {
          // If a new array of images is provided, process them
          finalImages = incomingImages.map(imageInput =>
            ensureProductImage(
              imageInput as string | Partial<ProductImage>,
              processedProductData.name || existingProduct.name || 'Product image' // Use updated or existing name for alt text
            )
          );
        } else if (incomingImages === null || (Array.isArray(incomingImages) && incomingImages.length === 0)) {
          // If images is explicitly set to null or an empty array, clear them
          finalImages = [];
        }
      }

      const updatedProduct: Product = {
        ...existingProduct,    // Start with the existing product
        ...processedProductData,  // Apply other changes from processedProductData
        images: finalImages,    // Set the processed images
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

  getAvailableProducts: (): Product[] => {
    try {
      const products = productService.getAll();
      
      if (products.length === 0) {
        console.log("No available products found from localStorage, returning dummy products.");
        
        // Return dummy products for demonstration if no real products exist
        return [
          {
            id: "dummy-1",
            name: "Boa Constrictor Amarali",
            speciesName: "Boa constrictor amarali",
            description: "Filhote de Boa Amarali nascido em cativeiro, bem adaptada e se alimentando regularmente.",
            price: 950,
            available: true,
            visible: true,
            featured: true,
            isNew: false,
            status: "disponivel" as ProductStatus,
            category: "serpente" as ProductCategory,
            subcategory: "boideos" as ProductSubcategory,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            images: [
              ensureProductImage(
                "https://images.unsplash.com/photo-1472396961693-142e6e269027",
                "Boa Constrictor Amarali"
              )
            ]
          },
          {
            id: "dummy-2",
            name: "Python Regius (Piton-Real)",
            speciesName: "Python regius",
            description: "Exemplar adulto de Python Regius, saudável e de temperamento dócil.",
            price: 1500,
            available: true,
            visible: true,
            featured: false,
            isNew: false,
            status: "disponivel" as ProductStatus,
            category: "serpente" as ProductCategory,
            subcategory: "boideos" as ProductSubcategory,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            images: [
              ensureProductImage(
                "https://images.unsplash.com/photo-1466721591366-2d5fba72006d",
                "Python Regius"
              )
            ]
          },
          {
            id: "dummy-3",
            name: "Jabuti-piranga",
            speciesName: "Chelonoidis carbonaria",
            description: "Filhote de Jabuti-piranga com registro e documentação completa.",
            price: 650,
            available: true,
            visible: true,
            featured: true,
            isNew: false,
            status: "disponivel" as ProductStatus,
            category: "quelonio" as ProductCategory,
            subcategory: "terrestres" as ProductSubcategory,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            images: [
              ensureProductImage(
                "https://images.unsplash.com/photo-1493962853295-0fd70327578a",
                "Jabuti-piranga"
              )
            ]
          }
        ];
      }
      
      // Atualizado para respeitar estritamente a visibilidade e status
      return products
        .filter(product => 
          // Produto deve estar visível E ter status disponível para aparecer na loja
          product.visible && product.status === 'disponivel'
        )
        .sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (a.order || 0) - (b.order || 0);
        });
    } catch (error) {
      console.error("Failed to get available products", error);
      return [];
    }
  },

  getFeaturedProducts: (): Product[] => {
    try {
      const products = productService.getAll();
      
      if (products.length === 0 || !products.some(p => p.featured)) {
        console.log("No actual featured products found, returning dummy featured products.");
        // Return dummy featured products for demonstration
        return [
          {
            id: "dummy-featured-1",
            name: "Boa Constrictor Amarali",
            speciesName: "Boa constrictor amarali",
            description: "Filhote de Boa Amarali nascido em cativeiro.",
            price: 950,
            available: true,
            visible: true,
            featured: true,
            isNew: false,
            status: "disponivel" as ProductStatus,
            category: "serpente" as ProductCategory,
            subcategory: "boideos" as ProductSubcategory,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            images: [
              ensureProductImage(
                "https://images.unsplash.com/photo-1472396961693-142e6e269027",
                "Boa Constrictor Amarali"
              )
            ]
          },
          {
            id: "dummy-featured-3", 
            name: "Jabuti-piranga",
            speciesName: "Chelonoidis carbonaria",
            description: "Filhote de Jabuti-piranga com registro legal.",
            price: 650,
            available: true,
            visible: true,
            featured: true,
            isNew: false,
            status: "disponivel" as ProductStatus,
            category: "quelonio" as ProductCategory,
            subcategory: "terrestres" as ProductSubcategory,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            images: [
              ensureProductImage(
                "https://images.unsplash.com/photo-1493962853295-0fd70327578a",
                "Jabuti-piranga"
              )
            ]
          }
        ];
      }
      
      // Atualizado para respeitar estritamente a visibilidade e status
      return products
        .filter(product => 
          // Produto deve estar visível, marcado como destacado E ter status disponível
          product.visible && product.featured && product.status === 'disponivel'
        )
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error("Failed to get featured products", error);
      return [];
    }
  }
};
