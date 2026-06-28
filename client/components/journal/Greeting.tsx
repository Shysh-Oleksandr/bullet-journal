"use client";

export interface GreetingProps {
  name?: string;
  total: number;
  thisMonth: number | null;
}

/** Serif greeting + mono stats subtitle. (Streak omitted — not derivable frontend-only.) */
export function Greeting({ name, total, thisMonth }: GreetingProps) {
  const parts = [`${total} ${total === 1 ? "entry" : "entries"}`];
  if (thisMonth != null) parts.push(`${thisMonth} this month`);

  return (
    <div className="mb-5">
      <p className="font-mono text-[12px] tracking-[0.04em] text-faint">
        {parts.join(" · ")}
      </p>
    </div>
  );
}
