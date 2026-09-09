DROP POLICY IF EXISTS system_settings_public_read_ui_only ON public.system_settings;
CREATE POLICY system_settings_public_read_ui_only ON public.system_settings
FOR SELECT
USING (key = ANY (ARRAY['isAcademyVisible','isAcademyOpenForSubscription','academy_visible','academy_open_for_subscription','checkout_v2_enabled','whatsapp_number']));

CREATE OR REPLACE FUNCTION public.create_guest_lead_order(
  p_product_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_consent boolean
)
RETURNS TABLE(order_id uuid, order_number text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_price numeric;
  v_name text;
  v_species text;
  v_code text;
  v_order_id uuid;
  v_order_number text;
BEGIN
  IF COALESCE(p_consent, false) IS NOT TRUE THEN
    RAISE EXCEPTION 'Consentimento obrigatorio';
  END IF;
  IF btrim(COALESCE(p_customer_name, '')) = '' OR btrim(COALESCE(p_customer_phone, '')) = '' THEN
    RAISE EXCEPTION 'Nome e WhatsApp sao obrigatorios';
  END IF;

  SELECT p.price, p.name, p.species_name, p.product_code
    INTO v_price, v_name, v_species, v_code
  FROM public.products p
  WHERE p.id = p_product_id AND p.visible = true AND p.available = true;

  IF v_price IS NULL THEN
    RAISE EXCEPTION 'Animal nao esta mais disponivel';
  END IF;

  INSERT INTO public.orders (
    user_id, status, payment_method, customer_name, customer_phone,
    total_amount, subtotal_amount, lead_stage, source, consent, consent_at, whatsapp_clicked_at
  ) VALUES (
    NULL, 'pending', 'whatsapp', btrim(p_customer_name), btrim(p_customer_phone),
    v_price, v_price, 'lead', 'site', true, now(), now()
  )
  RETURNING id, orders.order_number INTO v_order_id, v_order_number;

  INSERT INTO public.order_items (order_id, product_id, product_name, species_name, product_code, quantity, price)
  VALUES (v_order_id, p_product_id, v_name, v_species, v_code, 1, v_price);

  RETURN QUERY SELECT v_order_id, v_order_number;
END;
$$;

REVOKE ALL ON FUNCTION public.create_guest_lead_order(uuid, text, text, boolean) FROM public;
GRANT EXECUTE ON FUNCTION public.create_guest_lead_order(uuid, text, text, boolean) TO anon, authenticated;