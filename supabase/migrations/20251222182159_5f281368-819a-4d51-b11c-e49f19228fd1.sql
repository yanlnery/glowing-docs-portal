-- Fix material_leads RLS policy: convert from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "material_leads_public_insert" ON public.material_leads;

CREATE POLICY "material_leads_public_insert" 
ON public.material_leads 
FOR INSERT 
TO public 
WITH CHECK (true);