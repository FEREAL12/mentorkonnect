"use client";

import { DirectBookForm } from "@/components/sessions/DirectBookForm";

interface Props {
  mentorProfileId: string;
  mentorName: string;
  availability: Record<string, string[]>;
  isAuthenticated: boolean;
  loginRedirect: string;
}

export function BookingSection({
  mentorProfileId,
  mentorName,
  availability,
  isAuthenticated,
  loginRedirect,
}: Props) {
  return (
    <DirectBookForm
      mentorProfileId={mentorProfileId}
      mentorName={mentorName}
      availability={availability}
      isAuthenticated={isAuthenticated}
      loginRedirect={loginRedirect}
    />
  );
}
