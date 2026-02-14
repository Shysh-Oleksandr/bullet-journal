"use client";

import { useCallback, useState } from "react";

import { authApi } from "@/lib/auth/api";
import { useAuthStore } from "@/lib/auth/store";

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);
  const { mutateAsync: loginMutation } = authApi.useLoginMutation();
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (fire_token: string) => {
      try {
        setIsLoading(true);
        const response = await loginMutation({ fire_token });
        setUser(response.user);
      } catch (error) {
        console.error("Login failed", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [loginMutation, setUser],
  );

  return { login, isLoading };
}
