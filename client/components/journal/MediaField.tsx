"use client";

import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Play, Plus, Upload, X } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ImageLightbox } from "@/components/notes/ImageLightbox";
import { FieldLabel } from "@/components/journal/RatingSegments";
import { VideoThumbnail } from "@/components/journal/VideoThumbnail";
import {
  isNewImageItem,
  type NoteImageItem,
} from "@/lib/images/useHandleNoteImages";
import type { Image } from "@/lib/notes/types";

const ACCEPT_MEDIA =
  "image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,video/ogg,video/quicktime";

function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function itemKey(item: NoteImageItem, index: number): string {
  return isNewImageItem(item)
    ? `file-${fileKey(item.file)}-${index}`
    : (item as Image)._id;
}

function isVideoItem(item: NoteImageItem): boolean {
  if (isNewImageItem(item)) return item.file.type.startsWith("video/");
  return (item as Image).mimeType?.startsWith("video/") ?? false;
}

function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export interface MediaFieldProps {
  value: NoteImageItem[];
  onChange: (value: NoteImageItem[]) => void;
  disabled?: boolean;
  /** Show the section label eyebrow. */
  showLabel?: boolean;
}

/**
 * Media (image + video) editor: dashed dropzone when empty, sortable 3-col thumb
 * grid when filled (video thumbs show a play badge + client-derived duration).
 * Reuses ImageLightbox (which already plays video).
 */
export function MediaField({
  value,
  onChange,
  disabled,
  showLabel = true,
}: MediaFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(
    new Map(),
  );
  const prevKeysRef = useRef<Set<string>>(new Set());
  const [durations, setDurations] = useState<Map<string, number>>(new Map());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  const addFiles = useCallback(
    (files: FileList | File[] | null) => {
      if (!files) return;
      const arr = Array.from(files);
      if (!arr.length) return;
      onChange([...value, ...arr.map((file) => ({ file }))]);
    },
    [value, onChange],
  );

  const removeAt = useCallback(
    (index: number) => onChange(value.filter((_, i) => i !== index)),
    [value, onChange],
  );

  // Manage object URLs for new files.
  useEffect(() => {
    const keys = new Set<string>();
    value.forEach((item) => {
      if (isNewImageItem(item)) keys.add(fileKey(item.file));
    });
    setPreviewUrls((prev) => {
      const next = new Map(prev);
      prevKeysRef.current.forEach((key) => {
        if (!keys.has(key)) {
          const url = next.get(key);
          if (url) URL.revokeObjectURL(url);
          next.delete(key);
        }
      });
      value.forEach((item) => {
        if (isNewImageItem(item)) {
          const key = fileKey(item.file);
          if (!next.has(key)) next.set(key, URL.createObjectURL(item.file));
        }
      });
      prevKeysRef.current = keys;
      return next;
    });
  }, [value]);

  const getPreviewUrl = useCallback(
    (item: NoteImageItem): string | null => {
      if (isNewImageItem(item))
        return previewUrls.get(fileKey(item.file)) ?? null;
      return (item as Image).url || null;
    },
    [previewUrls],
  );

  const lightboxUrls = useMemo(
    () => value.map(getPreviewUrl).filter((u): u is string => !!u),
    [value, getPreviewUrl],
  );
  const lightboxMimeTypes = useMemo(
    () =>
      value
        .filter((item) => !!getPreviewUrl(item))
        .map((item) =>
          isNewImageItem(item)
            ? item.file.type
            : ((item as Image).mimeType ?? "image/"),
        ),
    [value, getPreviewUrl],
  );

  const ids = useMemo(() => value.map(itemKey), [value]);

  const setDuration = useCallback((url: string, sec: number) => {
    setDurations((m) => {
      if (m.get(url) === sec) return m;
      return new Map(m).set(url, sec);
    });
  }, []);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from < 0 || to < 0) return;
    onChange(arrayMove(value, from, to));
  };

  const openFilePicker = () => inputRef.current?.click();

  return (
    <div>
      {showLabel && <FieldLabel>Images &amp; video</FieldLabel>}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MEDIA}
        multiple
        hidden
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {value.length === 0 ? (
        <button
          type="button"
          disabled={disabled}
          onClick={openFilePicker}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          className="flex w-full cursor-pointer items-center gap-3 rounded-[12px] border border-dashed px-4 py-4 text-left transition-colors"
          style={{
            borderColor: dragOver ? "var(--accent)" : "var(--line)",
            backgroundColor: dragOver ? "var(--accent-soft)" : "transparent",
          }}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-surface-2 text-accent">
            <Upload size={18} />
          </span>
          <span className="flex-1">
            <span className="block text-[13px] font-semibold text-text">
              Drag &amp; drop, or tap to add
            </span>
            <span className="block text-[11px] text-faint">
              Photos and video
            </span>
          </span>
          <span className="text-[12px] font-semibold text-accent">
            Choose files
          </span>
        </button>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={ids} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {value.map((item, index) => (
                  <SortableThumb
                    key={ids[index]}
                    id={ids[index]}
                    src={getPreviewUrl(item)}
                    isVideo={isVideoItem(item)}
                    duration={
                      isVideoItem(item)
                        ? durations.get(getPreviewUrl(item) ?? "")
                        : undefined
                    }
                    onDuration={(d) => {
                      const url = getPreviewUrl(item);
                      if (url) setDuration(url, d);
                    }}
                    disabled={disabled}
                    onOpen={() => {
                      setLightboxIndex(index);
                      setLightboxOpen(true);
                    }}
                    onRemove={() => removeAt(index)}
                  />
                ))}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={openFilePicker}
                  className="grid aspect-square place-items-center rounded-[11px] border border-dashed border-line text-faint transition-colors hover:border-accent hover:text-accent"
                  aria-label="Add media"
                >
                  <Plus size={20} />
                </button>
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}

      {lightboxOpen && (
        <ImageLightbox
          opened={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={lightboxUrls}
          mimeTypes={lightboxMimeTypes}
          initialIndex={lightboxIndex}
        />
      )}
    </div>
  );
}

interface SortableThumbProps {
  id: string;
  src: string | null;
  isVideo: boolean;
  duration?: number;
  onDuration: (sec: number) => void;
  disabled?: boolean;
  onOpen: () => void;
  onRemove: () => void;
}

const SortableThumb = memo(function SortableThumb({
  id,
  src,
  isVideo,
  duration,
  onDuration,
  disabled,
  onOpen,
  onRemove,
}: SortableThumbProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
      onClick={onOpen}
      className="group relative aspect-square cursor-grab overflow-hidden rounded-[11px] border border-line bg-surface-2"
      {...attributes}
      {...listeners}
    >
      {src && isVideo ? (
        <>
          <VideoThumbnail
            url={src}
            className="h-full w-full object-cover"
            preloadVideo={src.startsWith("blob:")}
            onDuration={src.startsWith("blob:") ? onDuration : undefined}
          />
          <span className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white">
              <Play size={14} fill="currentColor" />
            </span>
          </span>
          {duration != null && (
            <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white">
              {fmtDuration(duration)}
            </span>
          )}
        </>
      ) : src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : null}

      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute z-10 right-1 top-1 grid h-6 w-6 cursor-pointer place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
        aria-label="Remove media"
      >
        <X size={13} />
      </button>
    </div>
  );
});
