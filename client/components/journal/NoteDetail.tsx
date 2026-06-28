"use client";

import { useDisclosure } from "@mantine/hooks";
import { format } from "date-fns";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Save,
  Trash2,
} from "lucide-react";
import { memo, useMemo, useState } from "react";

import { BlockNoteEditor } from "@/components/notes/BlockNoteEditor";
import { CreateLabelModal } from "@/components/notes/CreateLabelModal";
import {
  DangerOutlineButton,
  PrimaryButton,
  RoundIconButton,
} from "@/components/journal/Buttons";
import { DeleteConfirm } from "@/components/journal/DeleteConfirm";
import { LabelPill } from "@/components/journal/LabelPill";
import { MetadataControls } from "@/components/journal/MetadataControls";
import {
  ColorHexPill,
  RatingPill,
  StarredPill,
  TypePill,
} from "@/components/journal/MetadataPill";
import { getInitialEditorHtml, useNoteEditor } from "@/lib/notes/useNoteEditor";
import { isNewImageItem } from "@/lib/images/useHandleNoteImages";
import type { Image, Note } from "@/lib/notes/types";

function fileName(url: string): string {
  try {
    return decodeURIComponent(url.split("/").pop() ?? "media");
  } catch {
    return "media";
  }
}

interface MediaItem {
  url: string;
  isVideo: boolean;
  label: string;
}

function getMediaItems(images: Note["images"]): MediaItem[] {
  return images
    .map((item) => {
      const img = item as Image;
      if (!img.url) return null;
      return {
        url: img.url,
        isVideo: img.mimeType?.startsWith("video/") ?? false,
        label: fileName(img.url),
      };
    })
    .filter((x): x is MediaItem => x !== null);
}

/** Only mount the active slide and immediate neighbors to limit decode work. */
function shouldMountSlide(index: number, activeIndex: number): boolean {
  return Math.abs(index - activeIndex) <= 1;
}

interface MediaCarouselProps {
  items: MediaItem[];
}

