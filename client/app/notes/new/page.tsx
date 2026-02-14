"use client";

import { Loader } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { NoteForm } from "@/components/notes/NoteForm";
import { useAuthStore } from "@/lib/auth/store";

export default function CreateNotePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authChecked = useAuthStore((state) => state.authChecked);

  useEffect(() => {
    if (authChecked && user === null) {
      router.replace("/");
    }
  }, [authChecked, user, router]);

  if (!authChecked || user === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return <NoteForm mode="create" />;
}
