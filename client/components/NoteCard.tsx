"use client";

import { Badge, Box, Card, Text, useMantineColorScheme } from "@mantine/core";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

import type { Note } from "@/lib/notes/types";
import { cn } from "@/lib/utils";

const MAX_CONTENT_SYMBOLS = 260;
const DEFAULT_COLOR = "#0891b2";

/** Replace <br> tags with space so block boundaries don't run together, then strip tags. */
function stripHtml(html: string): string {
  const withSpaces = html.replace(/<br\s*\/?>/gi, " ");
  if (typeof document === "undefined") {
    return withSpaces
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  const div = document.createElement("div");
  div.innerHTML = withSpaces;
  const text = (div.textContent ?? div.innerText ?? "")
    .replace(/\s+/g, " ")
    .trim();
  return text;
}

/** Truncate content for card description. Strips HTML and removes leading title duplicate. */
function truncateContent(content: string, title: string, max: number): string {
  let plain = stripHtml(content);
  const titleTrimmed = title?.trim();
  if (titleTrimmed && plain.startsWith(titleTrimmed)) {
    plain = plain.slice(titleTrimmed.length).replace(/^\s+/, "").trim();
  }
  if (plain.length <= max) return plain;
  return plain.slice(0, max) + "...";
}

export interface NoteCardProps {
  note: Note;
  /** When true, render only the card (no link). Use for inline preview e.g. in note form. */
  preview?: boolean;
}

export function NoteCard({ note, preview }: NoteCardProps) {
  const { colorScheme } = useMantineColorScheme();
  const color = note.color || DEFAULT_COLOR;
  const labels = [...(note.type ? [note.type] : []), ...(note.category ?? [])];

  const card = (
    <Card
      withBorder
      shadow="lg"
      padding={0}
      className={`overflow-hidden transition-all duration-300 ${colorScheme === "dark" ? "hover:brightness-110" : "hover:brightness-95"}`}
      style={{ borderLeftWidth: "4px", borderLeftColor: color }}
    >
      {note.images?.length > 0 && (
        <div className="relative bg-zinc-100 dark:bg-zinc-800">
          {note.images.length === 1 ? (
            <div className="relative h-32 w-full">
              <Image
                src={note.images[0].url}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className={cn(
                "grid grid-cols-2 gap-px bg-zinc-200 dark:bg-zinc-700 md:grid-cols-3",
                note.images.length === 2 && "md:grid-cols-2",
              )}
            >
              {note.images.slice(0, 3).map((img, i) => (
                <div
                  key={img._id}
                  className={`relative w-full h-[150px] bg-zinc-100 dark:bg-zinc-800 ${i === 2 ? "hidden md:block" : ""}`}
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          {note.images.length > 3 && (
            <Badge
              size="sm"
              variant="filled"
              color="dark"
              className="absolute bottom-1 right-1"
            >
              +{note.images.length - 3}
            </Badge>
          )}
        </div>
      )}
      <Card.Section p="md">
        <Text fw={700} size="lg" lineClamp={1}>
          {note.title}
        </Text>
        <Text size="sm" c="dimmed" lineClamp={3} mt="xs">
          {truncateContent(note.content, note.title, MAX_CONTENT_SYMBOLS)}
        </Text>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Text size="xs" c="dimmed">
            {format(new Date(note.startDate), "dd MMM yyyy HH:mm")}
          </Text>
          <Text size="xs" c="dimmed">
            {note.rating}/10
          </Text>
          {note.isStarred && (
            <Text size="xs" c="yellow.6" aria-label="Starred">
              ★
            </Text>
          )}
          {labels.map((label) => (
            <Box
              key={label._id}
              component="span"
              style={{
                borderLeft: `3px solid ${label.color || "#64748b"}`,
              }}
              className={cn(
                "inline-flex rounded py-0.5 pl-1.5 pr-2 text-xs font-medium",
                colorScheme === "dark"
                  ? "bg-zinc-600 text-zinc-200"
                  : "bg-zinc-200 text-zinc-800",
              )}
            >
              {label.labelName}
            </Box>
          ))}
        </div>
      </Card.Section>
    </Card>
  );

  if (preview) return card;
  return (
    <Link href={`/notes/${note._id}`} className="block">
      {card}
    </Link>
  );
}
