-- Fix security for internship_waitlist table
-- Only admins should be able to read internship applicant data

-- First, ensure RLS is enabled
ALTER TABLE public.internship_waitlist ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly permissive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.internship_waitlist;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.internship_waitlist;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.internship_waitlist;
DROP POLICY IF EXISTS "Anyone can insert" ON public.internship_waitlist;
DROP POLICY IF EXISTS "Public can insert into internship_waitlist" ON public.internship_waitlist;

-- Create secure policies

-- Allow anyone to submit an application (INSERT only)
CREATE POLICY "Anyone can submit internship application"
ON public.internship_waitlist
FOR INSERT
TO public
WITH CHECK (true);

-- Only admins can view applications
CREATE POLICY "Only admins can view internship applications"
ON public.internship_waitlist
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Only admins can update applications
CREATE POLICY "Only admins can update internship applications"
ON public.internship_waitlist
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Only admins can delete applications
CREATE POLICY "Only admins can delete internship applications"
ON public.internship_waitlist
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));