import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { sendBookingNotificationToMentor } from "@/lib/email";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    matchId: bodyMatchId,
    mentorProfileId,
    mentorId: bodyMentorId,
    menteeId: bodyMenteeId,
    scheduledAt,
    durationMins,
    notes,
    meetingUrl,
    programmeId,
  } = body;

  if (!scheduledAt) {
    return NextResponse.json({ error: "scheduledAt is required" }, { status: 400 });
  }

  let resolvedMatchId = bodyMatchId;
  let resolvedMentorId = bodyMentorId;
  let resolvedMenteeId = bodyMenteeId;

  // Direct booking path: auto-find or create a match using mentorProfileId
  if (!resolvedMatchId) {
    if (!mentorProfileId) {
      return NextResponse.json(
        { error: "Either matchId or mentorProfileId is required" },
        { status: 400 }
      );
    }

    // Get the mentee's profile
    const menteeProfile = await prisma.menteeProfile.findUnique({
      where: { userId: user.id },
    });
    if (!menteeProfile) {
      return NextResponse.json(
        { error: "Please complete your mentee profile before booking" },
        { status: 400 }
      );
    }

    // Get the mentor profile (to resolve their userId)
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { id: mentorProfileId },
    });
    if (!mentorProfile) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    // Find or create an ACCEPTED match
    let match = await prisma.match.findUnique({
      where: {
        mentorId_menteeId: {
          mentorId: mentorProfileId,
          menteeId: menteeProfile.id,
        },
      },
    });

    if (!match) {
      match = await prisma.match.create({
        data: {
          mentorId: mentorProfileId,
          menteeId: menteeProfile.id,
          status: "ACCEPTED",
        },
      });
    } else if (match.status === "REJECTED") {
      match = await prisma.match.update({
        where: { id: match.id },
        data: { status: "ACCEPTED" },
      });
    }

    resolvedMatchId = match.id;
    resolvedMentorId = mentorProfile.userId;
    resolvedMenteeId = user.id;
  }

  // Validate the caller is the mentee
  if (user.id !== resolvedMenteeId) {
    return NextResponse.json(
      { error: "Only the mentee can book a session" },
      { status: 403 }
    );
  }

  try {
    const session = await prisma.session.create({
      data: {
        matchId: resolvedMatchId,
        mentorId: resolvedMentorId,
        menteeId: resolvedMenteeId,
        scheduledAt: new Date(scheduledAt),
        durationMins: durationMins ?? 60,
        notes,
        meetingUrl,
        programmeId: programmeId ?? null,
        status: "PENDING",
      },
    });

    // Notify the mentor about the new booking
    const [menteeUser, mentorUser] = await Promise.all([
      prisma.user.findUnique({
        where: { id: resolvedMenteeId },
        select: { menteeProfile: { select: { displayName: true } }, email: true },
      }),
      prisma.user.findUnique({
        where: { id: resolvedMentorId },
        select: { mentorProfile: { select: { displayName: true } }, email: true },
      }),
    ]);

    const menteeName =
      menteeUser?.menteeProfile?.displayName ?? menteeUser?.email ?? "A mentee";
    const mentorName =
      mentorUser?.mentorProfile?.displayName ?? mentorUser?.email ?? "Mentor";
    const scheduledDate = new Date(scheduledAt);
    const dateStr = scheduledDate.toLocaleDateString("en-GB", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
    const timeStr = scheduledDate.toLocaleTimeString("en-GB", {
      hour: "2-digit", minute: "2-digit",
    });

    await prisma.notification.create({
      data: {
        userId: resolvedMentorId,
        title: "New session booking",
        body: `${menteeName} booked a ${durationMins ?? 60}-min session on ${dateStr} at ${timeStr}.`,
        link: "/sessions",
      },
    });

    // Send email notification to mentor (awaited so errors surface in logs)
    if (mentorUser?.email) {
      try {
        await sendBookingNotificationToMentor({
          mentorEmail: mentorUser.email,
          mentorName,
          menteeName,
          scheduledAt: scheduledDate,
          durationMins: durationMins ?? 60,
          notes,
        });
      } catch (emailErr) {
        console.error("[sessions] Booking email failed:", emailErr);
      }
    } else {
      console.warn("[sessions] Mentor email not found, skipping email notification");
    }

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Failed to book session" }, { status: 500 });
  }
}
