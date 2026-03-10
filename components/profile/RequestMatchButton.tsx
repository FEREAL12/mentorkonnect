"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Props {
  mentorId: string;
  mentorName: string;
}

export function RequestMatchButton({ mentorId, mentorName }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleRequest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorProfileId: mentorId, message }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to send request");
      }
      setSent(true);
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-4">
        <p className="text-green-600 font-medium">
          Match request sent to {mentorName}!
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          You&apos;ll be notified once they respond.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message">
          Introduce yourself to {mentorName} (optional)
        </Label>
        <Textarea
          id="message"
          placeholder={`Hi ${mentorName}, I'm looking for guidance on...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button onClick={handleRequest} className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Request Match with {mentorName}
      </Button>
    </div>
  );
}
