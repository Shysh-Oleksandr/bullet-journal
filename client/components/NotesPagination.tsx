"use client";

import { Group, Button, Text } from "@mantine/core";

export function NotesPagination({
  page,
  totalPages,
  onPageChange,
  isLoading,
}: {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
  isLoading?: boolean;
}) {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1 || isLoading;
  const nextDisabled = page >= totalPages || isLoading;

  const goToPage = (nextPage: number) => {
    onPageChange(nextPage);
    window.scrollTo({ top: 0 });
  };

  return (
    <nav
      className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-700"
      aria-label="Notes pagination"
    >
      <Group justify="center" gap="md" wrap="wrap">
        <Button
          variant="default"
          onClick={() => goToPage(page - 1)}
          disabled={prevDisabled}
          aria-label="Previous page"
        >
          Previous
        </Button>
        <Text size="sm" c="dimmed">
          Page {page} of {totalPages}
        </Text>
        <Button
          variant="default"
          onClick={() => goToPage(page + 1)}
          disabled={nextDisabled}
          aria-label="Next page"
        >
          Next
        </Button>
      </Group>
    </nav>
  );
}
