import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const userId = formData.get("userId") as string | null;

  if (!file || !userId) {
    return NextResponse.json(
      { error: "file and userId are required" },
      { status: 400 }
    );
  }

  // Ensure the avatars bucket exists and is public
  const { error: bucketError } = await supabaseAdmin.storage.createBucket(
    "avatars",
    { public: true, fileSizeLimit: 5 * 1024 * 1024 }
  );
  // Ignore "already exists" errors — that's fine
  if (bucketError && !bucketError.message.toLowerCase().includes("already exists")) {
    console.error("Bucket creation error:", bucketError.message);
    return NextResponse.json(
      { error: "Storage setup failed" },
      { status: 500 }
    );
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabaseAdmin.storage
    .from("avatars")
    .upload(path, buffer, { upsert: true, contentType: file.type });

  if (uploadError) {
    console.error("Avatar upload error:", uploadError.message);
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("avatars").getPublicUrl(path);

  return NextResponse.json({ publicUrl });
}
