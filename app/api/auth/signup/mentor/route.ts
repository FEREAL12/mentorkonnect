import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";

// POST /api/auth/signup/mentor
// Creates a Supabase auth user via the admin API so the email is confirmed
// from the very start — no confirmation email, no waiting, sign-in works immediately.
export async function POST(request: Request) {
  const body = await request.json();
  const {
    email,
    password,
    displayName,
    title,
    country,
    yearsOfExperience,
    mentoringFormat,
    hourlyRate,
    preferredAvailabilityTime,
    avatarUrl,
    availability,
    bio,
  } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  // 1. Create the Supabase auth user with email pre-confirmed
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,          // no confirmation email needed
    user_metadata: { role: "MENTOR" },
  });

  if (userError || !userData.user) {
    return NextResponse.json(
      { error: userError?.message ?? "Failed to create account" },
      { status: 400 }
    );
  }

  const userId = userData.user.id;

  // 2. Upsert user row in Prisma DB
  await prisma.user.upsert({
    where: { id: userId },
    update: { email },
    create: { id: userId, email, role: "MENTOR" },
  });

  // 3. Create mentor profile
  try {
    await prisma.mentorProfile.upsert({
      where: { userId },
      update: {
        displayName,
        title,
        country: country ?? null,
        yearsOfExperience: yearsOfExperience !== undefined ? Number(yearsOfExperience) : null,
        mentoringFormat: mentoringFormat ?? null,
        hourlyRate: hourlyRate !== undefined && hourlyRate !== "" ? Number(hourlyRate) : null,
        preferredAvailabilityTime: preferredAvailabilityTime ?? null,
        avatarUrl: avatarUrl ?? null,
        availability: availability ?? {},
        bio,
      },
      create: {
        userId,
        displayName,
        title,
        bio,
        country: country ?? null,
        yearsOfExperience: yearsOfExperience !== undefined ? Number(yearsOfExperience) : null,
        mentoringFormat: mentoringFormat ?? null,
        hourlyRate: hourlyRate !== undefined && hourlyRate !== "" ? Number(hourlyRate) : null,
        preferredAvailabilityTime: preferredAvailabilityTime ?? null,
        avatarUrl: avatarUrl ?? null,
        availability: availability ?? {},
      },
    });
  } catch (err) {
    console.error("Failed to create mentor profile:", err);
    // Clean up the auth user so they can retry
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
