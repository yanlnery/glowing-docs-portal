
import { Product, ProductFormData, ProductImage, ProductStatus } from "@/types/product";
import { ensureProductImage } from "./utils/productImageUtils";
import { getStoredProducts, saveStoredProducts } from "./productStorage";

// Create a new product
export const createProduct = (productData: ProductFormData): Product => {
  try {
    const products = getStoredProducts();
    
    const processedImages: ProductImage[] = productData.images?.map(imageInput =>
      ensureProductImage(imageInput as string | Partial<ProductImage>, productData.name || 'Product image')
    ) || [];
    
    let status = productData.status || 'disponivel';
    let available = status === 'disponivel';
    
    if (productData.hasOwnProperty('available')) {
      available = !!productData.available;
      status = available ? 'disponivel' : 'indisponivel';
    }
    
    const newProduct: Product = {
      ...productData,
      images: processedImages,
      id: crypto.randomUUID(),
      status: status as ProductStatus,
      available,
      visible: productData.visible !== undefined ? productData.visible : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedProducts = [...products, newProduct];
    saveStoredProducts(updatedProducts);
    return newProduct;
  } catch (error) {
    console.error("Failed to create product", error);
    throw new Error("Failed to create product");
  }
};

// Update an existing product
export const updateProduct = (id: string, productData: Partial<ProductFormData>): Product => {
  try {
    const products = getStoredProducts();
    const productIndex = products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    const existingProduct = products[productIndex];
    const { images: incomingImages, ...restOfProductDataFromInput } = productData;

    let processedProductData = { ...restOfProductDataFromInput };

    if (processedProductData.hasOwnProperty('status')) {
      const validStatuses: ProductStatus[] = ['disponivel', 'indisponivel', 'vendido'];
      const newStatus = processedProductData.status;
      
      if (validStatuses.includes(newStatus as ProductStatus)) {
        processedProductData.available = newStatus === 'disponivel';
      } else {
        console.warn(`Invalid status provided: ${newStatus}. Status not changed.`);
        delete processedProductData.status; // remove invalid status key
      }
    } else if (processedProductData.hasOwnProperty('available')) {
      const isAvailable = !!processedProductData.available;
      processedProductData.status = isAvailable ? 'disponivel' : 'indisponivel';
    }

    let finalImages: ProductImage[] | undefined = existingProduct.images;

    if (productData.hasOwnProperty('images')) {
      if (Array.isArray(incomingImages) && incomingImages.length > 0) {
        finalImages = incomingImages.map(imageInput =>
          ensureProductImage(
            imageInput as string | Partial<ProductImage>,
            processedProductData.name || existingProduct.name || 'Product image'
          )
        );
      } else if (incomingImages === null || (Array.isArray(incomingImages) && incomingImages.length === 0)) {
        finalImages = [];
      }
    }

    const updatedProduct: Product = {
      ...existingProduct,
      ...processedProductData,
      images: finalImages,
      status: processedProductData.status ? processedProductData.status as ProductStatus : existingProduct.status,
      available: processedProductData.hasOwnProperty('available') ? processedProductData.available as boolean : existingProduct.available,
      updatedAt: new Date().toISOString(),
    };
    
    products[productIndex] = updatedProduct;
    saveStoredProducts(products);
    return updatedProduct;
  } catch (error) {
    console.error(`Failed to update product with ID ${id}`, error);
    throw new Error(`Failed to update product with ID ${id}`);
  }
};

// Delete a product
export const deleteProduct = (id: string): boolean => {
  try {
    let products = getStoredProducts();
    const initialLength = products.length;
    products = products.filter(product => product.id !== id);
    
    if (products.length === initialLength) {
      return false; 
    }
    
    saveStoredProducts(products);
    return true;
  } catch (error) {
    console.error(`Failed to delete product with ID ${id}`, error);
    return false;
  }
};
