import { cache } from "react";
import { prisma } from "@/lib/prisma";

/**
 * Cached per-request profile fetchers.
 * Layout and page both call these — React cache ensures only one
 * Prisma query runs per user per request.
 */
export const getMentorProfile = cache((userId: string) =>
  prisma.mentorProfile.findUnique({
    where: { userId },
    select: { id: true, displayName: true, avatarUrl: true, availability: true },
  })
);

export const getMenteeProfile = cache((userId: string) =>
  prisma.menteeProfile.findUnique({
    where: { userId },
    select: { id: true, displayName: true, avatarUrl: true },
  })
);
