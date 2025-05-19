
import { supabase } from "@/integrations/supabase/client"; // Caminho corrigido
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Definindo o tipo para os itens do carrossel para facilitar
export type CarouselItemSchema = Tables<'carousel_items'>;
export type CarouselItemInsert = TablesInsert<'carousel_items'>;
export type CarouselItemUpdate = TablesUpdate<'carousel_items'>;

export async function fetchCarouselItems(): Promise<CarouselItemSchema[]> {
  const { data, error } = await supabase
    .from("carousel_items")
    .select("*")
    .order("item_order", { ascending: true });

  if (error) {
    console.error("Erro ao buscar itens do carrossel:", error);
    return [];
  }

  return data || [];
}

export async function uploadCarouselImage(file: File): Promise<string | null> {
  const filePath = `public/${Date.now()}_${file.name}`; // Adicionado 'public/' para o caminho no bucket

  const { error: uploadError } = await supabase.storage
    .from("carousel_image_files") // Nome do bucket definido no último SQL
    .upload(filePath, file);

  if (uploadError) {
    console.error("Erro ao fazer upload da imagem:", uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from("carousel_image_files")
    .getPublicUrl(filePath);

  return data?.publicUrl ?? null;
}

export async function insertCarouselItem(item: CarouselItemInsert): Promise<CarouselItemSchema | null> {
  // Removendo 'id' se ele for undefined, pois o banco gera automaticamente
  const { id, ...insertData } = item;
  const itemToInsert = id ? item : insertData;


  const { data, error } = await supabase
    .from("carousel_items")
    .insert(itemToInsert as CarouselItemInsert) // Cast para garantir o tipo correto
    .select()
    .single();

  if (error) {
    console.error("Erro ao inserir item no carrossel:", error);
    return null;
  }
  return data;
}

export async function updateCarouselItem(id: string, itemData: CarouselItemUpdate): Promise<CarouselItemSchema | null> {
  const { data, error } = await supabase
    .from("carousel_items")
    .update(itemData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar item do carrossel:", error.message);
    return null;
  }
  return data;
}

export async function deleteCarouselItem(id: string): Promise<boolean> {
  // Opcional: Excluir a imagem do storage antes de excluir o registro do banco
  // Para isso, precisaríamos do caminho da imagem no storage.
  // Por simplicidade, vamos apenas excluir o registro do banco por agora.
  // const itemToDelete = await supabase.from('carousel_items').select('image_url').eq('id', id).single();
  // if (itemToDelete.data && itemToDelete.data.image_url) {
  //   const path = itemToDelete.data.image_url.split('/').pop(); // Simplista, pode precisar de ajuste
  //   if (path) {
  //     await supabase.storage.from('carousel_image_files').remove([`public/${path}`]);
  //   }
  // }

  const { error } = await supabase
    .from("carousel_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao deletar item do carrossel:", error);
    return false;
  }
  return true;
}
