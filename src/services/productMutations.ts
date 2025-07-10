
import { Product, ProductFormData, ProductImage, ProductStatus } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { ensureProductImage } from "./utils/productImageUtils";

// Transform Product to Supabase format
const transformToSupabaseProduct = (productData: ProductFormData) => {
  const processedImages: ProductImage[] = productData.images?.map(imageInput =>
    ensureProductImage(imageInput as string | Partial<ProductImage>, productData.name || 'Product image')
  ) || [];
  
  let status = productData.status || 'disponivel';
  let available = status === 'disponivel';
  
  if (productData.hasOwnProperty('available')) {
    available = !!productData.available;
    status = available ? 'disponivel' : 'indisponivel';
  }

  return {
    name: productData.name,
    species_name: productData.speciesName,
    species_id: productData.speciesId || null,
    description: productData.description || '',
    price: productData.price || 0,
    category: productData.category,
    subcategory: productData.subcategory,
    featured: productData.featured || false,
    is_new: productData.isNew || false,
    available,
    status: status as ProductStatus,
    visible: productData.visible !== undefined ? productData.visible : true,
    order_position: productData.order || 0,
    payment_link: productData.paymentLink || null,
    images: processedImages as any,
    details: (productData.details || []) as any,
    meta: (productData.meta || {}) as any
  };
};

