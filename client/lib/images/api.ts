import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/api/client";

import type { Image } from "@/lib/notes/types";

export const imagesQueryKey = ["images"] as const;

export interface UploadedMedia {
  urls: string[];
  mimeTypes: string[];
}

const UPLOAD_BATCH_SIZE = 5;

/** Upload files to S3 via API in sequential batches; returns public URLs and their MIME types. */
export async function uploadImages(files: File[]): Promise<UploadedMedia> {
  const urls: string[] = [];
  const mimeTypes: string[] = [];

  for (let i = 0; i < files.length; i += UPLOAD_BATCH_SIZE) {
    const batch = files.slice(i, i + UPLOAD_BATCH_SIZE);
    const formData = new FormData();
    batch.forEach((file) => formData.append("files", file));
    const { data } = await client.post<UploadedMedia>("/images/upload", formData);
    urls.push(...data.urls);
    mimeTypes.push(...data.mimeTypes);
  }

  return { urls, mimeTypes };
}

export interface CreateImagesBulkBody {
  urls: string[];
  mimeTypes?: string[];
  noteId?: string;
}

/** Create image records (after upload). Returns created images. */
export async function createImagesBulk(
  body: CreateImagesBulkBody,
): Promise<Image[]> {
  const { data } = await client.post<{ images: Image[] }>("/images/bulk", body);
  return data.images;
}

/** Delete image records by ID (and optionally from S3 on backend if implemented). */
export async function deleteImagesBulk(imageIds: string[]): Promise<void> {
  if (!imageIds.length) return;
  await client.delete("/images/bulk", { data: { imageIds } });
}

export function useCreateImagesBulkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createImagesBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: imagesQueryKey });
    },
  });
}

export function useDeleteImagesBulkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteImagesBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: imagesQueryKey });
    },
  });
}
