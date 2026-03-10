"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server Action: sign the user in with email + password.
 *
 * Because this runs on the server, the session cookie is written to the
 * response BEFORE the redirect fires — no client-side timing race.
 *
 * Returns `{ error: string }` on failure; throws a redirect on success.
 */
export async function signIn(email: string, password: string, expectedRole?: "MENTOR" | "MENTEE") {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data?.user) {
    return { error: error?.message ?? "Sign in failed" };
  }

  const role = (data.user.user_metadata?.role as string) ?? "MENTEE";

  // Enforce role-specific login pages
  if (expectedRole && role !== "ADMIN" && role !== expectedRole) {
    await supabase.auth.signOut();
    return {
      error:
        expectedRole === "MENTOR"
          ? "This account is not a mentor account. Please use the mentee sign in."
          : "This account is not a mentee account. Please use the mentor sign in.",
    };
  }

  const dest = role === "ADMIN" ? "/admin" : "/";

  redirect(dest);
}
