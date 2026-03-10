"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, getDay } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";
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

const bookSchema = z.object({
  time: z.string().min(1, "Please select a time slot"),
  durationMins: z.coerce.number().min(30).max(120),
  notes: z.string().optional(),
  meetingUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type BookFormData = z.infer<typeof bookSchema>;

interface Props {
  mentorProfileId: string;
  mentorName: string;
  availability: Record<string, string[]>;
  isAuthenticated: boolean;
  loginRedirect: string;
}

export function DirectBookForm({
  mentorProfileId,
  mentorName,
  availability,
  isAuthenticated,
  loginRedirect,
}: Props) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<BookFormData>({
      resolver: zodResolver(bookSchema),
      defaultValues: { durationMins: 60 },
    });

  const availableSlots = selectedDate
    ? (availability[DAY_KEYS[getDay(selectedDate)]] ?? [])
    : [];

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setDateError(null);
    setValue("time", "");
  };

  const onSubmit = async (data: BookFormData) => {
    if (!selectedDate) {
      setDateError("Please select a date");
      return;
    }

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(loginRedirect)}`);
      return;
    }

    setSubmitError(null);
    setIsBooking(true);

    const scheduledAt = new Date(
      `${format(selectedDate, "yyyy-MM-dd")}T${data.time}`
    );

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorProfileId,
          scheduledAt: scheduledAt.toISOString(),
          durationMins: data.durationMins,
          notes: data.notes,
          meetingUrl: data.meetingUrl || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSubmitError(body.error ?? "Booking failed. Please try again.");
        return;
      }

      router.push("/");
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            onChange={handleDateChange}
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
            /* Predefined slots — quick pick */
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setValue("time", slot, { shouldValidate: true })}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      watch("time") === slot
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
                  onChange={(e) => e.target.value && setValue("time", e.target.value, { shouldValidate: true })}
                />
              </p>
            </div>
          ) : (
            /* No predefined slots — free time input */
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">
                This mentor hasn&apos;t set specific time slots. Pick any time that suits you.
              </p>
              <input
                type="time"
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                onChange={(e) => e.target.value && setValue("time", e.target.value, { shouldValidate: true })}
              />
              {watch("time") && (
                <p className="text-xs text-muted-foreground">
                  Selected: <strong>{watch("time")}</strong>
                </p>
              )}
            </div>
          )}
          {errors.time && (
            <p className="mt-2 text-xs text-destructive">{errors.time.message}</p>
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
              onValueChange={(v) => setValue("durationMins", parseInt(v))}
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
              {...register("meetingUrl")}
            />
            {errors.meetingUrl && (
              <p className="text-xs text-destructive">{errors.meetingUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes / agenda (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Topics you'd like to cover…"
              rows={3}
              {...register("notes")}
            />
          </div>
        </CardContent>
      </Card>

      {submitError && (
        <p className="text-sm text-destructive text-center">{submitError}</p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isBooking}>
        {isBooking ? "Booking…" : "Book"}
      </Button>
    </form>
  );
}
