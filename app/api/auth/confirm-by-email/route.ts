import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// POST /api/auth/confirm-by-email
// Looks up a user by email and confirms their account if it isn't already confirmed.
// Called from the login form when Supabase returns "Email not confirmed".
export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Find the user by email using the admin API
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) {
    return NextResponse.json({ error: "Failed to look up user" }, { status: 500 });
  }

  const user = data.users.find((u) => u.email === email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Confirm the email if not already confirmed
  if (!user.email_confirmed_at) {
    await supabaseAdmin.auth.admin.updateUserById(user.id, { email_confirm: true });
  }

  return NextResponse.json({ success: true });
}
