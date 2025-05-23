
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type CarouselItem = Tables<'carousel_items'>;
export type CarouselInsert = TablesInsert<'carousel_items'>;
export type CarouselUpdate = TablesUpdate<'carousel_items'>;

export async function fetchCarouselItems(): Promise<CarouselItem[]> {
  console.log("Fetching carousel items from service...");
  const { data, error } = await supabase
    .from("carousel_items")
    .select("*")
    .order("item_order", { ascending: true });

  if (error) {
    console.error("Error fetching carousel items:", error);
    throw error;
  }

  console.log("Carousel items fetched successfully:", data);
  return data || [];
}

export async function uploadCarouselImage(file: File): Promise<string | null> {
  console.log("Uploading carousel image:", file.name);
  const sanitizedFileName = file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w.-]/g, "");
  
  const path = `public/${Date.now()}_${sanitizedFileName}`;
  console.log("Upload path:", path);

  const { error } = await supabase.storage
    .from("carousel_image_files")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data } = supabase.storage
    .from("carousel_image_files")
    .getPublicUrl(path);

  console.log("Public URL generated:", data?.publicUrl);
  return data?.publicUrl || null;
}

export async function insertCarouselItem(item: CarouselInsert): Promise<CarouselItem> {
  console.log("Inserting carousel item:", item);
  const { data, error } = await supabase
    .from("carousel_items")
    .insert(item)
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error);
    throw error;
  }

  console.log("Item inserted successfully:", data);
  return data;
}

export async function updateCarouselItem(id: string, item: CarouselUpdate): Promise<CarouselItem> {
  console.log("Updating carousel item:", id, item);
  const { data, error } = await supabase
    .from("carousel_items")
    .update(item)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Update error:", error);
    throw error;
  }

  console.log("Item updated successfully:", data);
  return data;
}

export async function deleteCarouselItem(id: string): Promise<void> {
  console.log("Deleting carousel item:", id);
  
  // First get the item to delete the image from storage
  const { data: item } = await supabase
    .from("carousel_items")
    .select("image_url")
    .eq("id", id)
    .single();

  // Delete from database
  const { error } = await supabase
    .from("carousel_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    throw error;
  }

  // Try to delete image from storage if it exists
  if (item?.image_url) {
    try {
      const url = new URL(item.image_url);
      const pathSegments = url.pathname.split('/');
      const bucketIndex = pathSegments.findIndex(segment => segment === 'carousel_image_files');
      if (bucketIndex !== -1 && pathSegments.length > bucketIndex + 1) {
        const filePath = pathSegments.slice(bucketIndex + 1).join('/');
        await supabase.storage.from("carousel_image_files").remove([filePath]);
        console.log("Image deleted from storage:", filePath);
      }
    } catch (e) {
      console.warn("Could not delete image from storage:", e);
    }
  }

  console.log("Item deleted successfully");
}
