"use client";

import { useState } from "react";

export function useSessionActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSession = async (
    sessionId: string,
    data: { status?: string; notes?: string; meetingUrl?: string }
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to update session");
      }
      return await res.json();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "An error occurred";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateSession, isLoading, error };
}
