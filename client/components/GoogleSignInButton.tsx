"use client";

import { Button, Stack, Text } from "@mantine/core";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";

import { auth } from "@/lib/firebase";
import { useLogin } from "@/lib/auth/useLogin";
import Image from "next/image";

export function GoogleSignInButton() {
  const { login, isLoading: isLoadingLogin } = useLogin();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoading = isSigningIn || isLoadingLogin;
  const isDisabled = !auth || isLoading;

  const handleClick = async () => {
    if (!auth) return;
    setError(null);
    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const fireToken = await result.user.getIdToken();
      await login(fireToken);
    } catch (err) {
      console.error("Google sign-in failed", err);
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Stack align="center" gap="sm">
      <Button
        variant="filled"
        onClick={handleClick}
        disabled={isDisabled}
        loading={isLoading}
        leftSection={
          <Image src="/icons/google.svg" alt="Google" width={24} height={24} />
        }
      >
        {!auth
          ? "Firebase not configured"
          : isLoading
            ? "Signing in…"
            : "Sign in with Google"}
      </Button>
      {error && (
        <Text size="sm" c="red" role="alert">
          {error}
        </Text>
      )}
    </Stack>
  );
}
