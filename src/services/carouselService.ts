
import { supabase } from "@/integrations/supabase/client";
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
  const filePath = `public/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

  const { error: uploadError } = await supabase.storage
    .from("carousel_image_files") 
    .upload(filePath, file, { upsert: true }); // Added upsert:true for safety if file name collides

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
    .insert(itemToInsert as CarouselItemInsert)
    .select()
    .single();

  if (error) {
    console.error("Erro ao inserir item no carrossel:", error);
    return null;
  }
  return data;
}

export async function updateCarouselItem(id: string, itemData: CarouselItemUpdate): Promise<CarouselItemSchema | null> {
  // Certifique-se de que 'id' não está no itemData para atualização
  const { id: itemId, ...updateData } = itemData;

  const { data, error } = await supabase
    .from("carousel_items")
    .update(updateData)
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
  const { data: itemToDelete, error: fetchError } = await supabase
    .from('carousel_items')
    .select('image_url')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error("Erro ao buscar item para deletar imagem:", fetchError);
    // Prosseguir com a deleção do DB mesmo assim? Ou retornar false?
    // Por ora, vamos prosseguir, mas logar o erro.
  }

  if (itemToDelete && itemToDelete.image_url) {
    const imageUrl = itemToDelete.image_url;
    // Extrair o nome do arquivo da URL pública. Isso pode ser frágil.
    // Ex: https://project_ref.supabase.co/storage/v1/object/public/carousel_image_files/public/image_name.jpg
    // Precisamos do caminho RELATIVO ao bucket: 'public/image_name.jpg'
    try {
      const url = new URL(imageUrl);
      const pathSegments = url.pathname.split('/');
      // Encontrar o nome do bucket nos segmentos e pegar o que vem depois
      const bucketNameInPath = "carousel_image_files";
      const bucketIndex = pathSegments.findIndex(segment => segment === bucketNameInPath);
      if (bucketIndex !== -1 && pathSegments.length > bucketIndex + 1) {
        const filePathInBucket = pathSegments.slice(bucketIndex + 1).join('/');
        if (filePathInBucket) {
          console.log("Tentando remover imagem do storage:", filePathInBucket);
          const { error: deleteImageError } = await supabase.storage
            .from("carousel_image_files")
            .remove([filePathInBucket]);
          if (deleteImageError) {
            console.error("Erro ao remover imagem do storage:", deleteImageError);
            // Não impedir a deleção do item do DB, mas logar.
          }
        }
      }
    } catch(e) {
      console.error("Erro ao parsear URL da imagem para deleção:", e);
    }
  }

  const { error: deleteDbError } = await supabase
    .from("carousel_items")
    .delete()
    .eq("id", id);

  if (deleteDbError) {
    console.error("Erro ao deletar item do carrossel do DB:", deleteDbError);
    return false;
  }
  return true;
}
