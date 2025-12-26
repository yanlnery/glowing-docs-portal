-- Remover as policies existentes
DROP POLICY IF EXISTS "material_leads_public_insert" ON public.material_leads;
DROP POLICY IF EXISTS "material_leads_admin_all" ON public.material_leads;

-- Criar policy de INSERT para usuários anônimos e autenticados
CREATE POLICY "material_leads_public_insert"
ON public.material_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Criar policies específicas para admin (SELECT, UPDATE, DELETE)
CREATE POLICY "material_leads_admin_select"
ON public.material_leads
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "material_leads_admin_update"
ON public.material_leads
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "material_leads_admin_delete"
ON public.material_leads
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));

-- Garantir GRANTs corretos
GRANT INSERT ON public.material_leads TO anon;
GRANT INSERT ON public.material_leads TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.material_leads TO authenticated;