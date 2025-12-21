-- Add focus columns to carousel_items
ALTER TABLE public.carousel_items
ADD COLUMN IF NOT EXISTS focus_desktop TEXT DEFAULT 'center',
ADD COLUMN IF NOT EXISTS focus_mobile TEXT DEFAULT 'center';

-- Add focus columns to species (for main image and will be in gallery JSON)
ALTER TABLE public.species
ADD COLUMN IF NOT EXISTS focus_desktop TEXT DEFAULT 'center',
ADD COLUMN IF NOT EXISTS focus_mobile TEXT DEFAULT 'center';

-- Note: For products, focus will be stored in the images JSONB array per image
-- Example: [{"url": "...", "focus_desktop": "center", "focus_mobile": "top"}]