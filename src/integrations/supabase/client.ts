import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const SUPABASE_URL = "https://qvpflozwwtjbjfwfmjco.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cGZsb3p3d3RqYmpmd2ZtamNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NDA0MzksImV4cCI6MjA3MTMxNjQzOX0.AHLuWMyt240UF3L9r0P4qvvXaNqbbFIbYL9oR4kja2w";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});