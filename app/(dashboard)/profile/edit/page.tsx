import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { ProfileSetupWizard } from "@/components/profile/ProfileSetupWizard";
import Link from "next/link";

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const role = (user.user_metadata?.role as string) ?? "MENTEE";
  const skills = await prisma.skill.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        href="/sessions"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back
      </Link>
      <h1 className="text-3xl font-bold">Edit Profile</h1>
      <ProfileSetupWizard
        userId={user.id}
        userEmail={user.email!}
        role={role}
        skills={skills}
      />
    </div>
  );
}
