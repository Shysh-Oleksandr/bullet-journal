"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

/** Floating amber action button (mobile only) → opens the create screen. */
export function Fab({ href = "/notes/new", label = "New entry" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="fixed bottom-[max(20px,env(safe-area-inset-bottom))] right-5 z-30 grid h-14 w-14 place-items-center rounded-[18px] text-[var(--on-accent)] shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-transform active:scale-95"
      style={{ background: "var(--accent-gradient)" }}
    >
      <Plus size={26} strokeWidth={2.4} />
    </Link>
  );
}
