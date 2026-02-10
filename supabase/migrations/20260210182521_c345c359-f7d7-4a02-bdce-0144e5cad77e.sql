-- Add admin policy to order_items so admins can see/manage all order items
CREATE POLICY "order_items_admin_all"
ON public.order_items
FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));