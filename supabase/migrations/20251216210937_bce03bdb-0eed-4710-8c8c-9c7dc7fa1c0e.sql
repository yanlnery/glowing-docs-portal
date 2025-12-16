-- Recreate RLS policies for public.species_waitlist explicitly

-- Ensure RLS is enabled
ALTER TABLE public.species_waitlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (old names)
DROP POLICY IF EXISTS "species_waitlist_public_insert" ON public.species_waitlist;
DROP POLICY IF EXISTS "species_waitlist_anyone_insert" ON public.species_waitlist;
DROP POLICY IF EXISTS "species_waitlist_authenticated_read" ON public.species_waitlist;
DROP POLICY IF EXISTS "species_waitlist_authenticated_update" ON public.species_waitlist;
DROP POLICY IF EXISTS "species_waitlist_authenticated_delete" ON public.species_waitlist;

-- INSERT: allow public signups (anon + authenticated)
CREATE POLICY "species_waitlist_anyone_insert"
ON public.species_waitlist
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- SELECT: only authenticated (admin UI)
CREATE POLICY "species_waitlist_authenticated_read"
ON public.species_waitlist
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (true);

-- UPDATE: only authenticated (admin UI)
CREATE POLICY "species_waitlist_authenticated_update"
ON public.species_waitlist
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- DELETE: only authenticated (admin UI)
CREATE POLICY "species_waitlist_authenticated_delete"
ON public.species_waitlist
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (true);
