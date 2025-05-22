import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Definindo o tipo para os itens do carrossel para facilitar
export type CarouselItemSchema = Tables<'carousel_items'>;
export type CarouselItemInsert = TablesInsert<'carousel_items'>;
export type CarouselItemUpdate = TablesUpdate<'carousel_items'>;

export async function fetchCarouselItems(): Promise<CarouselItemSchema[]> {
  console.log("Fetching carousel items from service...");
  const { data, error } = await supabase
    .from("carousel_items")
    .select("*")
    .order("item_order", { ascending: true });

  if (error) {
    console.error("Erro ao buscar itens do carrossel no serviço:", error);
    // Retornar array vazio em caso de erro para não quebrar a UI
    return []; 
  }

  console.log("Carousel items fetched successfully from service:", data);
  
  if (data && data.length > 0) {
    data.forEach(item => {
      if (item.image_url) {
        console.log(`Item ID ${item.id} image_url from DB: ${item.image_url}`);
      } else {
        console.warn(`Item ID ${item.id} não possui URL de imagem no DB`);
      }
    });
  } else if (data === null) {
    console.warn("fetchCarouselItems: Supabase retornou 'data' como null. Retornando array vazio.");
    return [];
  } else if (data.length === 0) {
    console.info("fetchCarouselItems: Nenhum item de carrossel encontrado no banco de dados.");
  }
  
  return data || []; // Fallback para array vazio se data for null/undefined
}

export async function uploadCarouselImage(file: File): Promise<string | null> {
  console.log("uploadCarouselImage: Iniciando upload para o arquivo:", file.name);
  // Sanitize file name to remove problematic characters and ensure uniqueness
  const sanitizedFileName = file.name
    .normalize("NFD") // Normalize to decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics (accents)
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/[^\w.-]/g, ""); // Remove non-alphanumeric characters except ., _, -
  
  const filePath = `public/${Date.now()}_${sanitizedFileName}`;
  console.log("uploadCarouselImage: Caminho do arquivo no bucket:", filePath);

  const { error: uploadError } = await supabase.storage
    .from("carousel_image_files") // Certifique-se que este é o nome correto do seu bucket
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true, // Sobrescreve se o arquivo com o mesmo nome já existir
    });

  if (uploadError) {
    console.error("Erro ao fazer upload da imagem para o Supabase Storage:", uploadError);
    return null;
  }

  console.log("uploadCarouselImage: Upload bem-sucedido. Obtendo URL pública...");
  const { data: publicUrlData } = supabase.storage
    .from("carousel_image_files") // Novamente, o nome do bucket
    .getPublicUrl(filePath);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    console.error("uploadCarouselImage: Não foi possível obter a URL pública do arquivo:", publicUrlData);
    return null;
  }
  
  console.log("uploadCarouselImage: URL pública obtida:", publicUrlData.publicUrl);
  return publicUrlData.publicUrl; // Retorna a URL pública completa
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
