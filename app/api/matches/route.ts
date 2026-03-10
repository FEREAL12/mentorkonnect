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

  const role = (user.user_metadata?.role as string) ?? "MENTEE";
  if (role !== "MENTEE") {
    return NextResponse.json(
      { error: "Only mentees can request matches" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { mentorProfileId, message } = body;

  if (!mentorProfileId) {
    return NextResponse.json(
      { error: "mentorProfileId is required" },
      { status: 400 }
    );
  }

  try {
    // Get mentee profile
    const menteeProfile = await prisma.menteeProfile.findUnique({
      where: { userId: user.id },
    });

    if (!menteeProfile) {
      return NextResponse.json(
        { error: "Mentee profile not found. Please complete your profile first." },
        { status: 404 }
      );
    }

    // Check mentor exists
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { id: mentorProfileId },
    });

    if (!mentorProfile) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    // Create match (upsert to avoid duplicates)
    const match = await prisma.match.upsert({
      where: {
        mentorId_menteeId: {
          mentorId: mentorProfileId,
          menteeId: menteeProfile.id,
        },
      },
      update: { message, status: "PENDING" },
      create: {
        mentorId: mentorProfileId,
        menteeId: menteeProfile.id,
        message,
        status: "PENDING",
      },
    });

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error("Error creating match:", error);
    return NextResponse.json({ error: "Failed to create match" }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (user.user_metadata?.role as string) ?? "MENTEE";

  try {
    let matches;
    if (role === "MENTOR") {
      const profile = await prisma.mentorProfile.findUnique({
        where: { userId: user.id },
      });
      if (!profile) return NextResponse.json([]);
      matches = await prisma.match.findMany({
        where: { mentorId: profile.id },
        include: { mentee: true },
        orderBy: { createdAt: "desc" },
      });
    } else {
      const profile = await prisma.menteeProfile.findUnique({
        where: { userId: user.id },
      });
      if (!profile) return NextResponse.json([]);
      matches = await prisma.match.findMany({
        where: { menteeId: profile.id },
        include: { mentor: true },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}
