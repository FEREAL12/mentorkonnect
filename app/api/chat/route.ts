import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// GET /api/chat?sessionId=xxx — fetch messages for a session
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const messages = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return NextResponse.json(messages);
}

// POST /api/chat — send a message
export async function POST(request: Request) {
  const body = await request.json();
  const { sessionId, message, senderName, fromAdmin } = body;

  if (!sessionId || !message?.trim()) {
    return NextResponse.json({ error: "sessionId and message are required" }, { status: 400 });
  }

  // Only admins can send admin messages
  if (fromAdmin) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } });
    if (dbUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const msg = await prisma.chatMessage.create({
    data: {
      sessionId,
      message: message.trim(),
      senderName: senderName?.trim() || "Visitor",
      fromAdmin: fromAdmin ?? false,
    },
  });

  return NextResponse.json(msg, { status: 201 });
}
