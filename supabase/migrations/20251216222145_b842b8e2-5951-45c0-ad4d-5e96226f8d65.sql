-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table (separate from profiles as per security best practices)
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "user_roles_admin_all" ON public.user_roles
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "user_roles_self_read" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- Update products policies to require admin for modifications
DROP POLICY IF EXISTS "products_authenticated_all_consolidated" ON public.products;

CREATE POLICY "products_admin_all" ON public.products
  FOR ALL USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Update species policies to require admin for modifications
DROP POLICY IF EXISTS "species_authenticated_all_consolidated" ON public.species;

CREATE POLICY "species_admin_all" ON public.species
  FOR ALL USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Update manuals policies to require admin for modifications
DROP POLICY IF EXISTS "manuals_authenticated_all_consolidated" ON public.manuals;

CREATE POLICY "manuals_admin_all" ON public.manuals
  FOR ALL USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Update carousel_items policies to require admin for modifications
DROP POLICY IF EXISTS "carousel_items_authenticated_all_consolidated" ON public.carousel_items;

CREATE POLICY "carousel_items_admin_all" ON public.carousel_items
  FOR ALL USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Update system_settings policies to require admin for modifications
DROP POLICY IF EXISTS "system_settings_authenticated_all_consolidated" ON public.system_settings;

CREATE POLICY "system_settings_admin_all" ON public.system_settings
  FOR ALL USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Update contact_messages policies to require admin for modifications
DROP POLICY IF EXISTS "contact_messages_authenticated_all_consolidated" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_authenticated_delete" ON public.contact_messages;

CREATE POLICY "contact_messages_admin_all" ON public.contact_messages
  FOR ALL USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Update waitlist policies to require admin for read/delete
DROP POLICY IF EXISTS "waitlist_authenticated_delete" ON public.waitlist;
DROP POLICY IF EXISTS "waitlist_authenticated_read" ON public.waitlist;

CREATE POLICY "waitlist_admin_read" ON public.waitlist
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "waitlist_admin_delete" ON public.waitlist
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Update internship_waitlist policies to require admin
DROP POLICY IF EXISTS "internship_waitlist_authenticated_delete" ON public.internship_waitlist;
DROP POLICY IF EXISTS "internship_waitlist_authenticated_read" ON public.internship_waitlist;
DROP POLICY IF EXISTS "internship_waitlist_authenticated_update" ON public.internship_waitlist;

CREATE POLICY "internship_waitlist_admin_read" ON public.internship_waitlist
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "internship_waitlist_admin_update" ON public.internship_waitlist
  FOR UPDATE USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "internship_waitlist_admin_delete" ON public.internship_waitlist
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Update species_waitlist policies to require admin for read/update/delete
DROP POLICY IF EXISTS "species_waitlist_authenticated_read" ON public.species_waitlist;
DROP POLICY IF EXISTS "species_waitlist_authenticated_update" ON public.species_waitlist;
DROP POLICY IF EXISTS "species_waitlist_authenticated_delete" ON public.species_waitlist;

CREATE POLICY "species_waitlist_admin_read" ON public.species_waitlist
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "species_waitlist_admin_update" ON public.species_waitlist
  FOR UPDATE USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "species_waitlist_admin_delete" ON public.species_waitlist
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Update material_leads policies to require admin
DROP POLICY IF EXISTS "material_leads_authenticated_all" ON public.material_leads;
DROP POLICY IF EXISTS "material_leads_authenticated_read" ON public.material_leads;

CREATE POLICY "material_leads_admin_all" ON public.material_leads
  FOR ALL USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Update cart_analytics policies to require admin for read
DROP POLICY IF EXISTS "cart_analytics_authenticated_read" ON public.cart_analytics;

CREATE POLICY "cart_analytics_admin_read" ON public.cart_analytics
  FOR SELECT USING (public.is_admin(auth.uid()));