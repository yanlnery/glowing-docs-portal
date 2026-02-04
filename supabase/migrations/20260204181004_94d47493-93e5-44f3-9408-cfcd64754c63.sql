-- Permitir que usuários criem seu próprio perfil (bootstrap)
CREATE POLICY "profiles_user_insert_own"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);