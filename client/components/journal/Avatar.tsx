"use client";

/** Round initials avatar with the warm accent treatment. */
export function Avatar({ name, size = 36 }: { name?: string; size?: number }) {
  const initials = (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span
      className="grid shrink-0 place-items-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] font-semibold text-accent"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials || "·"}
    </span>
  );
}
