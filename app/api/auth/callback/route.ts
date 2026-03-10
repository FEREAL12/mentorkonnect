import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/profile/setup";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { user } = data;
      const role = (user.user_metadata?.role as string) ?? "MENTEE";

      // Upsert the user in our DB
      await prisma.user.upsert({
        where: { id: user.id },
        update: { email: user.email!, role: role as "ADMIN" | "MENTOR" | "MENTEE" },
        create: {
          id: user.id,
          email: user.email!,
          role: role as "ADMIN" | "MENTOR" | "MENTEE",
        },
      });

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
