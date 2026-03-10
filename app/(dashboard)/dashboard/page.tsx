import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import {
  Calendar,
  MessageSquare,
  Users,
  Clock,
  TrendingUp,
  UserCheck,
  DollarSign,
  CheckCircle,
  Star,
  Pencil,
  ArrowRight,
  Banknote,
} from "lucide-react";
import { getUser } from "@/lib/data/get-user";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateTime, getInitials } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const role = (user.user_metadata?.role as string) ?? "MENTEE";

  if (role === "MENTOR") return <MentorDashboard userId={user.id} />;
  if (role === "MENTEE") redirect("/");
  if (role === "ADMIN") return <AdminDashboard />;

  redirect("/sessions");
}

// ─── Server Actions ───────────────────────────────────────────────────────────

async function acceptMatch(matchId: string) {
  "use server";
  await prisma.match.update({ where: { id: matchId }, data: { status: "ACCEPTED" } });
  revalidatePath("/dashboard");
}

async function rejectMatch(matchId: string) {
  "use server";
  await prisma.match.update({ where: { id: matchId }, data: { status: "REJECTED" } });
  revalidatePath("/dashboard");
}

// ─── Mentor Dashboard ─────────────────────────────────────────────────────────

async function MentorDashboard({ userId }: { userId: string }) {
  const profile = await prisma.mentorProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      displayName: true,
      title: true,
      company: true,
      hourlyRate: true,
      isVerified: true,
      mentoringFormat: true,
      yearsOfExperience: true,
      avatarUrl: true,
    },
  });

  if (!profile) redirect("/profile/setup");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    pendingMatches,
    upcomingSessions,
    recentBookings,
    completedAllTime,
    completedThisMonth,
    counts,
  ] = await Promise.all([
    // Pending match requests
    prisma.match.findMany({
      where: { mentorId: profile.id, status: "PENDING" },
      include: { mentee: { include: { user: { select: { email: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    // Upcoming sessions
    prisma.session.findMany({
      where: {
        mentorId: userId,
        status: { in: ["PENDING", "CONFIRMED"] },
        scheduledAt: { gte: now },
      },
      include: {
        mentee: {
          include: {
            menteeProfile: { select: { displayName: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { scheduledAt: "asc" },
      take: 5,
    }),
    // Recent bookings (all statuses, newest first)
    prisma.session.findMany({
      where: { mentorId: userId },
      include: {
        mentee: {
          include: {
            menteeProfile: { select: { displayName: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    // Completed sessions all-time (for total hours + earnings)
    prisma.session.findMany({
      where: { mentorId: userId, status: "COMPLETED" },
      select: { durationMins: true },
    }),
    // Completed sessions this month
    prisma.session.findMany({
      where: {
        mentorId: userId,
        status: "COMPLETED",
        scheduledAt: { gte: startOfMonth },
      },
      select: { durationMins: true },
    }),
    // Counts
    prisma.$transaction([
      prisma.match.count({ where: { mentorId: profile.id, status: "ACCEPTED" } }), // [0] active mentees
      prisma.session.count({ where: { mentorId: userId, status: "COMPLETED" } }),   // [1] completed
      prisma.match.count({ where: { mentorId: profile.id, status: "PENDING" } }),   // [2] pending requests
      prisma.session.count({ where: { mentorId: userId } }),                         // [3] total booked
    ]),
  ]);

  const hourlyRate = profile.hourlyRate ? Number(profile.hourlyRate) : null;
  const totalHours = completedAllTime.reduce((s, x) => s + x.durationMins, 0) / 60;
  const monthHours = completedThisMonth.reduce((s, x) => s + x.durationMins, 0) / 60;
  const totalEarnings = hourlyRate !== null ? hourlyRate * totalHours : null;
  const monthEarnings = hourlyRate !== null ? hourlyRate * monthHours : null;

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            <AvatarImage src={profile.avatarUrl ?? undefined} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {getInitials(profile.displayName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {profile.displayName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {profile.title}
              {profile.company ? ` · ${profile.company}` : ""}
              {profile.yearsOfExperience ? ` · ${profile.yearsOfExperience} yrs exp` : ""}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {profile.isVerified && (
                <Badge className="bg-green-100 text-green-700 border-green-200 gap-1 text-xs">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </Badge>
              )}
              {profile.mentoringFormat && (
                <Badge variant="outline" className="text-xs capitalize">
                  {profile.mentoringFormat.toLowerCase().replace("_", "-")}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href="/profile/edit">
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Edit Profile
          </Link>
        </Button>
      </div>

      {/* ── Earnings & Price highlight ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Hourly rate */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Your Rate</p>
                {hourlyRate !== null ? (
                  <p className="text-3xl font-bold text-primary">${hourlyRate.toFixed(0)}</p>
                ) : (
                  <p className="text-xl font-bold text-muted-foreground">Not set</p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">per hour</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Pencil className="h-3 w-3" />
              {hourlyRate !== null ? "Update rate" : "Set your rate"}
            </Link>
          </CardContent>
        </Card>

        {/* This month's earnings */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">This Month</p>
                <p className="text-3xl font-bold">
                  {monthEarnings !== null
                    ? `$${monthEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    : "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {monthHours.toFixed(1)} hrs completed
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All-time earnings */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">All-Time Earnings</p>
                <p className="text-3xl font-bold">
                  {totalEarnings !== null
                    ? `$${totalEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    : "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {totalHours.toFixed(1)} hrs total
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                <Banknote className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions summary */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Sessions</p>
                <p className="text-3xl font-bold">{counts[3]}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {counts[1]} completed · {counts[3] - counts[1]} pending
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Secondary stats ── */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <StatCard icon={Users} title="Active Mentees" display={String(counts[0])} color="pink" />
        <StatCard icon={CheckCircle} title="Completed" display={String(counts[1])} color="emerald" />
        <StatCard icon={Clock} title="Hours Mentored" display={`${totalHours.toFixed(1)}h`} color="orange" />
        <StatCard icon={Star} title="Pending Requests" display={String(counts[2])} color="amber" />
      </div>

      {/* ── Main panels ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Pending requests */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Pending Requests
              </CardTitle>
              {counts[2] > 0 && (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                  {counts[2]} new
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">Mentees waiting for your response</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingMatches.length === 0 ? (
              <div className="py-6 text-center">
                <Users className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No pending requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingMatches.map((match) => (
                  <div key={match.id} className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9 mt-0.5">
                        <AvatarImage src={match.mentee.avatarUrl ?? undefined} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {getInitials(match.mentee.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{match.mentee.displayName}</p>
                        <p className="text-xs text-muted-foreground">{match.mentee.user.email}</p>
                        {match.message && (
                          <p className="text-xs text-muted-foreground mt-1 italic line-clamp-2">
                            &ldquo;{match.message}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <form action={acceptMatch.bind(null, match.id)}>
                        <Button type="submit" size="sm" className="h-7 px-2 text-xs">Accept</Button>
                      </form>
                      <form action={rejectMatch.bind(null, match.id)}>
                        <Button type="submit" size="sm" variant="outline" className="h-7 px-2 text-xs">
                          Decline
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming sessions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription className="text-xs">Your next scheduled sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length === 0 ? (
              <div className="py-6 text-center">
                <Calendar className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No upcoming sessions</p>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingSessions.map((session) => {
                  const name = session.mentee.menteeProfile?.displayName ?? session.mentee.email;
                  return (
                    <div key={session.id} className="flex items-center justify-between gap-3 rounded-lg p-2 hover:bg-accent transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={session.mentee.menteeProfile?.avatarUrl ?? undefined} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {getInitials(name ?? "")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(session.scheduledAt)} · {session.durationMins} min
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs shrink-0 ${
                          session.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {session.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
            <Button variant="outline" size="sm" asChild className="w-full mt-4">
              <Link href="/sessions">View All Sessions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── Recent bookings ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Recent Bookings
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
              <Link href="/sessions">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
          <CardDescription className="text-xs">Latest session bookings from mentees</CardDescription>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No bookings yet</p>
          ) : (
            <div className="divide-y">
              {recentBookings.map((session) => {
                const name = session.mentee.menteeProfile?.displayName ?? session.mentee.email;
                const earned =
                  hourlyRate !== null && session.status === "COMPLETED"
                    ? (hourlyRate * session.durationMins) / 60
                    : null;
                return (
                  <div key={session.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={session.mentee.menteeProfile?.avatarUrl ?? undefined} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {getInitials(name ?? "")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(session.scheduledAt)} · {session.durationMins} min
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {earned !== null && (
                        <span className="text-sm font-semibold text-emerald-600">
                          +${earned.toFixed(0)}
                        </span>
                      )}
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          session.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : session.status === "CANCELLED"
                            ? "bg-red-50 text-red-600"
                            : session.status === "CONFIRMED"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {session.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Quick actions ── */}
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href="/sessions">
            <Calendar className="mr-2 h-4 w-4" />
            All Sessions
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/profile/edit">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

async function AdminDashboard() {
  const stats = await prisma.$transaction([
    prisma.user.count(),
    prisma.mentorProfile.count(),
    prisma.menteeProfile.count(),
    prisma.mentorProfile.count({ where: { isVerified: false } }),
    prisma.match.count({ where: { status: "ACCEPTED" } }),
    prisma.session.count({ where: { status: "COMPLETED" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Users} title="Total Users" display={String(stats[0])} color="blue" />
        <StatCard icon={UserCheck} title="Total Mentors" display={String(stats[1])} color="violet" />
        <StatCard icon={TrendingUp} title="Total Mentees" display={String(stats[2])} color="emerald" />
        <StatCard icon={Clock} title="Pending Verifications" display={String(stats[3])} color="amber" />
        <StatCard icon={Users} title="Active Matches" display={String(stats[4])} color="pink" />
        <StatCard icon={Calendar} title="Sessions Completed" display={String(stats[5])} color="teal" />
      </div>
      <div className="flex gap-3">
        <Button asChild><Link href="/admin/users">Manage Users</Link></Button>
        <Button variant="outline" asChild><Link href="/admin/programmes">Manage Programmes</Link></Button>
      </div>
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  blue:    "bg-blue-100 text-blue-600",
  emerald: "bg-emerald-100 text-emerald-600",
  violet:  "bg-violet-100 text-violet-600",
  orange:  "bg-orange-100 text-orange-600",
  pink:    "bg-pink-100 text-pink-600",
  teal:    "bg-teal-100 text-teal-600",
  amber:   "bg-amber-100 text-amber-600",
  gray:    "bg-gray-100 text-gray-500",
  green:   "bg-green-100 text-green-600",
};

function StatCard({
  icon: Icon,
  title,
  display,
  color = "blue",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  display: string;
  color?: string;
}) {
  const iconClass = COLOR_MAP[color] ?? COLOR_MAP.blue;
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${iconClass}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold leading-none">{display}</p>
            <p className="text-xs text-muted-foreground mt-1">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
