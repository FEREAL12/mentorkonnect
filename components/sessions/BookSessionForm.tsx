"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, getDay } from "date-fns";
import { Loader2, CalendarDays, Clock, CreditCard } from "lucide-react";
import type { Programme } from "@prisma/client";
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

// Paystack inline types
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref?: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

type Currency = "NGN" | "GBP";

// Approximate exchange rates from USD
const EXCHANGE_RATES: Record<Currency, number> = { NGN: 1650, GBP: 0.79 };
const CURRENCY_SYMBOLS: Record<Currency, string> = { NGN: "₦", GBP: "£" };
const CURRENCY_LABELS: Record<Currency, string> = {
  NGN: "🇳🇬 Nigerian Naira (₦)",
  GBP: "🇬🇧 British Pounds (£)",
};

const bookSchema = z.object({
  time: z.string().min(1, "Please select a time slot"),
  durationMins: z.coerce.number().min(30).max(120),
  notes: z.string().optional(),
  meetingUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  programmeId: z.string().optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

interface Props {
  matchId: string;
  mentorUserId: string;
  menteeUserId: string;
  menteeEmail: string;
  hourlyRate: number;
  availability: Record<string, string[]>;
  programmes: Programme[];
}

export function BookSessionForm({
  matchId,
  mentorUserId,
  menteeUserId,
  menteeEmail,
  hourlyRate,
  availability,
  programmes,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>("NGN");

  // Load Paystack inline script
  useEffect(() => {
    if (document.getElementById("paystack-script")) return;
    const script = document.createElement("script");
    script.id = "paystack-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    document.head.appendChild(script);
  }, []);

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<BookFormData>({
      resolver: zodResolver(bookSchema),
      defaultValues: { durationMins: 60 },
    });

  const selectedDuration = Number(watch("durationMins") || 60);
  const availableSlots = selectedDate
    ? (availability[DAY_KEYS[getDay(selectedDate)]] ?? [])
    : [];

  // Price calculation
  const priceUSD = (hourlyRate * selectedDuration) / 60;
  const priceConverted = priceUSD * EXCHANGE_RATES[currency];
  const symbol = CURRENCY_SYMBOLS[currency];
  const displayPrice = priceConverted.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setDateError(null);
    setValue("time", "");
  };

  const createSession = async (data: BookFormData, paymentReference: string) => {
    const scheduledAt = new Date(
      `${format(selectedDate!, "yyyy-MM-dd")}T${data.time}`
    );
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matchId,
        mentorId: mentorUserId,
        menteeId: menteeUserId,
        scheduledAt: scheduledAt.toISOString(),
        durationMins: data.durationMins,
        notes: data.notes,
        meetingUrl: data.meetingUrl || undefined,
        programmeId: data.programmeId || undefined,
        paymentReference,
        paymentCurrency: currency,
      }),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error ?? "Failed to book session");
    }
    router.push("/sessions");
  };

  const onSubmit = async (data: BookFormData) => {
    if (!selectedDate) {
      setDateError("Please select a date on the calendar");
      return;
    }
    setDateError(null);
    setIsLoading(true);
    setError(null);

    if (!window.PaystackPop) {
      setError("Payment system is still loading — please try again in a moment.");
      setIsLoading(false);
      return;
    }

    // Paystack expects amount in smallest currency unit (kobo for NGN, pence for GBP)
    const amountInSmallestUnit = Math.round(priceConverted * 100);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
      email: menteeEmail,
      amount: amountInSmallestUnit,
      currency,
      metadata: {
        matchId,
        mentorUserId,
        menteeUserId,
        durationMins: data.durationMins,
      },
      callback: async (response) => {
        try {
          await createSession(data, response.reference);
        } catch (e: unknown) {
          setError(e instanceof Error ? e.message : "Booking failed after payment");
          setIsLoading(false);
        }
      },
      onClose: () => {
        setIsLoading(false);
      },
    });

    handler.openIframe();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Calendar picker ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Pick a Date
          </CardTitle>
          <CardDescription>
            Highlighted dates are days the mentor is available. Past dates and
            unavailable days are greyed out.
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

      {/* ── Time slot ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Pick a Time
          </CardTitle>
          {selectedDate && (
            <CardDescription>
              Available slots for{" "}
              <strong>{format(selectedDate, "EEEE, d MMMM yyyy")}</strong>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {!selectedDate ? (
            <p className="text-sm text-muted-foreground">
              Select a date above to see available time slots.
            </p>
          ) : availableSlots.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No time slots on this day — please pick another date.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setValue("time", slot)}
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
          )}
          {errors.time && (
            <p className="mt-2 text-xs text-destructive">{errors.time.message}</p>
          )}
        </CardContent>
      </Card>

      {/* ── Session details ── */}
      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
          <CardDescription>Set the duration and any extra info</CardDescription>
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

          {programmes.length > 0 && (
            <div className="space-y-2">
              <Label>Link to Programme (optional)</Label>
              <Select
                onValueChange={(v) =>
                  setValue("programmeId", v === "none" ? undefined : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a programme…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No programme</SelectItem>
                  {programmes.map((prog) => (
                    <SelectItem key={prog.id} value={prog.id}>
                      {prog.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Session notes / agenda (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Topics you'd like to cover in this session…"
              rows={3}
              {...register("notes")}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Payment ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment
          </CardTitle>
          <CardDescription>
            Select your currency and complete payment to confirm your booking.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select
              value={currency}
              onValueChange={(v) => setCurrency(v as Currency)}
            >
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CURRENCY_LABELS) as Currency[]).map((c) => (
                  <SelectItem key={c} value={c}>
                    {CURRENCY_LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price summary */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Mentor rate</span>
              <span>${hourlyRate.toFixed(2)} / hr</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Duration</span>
              <span>{selectedDuration} min</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal (USD)</span>
              <span>${priceUSD.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold text-base">
              <span>Total</span>
              <span className="text-primary">
                {symbol}{displayPrice} {currency}
              </span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Approximate rate: 1 USD ≈ {EXCHANGE_RATES[currency].toLocaleString()} {currency}.
              Final charge processed by Paystack.
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Pay {symbol}{displayPrice} &amp; Book Session
      </Button>
    </form>
  );
}
