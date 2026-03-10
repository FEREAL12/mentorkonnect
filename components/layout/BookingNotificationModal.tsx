"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface BookingNotif {
  id: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
}

interface Props {
  userId: string;
}

export function BookingNotificationModal({ userId }: Props) {
  const router = useRouter();
  const [queue, setQueue] = useState<BookingNotif[]>([]);
  const seenIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  // Baseline existing IDs on mount so old notifications don't pop up
  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.ok ? r.json() : [])
      .then((data: BookingNotif[]) => {
        data.forEach((n) => seenIds.current.add(n.id));
        initialized.current = true;
      })
      .catch(() => {
        initialized.current = true; // proceed even if baseline fails
      });
  }, []);

  // Supabase Realtime — instant push when a new notification row is inserted
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`booking-modal:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (!initialized.current) return;
          const row = payload.new as {
            id: string;
            title: string;
            body: string;
            link: string | null;
            read: boolean;
          };
          if (row.title !== "New session booking") return;
          if (seenIds.current.has(row.id)) return;
          seenIds.current.add(row.id);
          setQueue((prev) => [...prev, { id: row.id, title: row.title, body: row.body, link: row.link, read: row.read }]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  // Fallback poll every 15s in case Realtime misses something
  useEffect(() => {
    const poll = async () => {
      if (!initialized.current) return;
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;
        const data: BookingNotif[] = await res.json();
        const fresh = data.filter(
          (n) => n.title === "New session booking" && !seenIds.current.has(n.id)
        );
        if (fresh.length > 0) {
          fresh.forEach((n) => seenIds.current.add(n.id));
          setQueue((prev) => [...prev, ...fresh]);
        }
      } catch {
        // silently ignore
      }
    };

    const interval = setInterval(poll, 15_000);
    return () => clearInterval(interval);
  }, []);

  const current = queue[0];
  if (!current) return null;

  const dismiss = () => setQueue((prev) => prev.slice(1));

  const handleView = () => {
    dismiss();
    router.push(current.link ?? "/sessions");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
          {/* Top accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-orange-500" />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 shrink-0">
                  <CalendarDays className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">New Booking!</p>
                  <p className="text-xs text-gray-400 mt-0.5">A mentee has requested a session</p>
                </div>
              </div>
              <button
                onClick={dismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Booking details */}
            <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3.5 mb-5">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">{current.body}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5">
              <Button
                onClick={handleView}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white border-0 rounded-xl h-10 font-semibold"
              >
                View Sessions
              </Button>
              <Button
                variant="outline"
                onClick={dismiss}
                className="flex-1 rounded-xl h-10 border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Dismiss
              </Button>
            </div>

            {queue.length > 1 && (
              <p className="text-center text-xs text-muted-foreground mt-3">
                +{queue.length - 1} more notification{queue.length - 1 > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
