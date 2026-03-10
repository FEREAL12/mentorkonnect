import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";

// POST /api/auth/complete-signup
// Called immediately after client-side OTP verification succeeds.
// Upserts the user row in our DB and, for mentors, creates their profile.
export async function POST(request: Request) {
  const body = await request.json();
  const { userId, email, role, mentorData } = body;

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  // Confirm the user exists in Supabase auth
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (authError || !authUser.user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // For phone-auth users, email lives in user_metadata (set at signUp time)
  const resolvedEmail: string =
    email ||
    (authUser.user.user_metadata?.email as string | undefined) ||
    authUser.user.email ||
    "";

  if (!resolvedEmail) {
    return NextResponse.json({ error: "Could not determine user email" }, { status: 400 });
  }

  // Upsert user row in our DB
  await prisma.user.upsert({
    where: { id: userId },
    update: { email: resolvedEmail },
    create: {
      id: userId,
      email: resolvedEmail,
      role: (role ?? "MENTEE") as "ADMIN" | "MENTOR" | "MENTEE",
    },
  });

  // Create mentor profile if this is a mentor signup
  if (role === "MENTOR" && mentorData) {
    await prisma.mentorProfile.upsert({
      where: { userId },
      update: {
        displayName: mentorData.displayName,
        title: mentorData.title,
        bio: mentorData.bio,
        country: mentorData.country ?? null,
        yearsOfExperience:
          mentorData.yearsOfExperience != null ? Number(mentorData.yearsOfExperience) : null,
        mentoringFormat: mentorData.mentoringFormat ?? null,
        hourlyRate:
          mentorData.hourlyRate != null && mentorData.hourlyRate !== ""
            ? Number(mentorData.hourlyRate)
            : null,
        preferredAvailabilityTime: mentorData.preferredAvailabilityTime ?? null,
        avatarUrl: mentorData.avatarUrl ?? null,
        availability: mentorData.availability ?? {},
      },
      create: {
        userId,
        displayName: mentorData.displayName,
        title: mentorData.title,
        bio: mentorData.bio,
        country: mentorData.country ?? null,
        yearsOfExperience:
          mentorData.yearsOfExperience != null ? Number(mentorData.yearsOfExperience) : null,
        mentoringFormat: mentorData.mentoringFormat ?? null,
        hourlyRate:
          mentorData.hourlyRate != null && mentorData.hourlyRate !== ""
            ? Number(mentorData.hourlyRate)
            : null,
        preferredAvailabilityTime: mentorData.preferredAvailabilityTime ?? null,
        avatarUrl: mentorData.avatarUrl ?? null,
        availability: mentorData.availability ?? {},
      },
    });
  }

  return NextResponse.json({ success: true });
}