const MediaCarousel = memo(function MediaCarousel({ items }: MediaCarouselProps) {
  const [index, setIndex] = useState(0);
  if (items.length === 0) return null;

  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  return (
    <figure className="mt-6">
      <div className="relative aspect-video overflow-hidden rounded-[14px] bg-surface-2">
        {items.map((item, i) => {
          const isActive = i === index;
          const mounted = shouldMountSlide(i, index);

          return (
            <div
              key={item.url}
              className="absolute inset-0 transition-opacity duration-200"
              style={{
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              {mounted &&
                (item.isVideo ? (
                  <video
                    src={item.url}
                    controls={isActive}
                    playsInline
                    preload={isActive ? "auto" : "metadata"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt=""
                    loading={isActive ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ))}
            </div>
          );
        })}

        {items.length > 1 && (
          <>
            {hasPrev && (
              <button
                type="button"
                onClick={() => setIndex((i) => i - 1)}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                aria-label="Previous media"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {hasNext && (
              <button
                type="button"
                onClick={() => setIndex((i) => i + 1)}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                aria-label="Next media"
              >
                <ChevronRight size={20} />
              </button>
            )}
            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to media ${i + 1}`}
                  className="h-1.5 cursor-pointer rounded-full transition-all"
                  style={{
                    width: i === index ? "20px" : "6px",
                    backgroundColor:
                      i === index ? "var(--accent)" : "rgba(255,255,255,0.5)",
                  }}
                />
              ))}
            </div>
          </>
        )}

        {items.length > 1 && (
          <figcaption className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center justify-center font-mono text-[11px] text-white">
            {index + 1} / {items.length}
          </figcaption>
        )}
      </div>
    </figure>
  );
});

const NoteEditorSection = memo(function NoteEditorSection({
  note,
  onChange,
}: {
  note: Note;
  onChange: (html: string) => void;
}) {
  return (
    <div className="mt-6">
      <BlockNoteEditor
        initialHtml={getInitialEditorHtml(note)}
        onChange={onChange}
        editable
      />
    </div>
  );
});

export function NoteDetail({ note }: { note: Note }) {
  const editor = useNoteEditor({ mode: "edit", initialNote: note });
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [deleteOpen, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [createTypeOpen, { open: openCreateType, close: closeCreateType }] =
    useDisclosure(false);
  const [
    createCategoryOpen,
    { open: openCreateCategory, close: closeCreateCategory },
  ] = useDisclosure(false);

  const type = editor.typeId ? editor.labelByValue.get(editor.typeId) : null;
  const categories = editor.categoryIds
    .map((id) => editor.labelByValue.get(id))
    .filter((l): l is NonNullable<typeof l> => !!l);

  const mediaItems = useMemo(() => {
    const savedImages = editor.currentImages.filter(
      (item) => !isNewImageItem(item),
    ) as Image[];
    return getMediaItems(savedImages);
  }, [editor.currentImages]);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[900px] items-center justify-between px-5 py-3 sm:px-6">
          <RoundIconButton href="/" aria-label="Back to journal">
            <ArrowLeft size={18} />
          </RoundIconButton>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
            Saved
          </span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[900px] px-5 py-6 sm:px-11 sm:py-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
          {format(
            new Date(editor.startDateValue ?? note.startDate),
            "dd MMMM yyyy · HH:mm",
          )}
        </p>
        <h1 className="mt-2 font-serif text-[26px] font-semibold leading-tight tracking-[-0.015em] text-text sm:text-[38px]">
          {editor.previewNote.title}
        </h1>

        {/* Metadata region — collapsed pills ↔ expanded edit panel */}
        <div className="mt-4">
          {!isEditingMeta ? (
            <div className="flex flex-wrap items-center gap-2">
              {type && <TypePill type={type} />}
              {categories.map((c) => (
                <LabelPill key={c._id} label={c} />
              ))}
              {editor.rating > 0 && <RatingPill rating={editor.rating} />}
              {editor.isStarred && <StarredPill />}
              <ColorHexPill color={editor.color} />
              <button
                type="button"
                onClick={() => setIsEditingMeta(true)}
                className="ml-auto cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-[12px] font-medium text-muted transition-colors hover:text-text"
              >
                <Pencil size={13} />
                Edit details
              </button>
            </div>
          ) : (
            <div className="rounded-[16px] border-[1.5px] border-(--accent-border) bg-surface p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                  Editing details
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingMeta(false)}
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-(--accent-soft) px-3 py-1 text-[12px] font-semibold text-accent transition-colors hover:brightness-110"
                >
                  <Check size={13} />
                  Done
                </button>
              </div>
              <MetadataControls
                typeId={editor.typeId}
                setTypeId={editor.setTypeId}
                categoryIds={editor.categoryIds}
                setCategoryIds={editor.setCategoryIds}
                color={editor.color}
                setColor={editor.setColor}
                startDateValue={editor.startDateValue}
                setStartDateValue={editor.setStartDateValue}
                rating={editor.rating}
                setRating={editor.setRating}
                isStarred={editor.isStarred}
                setIsStarred={editor.setIsStarred}
                currentImages={editor.currentImages}
                setCurrentImages={editor.setCurrentImages}
                typeLabels={editor.typeLabels}
                categoryLabels={editor.categoryLabels}
                labelByValue={editor.labelByValue}
                onCreateType={openCreateType}
                onCreateCategory={openCreateCategory}
                disabled={editor.isSaving}
              />
            </div>
          )}
        </div>

        {/* Hide carousel while editing — MediaField already shows the same images. */}
        {!isEditingMeta && <MediaCarousel items={mediaItems} />}

        <NoteEditorSection note={note} onChange={editor.setContent} />
      </div>

      {/* Action bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/90 backdrop-blur pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto flex w-full max-w-[900px] gap-3 px-5 sm:px-6">
          <PrimaryButton
            onClick={editor.handleSave}
            loading={editor.isSaving}
            className="flex-1"
          >
            <Save size={18} />
            Save changes
          </PrimaryButton>
          <DangerOutlineButton onClick={openDelete}>
            <Trash2 size={18} />
            <span className="hidden sm:inline">Delete</span>
          </DangerOutlineButton>
        </div>
      </div>

      <DeleteConfirm
        opened={deleteOpen}
        onClose={closeDelete}
        onConfirm={editor.handleDelete}
        title={editor.previewNote.title}
      />
      <CreateLabelModal
        opened={createTypeOpen}
        onClose={closeCreateType}
        labelFor="Type"
        onCreated={(label) => editor.setTypeId(label._id)}
      />
      <CreateLabelModal
        opened={createCategoryOpen}
        onClose={closeCreateCategory}
        labelFor="Category"
        onCreated={(label) =>
          editor.setCategoryIds([...editor.categoryIds, label._id])
        }
      />
    </div>
  );
}
