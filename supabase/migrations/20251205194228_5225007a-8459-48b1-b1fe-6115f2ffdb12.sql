-- Create waitlist table for Academy signups
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  contact_preference TEXT NOT NULL DEFAULT 'email',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "waitlist_public_insert"
ON public.waitlist
FOR INSERT
WITH CHECK (true);

-- Only authenticated users can read (admin panel)
CREATE POLICY "waitlist_authenticated_read"
ON public.waitlist
FOR SELECT
USING ((SELECT auth.role()) = 'authenticated');

-- Only authenticated users can delete
CREATE POLICY "waitlist_authenticated_delete"
ON public.waitlist
FOR DELETE
USING ((SELECT auth.role()) = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_waitlist_updated_at
BEFORE UPDATE ON public.waitlist
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();