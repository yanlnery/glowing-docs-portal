-- Drop existing permissive storage policies for product_images
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

-- Create admin-only storage policies for product_images bucket
CREATE POLICY "Admin users can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product_images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admin users can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product_images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admin users can delete product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product_images' AND public.is_admin(auth.uid()));

-- Also update species_images bucket policies (if they exist with same issue)
DROP POLICY IF EXISTS "Authenticated users can upload species images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update species images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete species images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Create admin-only storage policies for species_images bucket
CREATE POLICY "Admin users can upload species images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'species_images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admin users can update species images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'species_images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admin users can delete species images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'species_images' AND public.is_admin(auth.uid()));

-- Update carousel_images_bucket policies
DROP POLICY IF EXISTS "Authenticated users can upload carousel images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update carousel images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete carousel images" ON storage.objects;

CREATE POLICY "Admin users can upload carousel images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'carousel_images_bucket' AND public.is_admin(auth.uid()));

CREATE POLICY "Admin users can update carousel images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'carousel_images_bucket' AND public.is_admin(auth.uid()));

CREATE POLICY "Admin users can delete carousel images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'carousel_images_bucket' AND public.is_admin(auth.uid()));

-- Update carousel_image_files policies
DROP POLICY IF EXISTS "Authenticated users can upload carousel image files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update carousel image files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete carousel image files" ON storage.objects;

CREATE POLICY "Admin users can upload carousel image files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'carousel_image_files' AND public.is_admin(auth.uid()));

CREATE POLICY "Admin users can update carousel image files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'carousel_image_files' AND public.is_admin(auth.uid()));

CREATE POLICY "Admin users can delete carousel image files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'carousel_image_files' AND public.is_admin(auth.uid()));

-- Update manuals_images bucket policies
DROP POLICY IF EXISTS "Authenticated users can upload manual images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update manual images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete manual images" ON storage.objects;

CREATE POLICY "Admin users can upload manual images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'manuals_images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admin users can update manual images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'manuals_images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admin users can delete manual images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'manuals_images' AND public.is_admin(auth.uid()));