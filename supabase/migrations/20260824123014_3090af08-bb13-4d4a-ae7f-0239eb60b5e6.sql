REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.generate_product_slug() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_business_whatsapp() FROM anon;

DROP POLICY IF EXISTS "orders_user_insert_consolidated" ON public.orders;
CREATE POLICY "orders_user_insert_authenticated" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK ((auth.uid())::text = user_id::text);

DROP POLICY IF EXISTS "order_items_user_insert_consolidated" ON public.order_items;
CREATE POLICY "order_items_user_insert_authenticated" ON public.order_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id)::text = (auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "coupons_public_read_active" ON public.coupons;
CREATE POLICY "coupons_authenticated_read_active" ON public.coupons
  FOR SELECT TO authenticated
  USING (is_active = true);