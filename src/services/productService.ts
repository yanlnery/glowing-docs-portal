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
      
      // Ensure status and available are aligned
      let status = productData.status || 'disponivel';
      let available = status === 'disponivel';
      
      if (productData.hasOwnProperty('available')) {
        // If available is explicitly set, use it to set status
        available = !!productData.available;
        status = available ? 'disponivel' : 'indisponivel';
      }
      
      const newProduct: Product = {
        ...productData,
        images: processedImages,
        id: crypto.randomUUID(),
        status,
        available,
        visible: productData.visible !== undefined ? productData.visible : true,
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

      // Handle status and available fields to ensure they're consistent
      if (processedProductData.hasOwnProperty('status')) {
        const validStatuses: ProductStatus[] = ['disponivel', 'indisponivel', 'vendido'];
        const newStatus = processedProductData.status;
        
        if (validStatuses.includes(newStatus as ProductStatus)) {
          // Update available based on new status
          processedProductData.available = newStatus === 'disponivel';
          console.log(`Updating product ${id} with status: ${newStatus}, available: ${processedProductData.available}`);
        } else {
          console.warn(`Invalid status provided: ${newStatus}. Status not changed.`);
          delete processedProductData.status;
        }
      } 
      // If available is explicitly set but status is not
      else if (processedProductData.hasOwnProperty('available')) {
        const isAvailable = !!processedProductData.available;
        // Set status based on available
        processedProductData.status = isAvailable ? 'disponivel' : 'indisponivel';
        console.log(`Updating product ${id} with available: ${isAvailable}, status: ${processedProductData.status}`);
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
      
      // Filter by visibility, regardless of status
      return products
        .filter(product => 
          product.visible === true
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
      
      // Filter by visibility and featured flag, regardless of status
      return products
        .filter(product => 
          product.visible === true && product.featured === true
        )
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error("Failed to get featured products", error);
      return [];
    }
  }
};
