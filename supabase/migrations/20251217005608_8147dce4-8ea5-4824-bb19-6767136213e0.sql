-- Reinforce RLS policy for internship_waitlist to ensure ONLY admins can SELECT
-- Drop existing SELECT policy and recreate with explicit admin-only access

DROP POLICY IF EXISTS "internship_admin_select" ON public.internship_waitlist;

-- Create admin-only SELECT policy
-- This policy uses USING clause which means:
-- - Anonymous users: auth.uid() is NULL, is_admin(NULL) returns false = NO ACCESS
-- - Authenticated non-admin: is_admin(uid) returns false = NO ACCESS  
-- - Authenticated admin: is_admin(uid) returns true = ACCESS GRANTED
CREATE POLICY "internship_admin_select_only"
ON public.internship_waitlist
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Verify no other SELECT policies exist that could grant broader access
-- The policy above is the ONLY SELECT policy, and it requires admin role