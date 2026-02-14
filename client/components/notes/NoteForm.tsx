"use client";

import {
  Box,
  Button,
  ColorInput,
  Container,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { NoteCard } from "@/components/NoteCard";
import { BlockNoteEditor } from "@/components/notes/BlockNoteEditor";
import { CreateLabelModal } from "@/components/notes/CreateLabelModal";
import {
  NoteImagesField,
  NoteImagesList,
} from "@/components/notes/NoteImagesSection";
import { useLabelsQuery } from "@/lib/custom-labels/api";
import {
  isNewImageItem,
  NoteImageItem,
  useHandleNoteImages,
} from "@/lib/images/useHandleNoteImages";
import {
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
} from "@/lib/notes/api";
import type { CustomLabel, Note } from "@/lib/notes/types";
import { cn } from "@/lib/utils";
import { Plus, Save, Star, Trash } from "lucide-react";

const DEFAULT_COLOR = "#868e96";
const DEFAULT_RATING = 0;

export interface NoteFormProps {
  mode: "create" | "edit";
  initialNote?: Note | null;
}

/** Extract the first H2 text from editor HTML for the note title. */
function extractTitleFromEditorHtml(html: string): string {
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
function getInitialEditorHtml(note: Note): string {
  const raw = (note.content ?? "").trim();
  if (raw.startsWith("<h2")) return note.content ?? "";
  const title = (note.title ?? "Untitled").trim();
  const body = note.content ?? "";
  return `<h2>${escapeHtml(title)}</h2>${body ? `\n${body}` : ""}`;
}

const EMPTY_NOTE_HTML = "<h2></h2><br/>";

export function NoteForm({ mode, initialNote }: NoteFormProps) {
  const router = useRouter();
  const createMutation = useCreateNoteMutation();
  const updateMutation = useUpdateNoteMutation();
  const deleteMutation = useDeleteNoteMutation();

  const [content, setContent] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [startDateValue, setStartDateValue] = useState<Date | null>(null);
  const [rating, setRating] = useState(DEFAULT_RATING);
  const [isStarred, setIsStarred] = useState(false);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [currentImages, setCurrentImages] = useState<NoteImageItem[]>([]);

  const handleNoteImages = useHandleNoteImages();
  const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [createTypeOpen, { open: openCreateType, close: closeCreateType }] =
    useDisclosure(false);
  const [
    createCategoryOpen,
    { open: openCreateCategory, close: closeCreateCategory },
  ] = useDisclosure(false);

  const { data: typeLabels = [] } = useLabelsQuery("Type");
  const { data: categoryLabels = [] } = useLabelsQuery("Category");

  useEffect(() => {
    if (mode === "edit" && initialNote) {
      setContent(getInitialEditorHtml(initialNote));
      setColor(initialNote.color ?? DEFAULT_COLOR);
      setStartDateValue(new Date(initialNote.startDate));
      setRating(
        typeof initialNote.rating === "number"
          ? initialNote.rating
          : DEFAULT_RATING,
      );
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
    const basePayload = {
      title: extractTitleFromEditorHtml(content),
      content: content || undefined,
      startDate,
      color: color || undefined,
      rating,
      isStarred,
      type: typeId,
      category: categoryIds,
    };

    if (mode === "create") {
      try {
        const note = await createMutation.mutateAsync({
          ...basePayload,
          images: [],
        });
        const newImages = await handleNoteImages(currentImages, note);
        if (newImages.length) {
          await updateMutation.mutateAsync({
            id: note._id,
            ...basePayload,
            images: newImages.map((i) => i._id),
          });
        }
        router.replace(`/notes/${note._id}`);
      } catch (err) {
        console.error("Failed to create note", err);
      }
      return;
    }

    if (initialNote?._id) {
      try {
        const newImages = await handleNoteImages(currentImages, initialNote);
        await updateMutation.mutateAsync({
          id: initialNote._id,
          ...basePayload,
          images: newImages.map((i) => i._id),
        });
        router.refresh();
      } catch (err) {
        console.error("Failed to update note", err);
      }
    }
  }, [
    content,
    startDate,
    color,
    rating,
    isStarred,
    typeId,
    categoryIds,
    currentImages,
    mode,
    initialNote,
    handleNoteImages,
    createMutation,
    updateMutation,
    router,
  ]);

  const handleDelete = useCallback(async () => {
    if (mode !== "edit" || !initialNote?._id) return;
    try {
      closeDeleteModal();
      router.push("/");
      await deleteMutation.mutateAsync(initialNote._id);
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  }, [mode, initialNote?._id, deleteMutation, closeDeleteModal, router]);

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const previewNote: Note = {
    _id: initialNote?._id ?? "preview",
    author: initialNote?.author ?? "",
    title: extractTitleFromEditorHtml(content),
    content: content || "",
    color: color || DEFAULT_COLOR,
    startDate,
    rating,
    isLocked: initialNote?.isLocked ?? false,
    isStarred,
    images: currentImages.filter(
      (item): item is Note["images"][number] => !isNewImageItem(item),
    ),
    type: typeId ? (labelByValue.get(typeId) ?? null) : null,
    category: categoryIds
      .map((id) => labelByValue.get(id))
      .filter((l): l is CustomLabel => !!l),
  };

  return (
    <Container size="md" className="mx-auto max-w-2xl px-4 sm:py-6 py-4">
      <Group
        wrap="wrap"
        align="flex-end"
        className="sm:gap-x-3! gap-x-2! gap-y-0!"
      >
        <div className="flex items-end gap-1">
          <Select
            label="Type"
            placeholder="Select type"
            data={typeSelectData}
            value={typeId}
            onChange={setTypeId}
            searchable
            clearable
            nothingFoundMessage="No type found"
            style={{ minWidth: 180 }}
            renderOption={({ option }) => {
              const label = labelByValue.get(option.value);
              return (
                <Group gap="xs">
                  {label && (
                    <Box
                      w={12}
                      h={12}
                      style={{
                        backgroundColor: label.color || "#868e96",
                        borderRadius: 4,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span>{option.label}</span>
                </Group>
              );
            }}
          />
          <Button
            variant="light"
            size="sm"
            className="px-2!"
            onClick={openCreateType}
          >
            <Plus />
          </Button>
        </div>
        <NoteImagesField
          value={currentImages}
          onChange={setCurrentImages}
          disabled={isSaving}
        />
        <ColorInput
          label="Color"
          value={color}
          onChange={setColor}
          format="hex"
          withPreview
          style={{ width: 130 }}
        />
        <DateTimePicker
          label="Date & time"
          value={startDateValue}
          onChange={(v) => setStartDateValue(typeof v === "string" ? (v ? new Date(v) : null) : v)}
          placeholder="Pick date and time"
          style={{ width: 200 }}
        />
        <NumberInput
          label="Rating"
          min={0}
          max={10}
          value={rating}
          onChange={(v) => setRating(Number(v) ?? 0)}
          style={{ width: 62 }}
        />

        <Button
          variant="subtle"
          size="sm"
          className="px-2!"
          onClick={() => setIsStarred(!isStarred)}
        >
          <Star
            className={cn(
              "transition-colors",
              isStarred ? "text-yellow-500" : "text-zinc-500",
            )}
          />
        </Button>
      </Group>

      <Group
        gap="xs"
        align="flex-end"
        justify="flex-end"
        className="mb-2 mt-2"
        flex={1}
      >
        <MultiSelect
          placeholder="Select categories"
          data={categorySelectData}
          value={categoryIds}
          onChange={setCategoryIds}
          searchable
          nothingFoundMessage="No category found"
          style={{ minWidth: 220 }}
          flex={1}
          hidePickedOptions
          renderOption={({ option }) => {
            const label = labelByValue.get(option.value);
            return (
              <Group gap="xs">
                {label && (
                  <Box
                    w={12}
                    h={12}
                    style={{
                      backgroundColor: label.color || "#868e96",
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  />
                )}
                <span>{option.label}</span>
              </Group>
            );
          }}
        />
        <Button
          variant="light"
          size="sm"
          className="px-2!"
          onClick={openCreateCategory}
        >
          <Plus />
        </Button>
      </Group>

      <NoteImagesList
        value={currentImages}
        onChange={setCurrentImages}
        disabled={isSaving}
      />

      <BlockNoteEditor
        initialHtml={
          mode === "edit" && initialNote
            ? getInitialEditorHtml(initialNote)
            : mode === "create"
              ? EMPTY_NOTE_HTML
              : undefined
        }
        onChange={setContent}
        editable
      />

      <Group gap="sm" className="w-full mb-4 mt-2">
        <Button
          loading={isSaving}
          onClick={handleSave}
          variant="filled"
          flex={1}
          size="md"
          className="bg-linear-to-br! bg-cyan-700/50 from-cyan-800/80 to-sky-800/70 hover:bg-cyan-600! text-white transition-all duration-300"
        >
          <Save className="mr-1.5" size={20} />
          {mode === "create" ? "Create" : "Save"}
        </Button>
        {mode === "edit" && (
          <Button
            color="red"
            variant="light"
            loading={isDeleting}
            onClick={openDeleteModal}
            size="md"
          >
            <Trash className="mr-1.5" size={20} />
            Delete
          </Button>
        )}
      </Group>

      <CreateLabelModal
        opened={createTypeOpen}
        onClose={closeCreateType}
        labelFor="Type"
        onCreated={(label) => setTypeId(label._id)}
      />
      <CreateLabelModal
        opened={createCategoryOpen}
        onClose={closeCreateCategory}
        labelFor="Category"
        onCreated={(label) => setCategoryIds((prev) => [...prev, label._id])}
      />

      <Modal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete note?"
        centered
      >
        <p className="text-zinc-600 dark:text-zinc-400">
          This cannot be undone.
        </p>
        <Group justify="flex-end" mt="md" gap="sm">
          <Button variant="default" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button color="red" loading={isDeleting} onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>

      <Stack
        gap="xs"
        className="border-t border-zinc-200 pt-4 dark:border-zinc-700"
      >
        <Text size="sm" fw={500} c="dimmed">
          Preview
        </Text>
        <NoteCard note={previewNote} preview />
      </Stack>
    </Container>
  );
}
