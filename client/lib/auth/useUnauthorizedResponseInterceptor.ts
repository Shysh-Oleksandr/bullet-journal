"use client";

import { AxiosInstance } from "axios";
import { useEffect, useRef } from "react";

import { authApi } from "@/lib/auth/api";
import { useAuthStore } from "@/lib/auth/store";
import { ApiStatusCodes } from "@/lib/auth/types";

export function useUnauthorizedResponseInterceptor(client: AxiosInstance) {
  const { mutateAsync: refreshToken } = authApi.useRefreshTokenMutation();
  const isRetryingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const isRetrying = isRetryingRef.current;

    const interceptorId = client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error?.config;
        if (!config?.url) return Promise.reject(error);

        const requestId = `${config.method ?? ""}:${config.url}`;

        if (
          error?.response?.status === ApiStatusCodes.Unauthorized &&
          !config.url.includes("/auth/refresh") &&
          !isRetrying.has(requestId)
        ) {
          try {
            isRetrying.add(requestId);

            const authHeader = config.headers?.Authorization;
            const accessToken =
              typeof authHeader === "string"
                ? authHeader.split(" ")[1]
                : useAuthStore.getState().user?.access_token;

            if (!accessToken) {
              isRetrying.delete(requestId);
              return Promise.reject(error);
            }

            const { access_token } = await refreshToken({
              access_token: accessToken,
            });

            const currentUser = useAuthStore.getState().user;
            if (currentUser && access_token) {
              useAuthStore.getState().setUser({
                ...currentUser,
                access_token,
              });
            }

            isRetrying.delete(requestId);

            return client({
              ...config,
              headers: {
                ...config.headers,
                Authorization: `Bearer ${access_token}`,
              },
            });
          } catch {
            isRetrying.delete(requestId);
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      client.interceptors.response.eject(interceptorId);
    };
  }, [client, refreshToken]);
}
