"use client";

import type { CustomLabel } from "@/lib/notes/types";

/** Convert a #rrggbb to rgba with the given alpha. */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return hex;
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Lighten a hex toward parchment for readable tinted text on dark surfaces. */
export function tintText(hex: string, mix = 0.55): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return "#ece3d4";
  const lift = (c: number, t: number) => Math.round(c + (t - c) * mix);
  return `rgb(${lift(r, 236)},${lift(g, 227)},${lift(b, 212)})`;
}

/** Soft, color-tinted pill for a type/category label (card footer + detail row). */
export function LabelPill({ label }: { label: CustomLabel }) {
  const color = label.color || "#868e96";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-[7px] px-2 py-[3px] text-[11px] font-medium"
      style={{
        backgroundColor: withAlpha(color, 0.16),
        color: tintText(color),
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label.labelName}
    </span>
  );
}
