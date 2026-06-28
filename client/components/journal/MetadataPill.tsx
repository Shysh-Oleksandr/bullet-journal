"use client";

import { Star } from "lucide-react";

import { RatingRing } from "@/components/journal/RatingRing";
import type { CustomLabel } from "@/lib/notes/types";

/** Neutral read-only pill on the collapsed detail metadata row. */
export function Pill({
  children,
  onClick,
  accent,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  accent?: boolean;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium transition-colors"
      style={{
        borderColor: accent ? "var(--accent-border)" : "var(--line)",
        backgroundColor: accent ? "var(--accent-soft)" : "var(--surface-2)",
        color: accent ? "var(--accent)" : "var(--text)",
      }}
    >
      {children}
    </Comp>
  );
}

export function TypePill({ type }: { type: CustomLabel }) {
  return (
    <Pill>
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: type.color || "#868e96" }}
      />
      {type.labelName}
    </Pill>
  );
}

export function RatingPill({ rating }: { rating: number }) {
  return (
    <Pill>
      <RatingRing value={rating} size={20} />
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Rating</span>
    </Pill>
  );
}

export function StarredPill() {
  return (
    <Pill accent>
      <Star size={13} fill="currentColor" />
      Starred
    </Pill>
  );
}

export function ColorHexPill({ color }: { color: string }) {
  return (
    <Pill>
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-mono text-[11px] text-muted">{color}</span>
    </Pill>
  );
}
