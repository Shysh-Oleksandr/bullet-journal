import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { client } from "@/lib/api/client";

import type { CreateNoteRequest, Note, UpdateNoteRequest } from "./types";

export const notesQueryKey = ["notes"];

export const noteQueryKey = (id: string) => ["notes", id] as const;

export interface PaginatedNotesResponse {
  data: Note[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const NOTES_PER_PAGE = 20;

export function useNotesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: notesQueryKey,
    queryFn: async () => {
      const { data } = await client.get<Note[]>("/notes/user");
      return data;
    },
    enabled: options?.enabled ?? true,
  });
}

export function useNoteQuery(
  id: string | null | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: noteQueryKey(id!),
    queryFn: async () => {
      const { data } = await client.get<{ note: Note }>(`/notes/${id}`);
      return data.note;
    },
    enabled: (options?.enabled ?? true) && !!id,
  });
}

export interface NotesFilters {
  search?: string;
  typeIds?: string[];
  categoryIds?: string[];
  dateFrom?: number;
  dateTo?: number;
  ratingMin?: number;
  ratingMax?: number;
  isStarred?: boolean;
  withImages?: boolean;
}

export const paginatedNotesQueryKey = (
  page: number,
  limit: number,
  filters?: NotesFilters | null,
) => ["notes", "paginated", page, limit, filters ?? null] as const;

function buildPaginatedParams(
  page: number,
  filters?: NotesFilters | null,
): Record<string, string | number | boolean | undefined> {
  const params: Record<string, string | number | boolean | undefined> = {
    page,
    limit: NOTES_PER_PAGE,
  };
  if (!filters) return params;
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.typeIds?.length) params.typeIds = filters.typeIds.join(",");
  if (filters.categoryIds?.length)
    params.categoryIds = filters.categoryIds.join(",");
  if (filters.dateFrom != null) params.dateFrom = filters.dateFrom;
  if (filters.dateTo != null) params.dateTo = filters.dateTo;
  if (filters.ratingMin != null) params.ratingMin = filters.ratingMin;
  if (filters.ratingMax != null) params.ratingMax = filters.ratingMax;
  if (filters.isStarred === true) params.isStarred = true;
  if (filters.withImages === true) params.withImages = true;
  return params;
}

export function usePaginatedNotesQuery(
  page: number,
  options?: { enabled?: boolean; filters?: NotesFilters | null },
) {
  const filters = options?.filters ?? null;
  return useQuery({
    queryKey: paginatedNotesQueryKey(page, NOTES_PER_PAGE, filters),
    queryFn: async () => {
      const { data } = await client.get<PaginatedNotesResponse>(
        "/notes/paginated",
        { params: buildPaginatedParams(page, filters) },
      );
      return data;
    },
    enabled: options?.enabled ?? true,
  });
}

export function useCreateNoteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateNoteRequest) => {
      const { data } = await client.post<Note>("/notes", body);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      await queryClient.refetchQueries({ queryKey: ["notes"] });
    },
  });
}

export function useUpdateNoteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...body
    }: UpdateNoteRequest & { _id?: string } & { id: string }) => {
      const { data } = await client.put<{ note: Note }>(`/notes/${id}`, body);
      return data.note;
    },
    onSuccess: async (updatedNote) => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      await queryClient.refetchQueries({ queryKey: ["notes"] });
      if (updatedNote?._id) {
        queryClient.invalidateQueries({ queryKey: noteQueryKey(updatedNote._id) });
      }
    },
  });
}

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/notes/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      await queryClient.refetchQueries({ queryKey: ["notes"] });
    },
  });
}

export { NOTES_PER_PAGE };
