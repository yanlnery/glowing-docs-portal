import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://xlhcneenthhhsjqqdmbm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaGNuZWVudGhoaHNqcXFkbWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMTkxMDAsImV4cCI6MjA2Mjg5NTEwMH0.sfzXDOllb7xUo2GSYslS_pQ3ei7rjKdEOcJI56EITt8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
//
// A sessão é persistida em cookies (em vez de localStorage), de modo que
// limpar os cookies do navegador invalida a sessão no cliente.
export const supabase = createBrowserClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);
