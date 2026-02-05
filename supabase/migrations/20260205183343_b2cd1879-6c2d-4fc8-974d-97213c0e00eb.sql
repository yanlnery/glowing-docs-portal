-- Adicionar coluna product_code para armazenar o ID customizado do produto (ex: PS001)
ALTER TABLE public.order_items 
ADD COLUMN product_code text;

-- Comentário para documentar o propósito da coluna
COMMENT ON COLUMN public.order_items.product_code IS 'ID customizado do produto definido pelo admin (ex: PS001)';