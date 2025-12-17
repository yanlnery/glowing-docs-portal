-- Make user_id immutable on addresses table to prevent ownership hijacking
-- This prevents users from changing the user_id to access other users' addresses

-- Create function to prevent user_id modification
CREATE OR REPLACE FUNCTION public.prevent_user_id_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prevent changing user_id after creation
  IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
    RAISE EXCEPTION 'Changing user_id is not allowed';
  END IF;
  RETURN NEW;
END;
$$;

-- Apply trigger to addresses table
DROP TRIGGER IF EXISTS prevent_addresses_user_id_change ON public.addresses;
CREATE TRIGGER prevent_addresses_user_id_change
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_user_id_change();

-- Also apply to orders table for consistency (same security concern)
DROP TRIGGER IF EXISTS prevent_orders_user_id_change ON public.orders;
CREATE TRIGGER prevent_orders_user_id_change
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_user_id_change();