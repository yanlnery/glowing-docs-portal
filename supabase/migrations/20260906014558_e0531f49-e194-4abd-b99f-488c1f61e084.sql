ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS subtotal_amount numeric,
  ADD COLUMN IF NOT EXISTS coupon_discount numeric NOT NULL DEFAULT 0;

-- Valida o cupom e RECALCULA desconto e total no servidor (BEFORE INSERT).
-- Qualquer coupon_discount / total_amount enviado pelo cliente e ignorado quando ha cupom.
CREATE OR REPLACE FUNCTION public.normalize_order_coupon()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_base numeric;
  v_valid boolean;
  v_type text;
  v_value numeric;
  v_discount numeric;
BEGIN
  -- Base do desconto = subtotal bruto (antes do cupom).
  -- Se o cliente nao enviar subtotal_amount, cai para total_amount.
  v_base := COALESCE(NULLIF(NEW.subtotal_amount, 0), NEW.total_amount, 0);
  IF v_base < 0 THEN
    v_base := 0;
  END IF;
  NEW.subtotal_amount := round(v_base, 2);

  IF NEW.coupon_code IS NULL OR btrim(NEW.coupon_code) = '' THEN
    NEW.coupon_code := NULL;
    NEW.coupon_discount := 0;
    RETURN NEW;
  END IF;

  NEW.coupon_code := upper(btrim(NEW.coupon_code));

  -- Passa o subtotal real para que min_order_value seja de fato verificado
  SELECT v.valid, v.discount_type, v.discount_value
    INTO v_valid, v_type, v_value
  FROM public.validate_coupon(NEW.coupon_code, v_base) v;

  IF NOT COALESCE(v_valid, false) THEN
    NEW.coupon_code := NULL;
    NEW.coupon_discount := 0;
    NEW.total_amount := round(v_base, 2);
    RETURN NEW;
  END IF;

  -- Mesmas regras do carrinho: percentual sobre o subtotal, fixo limitado ao subtotal
  IF v_type = 'percentage' THEN
    v_discount := v_base * (COALESCE(v_value, 0) / 100);
  ELSE
    v_discount := LEAST(COALESCE(v_value, 0), v_base);
  END IF;

  v_discount := round(GREATEST(LEAST(v_discount, v_base), 0), 2);

  NEW.coupon_discount := v_discount;
  NEW.total_amount := round(GREATEST(v_base - v_discount, 0), 2);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_orders_normalize_coupon ON public.orders;
CREATE TRIGGER trg_orders_normalize_coupon
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.normalize_order_coupon();

-- Incrementa times_used somente quando o pedido e efetivamente criado com o cupom
CREATE OR REPLACE FUNCTION public.increment_coupon_usage_on_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.coupon_code IS NOT NULL THEN
    UPDATE public.coupons
    SET times_used = times_used + 1
    WHERE upper(code) = NEW.coupon_code;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_orders_increment_coupon ON public.orders;
CREATE TRIGGER trg_orders_increment_coupon
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.increment_coupon_usage_on_order();

-- Cliente nao pode alterar cupom, desconto ou subtotal depois que o pedido foi criado
CREATE OR REPLACE FUNCTION public.protect_admin_order_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    NEW.total_amount := OLD.total_amount;
    NEW.status := OLD.status;
    NEW.admin_notes := OLD.admin_notes;
    NEW.confirmed_at := OLD.confirmed_at;
    NEW.confirmed_by := OLD.confirmed_by;
    NEW.tracking_code := OLD.tracking_code;
    NEW.order_number := OLD.order_number;
    NEW.coupon_code := OLD.coupon_code;
    NEW.coupon_discount := OLD.coupon_discount;
    NEW.subtotal_amount := OLD.subtotal_amount;
  END IF;
  RETURN NEW;
END;
$$;