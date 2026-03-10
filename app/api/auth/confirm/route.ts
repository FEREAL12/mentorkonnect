import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";

// POST /api/auth/confirm
// Accepts a userId from the client right after signUp().
// When Supabase email confirmation is ON, signUp() returns no session,
// so we cannot use cookie-based auth here — we verify the userId via the admin API instead.
export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  // Verify the userId is a real Supabase auth user (same pattern as /api/profiles/mentor)
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (authError || !authUser.user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Auto-confirm email so the user can sign in immediately
  await supabaseAdmin.auth.admin.updateUserById(userId, { email_confirm: true });

  // Ensure the user row exists in our DB
  const role = (authUser.user.user_metadata?.role as string) ?? "MENTEE";
  await prisma.user.upsert({
    where: { id: userId },
    update: { email: authUser.user.email! },
    create: { id: userId, email: authUser.user.email!, role: role as "ADMIN" | "MENTOR" | "MENTEE" },
  });

  return NextResponse.json({ success: true });
}
