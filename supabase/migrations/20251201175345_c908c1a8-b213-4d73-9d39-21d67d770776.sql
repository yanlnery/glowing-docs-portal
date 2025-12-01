-- Adicionar campo gallery para armazenar array de URLs de imagens adicionais
ALTER TABLE public.species 
ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.species.gallery IS 'Array de URLs de imagens adicionais para galeria (3-6 fotos)';