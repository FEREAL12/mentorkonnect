import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function AdminProgrammesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "ADMIN") redirect("/sessions");

  const programmes = await prisma.programme.findMany({
    include: { _count: { select: { sessions: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
            &larr; Admin
          </Link>
          <h1 className="text-2xl font-bold">Programmes</h1>
        </div>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium">Duration</th>
              <th className="text-left px-4 py-3 font-medium">Max Mentees</th>
              <th className="text-left px-4 py-3 font-medium">Sessions</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {programmes.map((prog) => (
              <tr key={prog.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <p className="font-medium">{prog.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {prog.description}
                  </p>
                </td>
                <td className="px-4 py-3">{prog.durationWeeks} weeks</td>
                <td className="px-4 py-3">{prog.maxMentees}</td>
                <td className="px-4 py-3">{prog._count.sessions}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${prog.isActive ? "bg-green-100 text-green-700" : ""}`}
                  >
                    {prog.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(prog.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
