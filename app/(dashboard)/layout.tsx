import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getUser } from "@/lib/data/get-user";
import { getMentorProfile, getMenteeProfile } from "@/lib/data/get-profile";
import { TopNav } from "@/components/layout/TopNav";

const NO_NAV_PATHS = ["/profile/setup"];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") ?? "";

  const user = await getUser();

  // Mentor directory is publicly browsable — show without nav for guests
  if (!user) {
    if (pathname.startsWith("/mentors")) {
      return (
        <div className="min-h-screen bg-gray-50">
          <main className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
            {children}
          </main>
        </div>
      );
    }
    redirect("/login");
  }

  // Profile-setup page: no nav bar during onboarding
  if (NO_NAV_PATHS.some((p) => pathname.startsWith(p))) {
    return <>{children}</>;
  }

  const role = (user.user_metadata?.role as string) ?? "MENTEE";

  // Cached — other pages in this layout reuse the same result
  const profile =
    role === "MENTOR"
      ? await getMentorProfile(user.id)
      : role === "MENTEE"
      ? await getMenteeProfile(user.id)
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav
        userId={user.id}
        userEmail={user.email!}
        userRole={role}
        displayName={profile?.displayName}
        avatarUrl={profile?.avatarUrl ?? undefined}
      />
      <main className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
        {children}
      </main>
    </div>
  );
}
