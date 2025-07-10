-- Add missing updated_at triggers for tables that don't have them
-- Create trigger for products table
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for species table  
CREATE TRIGGER update_species_updated_at
    BEFORE UPDATE ON public.species
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for carousel_items table
CREATE TRIGGER update_carousel_items_updated_at
    BEFORE UPDATE ON public.carousel_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for manuals table
CREATE TRIGGER update_manuals_updated_at
    BEFORE UPDATE ON public.manuals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();