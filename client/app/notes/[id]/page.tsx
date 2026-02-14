"use client";

import { Container, Loader, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { NoteForm } from "@/components/notes/NoteForm";
import { useAuthStore } from "@/lib/auth/store";
import { useNoteQuery } from "@/lib/notes/api";

export default function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authChecked = useAuthStore((state) => state.authChecked);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    Promise.resolve(params).then((p) => {
      if (!cancelled) setResolvedParams(p);
    });
    return () => {
      cancelled = true;
    };
  }, [params]);

  const id = resolvedParams?.id ?? null;
  const { data: note, isLoading, isError, error } = useNoteQuery(id, {
    enabled: !!id && !!user,
  });

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

  if (!id) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !note) {
    return (
      <Container size="md">
        <Text c="dimmed">
          {isError && error ? "Failed to load note." : "Note not found."}
        </Text>
      </Container>
    );
  }

  return <NoteForm mode="edit" initialNote={note} />;
}