// Create a new product
export const createProduct = async (productData: ProductFormData): Promise<Product> => {
  try {
    console.log("🔄 Creating product in Supabase...", productData);
    
    const supabaseData = transformToSupabaseProduct(productData);
    
    const { data, error } = await supabase
      .from('products')
      .insert(supabaseData)
      .select()
      .single();

    if (error) {
      console.error("❌ Error creating product:", error);
      throw error;
    }

    console.log("✅ Product created successfully:", data);
    return {
      id: data.id,
      name: data.name,
      speciesName: data.species_name,
      speciesId: data.species_id,
      description: data.description || '',
      price: Number(data.price) || 0,
      category: data.category as any,
      subcategory: data.subcategory as any,
      featured: data.featured || false,
      isNew: data.is_new || false,
      available: data.available || false,
      status: (data.status as any) || 'disponivel',
      visible: data.visible || false,
      order: data.order_position || 0,
      paymentLink: data.payment_link || '',
      images: Array.isArray(data.images) ? (data.images as any) : [],
      details: Array.isArray(data.details) ? (data.details as any) : [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      meta: (data.meta as any) || {}
    };
  } catch (error) {
    console.error("Failed to create product", error);
    throw new Error("Failed to create product");
  }
};

// Update an existing product
export const updateProduct = async (id: string, productData: Partial<ProductFormData>): Promise<Product> => {
  try {
    console.log(`🔄 Updating product ${id} in Supabase...`, productData);
    
    const { images: incomingImages, ...restOfProductData } = productData;

    let processedProductData: any = { ...restOfProductData };

    if (processedProductData.hasOwnProperty('status')) {
      const validStatuses: ProductStatus[] = ['disponivel', 'indisponivel', 'vendido'];
      const newStatus = processedProductData.status;
      
      if (validStatuses.includes(newStatus as ProductStatus)) {
        processedProductData.available = newStatus === 'disponivel';
      } else {
        console.warn(`Invalid status provided: ${newStatus}. Status not changed.`);
        delete processedProductData.status;
      }
    } else if (processedProductData.hasOwnProperty('available')) {
      const isAvailable = !!processedProductData.available;
      processedProductData.status = isAvailable ? 'disponivel' : 'indisponivel';
    }

    // Process images if provided
    if (productData.hasOwnProperty('images')) {
      if (Array.isArray(incomingImages) && incomingImages.length > 0) {
        processedProductData.images = incomingImages.map(imageInput =>
          ensureProductImage(
            imageInput as string | Partial<ProductImage>,
            processedProductData.name || 'Product image'
          )
        );
      } else if (incomingImages === null || (Array.isArray(incomingImages) && incomingImages.length === 0)) {
        processedProductData.images = [];
      }
    }

    // Transform field names for Supabase
    const supabaseUpdate: any = {};
    if (processedProductData.name !== undefined) supabaseUpdate.name = processedProductData.name;
    if (processedProductData.speciesName !== undefined) supabaseUpdate.species_name = processedProductData.speciesName;
    if (processedProductData.speciesId !== undefined) supabaseUpdate.species_id = processedProductData.speciesId;
    if (processedProductData.description !== undefined) supabaseUpdate.description = processedProductData.description;
    if (processedProductData.price !== undefined) supabaseUpdate.price = processedProductData.price;
    if (processedProductData.category !== undefined) supabaseUpdate.category = processedProductData.category;
    if (processedProductData.subcategory !== undefined) supabaseUpdate.subcategory = processedProductData.subcategory;
    if (processedProductData.featured !== undefined) supabaseUpdate.featured = processedProductData.featured;
    if (processedProductData.isNew !== undefined) supabaseUpdate.is_new = processedProductData.isNew;
    if (processedProductData.available !== undefined) supabaseUpdate.available = processedProductData.available;
    if (processedProductData.status !== undefined) supabaseUpdate.status = processedProductData.status;
    if (processedProductData.visible !== undefined) supabaseUpdate.visible = processedProductData.visible;
    if (processedProductData.order !== undefined) supabaseUpdate.order_position = processedProductData.order;
    if (processedProductData.paymentLink !== undefined) supabaseUpdate.payment_link = processedProductData.paymentLink;
    if (processedProductData.images !== undefined) supabaseUpdate.images = processedProductData.images;
    if (processedProductData.details !== undefined) supabaseUpdate.details = processedProductData.details;
    if (processedProductData.meta !== undefined) supabaseUpdate.meta = processedProductData.meta;

    const { data, error } = await supabase
      .from('products')
      .update(supabaseUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`❌ Error updating product ${id}:`, error);
      throw error;
    }

    if (!data) {
      throw new Error(`Product with ID ${id} not found`);
    }

    console.log(`✅ Product ${id} updated successfully`);
    return {
      id: data.id,
      name: data.name,
      speciesName: data.species_name,
      speciesId: data.species_id,
      description: data.description || '',
      price: Number(data.price) || 0,
      category: data.category as any,
      subcategory: data.subcategory as any,
      featured: data.featured || false,
      isNew: data.is_new || false,
      available: data.available || false,
      status: (data.status as any) || 'disponivel',
      visible: data.visible || false,
      order: data.order_position || 0,
      paymentLink: data.payment_link || '',
      images: Array.isArray(data.images) ? (data.images as any) : [],
      details: Array.isArray(data.details) ? (data.details as any) : [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      meta: (data.meta as any) || {}
    };
  } catch (error) {
    console.error(`Failed to update product with ID ${id}`, error);
    throw new Error(`Failed to update product with ID ${id}`);
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    console.log(`🔄 Deleting product ${id} from Supabase...`);
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`❌ Error deleting product ${id}:`, error);
      return false;
    }

    console.log(`✅ Product ${id} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`Failed to delete product with ID ${id}`, error);
    return false;
  }
};

// Mark product as sold (set status to 'vendido' and available to false)
export const markProductAsSold = async (id: string): Promise<Product | null> => {
  try {
    console.log(`🔄 Marking product ${id} as sold...`);
    
    const { data, error } = await supabase
      .from('products')
      .update({ 
        status: 'vendido',
        available: false
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`❌ Error marking product ${id} as sold:`, error);
      return null;
    }

    console.log(`✅ Product ${id} marked as sold`);
    return {
      id: data.id,
      name: data.name,
      speciesName: data.species_name,
      speciesId: data.species_id,
      description: data.description || '',
      price: Number(data.price) || 0,
      category: data.category as any,
      subcategory: data.subcategory as any,
      featured: data.featured || false,
      isNew: data.is_new || false,
      available: data.available || false,
      status: (data.status as any) || 'disponivel',
      visible: data.visible || false,
      order: data.order_position || 0,
      paymentLink: data.payment_link || '',
      images: Array.isArray(data.images) ? (data.images as any) : [],
      details: Array.isArray(data.details) ? (data.details as any) : [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      meta: (data.meta as any) || {}
    };
  } catch (error) {
    console.error(`Failed to mark product ${id} as sold`, error);
    return null;
  }
};
