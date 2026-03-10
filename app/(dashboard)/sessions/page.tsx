import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionCard } from "@/components/sessions/SessionCard";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

export default async function SessionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const role = (user.user_metadata?.role as string) ?? "MENTEE";

  const baseWhere =
    role === "MENTOR" ? { mentorId: user.id } : { menteeId: user.id };

  const [upcoming, past, pending] = await Promise.all([
    prisma.session.findMany({
      where: {
        ...baseWhere,
        status: { in: ["CONFIRMED"] },
        scheduledAt: { gte: new Date() },
      },
      include: { mentor: true, mentee: true, programme: true },
      orderBy: { scheduledAt: "asc" },
    }),
    prisma.session.findMany({
      where: {
        ...baseWhere,
        OR: [
          { status: "COMPLETED" },
          { scheduledAt: { lt: new Date() } },
        ],
      },
      include: { mentor: true, mentee: true, programme: true },
      orderBy: { scheduledAt: "desc" },
      take: 20,
    }),
    prisma.session.findMany({
      where: { ...baseWhere, status: "PENDING" },
      include: { mentor: true, mentee: true, programme: true },
      orderBy: { scheduledAt: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sessions</h1>
          <p className="text-muted-foreground mt-1">
            Manage your mentorship sessions
          </p>
        </div>
        {role === "MENTEE" && (
          <Button asChild>
            <Link href="/mentors">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Book a Session
            </Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4 space-y-4">
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No upcoming sessions
            </p>
          ) : (
            upcoming.map((session) => (
              <SessionCard key={session.id} session={session} currentUserId={user.id} />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-4 space-y-4">
          {pending.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No pending sessions
            </p>
          ) : (
            pending.map((session) => (
              <SessionCard key={session.id} session={session} currentUserId={user.id} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4 space-y-4">
          {past.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No past sessions
            </p>
          ) : (
            past.map((session) => (
              <SessionCard key={session.id} session={session} currentUserId={user.id} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
