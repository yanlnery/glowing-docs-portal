-- Create species_waitlist table
CREATE TABLE public.species_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID NOT NULL REFERENCES public.species(id) ON DELETE CASCADE,
  
  -- Customer data
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  cpf TEXT,
  contact_preference TEXT DEFAULT 'email',
  
  -- Commercial tracking
  status TEXT DEFAULT 'waiting',
  priority INTEGER DEFAULT 0,
  notes TEXT,
  
  -- Migration history
  previous_species_id UUID REFERENCES public.species(id),
  migrated_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.species_waitlist ENABLE ROW LEVEL SECURITY;

-- Public can insert (register interest)
CREATE POLICY "species_waitlist_public_insert" ON public.species_waitlist
FOR INSERT WITH CHECK (true);

-- Authenticated users can read all entries
CREATE POLICY "species_waitlist_authenticated_read" ON public.species_waitlist
FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can update entries
CREATE POLICY "species_waitlist_authenticated_update" ON public.species_waitlist
FOR UPDATE USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can delete entries
CREATE POLICY "species_waitlist_authenticated_delete" ON public.species_waitlist
FOR DELETE USING (auth.role() = 'authenticated');

-- Create index for faster queries
CREATE INDEX idx_species_waitlist_species_id ON public.species_waitlist(species_id);
CREATE INDEX idx_species_waitlist_status ON public.species_waitlist(status);
CREATE INDEX idx_species_waitlist_email ON public.species_waitlist(email);

-- Trigger for updated_at
CREATE TRIGGER update_species_waitlist_updated_at
BEFORE UPDATE ON public.species_waitlist
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();