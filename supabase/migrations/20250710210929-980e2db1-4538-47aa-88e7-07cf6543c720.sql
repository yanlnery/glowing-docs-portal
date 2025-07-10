-- Melhoria do sistema de pedidos
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_cpf TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS shipping_address JSONB,
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'whatsapp',
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS tracking_code TEXT;

-- Melhorar tabela de itens do pedido
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS product_id UUID,
ADD COLUMN IF NOT EXISTS species_name TEXT,
ADD COLUMN IF NOT EXISTS product_image_url TEXT;

-- Criar tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para system_settings (apenas admin pode gerenciar)
CREATE POLICY "Anyone can read system settings" ON public.system_settings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage settings" ON public.system_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Inserir configurações padrão
INSERT INTO public.system_settings (key, value, description) VALUES
('whatsapp_number', '"5511999999999"', 'Número do WhatsApp para vendas'),
('store_name', '"Pet Serpentes"', 'Nome da loja'),
('store_address', '{"street": "", "city": "", "state": "", "zipcode": ""}', 'Endereço da loja'),
('email_notifications', 'true', 'Ativar notificações por email'),
('order_prefix', '"PS"', 'Prefixo dos pedidos')
ON CONFLICT (key) DO NOTHING;

-- Criar tabela de contatos/mensagens
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS para contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Política para contact_messages
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can manage contact messages" ON public.contact_messages
  FOR ALL USING (auth.role() = 'authenticated');

-- Trigger para atualizar updated_at
CREATE OR REPLACE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON public.contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();