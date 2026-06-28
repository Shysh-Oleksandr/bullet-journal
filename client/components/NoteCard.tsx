"use client";

import { format } from "date-fns";
import Link from "next/link";
import { Star } from "lucide-react";
import { memo } from "react";

import { LabelPill } from "@/components/journal/LabelPill";
import { RatingRing } from "@/components/journal/RatingRing";
import { VideoThumbnail } from "@/components/journal/VideoThumbnail";
import { DEFAULT_NOTE_COLOR } from "@/components/journal/tokens";
import type { Note } from "@/lib/notes/types";

const MAX_CONTENT_SYMBOLS = 200;

/** Insert space after block tags and <br> so adjacent blocks don't run together, then strip tags. */
function stripHtml(html: string): string {
  let withSpaces = html.replace(/<br\s*\/?>/gi, " ");
  withSpaces = withSpaces.replace(/<\/(p|h[1-6]|div|li|blockquote|tr)\s*>/gi, "</$1> ");
  if (typeof document === "undefined") {
    return withSpaces.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  }
  const div = document.createElement("div");
  div.innerHTML = withSpaces;
  return (div.textContent ?? div.innerText ?? "").replace(/\s+/g, " ").trim();
}

function truncateContent(content: string, title: string, max: number): string {
  let plain = stripHtml(content);
  const titleTrimmed = title?.trim();
  if (titleTrimmed && plain.startsWith(titleTrimmed)) {
    plain = plain.slice(titleTrimmed.length).replace(/^\s+/, "").trim();
  }
  if (plain.length <= max) return plain;
  return plain.slice(0, max) + "…";
}

export interface NoteCardProps {
  note: Note;
  /** When true, render only the card (no link). Used for inline preview in the editor. */
  preview?: boolean;
}

function CoverMedia({ image }: { image: Note["images"][number] }) {
  const className = "h-full w-full object-cover";
  if (image.mimeType?.startsWith("video/")) {
    return <VideoThumbnail url={image.url} className={className} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image.url} alt="" className={className} loading="lazy" decoding="async" />
  );
}

function Cover({ note }: { note: Note }) {
  const images = note.images;
  if (!images?.length) return null;

  if (images.length === 1) {
    return (
      <div className="relative h-[140px] w-full overflow-hidden bg-surface-2">
        <CoverMedia image={images[0]} />
      </div>
    );
  }

  const desktopImages = images.slice(0, 3);
  const overflow = images.length - desktopImages.length;
  const desktopCols =
    desktopImages.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3";

  return (
    <div className="relative h-[140px] w-full overflow-hidden bg-surface-2">
      <div className="h-full sm:hidden">
        <CoverMedia image={images[0]} />
      </div>
      <div className={`hidden h-full sm:grid ${desktopCols}`}>
        {desktopImages.map((image, index) => (
          <div key={image._id} className="relative h-full overflow-hidden">
            <CoverMedia image={image} />
            {overflow > 0 && index === desktopImages.length - 1 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/45 font-mono text-[13px] font-medium text-white">
                +{overflow}
              </span>
            )}
          </div>
        ))}
      </div>
      <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 font-mono text-[10px] text-white sm:hidden">
        +{images.length - 1}
      </span>
    </div>
  );
}

function NoteCardComponent({ note, preview }: NoteCardProps) {
  const color = note.color || DEFAULT_NOTE_COLOR;
  const excerpt = truncateContent(note.content, note.title, MAX_CONTENT_SYMBOLS);

  const card = (
    <article
      className="overflow-hidden rounded-[16px] border border-line bg-surface shadow-[0_14px_44px_rgba(0,0,0,0.30)] transition-[filter] group"
      style={preview ? { borderLeft: `3px solid ${color}` } : undefined}
    >
      <Cover note={note} />
      <div className="p-[18px] group-hover:brightness-110 group-hover:bg-surface-2 transition-all">
        <div className="flex items-start justify-between gap-3">
          <h3 className="flex items-center gap-1.5 font-serif text-[19px] font-semibold leading-snug tracking-[-0.01em] text-text">
            <span className="line-clamp-1">{note.title}</span>
            {note.isStarred && (
              <Star size={15} className="shrink-0 text-accent" fill="currentColor" />
            )}
          </h3>
          {note.rating > 0 && <RatingRing value={note.rating} size={30} />}
        </div>

        {excerpt && (
          <p className="mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-muted">{excerpt}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {note.type && <LabelPill label={note.type} />}
          {note.category?.map((c) => <LabelPill key={c._id} label={c} />)}
          <span className="ml-auto font-mono text-[11px] text-faint">
            {format(new Date(note.startDate), "dd MMM · HH:mm")}
          </span>
        </div>
      </div>
    </article>
  );

  if (preview) return card;
  return (
    <Link href={`/notes/${note._id}`} className="block no-underline">
      {card}
    </Link>
  );
}

export const NoteCard = memo(NoteCardComponent);
NoteCard.displayName = "NoteCard";
