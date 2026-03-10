import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Cached per-request helper. React `cache()` deduplicates this call
 * within a single render pass — layout + page share the same result
 * without a second round-trip to Supabase Auth.
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
});
