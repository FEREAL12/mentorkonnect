"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Video, FileText, Loader2 } from "lucide-react";
import type { Session, User, Programme } from "@prisma/client";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

type SessionWithDetails = Session & {
  mentor: User;
  mentee: User;
  programme: Programme | null;
};

interface SessionCardProps {
  session: SessionWithDetails;
  currentUserId: string;
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
  PENDING: "secondary",
  CONFIRMED: "success",
  COMPLETED: "outline",
  CANCELLED: "destructive",
};

export function SessionCard({ session, currentUserId }: SessionCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isMentor = session.mentorId === currentUserId;
  const otherUser = isMentor ? session.mentee : session.mentor;

  const updateStatus = async (status: string) => {
    setIsLoading(true);
    try {
      await fetch(`/api/sessions/${session.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="font-medium">
              {isMentor ? "Session with mentee" : "Session with mentor"}:{" "}
              <span className="text-primary">{otherUser.email}</span>
            </p>
            {session.programme && (
              <p className="text-xs text-muted-foreground">
                Programme: {session.programme.title}
              </p>
            )}
          </div>
          <Badge variant={STATUS_VARIANT[session.status] ?? "secondary"} className="shrink-0">
            {session.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            {formatDateTime(session.scheduledAt)}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            {session.durationMins} minutes
          </div>
        </div>

        {session.meetingUrl && (
          <div className="flex items-center gap-2 text-sm">
            <Video className="h-4 w-4 text-muted-foreground shrink-0" />
            <a
              href={session.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Join Meeting
            </a>
          </div>
        )}

        {session.notes && (
          <div className="flex items-start gap-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-muted-foreground">{session.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          {isMentor && session.status === "PENDING" && (
            <>
              <Button
                size="sm"
                onClick={() => updateStatus("CONFIRMED")}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                Confirm
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateStatus("CANCELLED")}
                disabled={isLoading}
              >
                Decline
              </Button>
            </>
          )}
          {session.status === "CONFIRMED" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateStatus("CANCELLED")}
              disabled={isLoading}
              className="text-destructive hover:text-destructive"
            >
              Cancel
            </Button>
          )}
          {isMentor && session.status === "CONFIRMED" && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => updateStatus("COMPLETED")}
              disabled={isLoading}
            >
              Mark Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
