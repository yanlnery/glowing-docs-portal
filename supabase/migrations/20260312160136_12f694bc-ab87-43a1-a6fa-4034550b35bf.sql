
-- Create coupons table
CREATE TABLE public.coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL CHECK (discount_value > 0),
  min_order_value numeric,
  max_uses integer,
  times_used integer NOT NULL DEFAULT 0,
  max_uses_per_customer integer,
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "coupons_admin_all" ON public.coupons
  FOR ALL TO public
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Public can read active coupons (for validation)
CREATE POLICY "coupons_public_read_active" ON public.coupons
  FOR SELECT TO public
  USING (is_active = true);
