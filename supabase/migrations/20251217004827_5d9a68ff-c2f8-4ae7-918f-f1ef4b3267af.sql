-- Restrict public access to system_settings to only non-sensitive UI settings
-- The WhatsApp number should not be publicly queryable via database

-- Drop the current overly permissive public read policy
DROP POLICY IF EXISTS "system_settings_public_read_consolidated" ON public.system_settings;

-- Create a new restrictive policy that only allows reading specific UI-related settings
CREATE POLICY "system_settings_public_read_ui_only"
ON public.system_settings
FOR SELECT
TO public
USING (
  key IN (
    'isAcademyVisible',
    'isAcademyOpenForSubscription',
    'academy_visible',
    'academy_open_for_subscription'
  )
);

-- Admin policy remains unchanged - admins can read all settings