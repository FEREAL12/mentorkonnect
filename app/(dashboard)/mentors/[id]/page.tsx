import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  Linkedin,
  CalendarDays,
  DollarSign,
  Clock,
  MapPin,
  Monitor,
  Users,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { WEEK_DAYS } from "@/types";
import { BookingSection } from "@/components/sessions/BookingSection";

interface PageProps {
  params: Promise<{ id: string }>;
}

const FORMAT_LABELS: Record<string, string> = {
  VIRTUAL: "Virtual",
  HYBRID: "Hybrid",
  IN_PERSON: "In-Person",
};

export default async function MentorProfilePage({ params }: PageProps) {
  const { id } = await params;

  const mentor = await prisma.mentorProfile.findUnique({
    where: { id },
    include: {
      skills: { include: { skill: true } },
      user: { select: { email: true } },
    },
  });

  if (!mentor) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = (user?.user_metadata?.role as string) ?? null;

  let hasProfile = false;
  if (user && role === "MENTEE") {
    const menteeProfile = await prisma.menteeProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    hasProfile = !!menteeProfile;
  }

  const isAuthenticated = !!user && role === "MENTEE" && hasProfile;
  const loginRedirect = `/mentors/${mentor.id}`;

  const availability = mentor.availability as Record<string, string[]>;
  const hourlyRate = (mentor as { hourlyRate?: number | null }).hourlyRate;

  const availableDays = WEEK_DAYS.filter(
    ({ key }) => (availability[key] ?? []).length > 0
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      {/* Back link */}
      <Link
        href="/mentors"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700 transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Mentors
      </Link>

      {/* ── Hero card ── */}
      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        {/* Top banner */}
        <div className="relative h-28 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-orange-500/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-400/20 blur-2xl" />
          {mentor.isVerified && (
            <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-green-500/20 border border-green-400/30 px-3 py-1 text-xs font-semibold text-green-300">
              <CheckCircle className="h-3.5 w-3.5" />
              Verified Mentor
            </span>
          )}
        </div>

        <div className="px-6 pb-6">
          {/* Avatar overlapping banner */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-5">
            <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg shrink-0">
              <AvatarImage src={mentor.avatarUrl ?? undefined} className="object-cover" />
              <AvatarFallback className="text-2xl font-bold bg-blue-600 text-white">
                {getInitials(mentor.displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="pb-1">
              <h1 className="text-2xl font-extrabold text-gray-900">{mentor.displayName}</h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1 font-semibold text-orange-500">
                  <Briefcase className="h-3.5 w-3.5" />
                  {mentor.title}
                </span>
                {mentor.company && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-gray-400" />
                    {mentor.company}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {hourlyRate != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-sm font-bold text-orange-600">
                <DollarSign className="h-3.5 w-3.5" />
                {Number(hourlyRate)}/hr
              </span>
            )}
            {mentor.country && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                <MapPin className="h-3 w-3" />
                {mentor.country}
              </span>
            )}
            {mentor.yearsOfExperience != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                <Clock className="h-3 w-3" />
                {mentor.yearsOfExperience} yr{mentor.yearsOfExperience !== 1 ? "s" : ""} experience
              </span>
            )}
            {mentor.mentoringFormat && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                {mentor.mentoringFormat === "VIRTUAL" ? (
                  <Monitor className="h-3 w-3" />
                ) : (
                  <Users className="h-3 w-3" />
                )}
                {FORMAT_LABELS[mentor.mentoringFormat]}
              </span>
            )}
          </div>

          {/* Bio */}
          <p className="text-gray-600 leading-relaxed mb-5">{mentor.bio}</p>

          {/* Skills */}
          {mentor.skills.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Expertise</p>
              <div className="flex flex-wrap gap-2">
                {mentor.skills.map(({ skill }) => (
                  <span
                    key={skill.id}
                    className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* LinkedIn + Book button row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
            {mentor.linkedinUrl ? (
              <a
                href={mentor.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn Profile
              </a>
            ) : (
              <span />
            )}
            <a
              href="#book-session"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors"
            >
              <CalendarDays className="h-4 w-4" />
              Book a Session
            </a>
          </div>
        </div>
      </div>

      {/* ── Availability ── */}
      <div className="rounded-2xl border border-gray-100 shadow-sm bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
            <CalendarDays className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Available Times</h2>
            <p className="text-xs text-gray-500">Days &amp; slots {mentor.displayName} is open for sessions</p>
          </div>
        </div>

        {availableDays.length === 0 ? (
          <p className="text-sm text-gray-400">No availability set yet.</p>
        ) : (
          <div className="space-y-3">
            {availableDays.map(({ key, label }) => {
              const slots = availability[key] ?? [];
              return (
                <div key={key} className="flex items-start gap-4">
                  <span className="w-24 text-sm font-semibold text-gray-700 shrink-0 pt-0.5">
                    {label}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {slots.map((slot) => (
                      <span
                        key={slot}
                        className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-mono font-medium text-blue-700"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Booking ── */}
      <div id="book-session" className="scroll-mt-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <h2 className="text-lg font-extrabold text-gray-900 px-3">
            Book a Session with {mentor.displayName}
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>
        <BookingSection
          mentorProfileId={mentor.id}
          mentorName={mentor.displayName}
          availability={availability}
          isAuthenticated={isAuthenticated}
          loginRedirect={loginRedirect}
        />
      </div>
    </div>
  );
}
