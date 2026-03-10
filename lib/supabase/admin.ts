import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — bypasses RLS and session cookies.
 * Only use server-side (API routes, Server Actions). Never expose to the browser.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
