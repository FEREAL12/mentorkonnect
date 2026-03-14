import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";
import { verifyAndDecodeToken } from "@/lib/otp";

// POST /api/auth/verify-custom-otp
export async function POST(request: Request) {
  const { otp, pendingToken } = await request.json();

  if (!otp || !pendingToken) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const payload = verifyAndDecodeToken(pendingToken);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  if (Date.now() > (payload.exp as number)) {
    return NextResponse.json({ error: "Code expired. Please sign up again." }, { status: 400 });
  }

  if (otp !== payload.otp) {
    return NextResponse.json({ error: "Invalid code. Please try again." }, { status: 400 });
  }

  const { email, password, role, mentorData } = payload as {
    email: string;
    password: string;
    role: "MENTOR" | "MENTEE";
    mentorData: Record<string, unknown> | null;
  };

  // Create Supabase user with email pre-confirmed
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role },
  });

  if (userError || !userData.user) {
    const msg = userError?.message ?? "";
    if (msg.includes("already been registered") || msg.includes("already exists")) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: msg || "Failed to create account" }, { status: 400 });
  }

  const userId = userData.user.id;

  // Upsert user row in DB
  await prisma.user.upsert({
    where: { id: userId },
    update: { email },
    create: { id: userId, email, role: role ?? "MENTEE" },
  });

  // Create mentor profile if needed
  if (role === "MENTOR" && mentorData) {
    await prisma.mentorProfile.upsert({
      where: { userId },
      update: {
        displayName: mentorData.displayName as string,
        title: mentorData.title as string,
        bio: mentorData.bio as string,
        country: (mentorData.country as string) ?? null,
        yearsOfExperience: mentorData.yearsOfExperience != null ? Number(mentorData.yearsOfExperience) : null,
        mentoringFormat: (mentorData.mentoringFormat as "VIRTUAL" | "HYBRID" | "IN_PERSON") ?? null,
        hourlyRate: mentorData.hourlyRate != null && mentorData.hourlyRate !== "" ? Number(mentorData.hourlyRate) : null,
        preferredAvailabilityTime: (mentorData.preferredAvailabilityTime as string) ?? null,
        avatarUrl: (mentorData.avatarUrl as string) ?? null,
        availability: (mentorData.availability as object) ?? {},
      },
      create: {
        userId,
        displayName: mentorData.displayName as string,
        title: mentorData.title as string,
        bio: mentorData.bio as string,
        country: (mentorData.country as string) ?? null,
        yearsOfExperience: mentorData.yearsOfExperience != null ? Number(mentorData.yearsOfExperience) : null,
        mentoringFormat: (mentorData.mentoringFormat as "VIRTUAL" | "HYBRID" | "IN_PERSON") ?? null,
        hourlyRate: mentorData.hourlyRate != null && mentorData.hourlyRate !== "" ? Number(mentorData.hourlyRate) : null,
        preferredAvailabilityTime: (mentorData.preferredAvailabilityTime as string) ?? null,
        avatarUrl: (mentorData.avatarUrl as string) ?? null,
        availability: (mentorData.availability as object) ?? {},
      },
    });
  }

  // Sign the user in to get session tokens
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({ email, password });

  if (signInError || !signInData.session) {
    // Account created — user can log in manually
    return NextResponse.json({ success: true, session: null });
  }

  return NextResponse.json({
    success: true,
    session: {
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
    },
  });
}
