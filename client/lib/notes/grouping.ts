import {
  isSameMonth,
  isSameYear,
  isToday,
  isYesterday,
  startOfDay,
} from "date-fns";

import type { Note } from "@/lib/notes/types";

export interface NoteGroup {
  key: string;
  /** Mono eyebrow label, e.g. "TODAY", "EARLIER THIS MONTH", "MARCH 2026". */
  label: string;
  notes: Note[];
}

/**
 * Group notes (already sorted newest-first by the server) into recency buckets:
 * TODAY, YESTERDAY, EARLIER THIS MONTH, then month names. Used by the timeline.
 */
export function groupNotesByRecency(notes: Note[], now = new Date()): NoteGroup[] {
  const groups: NoteGroup[] = [];
  const byKey = new Map<string, NoteGroup>();
  const todayStart = startOfDay(now);

  const push = (key: string, label: string, note: Note) => {
    let group = byKey.get(key);
    if (!group) {
      group = { key, label, notes: [] };
      byKey.set(key, group);
      groups.push(group);
    }
    group.notes.push(note);
  };

  for (const note of notes) {
    const d = new Date(note.startDate);
    if (isToday(d) || d.getTime() > todayStart.getTime()) {
      push("today", "TODAY", note);
    } else if (isYesterday(d)) {
      push("yesterday", "YESTERDAY", note);
    } else if (isSameMonth(d, now) && isSameYear(d, now)) {
      push("this-month", "EARLIER THIS MONTH", note);
    } else {
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d
        .toLocaleString("en-US", { month: "long", year: "numeric" })
        .toUpperCase();
      push(key, label, note);
    }
  }

  return groups;
}
