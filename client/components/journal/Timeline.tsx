"use client";

import { NoteCard } from "@/components/NoteCard";
import { withAlpha } from "@/components/journal/LabelPill";
import { DEFAULT_NOTE_COLOR } from "@/components/journal/tokens";
import { groupNotesByRecency } from "@/lib/notes/grouping";
import type { Note } from "@/lib/notes/types";

/** Recency-grouped timeline. Desktop: spine rail + color dot. Mobile: color left-border card. */
export function Timeline({ notes }: { notes: Note[] }) {
  const groups = groupNotesByRecency(notes);

  return (
    <div className="flex flex-col gap-7">
      {groups.map((group) => (
        <section key={group.key}>
          <h2 className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-faint">
            {group.label}
          </h2>
          <ul className="flex flex-col gap-4">
            {group.notes.map((note) => {
              const color = note.color || DEFAULT_NOTE_COLOR;
              return (
                <li key={note._id} className="sm:grid sm:grid-cols-[18px_1fr] sm:gap-4">
                  {/* Desktop spine + dot */}
                  <div className="relative hidden justify-center sm:flex">
                    <span className="absolute inset-y-0 w-0.5 bg-line" />
                    <span
                      className="absolute top-5 h-[11px] w-[11px] rounded-full"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 0 3px ${withAlpha(color, 0.18)}`,
                      }}
                    />
                  </div>
                  {/* Mobile: color left-border (desktop uses the spine instead) */}
                  <div
                    className="overflow-hidden rounded-[16px] border-l-[3px] sm:border-l-0"
                    style={{ borderLeftColor: color }}
                  >
                    <NoteCard note={note} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
