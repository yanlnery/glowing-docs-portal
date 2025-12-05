-- Create cart_analytics table for tracking cart views
CREATE TABLE public.cart_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  item_count INTEGER NOT NULL DEFAULT 0,
  total_value NUMERIC NOT NULL DEFAULT 0,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cart_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (tracking is public)
CREATE POLICY "cart_analytics_public_insert"
ON public.cart_analytics
FOR INSERT
WITH CHECK (true);

-- Only authenticated users can read (admin panel)
CREATE POLICY "cart_analytics_authenticated_read"
ON public.cart_analytics
FOR SELECT
USING ((SELECT auth.role()) = 'authenticated');