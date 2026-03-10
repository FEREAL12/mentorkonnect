"use client";

import { useState } from "react";
import { format, getDay } from "date-fns";
import { CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarBooking } from "@/components/ui/calendar-booking";

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

interface Props {
  mentorProfileId: string;
  mentorName: string;
  availability: Record<string, string[]>;
}

export function DirectBookForm({
  mentorProfileId,
  mentorName,
  availability,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [durationMins, setDurationMins] = useState(60);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [notes, setNotes] = useState("");

  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");

  const [isBooked, setIsBooked] = useState(false);

  const availableSlots = selectedDate
    ? (availability[DAY_KEYS[getDay(selectedDate)]] ?? [])
    : [];

  const handleBook = () => {
    if (!selectedDate) {
      setDateError("Please select a date");
      return;
    }
    setDateError("");

    if (!selectedTime) {
      setTimeError("Please select a time slot");
      return;
    }
    setTimeError("");

    setIsBooked(true);

    const scheduledAt = new Date(
      `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`
    );

    fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mentorProfileId,
        scheduledAt: scheduledAt.toISOString(),
        durationMins,
        notes: notes || undefined,
        meetingUrl: meetingUrl || undefined,
      }),
    }).catch(console.error);
  };

  if (isBooked) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <div>
          <p className="font-bold text-lg text-gray-900">Session Booked!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your session request has been submitted. The mentor will confirm shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Calendar ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4 text-primary" />
            Select a Date
          </CardTitle>
          <CardDescription className="text-xs">
            Highlighted dates are days {mentorName} is available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarBooking
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setSelectedTime("");
              setDateError("");
            }}
            availability={availability}
          />
          {dateError && (
            <p className="mt-2 text-xs text-destructive">{dateError}</p>
          )}
        </CardContent>
      </Card>

      {/* ── Time slots ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-primary" />
            Select a Time
          </CardTitle>
          {selectedDate && (
            <CardDescription className="text-xs">
              {availableSlots.length > 0
                ? <>Suggested slots for <strong>{format(selectedDate, "EEEE, d MMMM yyyy")}</strong></>
                : <>Choose any time for <strong>{format(selectedDate, "EEEE, d MMMM yyyy")}</strong></>
              }
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {!selectedDate ? (
            <p className="text-sm text-muted-foreground">
              Pick a date above to choose a time.
            </p>
          ) : availableSlots.length > 0 ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => { setSelectedTime(slot); setTimeError(""); }}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedTime === slot
                        ? "border-primary bg-primary text-white shadow-sm"
                        : "border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Or enter a custom time:&nbsp;
                <input
                  type="time"
                  className="rounded border border-border px-2 py-0.5 text-xs"
                  onChange={(e) => { if (e.target.value) { setSelectedTime(e.target.value); setTimeError(""); } }}
                />
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">
                This mentor hasn&apos;t set specific time slots. Pick any time that suits you.
              </p>
              <input
                type="time"
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                onChange={(e) => { if (e.target.value) { setSelectedTime(e.target.value); setTimeError(""); } }}
              />
              {selectedTime && (
                <p className="text-xs text-muted-foreground">
                  Selected: <strong>{selectedTime}</strong>
                </p>
              )}
            </div>
          )}
          {timeError && (
            <p className="mt-2 text-xs text-destructive">{timeError}</p>
          )}
        </CardContent>
      </Card>

      {/* ── Session details ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Session Details</CardTitle>
          <CardDescription className="text-xs">Duration and optional notes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Duration</Label>
            <Select
              defaultValue="60"
              onValueChange={(v) => setDurationMins(parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
                <SelectItem value="120">120 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetingUrl">Meeting URL (optional)</Label>
            <Input
              id="meetingUrl"
              type="url"
              placeholder="https://meet.google.com/… or https://zoom.us/…"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes / agenda (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Topics you'd like to cover…"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="button" className="w-full" size="lg" onClick={handleBook}>
        Book
      </Button>
    </div>
  );
}
