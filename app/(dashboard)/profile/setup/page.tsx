import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileSetupWizard } from "@/components/profile/ProfileSetupWizard";
import { prisma } from "@/lib/prisma";

export default async function ProfileSetupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = (user.user_metadata?.role as string) ?? "MENTEE";

  // If profile already exists, redirect to the right home page
  if (role === "MENTOR") {
    const existing = await prisma.mentorProfile.findUnique({
      where: { userId: user.id },
    });
    if (existing) redirect("/sessions");
  } else if (role === "MENTEE") {
    const existing = await prisma.menteeProfile.findUnique({
      where: { userId: user.id },
    });
    if (existing) redirect("/mentors");
  }

  // Load skills for the selector
  const skills = await prisma.skill.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">MentorKonnect</h1>
          <p className="mt-2 text-muted-foreground">
            Let&apos;s set up your profile
          </p>
        </div>
        <ProfileSetupWizard
          userId={user.id}
          userEmail={user.email!}
          role={role}
          skills={skills}
        />
      </div>
    </div>
  );
}
