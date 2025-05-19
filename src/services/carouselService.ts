
import { supabase } from '@/integrations/supabase/client';

export interface CarouselImage {
  id: string; // UUID from Supabase
  url: string | null; // Mapped from image_url
  alt: string;    // Mapped from alt_text
  order: number;  // Mapped from item_order
  title?: string;
  subtitle?: string;
}

// Interface for DB row, closer to table structure
export interface CarouselItemDB {
  id: string;
  image_url: string | null;
  alt_text: string;
  title?: string | null;
  subtitle?: string | null;
  item_order: number;
  created_at?: string;
  updated_at?: string;
}

const CAROUSEL_ITEMS_TABLE = 'carousel_items';
const CAROUSEL_IMAGES_BUCKET = 'carousel_images_bucket'; // Matches SQL

// Fetch all carousel images, ordered
export const getCarouselImages = async (): Promise<CarouselImage[]> => {
  const { data, error } = await supabase
    .from(CAROUSEL_ITEMS_TABLE)
    .select('*')
    .order('item_order', { ascending: true });

  if (error) {
    console.error("Error fetching carousel images:", error);
    return [];
  }
  return data.map(item => ({
    id: item.id,
    url: item.image_url,
    alt: item.alt_text,
    order: item.item_order,
    title: item.title || undefined,
    subtitle: item.subtitle || undefined,
  } as CarouselImage));
};

// Upload image to Supabase Storage
export const uploadCarouselImageFile = async (file: File): Promise<string | null> => {
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const filePath = `public/${fileName}`; // public folder inside bucket

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(CAROUSEL_IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // Overwrite if file with same name exists
    });

  if (uploadError) {
    console.error('Error uploading carousel image:', uploadError);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from(CAROUSEL_IMAGES_BUCKET)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

// Delete image from Supabase Storage
export const deleteCarouselImageFile = async (imageUrl: string | null): Promise<boolean> => {
  if (!imageUrl) return true; // No image to delete

  // Extract file path from URL. Example: https://<project-ref>.supabase.co/storage/v1/object/public/carousel_images_bucket/public/image.png
  // Path becomes: public/image.png
  const bucketBaseUrlPart = `${CAROUSEL_IMAGES_BUCKET}/`;
  const pathStartIndex = imageUrl.indexOf(bucketBaseUrlPart);

  if (pathStartIndex === -1) {
    console.warn("Could not determine file path from URL for deletion:", imageUrl);
    return false;
  }
  const filePath = imageUrl.substring(pathStartIndex + bucketBaseUrlPart.length);

  const { error } = await supabase.storage
    .from(CAROUSEL_IMAGES_BUCKET)
    .remove([filePath]);

  if (error) {
    console.error('Error deleting carousel image from storage:', error);
    return false;
  }
  return true;
};

// Add a new carousel item to the DB
export const addCarouselItem = async (itemData: Omit<CarouselItemDB, 'id' | 'created_at' | 'updated_at'>): Promise<CarouselItemDB | null> => {
  const { data, error } = await supabase
    .from(CAROUSEL_ITEMS_TABLE)
    .insert(itemData)
    .select()
    .single();

  if (error) {
    console.error("Error adding carousel item:", error);
    return null;
  }
  return data;
};

// Update an existing carousel item in the DB
export const updateCarouselItem = async (id: string, itemData: Partial<Omit<CarouselItemDB, 'id' | 'created_at' | 'updated_at'>>): Promise<CarouselItemDB | null> => {
  const payload = { ...itemData, updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from(CAROUSEL_ITEMS_TABLE)
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating carousel item:", error);
    return null;
  }
  return data;
};

// Delete a carousel item from the DB (and its image from storage)
export const deleteCarouselItem = async (id: string): Promise<boolean> => {
  // First, get the item to find its image URL for deletion from storage
  const { data: itemToDelete, error: fetchError } = await supabase
    .from(CAROUSEL_ITEMS_TABLE)
    .select('image_url')
    .eq('id', id)
    .single();

  if (fetchError || !itemToDelete) {
    console.error("Error fetching item for deletion or item not found:", fetchError);
    // If item not found in DB, proceed to try deleting from DB anyway (maybe it was already removed from storage)
  } else if (itemToDelete.image_url) {
    await deleteCarouselImageFile(itemToDelete.image_url);
    // We don't necessarily block DB deletion if storage deletion fails, but log it.
  }

  const { error: deleteDbError } = await supabase
    .from(CAROUSEL_ITEMS_TABLE)
    .delete()
    .eq('id', id);

  if (deleteDbError) {
    console.error("Error deleting carousel item from DB:", deleteDbError);
    return false;
  }
  return true;
};

// Reorder carousel items (complex, might need a batch update or dedicated function)
// For now, individual order updates are handled by `updateCarouselItem`.
// A full reorder (like drag-and-drop) would typically involve updating `item_order` for multiple items.
// The AdminCarousel.tsx handles this by sorting and then saving all items via a loop if `saveCarouselImages` was used.
// With Supabase, it's better to update only changed items.
// The current `AdminCarousel.tsx` `handleMove` updates order properties and then calls saveCarouselImages, which we're removing.
// `AdminCarousel.tsx` `handleMove` should now directly call `updateCarouselItem` for the two swapped items.

export const updateCarouselItemsOrder = async (items: { id: string, item_order: number }[]): Promise<boolean> => {
  const updates = items.map(item =>
    supabase
      .from(CAROUSEL_ITEMS_TABLE)
      .update({ item_order: item.item_order, updated_at: new Date().toISOString() })
      .eq('id', item.id)
  );

  const results = await Promise.all(updates);
  const errors = results.filter(res => res.error);

  if (errors.length > 0) {
    errors.forEach(err => console.error("Error updating item order:", err.error));
    return false;
  }
  return true;
};

