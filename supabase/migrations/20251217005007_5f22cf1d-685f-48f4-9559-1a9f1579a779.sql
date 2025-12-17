-- Fix the get_business_whatsapp function to have a fixed search_path
-- This prevents potential schema injection attacks

CREATE OR REPLACE FUNCTION public.get_business_whatsapp()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT value::text
  FROM public.system_settings
  WHERE key = 'whatsapp_number'
  LIMIT 1;
$$;