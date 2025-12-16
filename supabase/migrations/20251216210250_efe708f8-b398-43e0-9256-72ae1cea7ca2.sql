-- Fix species_waitlist RLS policy - change from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "species_waitlist_public_insert" ON public.species_waitlist;

CREATE POLICY "species_waitlist_public_insert" 
ON public.species_waitlist 
FOR INSERT 
TO public
WITH CHECK (true);