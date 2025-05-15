
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const SUPABASE_URL = "https://xlhcneenthhhsjqqdmbm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaGNuZWVudGhoaHNqcXFkbWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMTkxMDAsImV4cCI6MjA2Mjg5NTEwMH0.sfzXDOllb7xUo2GSYslS_pQ3ei7rjKdEOcJI56EITt8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
