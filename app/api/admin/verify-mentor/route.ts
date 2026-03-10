import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { userId, verified } = body;

  if (!userId || typeof verified !== "boolean") {
    return NextResponse.json(
      { error: "userId and verified (boolean) are required" },
      { status: 400 }
    );
  }

  try {
    const profile = await prisma.mentorProfile.update({
      where: { userId },
      data: { isVerified: verified },
    });

    return NextResponse.json({ success: true, isVerified: profile.isVerified });
  } catch (error) {
    console.error("Error updating verification:", error);
    return NextResponse.json(
      { error: "Failed to update verification status" },
      { status: 500 }
    );
  }
}
