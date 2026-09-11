CREATE OR REPLACE FUNCTION public.species_waitlist_count(p_species_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(COUNT(*), 0)::integer
  FROM public.species_waitlist
  WHERE species_id = p_species_id
    AND status = 'waiting';
$$;

CREATE OR REPLACE FUNCTION public.join_species_waitlist(
  p_species_id uuid,
  p_name text,
  p_phone text,
  p_consent boolean
)
RETURNS TABLE(queue_position integer, already_registered boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_phone_digits text;
  v_exists boolean;
  v_position integer;
BEGIN
  IF p_consent IS NOT TRUE THEN
    RAISE EXCEPTION 'E preciso aceitar a politica de privacidade';
  END IF;

  IF p_name IS NULL OR length(btrim(p_name)) < 2 THEN
    RAISE EXCEPTION 'Nome invalido';
  END IF;

  v_phone_digits := regexp_replace(COALESCE(p_phone, ''), '\D', '', 'g');
  IF length(v_phone_digits) < 10 THEN
    RAISE EXCEPTION 'Telefone invalido';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.species WHERE id = p_species_id) THEN
    RAISE EXCEPTION 'Especie nao encontrada';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.species_waitlist
    WHERE species_id = p_species_id
      AND regexp_replace(COALESCE(phone, ''), '\D', '', 'g') = v_phone_digits
  ) INTO v_exists;

  IF v_exists THEN
    SELECT COUNT(*)::integer INTO v_position
    FROM public.species_waitlist
    WHERE species_id = p_species_id AND status = 'waiting';
    RETURN QUERY SELECT GREATEST(v_position, 1), true;
    RETURN;
  END IF;

  INSERT INTO public.species_waitlist (species_id, name, phone, contact_preference, status, consent, consent_at)
  VALUES (p_species_id, btrim(p_name), btrim(p_phone), 'whatsapp', 'waiting', true, now());

  SELECT COUNT(*)::integer INTO v_position
  FROM public.species_waitlist
  WHERE species_id = p_species_id AND status = 'waiting';

  RETURN QUERY SELECT GREATEST(v_position, 1), false;
END;
$$;

REVOKE ALL ON FUNCTION public.species_waitlist_count(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.join_species_waitlist(uuid, text, text, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.species_waitlist_count(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.join_species_waitlist(uuid, text, text, boolean) TO anon, authenticated;

DELETE FROM public.species_waitlist WHERE name = 'Teste PR8 QA' AND phone = '(21) 90000-0001';