import { prisma } from "@/lib/prisma";
import { BookOpen, Clock, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProgrammesPage() {
  const programmes = await prisma.programme.findMany({
    where: { isActive: true },
    include: { _count: { select: { sessions: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Programmes</h1>
        <p className="text-muted-foreground mt-1">
          Structured mentorship programmes to accelerate your growth
        </p>
      </div>

      {programmes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="font-medium">No programmes available yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Check back soon for new structured mentorship programmes.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programmes.map((prog) => (
            <Card key={prog.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-3">{prog.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {prog.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0" />
                    {prog.durationWeeks} weeks
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 shrink-0" />
                    Max {prog.maxMentees} mentees
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/programmes/${prog.id}`}>Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
