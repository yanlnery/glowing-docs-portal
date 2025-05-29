
import { 
  getAllProducts, 
  getProductById, 
  getAvailableProducts, 
  getFeaturedProducts 
} from "./productQueries";
import { 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "./productMutations";

export const productService = {
  // Query functions - now async
  getAll: getAllProducts,
  getById: getProductById,
  getProductById: getProductById, // Alias for backward compatibility
  getAvailableProducts: getAvailableProducts,
  getFeaturedProducts: getFeaturedProducts,

  // Mutation functions
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
};
