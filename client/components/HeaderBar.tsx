"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Container,
  Group,
  HoverCard,
  Text,
  UnstyledButton,
} from "@mantine/core";
import Image from "next/image";
import { LogOut, Plus } from "lucide-react";

import { ThemeSwitch } from "@/components/ThemeSwitch";
import { useAuthStore } from "@/lib/auth/store";

export function HeaderBar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className="sticky top-0 z-10 border-b backdrop-blur bg-background/50"
      style={{
        borderColor: "var(--mantine-color-default-border)",
      }}
    >
      <Container size="md" py="sm" px="md">
        <Group justify="space-between">
          <Link
            href="/"
            className="text-inherit no-underline flex items-center gap-2"
            onClick={handleLogoClick}
          >
            <Image
              src="/icon-192x192.png"
              alt="Bullet Journal"
              width={40}
              height={40}
            />
            <Text fw={700} size="xl" className="sm:block hidden">
              Bullet Journal
            </Text>
          </Link>
          <Group gap="sm">
            {user && (
              <>
                <Link
                  href="/notes/new"
                  className="text-inherit p-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-(--mantine-color-dark-5)"
                >
                  <Plus size={24} />
                </Link>
                <HoverCard openDelay={200} closeDelay={150} width={200}>
                  <HoverCard.Target>
                    <UnstyledButton
                      className="rounded-md px-2 py-1 text-left transition-colors hover:bg-gray-100 dark:hover:bg-(--mantine-color-dark-5)"
                      style={{ cursor: "pointer" }}
                    >
                      <Text size="sm">{user.name}</Text>
                    </UnstyledButton>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <UnstyledButton
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-(--mantine-color-dark-5)"
                      onClick={() => logout()}
                    >
                      <LogOut size={16} />
                      Log out
                    </UnstyledButton>
                  </HoverCard.Dropdown>
                </HoverCard>
              </>
            )}
            <ThemeSwitch />
          </Group>
        </Group>
      </Container>
    </header>
  );
}
