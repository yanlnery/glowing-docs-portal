
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

// Transform Supabase row to Product type
const transformSupabaseProduct = (row: any): Product => {
  return {
    id: row.id,
    name: row.name,
    speciesName: row.species_name,
    speciesId: row.species_id,
    description: row.description || '',
    price: parseFloat(row.price) || 0,
    originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
    pixPrice: row.pix_price ? parseFloat(row.pix_price) : undefined,
    category: row.category,
    subcategory: row.subcategory,
    featured: row.featured || false,
    isNew: row.is_new || false,
    available: row.available || false,
    status: row.status || 'disponivel',
    visible: row.visible || false,
    order: row.order_position || 0,
    paymentLink: row.payment_link || '',
    images: Array.isArray(row.images) ? row.images : [],
    details: Array.isArray(row.details) ? row.details : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    meta: row.meta || {}
  };
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    console.log("🔄 Fetching all products from Supabase...");
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('order_position', { ascending: true });

    if (error) {
      console.error("❌ Error fetching products:", error);
      throw error;
    }

    const products = data?.map(transformSupabaseProduct) || [];
    console.log("📦 Products fetched from Supabase:", products.length);
    return products;
  } catch (error) {
    console.error("❌ Failed to get all products", error);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    console.log(`🔄 Fetching product ${id} from Supabase...`);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`❌ Error fetching product ${id}:`, error);
      return null;
    }

    if (!data) {
      console.log(`📭 Product ${id} not found`);
      return null;
    }

    const product = transformSupabaseProduct(data);
    console.log(`✅ Product ${id} fetched from Supabase`);
    return product;
  } catch (error) {
    console.error(`❌ Failed to get product with ID ${id}`, error);
    return null;
  }
};

// Get available products (visible and sorted)
export const getAvailableProducts = async (): Promise<Product[]> => {
  try {
    console.log("🔄 Fetching available products from Supabase...");
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('visible', true)
      .order('featured', { ascending: false })
      .order('order_position', { ascending: true });

    if (error) {
      console.error("❌ Error fetching available products:", error);
      throw error;
    }

    const products = data?.map(transformSupabaseProduct) || [];
    console.log("📦 Available products fetched from Supabase:", products.length);
    return products;
  } catch (error) {
    console.error("❌ Failed to get available products", error);
    return [];
  }
};

// Get featured products (visible, featured, and sorted)
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    console.log("🔄 Fetching featured products from Supabase...");
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('visible', true)
      .eq('featured', true)
      .order('order_position', { ascending: true });

    if (error) {
      console.error("❌ Error fetching featured products:", error);
      throw error;
    }

    const products = data?.map(transformSupabaseProduct) || [];
    console.log("📦 Featured products fetched from Supabase:", products.length);
    return products;
  } catch (error) {
    console.error("❌ Failed to get featured products", error);
    return [];
  }
};
