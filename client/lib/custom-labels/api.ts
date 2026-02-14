import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { client } from "@/lib/api/client";

import type { CustomLabel } from "@/lib/notes/types";

export type LabelFor = "Type" | "Category" | "Task";

export const labelsQueryKey = (labelFor: LabelFor) =>
  ["custom-labels", labelFor] as const;

export function useLabelsQuery(labelFor: LabelFor, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: labelsQueryKey(labelFor),
    queryFn: async () => {
      const { data } = await client.get<CustomLabel[]>(
        "/custom-labels/user",
        { params: { labelFor } },
      );
      return data;
    },
    enabled: options?.enabled ?? true,
  });
}

export interface CreateLabelRequest {
  labelName: string;
  color: string;
  labelFor: LabelFor;
  isCategoryLabel?: boolean;
  isDefault?: boolean;
}

export interface CreateLabelResponse {
  customLabel: CustomLabel;
}

export function useCreateLabelMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateLabelRequest) => {
      const { data } = await client.post<CreateLabelResponse>(
        "/custom-labels",
        payload,
      );
      return data.customLabel;
    },
    onSuccess: (created, variables) => {
      queryClient.invalidateQueries({
        queryKey: labelsQueryKey(variables.labelFor),
      });
    },
  });
}
