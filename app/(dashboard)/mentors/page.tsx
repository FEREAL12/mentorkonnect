import { prisma } from "@/lib/prisma";
import { MentorProfileCard } from "@/components/profile/MentorProfileCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { Users, Search } from "lucide-react";
import type { MentoringFormat } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    skill?: string;
    country?: string;
    format?: string;
  }>;
}

export default async function MentorsPage({ searchParams }: PageProps) {
  const { q, skill, country, format } = await searchParams;

  const formatFilter = (["VIRTUAL", "HYBRID", "IN_PERSON"] as const).includes(
    format as MentoringFormat
  )
    ? (format as MentoringFormat)
    : undefined;

  const mentors = await prisma.mentorProfile.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { displayName: { contains: q, mode: "insensitive" } },
              { title: { contains: q, mode: "insensitive" } },
              { bio: { contains: q, mode: "insensitive" } },
              { company: { contains: q, mode: "insensitive" } },
              { country: { contains: q, mode: "insensitive" } },
              { qualification: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(skill
        ? {
            skills: {
              some: { skill: { name: { equals: skill, mode: "insensitive" } } },
            },
          }
        : {}),
      ...(country ? { country: { equals: country, mode: "insensitive" } } : {}),
      ...(formatFilter ? { mentoringFormat: formatFilter } : {}),
    },
    include: {
      skills: { include: { skill: true } },
      user: { select: { email: true } },
    },
    orderBy: [{ isVerified: "desc" }, { createdAt: "desc" }],
  });

  const allSkills = await prisma.skill.findMany({
    where: { mentors: { some: {} } },
    orderBy: { name: "asc" },
  });

  const isFiltered = !!(q || skill || country || format);

  return (
    <div className="space-y-8">
      {/* ── Page header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 px-8 py-10">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Browse Mentors
            </h1>
            <p className="mt-1.5 text-blue-200 max-w-md">
              Connect with experienced professionals ready to guide your career journey.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-orange-400">{mentors.length}</p>
              <p className="text-xs text-blue-300 font-medium">
                {isFiltered ? "Results" : "Mentors"}
              </p>
            </div>
            <div className="h-10 w-px bg-blue-600" />
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white">{allSkills.length}</p>
              <p className="text-xs text-blue-300 font-medium">Skills</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + filters ── */}
      <SearchBar
        skills={allSkills}
        currentQuery={q}
        currentSkill={skill}
        currentCountry={country}
        currentFormat={format}
      />

      {/* ── Results ── */}
      {mentors.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-4">
            <Search className="h-7 w-7 text-blue-400" />
          </div>
          <p className="text-lg font-bold text-gray-900">No mentors found</p>
          <p className="text-gray-500 mt-1 text-sm max-w-xs">
            Try adjusting your search or removing some filters to see more results.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4 text-blue-500" />
              <span>
                <strong className="text-gray-900">{mentors.length}</strong>{" "}
                mentor{mentors.length !== 1 ? "s" : ""}{" "}
                {isFiltered ? "matched your search" : "available"}
              </span>
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <MentorProfileCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
