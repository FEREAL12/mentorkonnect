import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, BookOpen, Calendar } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "ADMIN") redirect("/sessions");

  const [totalUsers, mentors, mentees, unverified, programmes, sessions] =
    await prisma.$transaction([
      prisma.user.count(),
      prisma.mentorProfile.count(),
      prisma.menteeProfile.count(),
      prisma.mentorProfile.count({ where: { isVerified: false } }),
      prisma.programme.count(),
      prisma.session.count(),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">Manage the MentorKonnect platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Users, label: "Total Users", value: totalUsers },
          { icon: UserCheck, label: "Mentors", value: mentors },
          { icon: Users, label: "Mentees", value: mentees },
          { icon: UserCheck, label: "Unverified Mentors", value: unverified },
          { icon: BookOpen, label: "Programmes", value: programmes },
          { icon: Calendar, label: "Total Sessions", value: sessions },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 flex-wrap">
        <Button asChild>
          <Link href="/admin/users">Manage Users</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/programmes">Manage Programmes</Link>
        </Button>
      </div>
    </div>
  );
}
