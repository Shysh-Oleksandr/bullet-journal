import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/api/client";

import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "./types";

export const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async ({ fire_token }) => {
      const { data } = await client.post<LoginResponse>("/auth/login", {
        token: fire_token,
      });
      return data;
    },
  });
};

export const useRefreshTokenMutation = () => {
  return useMutation<RefreshTokenResponse, Error, RefreshTokenRequest>({
    mutationFn: async ({ access_token }) => {
      const { data } = await client.post<RefreshTokenResponse>(
        "/auth/refresh",
        { token: access_token },
      );
      return data;
    },
  });
};

export const authApi = {
  useLoginMutation,
  useRefreshTokenMutation,
};
