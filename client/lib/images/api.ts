import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/api/client";

import type { Image } from "@/lib/notes/types";

export const imagesQueryKey = ["images"] as const;

/** Upload files to S3 via API; returns public URLs. */
export async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const { data } = await client.post<{ urls: string[] }>("/images/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.urls;
}

export interface CreateImagesBulkBody {
  urls: string[];
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
