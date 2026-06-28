"use client";

import { Loader } from "@mantine/core";
import Link from "next/link";

import { cn } from "@/lib/utils";

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

/** Full-width amber-gradient primary action (Save / Create). */
export function PrimaryButton({
  loading,
  children,
  className,
  disabled,
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 h-[48px] rounded-[13px] px-5 py-3 text-[14px] font-semibold text-[var(--on-accent)] transition-[filter] hover:brightness-110 disabled:opacity-70",
        className,
      )}
      style={{ background: "var(--accent-gradient)" }}
    >
      {loading ? <Loader size={16} color="var(--on-accent)" /> : children}
    </button>
  );
}

type DangerOutlineButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Outline danger action (Delete). */
export function DangerOutlineButton({
  children,
  className,
  ...rest
}: DangerOutlineButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[13px] border px-5 py-3 text-[14px] font-semibold transition-colors hover:bg-surface-2",
        className,
      )}
      style={{ borderColor: "var(--line)", color: "var(--danger-text)" }}
    >
      {children}
    </button>
  );
}

/** Round icon button (back / close). */
export function RoundIconButton({
  children,
  href,
  ...rest
}: { children: React.ReactNode; href?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const className =
    "grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-text transition-colors hover:bg-surface-2";
  if (href) {
    return (
      <Link href={href} className={className} aria-label={rest["aria-label"]}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" {...rest} className={className}>
      {children}
    </button>
  );
}
