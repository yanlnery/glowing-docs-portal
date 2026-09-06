ALTER TABLE public.backup_pr0_20260905_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_pr0_20260905_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_pr0_20260905_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_pr0_20260905_species ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.backup_pr0_20260905_orders FROM anon, authenticated;
REVOKE ALL ON public.backup_pr0_20260905_order_items FROM anon, authenticated;
REVOKE ALL ON public.backup_pr0_20260905_products FROM anon, authenticated;
REVOKE ALL ON public.backup_pr0_20260905_species FROM anon, authenticated;