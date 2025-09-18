-- Reduce OTP token expiry time to 10 minutes (600 seconds) for better security
-- This improves temporary access security by reducing the window for OTP exploitation
ALTER SYSTEM SET auth.jwt_aud = 'authenticated';
ALTER SYSTEM SET auth.jwt_exp = 3600;

-- Note: The OTP expiry setting might need to be configured via Supabase Dashboard
-- as it's an auth-specific configuration that may not be accessible via SQL migrations