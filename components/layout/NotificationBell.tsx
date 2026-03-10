"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/client";

interface Notification {
  id: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

interface Props {
  userId: string;
}

export function NotificationBell({ userId }: Props) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) setNotifications(await res.json());
    } catch {
      // silently ignore
    }
  };

  // Initial fetch + 30s fallback poll
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Supabase Realtime — instant push when a new notification is inserted
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${userId}`)
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
            read: boolean;
            created_at: string;
          };
          const notification: Notification = {
            id: row.id,
            title: row.title,
            body: row.body,
            link: row.link,
            read: row.read,
            createdAt: row.created_at,
          };
          setNotifications((prev) => [notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = async () => {
    setOpen((v) => !v);
    if (!open && unread > 0) {
      // Mark all as read
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const handleClick = (n: Notification) => {
    setOpen(false);
    if (n.link) router.push(n.link);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative flex items-center justify-center h-9 w-9 rounded-full hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-11 z-20 w-80 rounded-xl border bg-white shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="text-sm font-semibold">Notifications</span>
              {notifications.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {unread === 0 ? "All caught up" : `${unread} unread`}
                </span>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <ul className="max-h-96 overflow-y-auto divide-y">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => handleClick(n)}
                      className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors ${
                        !n.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && (
                          <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                        )}
                        <div className={!n.read ? "" : "pl-4"}>
                          <p className="text-sm font-medium leading-snug">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                            {n.body}
                          </p>
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
