"use client";

import { TOKENS } from "@/components/journal/tokens";

export interface RatingRingProps {
  /** 0–10 importance. */
  value: number;
  size?: number;
}

/** Small amber progress ring showing a note's 1–10 importance. */
export function RatingRing({ value, size = 30 }: RatingRingProps) {
  const v = Math.max(0, Math.min(10, value));
  const stroke = Math.max(2, Math.round(size * 0.1));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (v / 10) * c;
  const center = size / 2;

  return (
    <span
      className="relative inline-grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
      aria-label={`Importance ${v} of 10`}
      title={`Importance ${v}/10`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={center} cy={center} r={r} fill="none" stroke={TOKENS.line} strokeWidth={stroke} />
        {v > 0 && (
          <circle
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke={TOKENS.accent}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
          />
        )}
      </svg>
      <span
        className="absolute font-mono font-semibold"
        style={{ fontSize: size * 0.32, color: v > 0 ? TOKENS.accent : TOKENS.faint }}
      >
        {v > 0 ? v : "–"}
      </span>
    </span>
  );
}
