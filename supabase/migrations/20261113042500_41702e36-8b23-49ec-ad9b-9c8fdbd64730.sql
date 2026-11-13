CREATE TABLE public.instagram_feed_cache (
 id integer PRIMARY KEY DEFAULT 1,
 profile jsonb,
 posts jsonb,
 fetched_at timestamptz,
 CONSTRAINT single_row CHECK (id = 1)
);
GRANT SELECT ON public.instagram_feed_cache TO anon;
GRANT SELECT ON public.instagram_feed_cache TO authenticated;
GRANT ALL ON public.instagram_feed_cache TO service_role;
ALTER TABLE public.instagram_feed_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read instagram feed cache" ON public.instagram_feed_cache FOR SELECT TO anon, authenticated USING (true);
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;