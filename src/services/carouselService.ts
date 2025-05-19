import { supabase } from "@/lib/supabaseClient";

export async function fetchCarouselItems() {
  const { data, error } = await supabase
    .from("carousel_items")
    .select("*")
    .order("item_order", { ascending: true });

  if (error) {
    console.error("Erro ao buscar itens do carrossel:", error);
    return [];
  }

  return data;
}

export async function uploadCarouselImage(file: File): Promise<string | null> {
  const filePath = `${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("carousel_image_files")
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

export async function insertCarouselItem({
  image_url,
  alt_text,
  title,
  subtitle,
  item_order,
}: {
  image_url: string;
  alt_text: string;
  title?: string;
  subtitle?: string;
  item_order?: number;
}) {
  const { error } = await supabase.from("carousel_items").insert([
    {
      image_url,
      alt_text,
      title,
      subtitle,
      item_order,
    },
  ]);

  if (error) {
    console.error("Erro ao inserir item no carrossel:", error);
  }
}
