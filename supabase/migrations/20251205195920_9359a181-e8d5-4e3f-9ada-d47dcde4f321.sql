-- Add DELETE policy for authenticated users on contact_messages
CREATE POLICY "contact_messages_authenticated_delete"
ON public.contact_messages
FOR DELETE
USING ((SELECT auth.role()) = 'authenticated');