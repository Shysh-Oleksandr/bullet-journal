"use client";

import { useState } from "react";

/** Field label eyebrow shared by journal controls. */
export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-faint">
      {children}
    </div>
  );
}

export interface RatingSegmentsProps {
  /** 0–10. 0 = unset. */
  value: number;
  onChange: (value: number) => void;
}

/**
 * 10-segment importance bar. Click segment i → rating = i; click the current
 * value → clear to 0. ←/→ decrement/increment when focused.
 */
export function RatingSegments({ value, onChange }: RatingSegmentsProps) {
  const [focused, setFocused] = useState(false);
  const v = Math.max(0, Math.min(10, value));

  const handleSegment = (i: number) => {
    onChange(i === v ? 0 : i);
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className="w-7 shrink-0 text-center font-serif text-[28px] sm:text-[32px] leading-none pt-1.5"
          style={{ color: v > 0 ? "var(--accent)" : "var(--faint)" }}
        >
          {v > 0 ? v : "–"}
        </span>
        <div
          className="flex flex-1 gap-1 outline-none"
          role="slider"
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={10}
          aria-valuenow={v}
          aria-label="Importance"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              onChange(Math.min(10, v + 1));
            } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              onChange(Math.max(0, v - 1));
            }
          }}
        >
          {Array.from({ length: 10 }, (_, idx) => {
            const seg = idx + 1;
            const filled = seg <= v;
            const isCurrent = seg === v;
            return (
              <button
                key={seg}
                type="button"
                aria-label={`Set importance ${seg}`}
                onClick={() => handleSegment(seg)}
                className="h-7 sm:h-10 flex-1 cursor-pointer rounded-[5px] border transition-colors"
                style={{
                  backgroundColor: filled ? "var(--accent)" : "var(--surface-2)",
                  borderColor: filled ? "var(--accent)" : "var(--line)",
                  boxShadow:
                    isCurrent && focused
                      ? "0 0 0 2px var(--accent-border)"
                      : "none",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
