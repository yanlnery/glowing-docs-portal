-- Create site_events table for comprehensive analytics tracking
CREATE TABLE public.site_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid,
  user_email text,
  event_type text NOT NULL,
  event_category text NOT NULL,
  page_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device_type text,
  browser text,
  product_id uuid,
  product_name text,
  product_price numeric,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_site_events_session ON public.site_events(session_id);
CREATE INDEX idx_site_events_type ON public.site_events(event_type);
CREATE INDEX idx_site_events_created ON public.site_events(created_at);
CREATE INDEX idx_site_events_user ON public.site_events(user_id);
CREATE INDEX idx_site_events_category ON public.site_events(event_category);
CREATE INDEX idx_site_events_device ON public.site_events(device_type);

-- Enable RLS
ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking events from non-logged users)
CREATE POLICY "Allow anonymous insert" ON public.site_events
FOR INSERT WITH CHECK (true);

-- Allow admins to read all events
CREATE POLICY "Admins can read all events" ON public.site_events
FOR SELECT USING (public.is_admin(auth.uid()));