"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type MessageRow = {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
  sender: { email: string };
};

export function useMessages(matchId: string, initialMessages: MessageRow[]) {
  const [messages, setMessages] = useState<MessageRow[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        async (payload) => {
          // Fetch the full message with sender info
          const res = await fetch(`/api/messages/${payload.new.id}`);
          if (res.ok) {
            const msg = await res.json();
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  const sendMessage = useCallback(
    async (content: string) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchId, content }),
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to send message");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [matchId]
  );

  return { messages, sendMessage, isLoading };
}
