"use client";

import { DateTimePicker } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import { Calendar } from "lucide-react";

import { FieldLabel } from "@/components/journal/RatingSegments";

export interface DateTimeFieldProps {
  value: Date | null;
  onChange: (value: Date | null) => void;
  label?: string;
}

function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

export function DateTimeField({ value, onChange, label = "Date & time" }: DateTimeFieldProps) {
  // getInitialValueInEffect avoids hydration mismatch — starts as false (desktop) then updates.
  const isMobile = useMediaQuery("(max-width: 640px)", false, {
    getInitialValueInEffect: true,
  });

  return (
    <div className="w-full">
      <FieldLabel>{label}</FieldLabel>
      {isMobile ? (
        <input
          type="datetime-local"
          value={value ? toDatetimeLocal(value) : ""}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
          className="w-[calc(100%-28px)] cursor-pointer rounded-[8px] border border-line bg-surface px-3 py-1.5 font-mono text-[14px] text-text outline-none transition-colors hover:border-faint focus:border-accent focus:ring-1 focus:ring-(--accent-border) scheme-dark"
        />
      ) : (
        <DateTimePicker
          value={value}
          onChange={(v) => onChange(typeof v === "string" ? (v ? new Date(v) : null) : v)}
          valueFormat="DD/MM/YYYY HH:mm"
          placeholder="Pick date and time"
          size="md"
          rightSection={<Calendar size={16} className="text-faint" />}
          popoverProps={{ shadow: "var(--shadow-pop)" }}
          styles={{ input: { fontFamily: "var(--font-spline-mono), monospace" } }}
          submitButtonProps={{ "aria-label": "Done" }}
        />
      )}
    </div>
  );
}
