-- Adicionar novos campos de preço na tabela products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS original_price numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS pix_price numeric DEFAULT NULL;

-- Adicionar comentários para documentação
COMMENT ON COLUMN products.original_price IS 'Preço original (riscado) para exibir desconto';
COMMENT ON COLUMN products.price IS 'Preço normal parcelado (em até 10x sem juros)';
COMMENT ON COLUMN products.pix_price IS 'Preço com desconto para pagamento via PIX (10% de desconto)';