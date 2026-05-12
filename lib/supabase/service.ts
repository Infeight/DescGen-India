// lib/supabase/service.ts  ← create this new file
import { createClient } from "@supabase/supabase-js";

// Service role bypasses RLS entirely — only use server-side, never expose to browser
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // ← different key, not the anon key
);