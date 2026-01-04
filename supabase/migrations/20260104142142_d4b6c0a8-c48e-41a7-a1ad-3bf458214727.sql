-- Adicionar colunas para informações do cliente
ALTER TABLE public.cart_analytics
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN user_email text,
ADD COLUMN device_type text,
ADD COLUMN browser text;