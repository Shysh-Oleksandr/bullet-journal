"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { HoverCard, Text, UnstyledButton } from "@mantine/core";
import { Download, LogOut, Plus } from "lucide-react";

import { Avatar } from "@/components/journal/Avatar";
import { useAuthStore } from "@/lib/auth/store";
import Image from "next/image";

export function HeaderBar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (!standalone) setShowInstall(true);
  }, []);

  const handleInstall = () => {
    (
      document.querySelector("pwa-install") as {
        showDialog?: (b: boolean) => void;
      } | null
    )?.showDialog?.(true);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // The detail/create screens render their own headers — hide the global bar there.
  if (pathname.startsWith("/notes")) return null;

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[900px] items-center justify-between px-5 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-inherit no-underline"
          onClick={handleLogoClick}
        >
          <Image
            src="/icon-192x192.png"
            alt="Bullet Journal"
            width={48}
            height={48}
            className="sm:w-12 sm:h-12 w-10 h-10"
          />
          <span className="font-serif sm:text-[30px] text-[24px] pt-1.5 font-semibold tracking-[-0.01em] text-text">
            Organix
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user && (
            <>
              <Link
                href="/notes/new"
                aria-label="New entry"
                className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-text transition-colors hover:bg-surface-2"
              >
                <Plus size={18} />
              </Link>
              <HoverCard
                openDelay={150}
                closeDelay={150}
                width={200}
                position="bottom-end"
              >
                <HoverCard.Target>
                  <UnstyledButton aria-label="Account" className="rounded-full">
                    <Avatar name={user.name} size={36} />
                  </UnstyledButton>
                </HoverCard.Target>
                <HoverCard.Dropdown
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--line)",
                  }}
                >
                  <Text size="xs" c="dimmed" className="px-1 pb-1.5">
                    {user.name}
                  </Text>
                  {showInstall && (
                    <UnstyledButton
                      className="flex w-full items-center gap-2 rounded-md px-2 !py-1 text-left text-sm text-text transition-colors hover:bg-surface-2"
                      onClick={handleInstall}
                    >
                      <Download size={16} />
                      Install app
                    </UnstyledButton>
                  )}
                  <UnstyledButton
                    className="flex w-full items-center gap-2 rounded-md px-2 !py-1 text-left text-sm text-text transition-colors hover:bg-surface-2"
                    onClick={() => logout()}
                  >
                    <LogOut size={16} />
                    Log out
                  </UnstyledButton>
                </HoverCard.Dropdown>
              </HoverCard>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
