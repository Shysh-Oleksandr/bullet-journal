"use client";

import {
  Box,
  Container,
  Group,
  Loader,
  MultiSelect,
  RangeSlider,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDebouncedValue } from "@mantine/hooks";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { NoteCard } from "@/components/NoteCard";
import { NotesPagination } from "@/components/NotesPagination";
import { useLabelsQuery } from "@/lib/custom-labels/api";
import { useAuthStore } from "@/lib/auth/store";
import { type NotesFilters, usePaginatedNotesQuery } from "@/lib/notes/api";
import { Plus, Search } from "lucide-react";
import Image from "next/image";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

function dateToStartOfDay(value: string): number | undefined {
  if (!value) return undefined;
  const d = new Date(value + "T00:00:00");
  return Number.isNaN(d.getTime()) ? undefined : d.getTime();
}

function dateToEndOfDay(value: string): number | undefined {
  if (!value) return undefined;
  const d = new Date(value + "T23:59:59.999");
  return Number.isNaN(d.getTime()) ? undefined : d.getTime();
}

const DEFAULT_RATING = [1, 10] as [number, number];

type FilterParams = {
  search: string;
  typeIds: string[];
  categoryIds: string[];
  dateRange: [string | null, string | null];
  ratingRange: [number, number];
  isStarred: boolean;
  withImages: boolean;
  page: number;
};

function parseFiltersFromParams(
  sp: ReturnType<typeof useSearchParams>
): FilterParams {
  const q = sp.get("q") ?? "";
  const types = sp.get("types");
  const categories = sp.get("categories");
  const dateFrom = sp.get("dateFrom") ?? null;
  const dateTo = sp.get("dateTo") ?? null;
  const ratingMin = sp.get("ratingMin");
  const ratingMax = sp.get("ratingMax");
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);
  return {
    search: q,
    typeIds: types ? types.split(",").filter(Boolean) : [],
    categoryIds: categories ? categories.split(",").filter(Boolean) : [],
    dateRange: [dateFrom, dateTo],
    ratingRange: [
      ratingMin != null ? Math.min(10, Math.max(1, parseInt(ratingMin, 10) || 1)) : DEFAULT_RATING[0],
      ratingMax != null ? Math.min(10, Math.max(1, parseInt(ratingMax, 10) || 10)) : DEFAULT_RATING[1],
    ],
    isStarred: sp.get("starred") === "1",
    withImages: sp.get("images") === "1",
    page,
  };
}

