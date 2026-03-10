"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUploadProps {
  userId: string;
  displayName?: string;
  onUpload: (url: string) => void;
}

export function AvatarUpload({ userId, displayName, onUpload }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB");
      return;
    }

    // Local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError(null);
    setIsUploading(true);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      onUpload(publicUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative group focus:outline-none"
        disabled={isUploading}
        aria-label="Upload profile picture"
      >
        <Avatar className="h-24 w-24">
          <AvatarImage src={preview ?? undefined} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        {/* Overlay */}
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          {isUploading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </span>
      </button>

      <p className="text-xs text-muted-foreground">
        {isUploading ? "Uploading…" : "Click to upload a photo (max 5 MB)"}
      </p>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
