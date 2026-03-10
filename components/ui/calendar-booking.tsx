"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { Button } from "@/components/ui/button";

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

interface CalendarBookingProps {
  value?: Date | null;
  onChange: (date: Date) => void;
  /** Weekly availability — used only for visual highlighting, not to restrict selection */
  availability: Record<string, string[]>;
}

export function CalendarBooking({ value, onChange, availability }: CalendarBookingProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(value ?? new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  // Preferred days have pre-set time slots — highlighted but NOT the only selectable ones
  const isPreferred = (date: Date) => {
    const dayKey = DAY_KEYS[getDay(date)];
    return (availability[dayKey] ?? []).length > 0;
  };

  const isPast = (date: Date) => isBefore(date, today);

  return (
    <div className="w-full select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((h) => (
          <div key={h} className="text-center text-xs font-medium text-muted-foreground py-1">
            {h}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day) => {
          const inMonth = isSameMonth(day, currentMonth);
          const past = isPast(day);
          const selected = value ? isSameDay(day, value) : false;
          const preferred = inMonth && !past && isPreferred(day);
          const selectable = inMonth && !past;
          const todayMark = isToday(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={!selectable}
              onClick={() => selectable && onChange(day)}
              className={[
                "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors",
                !inMonth ? "opacity-20 pointer-events-none" : "",
                selected
                  ? "bg-primary text-primary-foreground font-semibold shadow"
                  : selectable
                  ? preferred
                    ? "bg-primary/10 text-primary font-semibold hover:bg-primary/25 cursor-pointer"
                    : "text-foreground hover:bg-muted cursor-pointer"
                  : "text-muted-foreground cursor-not-allowed opacity-40",
                todayMark && !selected ? "ring-2 ring-primary/40" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-primary/10 border border-primary/40" />
          Preferred days
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-primary" />
          Selected
        </span>
      </div>
    </div>
  );
}
