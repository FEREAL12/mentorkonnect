import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VerifyMentorButton } from "@/components/admin/VerifyMentorButton";
import Link from "next/link";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "ADMIN") redirect("/sessions");

  const users = await prisma.user.findMany({
    include: {
      mentorProfile: { select: { displayName: true, title: true, isVerified: true } },
      menteeProfile: { select: { displayName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Admin
        </Link>
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium">Profile Name</th>
              <th className="text-left px-4 py-3 font-medium">Joined</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => {
              const displayName =
                u.mentorProfile?.displayName ??
                u.menteeProfile?.displayName ??
                "—";
              return (
                <tr key={u.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.email}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">
                      {u.id}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        u.role === "ADMIN"
                          ? "default"
                          : u.role === "MENTOR"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <p>{displayName}</p>
                    {u.mentorProfile?.title && (
                      <p className="text-xs text-muted-foreground">
                        {u.mentorProfile.title}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {u.mentorProfile && (
                      <VerifyMentorButton
                        userId={u.id}
                        isVerified={u.mentorProfile.isVerified}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
