
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

// Helper to check if string is a valid UUID
const isUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// Get product by ID or Slug
export const getProductById = async (idOrSlug: string): Promise<Product | null> => {
  try {
    console.log(`🔄 Fetching product ${idOrSlug} from Supabase...`);
    
    // Determine if we're searching by UUID or slug
    const isIdSearch = isUUID(idOrSlug);
    const column = isIdSearch ? 'id' : 'slug';
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq(column, idOrSlug)
      .maybeSingle();

    if (error) {
      console.error(`❌ Error fetching product ${idOrSlug}:`, error);
      return null;
    }

    if (!data) {
      console.log(`📭 Product ${idOrSlug} not found`);
      return null;
    }

    const product = transformSupabaseProduct(data);
    console.log(`✅ Product ${idOrSlug} fetched from Supabase`);
    return product;
  } catch (error) {
    console.error(`❌ Failed to get product with ID/slug ${idOrSlug}`, error);
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
