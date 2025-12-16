-- Add phone column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;

-- Create internship_waitlist table for volunteer internship applications
CREATE TABLE IF NOT EXISTS public.internship_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  institution text NOT NULL,
  course text NOT NULL,
  semester text,
  availability text NOT NULL,
  interest_area text NOT NULL,
  motivation text,
  linkedin_url text,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on internship_waitlist
ALTER TABLE public.internship_waitlist ENABLE ROW LEVEL SECURITY;

-- Public can insert (anyone can apply)
CREATE POLICY "internship_waitlist_public_insert" ON public.internship_waitlist
  FOR INSERT WITH CHECK (true);

-- Authenticated can read all entries (admin)
CREATE POLICY "internship_waitlist_authenticated_read" ON public.internship_waitlist
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated can update entries (admin)
CREATE POLICY "internship_waitlist_authenticated_update" ON public.internship_waitlist
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated can delete entries (admin)
CREATE POLICY "internship_waitlist_authenticated_delete" ON public.internship_waitlist
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_internship_waitlist_updated_at
  BEFORE UPDATE ON public.internship_waitlist
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();