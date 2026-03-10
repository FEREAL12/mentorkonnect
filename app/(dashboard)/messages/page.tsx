import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, getInitials } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const role = (user.user_metadata?.role as string) ?? "MENTEE";

  // Fetch matches with last message
  let matches;
  if (role === "MENTOR") {
    const profile = await prisma.mentorProfile.findUnique({ where: { userId: user.id } });
    if (!profile) redirect("/profile/setup");
    matches = await prisma.match.findMany({
      where: { mentorId: profile.id, status: "ACCEPTED" },
      include: {
        mentee: { include: { user: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });
  } else {
    const profile = await prisma.menteeProfile.findUnique({ where: { userId: user.id } });
    if (!profile) redirect("/profile/setup");
    matches = await prisma.match.findMany({
      where: { menteeId: profile.id, status: "ACCEPTED" },
      include: {
        mentor: { include: { user: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-1">
          Your mentorship conversations
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="font-medium">No conversations yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            You&apos;ll see messages here once you have an accepted match.
          </p>
        </div>
      ) : (
        <div className="divide-y rounded-lg border bg-white overflow-hidden">
          {matches.map((match) => {
            const other =
              role === "MENTOR"
                ? (match as { mentee: { displayName: string; avatarUrl: string | null; user: { email: string } } }).mentee
                : (match as { mentor: { displayName: string; avatarUrl: string | null; user: { email: string } } }).mentor;
            const lastMessage = match.messages[0];

            return (
              <Link
                key={match.id}
                href={`/messages/${match.id}`}
                className="flex items-center gap-4 p-4 hover:bg-accent transition-colors"
              >
                <Avatar className="h-11 w-11 shrink-0">
                  <AvatarImage src={other.avatarUrl ?? undefined} />
                  <AvatarFallback className="text-sm bg-primary/10 text-primary">
                    {getInitials(other.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium truncate">{other.displayName}</p>
                    {lastMessage && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatDate(lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {lastMessage?.content ?? "No messages yet"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
