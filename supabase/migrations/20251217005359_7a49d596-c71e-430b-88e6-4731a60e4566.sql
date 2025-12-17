-- Clean up and fix RLS policies for internship_waitlist table
-- The table has duplicate policies causing confusion

-- First, drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can submit internship application" ON public.internship_waitlist;
DROP POLICY IF EXISTS "Only admins can delete internship applications" ON public.internship_waitlist;
DROP POLICY IF EXISTS "Only admins can update internship applications" ON public.internship_waitlist;
DROP POLICY IF EXISTS "Only admins can view internship applications" ON public.internship_waitlist;
DROP POLICY IF EXISTS "internship_waitlist_admin_delete" ON public.internship_waitlist;
DROP POLICY IF EXISTS "internship_waitlist_admin_read" ON public.internship_waitlist;
DROP POLICY IF EXISTS "internship_waitlist_admin_update" ON public.internship_waitlist;
DROP POLICY IF EXISTS "internship_waitlist_public_insert" ON public.internship_waitlist;

-- Ensure RLS is enabled
ALTER TABLE public.internship_waitlist ENABLE ROW LEVEL SECURITY;

-- Create clean, PERMISSIVE policies (default behavior)

-- 1. Public INSERT - anyone can submit an application
CREATE POLICY "internship_public_insert"
ON public.internship_waitlist
FOR INSERT
TO public
WITH CHECK (true);

-- 2. Admin SELECT - only admins can view applications
CREATE POLICY "internship_admin_select"
ON public.internship_waitlist
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- 3. Admin UPDATE - only admins can update applications  
CREATE POLICY "internship_admin_update"
ON public.internship_waitlist
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- 4. Admin DELETE - only admins can delete applications
CREATE POLICY "internship_admin_delete"
ON public.internship_waitlist
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));