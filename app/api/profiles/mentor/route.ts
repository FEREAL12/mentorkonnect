import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    userId,
    displayName,
    title,
    company,
    bio,
    linkedinUrl,
    avatarUrl,
    yearsOfExperience,
    timezone,
    preferredAvailabilityTime,
    country,
    qualification,
    mentoringFormat,
    hourlyRate,
    skills,
    availability,
    email,
  } = body;

  // Verify the userId belongs to a real Supabase auth user
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (authError || !authUser.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Auto-confirm email so the mentor can sign in immediately
  await supabaseAdmin.auth.admin.updateUserById(userId, { email_confirm: true });

  const profileFields = {
    displayName,
    title,
    company: company ?? null,
    bio,
    linkedinUrl: linkedinUrl || null,
    avatarUrl: avatarUrl ?? null,
    yearsOfExperience: yearsOfExperience !== undefined ? Number(yearsOfExperience) : null,
    timezone: timezone ?? "UTC",
    preferredAvailabilityTime: preferredAvailabilityTime ?? null,
    country: country ?? null,
    qualification: qualification ?? null,
    mentoringFormat: mentoringFormat ?? null,
    hourlyRate: hourlyRate !== undefined && hourlyRate !== "" ? Number(hourlyRate) : null,
    availability: availability ?? {},
  };

  try {
    // Ensure user exists in DB
    await prisma.user.upsert({
      where: { id: userId },
      update: { email: email ?? authUser.user.email! },
      create: { id: userId, email: email ?? authUser.user.email!, role: "MENTOR" },
    });

    // Upsert mentor profile
    const profile = await prisma.mentorProfile.upsert({
      where: { userId },
      update: profileFields,
      create: { userId, ...profileFields },
    });

    // Sync skills
    if (skills && Array.isArray(skills)) {
      await prisma.mentorSkill.deleteMany({ where: { mentorId: profile.id } });
      if (skills.length > 0) {
        await prisma.mentorSkill.createMany({
          data: skills.map((skillId: string) => ({
            mentorId: profile.id,
            skillId,
          })),
          skipDuplicates: true,
        });
      }
    }

    return NextResponse.json({ success: true, profileId: profile.id });
  } catch (error) {
    console.error("Error creating mentor profile:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}
