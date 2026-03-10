import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const message = await prisma.message.findUnique({
    where: { id },
    include: {
      sender: { select: { id: true, email: true } },
      match: { include: { mentor: true, mentee: true } },
    },
  });

  if (!message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  // Verify user is a participant
  const isMentor = message.match.mentor.userId === user.id;
  const isMentee = message.match.mentee.userId === user.id;
  if (!isMentor && !isMentee) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    id: message.id,
    matchId: message.matchId,
    senderId: message.senderId,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    readAt: message.readAt?.toISOString() ?? null,
    sender: { email: message.sender.email },
  });
}
