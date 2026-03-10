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
  const { matchId, content } = body;

  if (!matchId || !content?.trim()) {
    return NextResponse.json(
      { error: "matchId and content are required" },
      { status: 400 }
    );
  }

  // Verify user is a participant in this match
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { mentor: true, mentee: true },
  });

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const isMentor = match.mentor.userId === user.id;
  const isMentee = match.mentee.userId === user.id;

  if (!isMentor && !isMentee) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const message = await prisma.message.create({
      data: {
        matchId,
        senderId: user.id,
        content: content.trim(),
      },
      include: {
        sender: { select: { id: true, email: true } },
      },
    });

    return NextResponse.json(
      {
        id: message.id,
        matchId: message.matchId,
        senderId: message.senderId,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
        readAt: message.readAt?.toISOString() ?? null,
        sender: { email: message.sender.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
