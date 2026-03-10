import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, Clock, Users, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProgrammeDetailPage({ params }: PageProps) {
  const { id } = await params;

  const programme = await prisma.programme.findUnique({
    where: { id },
    include: {
      _count: { select: { sessions: true } },
    },
  });

  if (!programme) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/programmes"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Programmes
      </Link>

      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shrink-0">
          <BookOpen className="h-7 w-7 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">{programme.title}</h1>
            {programme.isActive && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            {programme.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xl font-bold">{programme.durationWeeks}</p>
              <p className="text-xs text-muted-foreground">Weeks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xl font-bold">{programme.maxMentees}</p>
              <p className="text-xs text-muted-foreground">Max Mentees</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xl font-bold">{programme._count.sessions}</p>
              <p className="text-xs text-muted-foreground">Sessions Booked</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to enrol</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            To enrol in this programme, you first need to be matched with a
            mentor. Once you have an accepted match, you can book sessions and
            link them to this programme.
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Browse the mentor directory and find a mentor that suits you</li>
            <li>Send a match request and wait for acceptance</li>
            <li>
              Book a session with your mentor and link it to &quot;{programme.title}&quot;
            </li>
          </ol>
          <Button asChild className="mt-4">
            <Link href="/mentors">Find a Mentor</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
