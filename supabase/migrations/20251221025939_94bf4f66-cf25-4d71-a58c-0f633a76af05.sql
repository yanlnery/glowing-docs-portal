-- Create table for About page gallery images
CREATE TABLE public.about_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt_text TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.about_gallery ENABLE ROW LEVEL SECURITY;

-- Public can view active images
CREATE POLICY "about_gallery_public_read"
  ON public.about_gallery
  FOR SELECT
  USING (active = true);

-- Admins can manage all images
CREATE POLICY "about_gallery_admin_all"
  ON public.about_gallery
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_about_gallery_updated_at
  BEFORE UPDATE ON public.about_gallery
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();