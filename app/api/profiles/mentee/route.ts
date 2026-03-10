import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { displayName, goals, background, email } = body;

  try {
    // Ensure user exists in DB
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: email ?? user.email! },
      create: { id: user.id, email: email ?? user.email!, role: "MENTEE" },
    });

    // Upsert mentee profile
    const profile = await prisma.menteeProfile.upsert({
      where: { userId: user.id },
      update: { displayName, goals, background },
      create: { userId: user.id, displayName, goals, background },
    });

    return NextResponse.json({ success: true, profileId: profile.id });
  } catch (error) {
    console.error("Error creating mentee profile:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}
