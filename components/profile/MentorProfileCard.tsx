import Link from "next/link";
import { MapPin, Clock, Monitor, Users, Star, CheckCircle } from "lucide-react";
import type { MentorProfile, Skill, MentorSkill } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

type MentorWithSkills = MentorProfile & {
  skills: Array<MentorSkill & { skill: Skill }>;
  user: { email: string };
};

interface MentorProfileCardProps {
  mentor: MentorWithSkills;
}

const FORMAT_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  VIRTUAL: { label: "Virtual", icon: Monitor },
  HYBRID: { label: "Hybrid", icon: Users },
  IN_PERSON: { label: "In-Person", icon: Users },
};

export function MentorProfileCard({ mentor }: MentorProfileCardProps) {
  const skillNames = mentor.skills.map((ms) => ms.skill.name);
  const formatInfo = mentor.mentoringFormat ? FORMAT_LABELS[mentor.mentoringFormat] : null;

  return (
    <Link
      href={`/mentors/${mentor.id}`}
      className="group flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
    >
      {/* ── Header band ── */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 px-6 pt-7 pb-10">
        {/* Subtle glow blob */}
        <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-orange-500/20 blur-2xl" />

        {/* Price badge */}
        {mentor.hourlyRate != null && (
          <span className="absolute top-3.5 right-3.5 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
            ${Number(mentor.hourlyRate)}/hr
          </span>
        )}

        {/* Verified badge */}
        {mentor.isVerified && (
          <span className="absolute top-3.5 left-3.5 flex items-center gap-1 rounded-full bg-green-500/20 border border-green-400/30 px-2.5 py-1 text-[10px] font-semibold text-green-300">
            <CheckCircle className="h-3 w-3" />
            Verified
          </span>
        )}
      </div>

      {/* ── Avatar (overlapping header) ── */}
      <div className="relative flex justify-center -mt-8 px-6">
        <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
          <AvatarImage src={mentor.avatarUrl ?? undefined} className="object-cover" />
          <AvatarFallback className="text-xl font-bold bg-blue-600 text-white">
            {getInitials(mentor.displayName)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 px-5 pt-3 pb-5 gap-3">
        {/* Name + title */}
        <div className="text-center">
          <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-blue-700 transition-colors">
            {mentor.displayName}
          </h3>
          <p className="text-sm font-semibold text-orange-500 mt-0.5">{mentor.title}</p>
          {mentor.company && (
            <p className="text-xs text-gray-400 mt-0.5">{mentor.company}</p>
          )}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-gray-500">
          {mentor.country && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-gray-400" />
              {mentor.country}
            </span>
          )}
          {mentor.yearsOfExperience != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-400" />
              {mentor.yearsOfExperience} yr{mentor.yearsOfExperience !== 1 ? "s" : ""} exp
            </span>
          )}
          {formatInfo && (
            <span className="flex items-center gap-1">
              <formatInfo.icon className="h-3 w-3 text-gray-400" />
              {formatInfo.label}
            </span>
          )}
        </div>

        {/* Bio */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed text-center">
          {mentor.bio}
        </p>

        {/* Skill pills */}
        {skillNames.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {skillNames.slice(0, 3).map((name) => (
              <span
                key={name}
                className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-[11px] font-medium text-blue-700"
              >
                {name}
              </span>
            ))}
            {skillNames.length > 3 && (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500">
                +{skillNames.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <div className="mt-1 flex items-center justify-between rounded-xl bg-blue-600 px-4 py-2.5 text-white group-hover:bg-blue-700 transition-colors">
          <span className="text-sm font-semibold">View Profile &amp; Book</span>
          <Star className="h-4 w-4 text-orange-300 fill-orange-300" />
        </div>
      </div>
    </Link>
  );
}
