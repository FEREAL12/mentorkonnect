"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, X, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";


interface BookingNotif {
  id: string;
  title: string;
  body: string;
  link: string | null;
  createdAt: string;
}

interface Props {
  userId: string;
}

export function BookingNotificationModal({ userId }: Props) {
  const router = useRouter();
  const [queue, setQueue] = useState<BookingNotif[]>([]);
  const seenIds = useRef<Set<string>>(new Set());
  // Record the time this component mounted — only show notifications newer than this
  const mountTime = useRef(new Date().toISOString());

  const addFresh = (notifications: BookingNotif[]) => {
    const fresh = notifications.filter(
      (n) =>
        n.title === "New session booking" &&
        n.createdAt >= mountTime.current &&
        !seenIds.current.has(n.id)
    );
    if (fresh.length === 0) return;
    fresh.forEach((n) => seenIds.current.add(n.id));
    setQueue((prev) => [...prev, ...fresh]);
  };

  // Poll every 5 seconds
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;
        const data: BookingNotif[] = await res.json();
        addFresh(data);
      } catch {
        // ignore network errors
      }
    };

    // First poll after 3s (give the booking API time to commit)
    const first = setTimeout(poll, 3_000);
    const interval = setInterval(poll, 5_000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Supabase Realtime for instant delivery
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
          const row = payload.new as {
            id: string;
            title: string;
            body: string;
            link: string | null;
            created_at: string;
          };
          addFresh([{
            id: row.id,
            title: row.title,
            body: row.body,
            link: row.link,
            createdAt: row.created_at,
          }]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const current = queue[0];
  if (!current) return null;

  const dismiss = () => setQueue((prev) => prev.slice(1));

  const handleView = () => {
    dismiss();
    router.push(current.link ?? "/sessions");
  };

  return (
    /* Bottom-right toast — no backdrop, doesn't block the page */
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm pointer-events-auto">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 text-white">

        {/* Glowing orb accent */}
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-orange-500/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />

        <div className="relative p-5">
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Pulsing dot */}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
                New Booking
              </span>
            </div>
            <button
              onClick={dismiss}
              className="text-white/40 hover:text-white/80 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Icon + title */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-500/30">
              <CalendarDays className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="font-bold text-white text-base leading-snug">
                A mentee booked a session!
              </p>
              <p className="text-sm text-white/60 mt-1 leading-relaxed">
                {current.body}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleView}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-400 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              View Session
            </button>
            <button
              onClick={dismiss}
              className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              Later
            </button>
          </div>

          {queue.length > 1 && (
            <p className="text-center text-xs text-white/40 mt-3">
              +{queue.length - 1} more booking{queue.length - 1 > 1 ? "s" : ""} waiting
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
