"use client";

import { useDebouncedValue } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { useLabelsQuery } from "@/lib/custom-labels/api";
import {
  isNewImageItem,
  type NoteImageItem,
  useHandleNoteImages,
} from "@/lib/images/useHandleNoteImages";
import {
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
} from "@/lib/notes/api";
import type { CustomLabel, Note } from "@/lib/notes/types";

export const DEFAULT_COLOR = "#868e96";
export const DEFAULT_RATING = 0;
export const EMPTY_NOTE_HTML = "<h2></h2><br/>";

/** Extract the first H2 text from editor HTML for the note title. */
export function extractTitleFromEditorHtml(html: string): string {
  if (!html?.trim()) return "Untitled";
  if (typeof document === "undefined") return "Untitled";
  const div = document.createElement("div");
  div.innerHTML = html;
  const h2 = div.querySelector("h2");
  const text = h2?.textContent?.trim();
  return text || "Untitled";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Editor HTML for initial load: use content if it already has an H2, else prepend title as H2. */
export function getInitialEditorHtml(note: Note): string {
  const raw = (note.content ?? "").trim();
  if (raw.startsWith("<h2")) return note.content ?? "";
  const title = (note.title ?? "Untitled").trim();
  const body = note.content ?? "";
  return `<h2>${escapeHtml(title)}</h2>${body ? `\n${body}` : ""}`;
}

export interface UseNoteEditorOptions {
  mode: "create" | "edit";
  initialNote?: Note | null;
}

/**
 * All state + handlers for creating/editing a note. Shared by the Create screen
 * and the Detail screen so the create→upload images→update→navigate flow is
 * written once. Presentation-agnostic.
 */
export function useNoteEditor({ mode, initialNote }: UseNoteEditorOptions) {
  const router = useRouter();
  const createMutation = useCreateNoteMutation();
  const updateMutation = useUpdateNoteMutation();
  const deleteMutation = useDeleteNoteMutation();
  const handleNoteImages = useHandleNoteImages();

  // Lazy initializers so that edit-mode state is correct on the very first render,
  // preventing the "Untitled" flash caused by the useEffect running after paint.
  const [content, setContent] = useState(() =>
    mode === "edit" && initialNote ? getInitialEditorHtml(initialNote) : EMPTY_NOTE_HTML,
  );
  const [color, setColor] = useState(() =>
    mode === "edit" && initialNote ? (initialNote.color ?? DEFAULT_COLOR) : DEFAULT_COLOR,
  );
  const [startDateValue, setStartDateValue] = useState<Date | null>(() =>
    mode === "edit" && initialNote ? new Date(initialNote.startDate) : new Date(),
  );
  const [rating, setRating] = useState(() =>
    mode === "edit" && initialNote
      ? typeof initialNote.rating === "number"
        ? initialNote.rating
        : DEFAULT_RATING
      : DEFAULT_RATING,
  );
  const [isStarred, setIsStarred] = useState(() =>
    mode === "edit" && initialNote ? !!initialNote.isStarred : false,
  );
  const [typeId, setTypeId] = useState<string | null>(() =>
    mode === "edit" && initialNote ? (initialNote.type?._id ?? null) : null,
  );
  const [categoryIds, setCategoryIds] = useState<string[]>(() =>
    mode === "edit" && initialNote ? (initialNote.category?.map((c) => c._id) ?? []) : [],
  );
  const [currentImages, setCurrentImages] = useState<NoteImageItem[]>(() =>
    mode === "edit" && initialNote ? (initialNote.images ?? []) : [],
  );
  const [isSaving, setIsSaving] = useState(false);

  const { data: typeLabels = [] } = useLabelsQuery("Type");
  const { data: categoryLabels = [] } = useLabelsQuery("Category");

  const formStateRef = useRef({
    content: "",
    startDate: 0,
    color: DEFAULT_COLOR,
    rating: DEFAULT_RATING,
    isStarred: false,
    typeId: null as string | null,
    categoryIds: [] as string[],
    currentImages: [] as NoteImageItem[],
  });

  useEffect(() => {
    formStateRef.current = {
      content,
      startDate: startDateValue?.getTime() ?? Date.now(),
      color,
      rating,
      isStarred,
      typeId,
      categoryIds,
      currentImages,
    };
  }, [content, startDateValue, color, rating, isStarred, typeId, categoryIds, currentImages]);

  useEffect(() => {
    if (mode === "edit" && initialNote) {
      setContent(getInitialEditorHtml(initialNote));
      setColor(initialNote.color ?? DEFAULT_COLOR);
      setStartDateValue(new Date(initialNote.startDate));
      setRating(typeof initialNote.rating === "number" ? initialNote.rating : DEFAULT_RATING);
      setIsStarred(!!initialNote.isStarred);
      setTypeId(initialNote.type?._id ?? null);
      setCategoryIds(initialNote.category?.map((c) => c._id) ?? []);
      setCurrentImages(initialNote.images ?? []);
    } else if (mode === "create") {
      setContent(EMPTY_NOTE_HTML);
      setColor(DEFAULT_COLOR);
      setStartDateValue(new Date());
      setRating(DEFAULT_RATING);
      setIsStarred(false);
      setTypeId(null);
      setCategoryIds([]);
      setCurrentImages([]);
    }
  }, [mode, initialNote]);

  const startDate = startDateValue?.getTime() ?? Date.now();

  const typeSelectData = useMemo(
    () => typeLabels.map((l) => ({ value: l._id, label: l.labelName })),
    [typeLabels],
  );
  const categorySelectData = useMemo(
    () => categoryLabels.map((l) => ({ value: l._id, label: l.labelName })),
    [categoryLabels],
  );
  const labelByValue = useMemo(() => {
    const map = new Map<string, CustomLabel>();
    typeLabels.forEach((l) => map.set(l._id, l));
    categoryLabels.forEach((l) => map.set(l._id, l));
    return map;
  }, [typeLabels, categoryLabels]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const state = formStateRef.current;
      const startDateTs = state.startDate || Date.now();
      const basePayload = {
        title: extractTitleFromEditorHtml(state.content),
        content: state.content || undefined,
        startDate: startDateTs,
        color: state.color || undefined,
        rating: state.rating,
        isStarred: state.isStarred,
        type: state.typeId,
        category: state.categoryIds,
      };
      const imagesToSave = state.currentImages;

      if (mode === "create") {
        try {
          const note = await createMutation.mutateAsync({ ...basePayload, images: [] });
          const newImages = await handleNoteImages(imagesToSave, note);
          if (newImages.length) {
            await updateMutation.mutateAsync({
              id: note._id,
              ...basePayload,
              images: newImages.map((i) => i._id),
            });
          }
          toast.success("Entry created");
          router.replace(`/notes/${note._id}`);
        } catch (err) {
          console.error("Failed to create note", err);
          toast.error("Failed to create entry");
        }
        return;
      }

      if (initialNote?._id) {
        try {
          const newImages = await handleNoteImages(imagesToSave, initialNote);
          await updateMutation.mutateAsync({
            id: initialNote._id,
            ...basePayload,
            images: newImages.map((i) => i._id),
          });
          toast.success("Changes saved");
          router.refresh();
        } catch (err) {
          console.error("Failed to update note", err);
          toast.error("Failed to save changes");
        }
      }
    } finally {
      setIsSaving(false);
    }
  }, [mode, initialNote, handleNoteImages, createMutation, updateMutation, router]);

  const handleDelete = useCallback(async () => {
    if (mode !== "edit" || !initialNote?._id) return;
    try {
      router.push("/");
      await deleteMutation.mutateAsync(initialNote._id);
      toast.success("Entry deleted");
    } catch (err) {
      console.error("Failed to delete note", err);
      toast.error("Failed to delete entry");
    }
  }, [mode, initialNote?._id, deleteMutation, router]);

  const [debouncedContent] = useDebouncedValue(content, 400);

  const previewNote = useMemo((): Note => {
    const savedImages = currentImages.filter(
      (item): item is Note["images"][number] => !isNewImageItem(item),
    );
    return {
      _id: initialNote?._id ?? "preview",
      author: initialNote?.author ?? "",
      title: extractTitleFromEditorHtml(debouncedContent),
      content: debouncedContent || "",
      color: color || DEFAULT_COLOR,
      startDate,
      rating,
      isLocked: initialNote?.isLocked ?? false,
      isStarred,
      images: savedImages,
      type: typeId ? (labelByValue.get(typeId) ?? null) : null,
      category: categoryIds
        .map((id) => labelByValue.get(id))
        .filter((l): l is CustomLabel => !!l),
    };
  }, [
    debouncedContent,
    color,
    startDate,
    rating,
    isStarred,
    currentImages,
    typeId,
    categoryIds,
    labelByValue,
    initialNote?._id,
    initialNote?.author,
    initialNote?.isLocked,
  ]);

  return {
    // state
    content,
    setContent,
    color,
    setColor,
    startDateValue,
    setStartDateValue,
    rating,
    setRating,
    isStarred,
    setIsStarred,
    typeId,
    setTypeId,
    categoryIds,
    setCategoryIds,
    currentImages,
    setCurrentImages,
    // labels
    typeLabels,
    categoryLabels,
    typeSelectData,
    categorySelectData,
    labelByValue,
    // actions
    handleSave,
    handleDelete,
    isSaving,
    isDeleting: deleteMutation.isPending,
    // derived
    previewNote,
  };
}

