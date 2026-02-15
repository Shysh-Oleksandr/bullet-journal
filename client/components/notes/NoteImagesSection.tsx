"use client";

import {
  Box,
  FileInput,
  Group,
  Image as MantineImage,
  Stack,
  Text,
} from "@mantine/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Image } from "@/lib/notes/types";

import {
  isNewImageItem,
  type NoteImageItem,
} from "@/lib/images/useHandleNoteImages";
import { X } from "lucide-react";

import { ImageLightbox } from "@/components/notes/ImageLightbox";

const ACCEPT_IMAGES = "image/png,image/jpeg,image/webp,image/gif";

export function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export interface NoteImagesFieldProps {
  value: NoteImageItem[];
  onChange: (value: NoteImageItem[]) => void;
  disabled?: boolean;
}

/** Label + FileInput only. Use in a row with other form fields. */
export function NoteImagesField({
  value,
  onChange,
  disabled,
}: NoteImagesFieldProps) {
  const addFiles = useCallback(
    (files: File[] | null) => {
      if (!files?.length) return;
      const newItems: NoteImageItem[] = Array.from(files).map((file) => ({
        file,
      }));
      onChange([...value, ...newItems]);
      (document.activeElement as HTMLElement)?.blur();
    },
    [value, onChange],
  );

  return (
    <FileInput
      label="Images"
      size="md"
      accept={ACCEPT_IMAGES}
      multiple
      placeholder="Add images"
      value={undefined}
      onChange={addFiles}
      disabled={disabled}
      clearable={false}
      style={{ minWidth: "102px" }}
      className="truncate"
      flex={1}
    />
  );
}

export interface NoteImagesListProps {
  value: NoteImageItem[];
  onChange: (value: NoteImageItem[]) => void;
  disabled?: boolean;
}

/** Thumbnails + remove + lightbox. Place above the editor or below the row. */
export function NoteImagesList({
  value,
  onChange,
  disabled,
}: NoteImagesListProps) {
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(new Map());
  const prevKeysRef = useRef<Set<string>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const removeAt = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange],
  );

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
      if (isNewImageItem(item)) {
        return previewUrls.get(fileKey(item.file)) ?? null;
      }
      const url = (item as Image).url;
      return url || null;
    },
    [previewUrls],
  );

  const lightboxUrls = useMemo(
    () =>
      value
        .map((item) => getPreviewUrl(item))
        .filter((url): url is string => !!url),
    [value, getPreviewUrl],
  );

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  if (value.length === 0) return null;

  return (
    <>
      <Group gap="sm" wrap="wrap" className="mb-2">
        {value.map((item, index) => {
          const src = getPreviewUrl(item);
          return (
            <Box
              key={
                isNewImageItem(item)
                  ? `file-${index}-${fileKey(item.file)}`
                  : (item as Image)._id
              }
              pos="relative"
              className="group cursor-pointer"
            >
              {src ? (
                <MantineImage
                  src={src}
                  alt=""
                  w={80}
                  h={80}
                  fit="cover"
                  radius="sm"
                  className="overflow-hidden"
                  onClick={() => openLightbox(index)}
                />
              ) : (
                <Box
                  w={80}
                  h={80}
                  style={{ borderRadius: 4 }}
                  bg="dark.4"
                  className="flex items-center justify-center"
                />
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(index);
                }}
                disabled={disabled}
                className="absolute right-1 top-1 cursor-pointer rounded-full bg-black/60 p-1 text-white md:opacity-0 transition-opacity hover:bg-black/80 group-hover:md:opacity-100 opacity-100 focus:opacity-100 focus:outline-none disabled:pointer-events-none"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </Box>
          );
        })}
      </Group>

      <ImageLightbox
        opened={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxUrls}
        initialIndex={lightboxIndex}
      />
    </>
  );
}

export interface NoteImagesSectionProps {
  value: NoteImageItem[];
  onChange: (value: NoteImageItem[]) => void;
  disabled?: boolean;
}

/** Combined layout: field + list in one stack (e.g. for other screens). */
export function NoteImagesSection({
  value,
  onChange,
  disabled,
}: NoteImagesSectionProps) {
  return (
    <Stack gap="xs">
      <NoteImagesField
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <NoteImagesList
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </Stack>
  );
}
