-- Create table for material download leads
CREATE TABLE public.material_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,
  source TEXT DEFAULT 'material_download',
  downloaded_material TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint on email to prevent duplicates
CREATE UNIQUE INDEX material_leads_email_unique ON public.material_leads(email);

-- Enable RLS
ALTER TABLE public.material_leads ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anyone can register as a lead)
CREATE POLICY "material_leads_public_insert"
ON public.material_leads
FOR INSERT
WITH CHECK (true);

-- Allow authenticated users to read leads (admin access)
CREATE POLICY "material_leads_authenticated_read"
ON public.material_leads
FOR SELECT
USING ((SELECT auth.role()) = 'authenticated');

-- Allow authenticated users to manage leads
CREATE POLICY "material_leads_authenticated_all"
ON public.material_leads
FOR ALL
USING ((SELECT auth.role()) = 'authenticated')
WITH CHECK ((SELECT auth.role()) = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_material_leads_updated_at
BEFORE UPDATE ON public.material_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();