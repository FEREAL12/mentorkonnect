"use client";

import { DirectBookForm } from "@/components/sessions/DirectBookForm";

interface Props {
  mentorProfileId: string;
  mentorName: string;
  availability: Record<string, string[]>;
}

export function BookingSection({
  mentorProfileId,
  mentorName,
  availability,
}: Props) {
  return (
    <DirectBookForm
      mentorProfileId={mentorProfileId}
      mentorName={mentorName}
      availability={availability}
    />
  );
}
