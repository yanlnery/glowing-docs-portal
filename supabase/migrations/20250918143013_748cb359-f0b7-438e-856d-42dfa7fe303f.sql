-- Fix all Supabase RLS and database security warnings

-- 1. Update function definitions to explicitly set search_path parameter
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_product_slug()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug = lower(regexp_replace(NEW.name, '[^a-zA-Z0-9\s]', '', 'g'));
        NEW.slug = regexp_replace(NEW.slug, '\s+', '-', 'g');
        NEW.slug = trim(both '-' from NEW.slug);
        
        -- Ensure uniqueness by appending number if needed
        WHILE EXISTS (SELECT 1 FROM public.products WHERE slug = NEW.slug AND id != COALESCE(NEW.id, gen_random_uuid())) LOOP
            NEW.slug = NEW.slug || '-' || extract(epoch from now())::integer;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, updated_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NOW()
  );
  RETURN NEW;
END;
$$;

-- 2. Drop existing RLS policies and recreate with proper auth function calls and merged logic

-- CAROUSEL_ITEMS: Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access to carousel items" ON public.carousel_items;
DROP POLICY IF EXISTS "Authenticated manage" ON public.carousel_items;
DROP POLICY IF EXISTS "Authenticated users can manage carousel_items" ON public.carousel_items;
DROP POLICY IF EXISTS "Public read access" ON public.carousel_items;
DROP POLICY IF EXISTS "Public read access for carousel_items" ON public.carousel_items;
DROP POLICY IF EXISTS "carousel_items_authenticated_all" ON public.carousel_items;
DROP POLICY IF EXISTS "carousel_items_public_read" ON public.carousel_items;

-- Create consolidated policies for carousel_items
CREATE POLICY "carousel_items_public_read_consolidated" ON public.carousel_items
FOR SELECT 
USING (true);

CREATE POLICY "carousel_items_authenticated_all_consolidated" ON public.carousel_items
FOR ALL 
USING ((select auth.role()) = 'authenticated'::text)
WITH CHECK ((select auth.role()) = 'authenticated'::text);

-- MANUALS: Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access to manuals" ON public.manuals;
DROP POLICY IF EXISTS "Authenticated users can manage manuals" ON public.manuals;
DROP POLICY IF EXISTS "Public read access for manuals" ON public.manuals;

-- Create consolidated policies for manuals
CREATE POLICY "manuals_public_read_consolidated" ON public.manuals
FOR SELECT 
USING (true);

CREATE POLICY "manuals_authenticated_all_consolidated" ON public.manuals
FOR ALL 
USING ((select auth.role()) = 'authenticated'::text)
WITH CHECK ((select auth.role()) = 'authenticated'::text);

-- PRODUCTS: Drop all existing policies
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
DROP POLICY IF EXISTS "Public can view visible products" ON public.products;

-- Create consolidated policies for products
CREATE POLICY "products_public_read_consolidated" ON public.products
FOR SELECT 
USING (visible = true);

CREATE POLICY "products_authenticated_all_consolidated" ON public.products
FOR ALL 
USING ((select auth.role()) = 'authenticated'::text)
WITH CHECK ((select auth.role()) = 'authenticated'::text);

-- SPECIES: Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access to species" ON public.species;
DROP POLICY IF EXISTS "Authenticated users can manage species" ON public.species;
DROP POLICY IF EXISTS "Public read access for species" ON public.species;

-- Create consolidated policies for species
CREATE POLICY "species_public_read_consolidated" ON public.species
FOR SELECT 
USING (true);

CREATE POLICY "species_authenticated_all_consolidated" ON public.species
FOR ALL 
USING ((select auth.role()) = 'authenticated'::text)
WITH CHECK ((select auth.role()) = 'authenticated'::text);

-- SYSTEM_SETTINGS: Drop all existing policies
DROP POLICY IF EXISTS "Anyone can read system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Authenticated users can manage settings" ON public.system_settings;

-- Create consolidated policies for system_settings
CREATE POLICY "system_settings_public_read_consolidated" ON public.system_settings
FOR SELECT 
USING (true);

CREATE POLICY "system_settings_authenticated_all_consolidated" ON public.system_settings
FOR ALL 
USING ((select auth.role()) = 'authenticated'::text)
WITH CHECK ((select auth.role()) = 'authenticated'::text);

-- CONTACT_MESSAGES: Drop all existing policies
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can manage contact messages" ON public.contact_messages;

-- Create consolidated policies for contact_messages
CREATE POLICY "contact_messages_public_insert_consolidated" ON public.contact_messages
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "contact_messages_authenticated_all_consolidated" ON public.contact_messages
FOR ALL 
USING ((select auth.role()) = 'authenticated'::text)
WITH CHECK ((select auth.role()) = 'authenticated'::text);

-- PROFILES: Drop all existing policies
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;

-- Create consolidated policies for profiles
CREATE POLICY "profiles_user_select_consolidated" ON public.profiles
FOR SELECT 
USING ((select auth.uid()) = id);

CREATE POLICY "profiles_user_update_consolidated" ON public.profiles
FOR UPDATE 
USING ((select auth.uid()) = id)
WITH CHECK ((select auth.uid()) = id);

-- ADDRESSES: Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.addresses;

-- Create consolidated policies for addresses
CREATE POLICY "addresses_user_all_consolidated" ON public.addresses
FOR ALL 
USING ((select auth.uid())::text = user_id::text)
WITH CHECK ((select auth.uid())::text = user_id::text);

-- ORDERS: Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

-- Create consolidated policies for orders
CREATE POLICY "orders_user_select_consolidated" ON public.orders
FOR SELECT 
USING ((select auth.uid())::text = user_id::text);

CREATE POLICY "orders_user_insert_consolidated" ON public.orders
FOR INSERT 
WITH CHECK ((select auth.uid())::text = user_id::text);

CREATE POLICY "orders_user_update_consolidated" ON public.orders
FOR UPDATE 
USING ((select auth.uid())::text = user_id::text)
WITH CHECK ((select auth.uid())::text = user_id::text);

-- ORDER_ITEMS: Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;

-- Create consolidated policies for order_items
CREATE POLICY "order_items_user_select_consolidated" ON public.order_items
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id::text = (select auth.uid())::text
));

CREATE POLICY "order_items_user_insert_consolidated" ON public.order_items
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id::text = (select auth.uid())::text
));