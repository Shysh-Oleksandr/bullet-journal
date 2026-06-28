"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export interface StarToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

/** Compact star button — amber accent when active. */
export function StarToggle({ checked, onChange, className }: StarToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      aria-label={checked ? "Unstar this entry" : "Star this entry"}
      className={cn("inline-flex h-[42px] cursor-pointer items-center gap-2 rounded-[10px] border px-3 py-2 text-[13px] font-medium transition-colors", className)}
      style={{
        borderColor: checked ? "var(--accent-border)" : "var(--line)",
        backgroundColor: checked ? "var(--accent-soft)" : "var(--surface-2)",
        color: checked ? "var(--accent)" : "var(--muted)",
      }}
    >
      <Star
        size={20}
        fill={checked ? "currentColor" : "none"}
        strokeWidth={checked ? 2 : 1.5}
      />
    </button>
  );
}
