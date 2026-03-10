import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { ChatWindow } from "@/components/messages/ChatWindow";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface PageProps {
  params: Promise<{ conversationId: string }>;
}

export default async function ConversationPage({ params }: PageProps) {
  const { conversationId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const match = await prisma.match.findUnique({
    where: { id: conversationId },
    include: {
      mentor: { include: { user: true } },
      mentee: { include: { user: true } },
      messages: {
        include: { sender: { select: { id: true, email: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!match) notFound();

  // Verify user is a participant
  const isMentor = match.mentor.userId === user.id;
  const isMentee = match.mentee.userId === user.id;
  if (!isMentor && !isMentee) notFound();

  const other = isMentor ? match.mentee : match.mentor;

  const initialMessages = match.messages.map((m) => ({
    id: m.id,
    matchId: m.matchId,
    senderId: m.senderId,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    readAt: m.readAt?.toISOString() ?? null,
    sender: { email: m.sender.email },
  }));

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <Link href="/messages" className="text-sm text-muted-foreground hover:text-foreground">
          &larr;
        </Link>
        <Avatar className="h-10 w-10">
          <AvatarImage src={other.avatarUrl ?? undefined} />
          <AvatarFallback className="text-sm bg-primary/10 text-primary">
            {getInitials(other.displayName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{other.displayName}</p>
          <p className="text-xs text-muted-foreground">{other.user.email}</p>
        </div>
      </div>

      <ChatWindow
        matchId={conversationId}
        currentUserId={user.id}
        initialMessages={initialMessages}
      />
    </div>
  );
}