function buildQueryString(state: FilterParams): string {
  const params = new URLSearchParams();
  if (state.search.trim()) params.set("q", state.search.trim());
  if (state.typeIds.length) params.set("types", state.typeIds.join(","));
  if (state.categoryIds.length) params.set("categories", state.categoryIds.join(","));
  if (state.dateRange[0]) params.set("dateFrom", state.dateRange[0]);
  if (state.dateRange[1]) params.set("dateTo", state.dateRange[1]);
  if (state.ratingRange[0] > 1) params.set("ratingMin", String(state.ratingRange[0]));
  if (state.ratingRange[1] < 10) params.set("ratingMax", String(state.ratingRange[1]));
  if (state.isStarred) params.set("starred", "1");
  if (state.withImages) params.set("images", "1");
  if (state.page > 1) params.set("page", String(state.page));
  const s = params.toString();
  return s ? `?${s}` : "";
}

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const authChecked = useAuthStore((state) => state.authChecked);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initial = useMemo(() => parseFiltersFromParams(searchParams), [searchParams]);

  const [page, setPage] = useState(initial.page);
  const [search, setSearch] = useState(initial.search);
  const [typeIds, setTypeIds] = useState<string[]>(initial.typeIds);
  const [categoryIds, setCategoryIds] = useState<string[]>(initial.categoryIds);
  const [dateRange, setDateRange] = useState<[string | null, string | null]>(initial.dateRange);
  const [ratingRange, setRatingRange] = useState<[number, number]>(initial.ratingRange);
  const [isStarred, setIsStarred] = useState(initial.isStarred);
  const [withImages, setWithImages] = useState(initial.withImages);

  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [debouncedRatingRange] = useDebouncedValue(ratingRange, 300);

  const lastPushedQueryRef = useRef<string>("");

  // Sync state from URL when searchParams change (e.g. back/forward), but not when we just pushed
  useEffect(() => {
    const current = searchParams.toString();
    if (current === lastPushedQueryRef.current) return;
    const next = parseFiltersFromParams(searchParams);
    setPage(next.page);
    setSearch(next.search);
    setTypeIds(next.typeIds);
    setCategoryIds(next.categoryIds);
    setDateRange(next.dateRange);
    setRatingRange(next.ratingRange);
    setIsStarred(next.isStarred);
    setWithImages(next.withImages);
  }, [searchParams]);

  // Push filter state to URL
  useEffect(() => {
    const query = buildQueryString({
      search,
      typeIds,
      categoryIds,
      dateRange,
      ratingRange,
      isStarred,
      withImages,
      page,
    });
    const current = searchParams.toString();
    const next = query.slice(1); // remove "?"
    if (next !== current) {
      lastPushedQueryRef.current = next;
      router.replace(pathname + query, { scroll: false });
    } else {
      lastPushedQueryRef.current = current;
    }
  }, [
    pathname,
    router,
    searchParams,
    page,
    search,
    typeIds,
    categoryIds,
    dateRange,
    ratingRange,
    isStarred,
    withImages,
  ]);

  const filters: NotesFilters | null = useMemo(() => {
    const dateFrom =
      dateRange[0] != null ? dateToStartOfDay(dateRange[0]) : undefined;
    const dateTo =
      dateRange[1] != null ? dateToEndOfDay(dateRange[1]) : undefined;
    const hasFilters =
      debouncedSearch.trim() ||
      typeIds.length > 0 ||
      categoryIds.length > 0 ||
      dateFrom != null ||
      dateTo != null ||
      debouncedRatingRange[0] > 1 ||
      debouncedRatingRange[1] < 10 ||
      isStarred ||
      withImages;
    if (!hasFilters) return null;
    return {
      ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
      ...(typeIds.length > 0 && { typeIds }),
      ...(categoryIds.length > 0 && { categoryIds }),
      ...(dateFrom != null && { dateFrom }),
      ...(dateTo != null && { dateTo }),
      ...(debouncedRatingRange[0] > 1 || debouncedRatingRange[1] < 10
        ? {
            ratingMin: debouncedRatingRange[0],
            ratingMax: debouncedRatingRange[1],
          }
        : {}),
      ...(isStarred && { isStarred: true }),
      ...(withImages && { withImages: true }),
    };
  }, [
    debouncedSearch,
    typeIds,
    categoryIds,
    dateRange,
    debouncedRatingRange,
    isStarred,
    withImages,
  ]);

  const { data, isLoading: isNotesLoading } = usePaginatedNotesQuery(page, {
    enabled: !!user,
    filters,
  });

  const notes = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalNotes = data?.total ?? 0;
  const displayPage = totalPages > 0 ? Math.min(page, totalPages) : page;

  const { data: typeLabels = [] } = useLabelsQuery("Type", { enabled: !!user });
  const { data: categoryLabels = [] } = useLabelsQuery("Category", {
    enabled: !!user,
  });
  const typeSelectData = useMemo(
    () => typeLabels.map((l) => ({ value: l._id, label: l.labelName })),
    [typeLabels],
  );
  const categorySelectData = useMemo(
    () => categoryLabels.map((l) => ({ value: l._id, label: l.labelName })),
    [categoryLabels],
  );

  const clearFilters = useCallback(() => {
    setSearch("");
    setTypeIds([]);
    setCategoryIds([]);
    setDateRange([null, null]);
    setRatingRange([...DEFAULT_RATING]);
    setIsStarred(false);
    setWithImages(false);
    setPage(1);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedRatingRange]);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen px-4 py-6">
        <Container size="md">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
              Hello, {user.name}!
            </h1>
            <div className="flex items-center gap-2">
              <Link
                href="/notes/new"
                className="rounded-lg border border-zinc-300 bg-white flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <Plus size={18} />
                New note
              </Link>
            </div>
          </div>

          <Box className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50 w-full">
            <Group
              align="flex-end"
              wrap="wrap"
              gap="xs"
              className="mb-1 w-full"
            >
              <TextInput
                placeholder="Search title"
                leftSection={<Search size={14} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="xs"
                flex={1}
                className="min-w-[100px] md:min-w-[150px] flex-1"
              />
              <MultiSelect
                placeholder="Type"
                data={typeSelectData}
                value={typeIds}
                onChange={(v) => {
                  setTypeIds(v);
                  setPage(1);
                }}
                size="xs"
                clearable
                searchable
                nothingFoundMessage="No type found"
                className="w-[120px] sm:w-[130px] one-line-input"
              />
              <MultiSelect
                placeholder="Category"
                data={categorySelectData}
                value={categoryIds}
                onChange={(v) => {
                  setCategoryIds(v);
                  setPage(1);
                }}
                size="xs"
                clearable
                searchable
                nothingFoundMessage="No category found"
                className="w-[120px] sm:w-[130px] one-line-input"
              />
              <Group align="center" gap="xs">
                <DatePickerInput
                  type="range"
                  placeholder="Start date – End date"
                  value={dateRange}
                  onChange={(v: [string | null, string | null]) => {
                    setDateRange(v);
                    setPage(1);
                  }}
                  size="xs"
                  className="w-[200px] min-w-0"
                />
              </Group>
            </Group>
            <Group align="end" wrap="wrap" gap="sm">
              <Box className="w-full min-w-0 sm:w-[180px]">
                <Text size="xs" c="dimmed" mb={4}>
                  Rating {ratingRange[0]}–{ratingRange[1]}
                </Text>
                <RangeSlider
                  min={1}
                  max={10}
                  minRange={0}
                  step={1}
                  value={ratingRange}
                  onChange={setRatingRange}
                  size="xs"
                  className="mt-1"
                />
              </Box>
              <Group gap="md" align="end">
                <Switch
                  size="xs"
                  label="Starred"
                  checked={isStarred}
                  onChange={(e) => {
                    setIsStarred(e.currentTarget.checked);
                    setPage(1);
                  }}
                />
                <Switch
                  size="xs"
                  label="With images"
                  checked={withImages}
                  onChange={(e) => {
                    setWithImages(e.currentTarget.checked);
                    setPage(1);
                  }}
                />
              </Group>
              {filters != null && (
                <Text
                  size="xs"
                  c="blue"
                  className="cursor-pointer hover:underline!"
                  onClick={clearFilters}
                >
                  Clear filters
                </Text>
              )}
            </Group>
          </Box>

          <Text size="xs" c="dimmed" mb={4}>
            <b>{totalNotes}</b> notes found
          </Text>

          <section aria-label="Notes">
            {isNotesLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader size="lg" />
              </div>
            ) : notes.length === 0 ? (
              <Text py="xl" ta="center" c="dimmed">
                {filters ? "No notes match the filters." : "No notes yet."}
              </Text>
            ) : (
              <>
                <ul className="flex flex-col gap-4">
                  {notes.map((note) => (
                    <li key={note._id}>
                      <NoteCard note={note} />
                    </li>
                  ))}
                </ul>
                <NotesPagination
                  page={displayPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  isLoading={isNotesLoading}
                />
              </>
            )}
          </section>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex h-full pt-24 flex-col items-center justify-center gap-6">
      <Stack align="center" gap="md">
        <Image
          src="/icon-192x192.png"
          alt="Bullet Journal"
          width={80}
          height={80}
        />
        <Title order={1} size="h1" fw={700}>
          Bullet Journal
        </Title>
        <GoogleSignInButton />
      </Stack>
    </div>
  );
}
