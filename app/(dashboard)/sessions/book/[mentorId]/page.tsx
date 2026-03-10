import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { BookSessionForm } from "@/components/sessions/BookSessionForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import Link from "next/link";

interface PageProps {
  params: Promise<{ mentorId: string }>;
}

export default async function BookSessionPage({ params }: PageProps) {
  const { mentorId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const role = (user.user_metadata?.role as string) ?? "MENTEE";
  if (role !== "MENTEE") redirect("/sessions");

  const [mentorProfile, menteeProfile] = await Promise.all([
    prisma.mentorProfile.findUnique({
      where: { id: mentorId },
      include: { skills: { include: { skill: true } }, user: { select: { email: true } } },
    }),
    prisma.menteeProfile.findUnique({ where: { userId: user.id } }),
  ]);

  if (!mentorProfile) notFound();
  if (!menteeProfile) redirect("/profile/setup");

  // Verify there's an accepted match
  const match = await prisma.match.findUnique({
    where: {
      mentorId_menteeId: { mentorId: mentorProfile.id, menteeId: menteeProfile.id },
    },
  });

  if (!match || match.status !== "ACCEPTED") {
    redirect(`/mentors/${mentorId}`);
  }

  const programmes = await prisma.programme.findMany({
    where: { isActive: true },
    orderBy: { title: "asc" },
  });

  const availability = mentorProfile.availability as Record<string, string[]>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/sessions" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Back to Sessions
      </Link>

      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={mentorProfile.avatarUrl ?? undefined} />
          <AvatarFallback className="text-sm bg-primary/10 text-primary">
            {getInitials(mentorProfile.displayName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">
            Book a Session with {mentorProfile.displayName}
          </h1>
          <p className="text-muted-foreground">{mentorProfile.title}</p>
        </div>
      </div>

      <BookSessionForm
        matchId={match.id}
        mentorUserId={mentorProfile.userId}
        menteeUserId={user.id}
        menteeEmail={user.email ?? ""}
        hourlyRate={Number(mentorProfile.hourlyRate ?? 0)}
        availability={availability}
        programmes={programmes}
      />
    </div>
  );
}
