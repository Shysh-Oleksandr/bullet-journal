import { useCallback } from "react";

import {
  createImagesBulk,
  deleteImagesBulk,
  uploadImages,
} from "@/lib/images/api";
import type { Image, Note } from "@/lib/notes/types";

export type NoteImageItem = Image | { file: File };

export function isNewImageItem(
  item: NoteImageItem,
): item is { file: File } {
  return "file" in item && item.file instanceof File;
}

/**
 * On save: delete removed image records, upload new files to S3, create image
 * records (with noteId when provided), and return the final image list for the note.
 */
export function useHandleNoteImages() {
  const handleImages = useCallback(
    async (
      currentImages: NoteImageItem[],
      savedNote: Note | null,
    ): Promise<Image[]> => {
      const savedImages = savedNote?.images ?? [];
      const savedIds = new Set(savedImages.map((i) => i._id));
      const currentSaved = currentImages.filter(
        (item): item is Image => !isNewImageItem(item),
      );
      const currentSavedIds = new Set(currentSaved.map((i) => i._id));

      // Remove image records that were removed from the form
      const toDelete = savedImages.filter((img) => !currentSavedIds.has(img._id));
      if (toDelete.length) {
        await deleteImagesBulk(toDelete.map((img) => img._id));
      }

      // Upload new files and create image records
      const newFiles = currentImages.filter(isNewImageItem).map((item) => item.file);
      let uploadedImages: Image[] = [];
      if (newFiles.length) {
        const urls = await uploadImages(newFiles);
        const noteId = savedNote?._id;
        uploadedImages = await createImagesBulk({
          urls,
          ...(noteId && { noteId }),
        });
      }

      // Preserve order: map currentImages to final Image[]
      const unchanged = savedImages.filter((img) => currentSavedIds.has(img._id));
      const result: Image[] = [];
      let uploadedIndex = 0;
      for (const item of currentImages) {
        if (isNewImageItem(item)) {
          if (uploadedImages[uploadedIndex]) {
            result.push(uploadedImages[uploadedIndex]);
            uploadedIndex++;
          }
        } else {
          result.push(item);
        }
      }
      return result;
    },
    [],
  );

  return handleImages;
}
