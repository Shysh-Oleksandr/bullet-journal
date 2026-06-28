"use client";

import { Loader } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { startOfMonth } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { FilterBar } from "@/components/journal/FilterBar";
import { Greeting } from "@/components/journal/Greeting";
import { Timeline } from "@/components/journal/Timeline";
import { Fab } from "@/components/journal/mobile/Fab";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { NotesPagination } from "@/components/NotesPagination";
import { useAuthStore } from "@/lib/auth/store";
import { useLabelsQuery } from "@/lib/custom-labels/api";
import { type NotesFilters, usePaginatedNotesQuery } from "@/lib/notes/api";

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
  sp: ReturnType<typeof useSearchParams>,
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
      ratingMin != null
        ? Math.min(10, Math.max(1, parseInt(ratingMin, 10) || 1))
        : DEFAULT_RATING[0],
      ratingMax != null
        ? Math.min(10, Math.max(1, parseInt(ratingMax, 10) || 10))
        : DEFAULT_RATING[1],
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
  if (state.categoryIds.length)
    params.set("categories", state.categoryIds.join(","));
  if (state.dateRange[0]) params.set("dateFrom", state.dateRange[0]);
  if (state.dateRange[1]) params.set("dateTo", state.dateRange[1]);
  if (state.ratingRange[0] > 1)
    params.set("ratingMin", String(state.ratingRange[0]));
  if (state.ratingRange[1] < 10)
    params.set("ratingMax", String(state.ratingRange[1]));
  if (state.isStarred) params.set("starred", "1");
  if (state.withImages) params.set("images", "1");
  if (state.page > 1) params.set("page", String(state.page));
  const s = params.toString();
  return s ? `?${s}` : "";
}

function HomePageContent() {
  const user = useAuthStore((state) => state.user);
  const authChecked = useAuthStore((state) => state.authChecked);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initial = useMemo(
    () => parseFiltersFromParams(searchParams),
    [searchParams],
  );

  const [page, setPage] = useState(initial.page);
  const [search, setSearch] = useState(initial.search);
  const [typeIds, setTypeIds] = useState<string[]>(initial.typeIds);
  const [categoryIds, setCategoryIds] = useState<string[]>(initial.categoryIds);
  const [dateRange, setDateRange] = useState<[string | null, string | null]>(
    initial.dateRange,
  );
  const [ratingRange, setRatingRange] = useState<[number, number]>(
    initial.ratingRange,
  );
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
        ? { ratingMin: debouncedRatingRange[0], ratingMax: debouncedRatingRange[1] }
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

  // "This month" count — extra lightweight query (frontend-only; streak is not derivable).
  const monthFilter = useMemo<NotesFilters>(
    () => ({ dateFrom: startOfMonth(new Date()).getTime() }),
    [],
  );
  const { data: monthData } = usePaginatedNotesQuery(1, {
    enabled: !!user,
    filters: monthFilter,
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

  const activeCount =
    (search.trim() ? 1 : 0) +
    typeIds.length +
    categoryIds.length +
    (dateRange[0] || dateRange[1] ? 1 : 0) +
    (ratingRange[0] > 1 || ratingRange[1] < 10 ? 1 : 0) +
    (isStarred ? 1 : 0) +
    (withImages ? 1 : 0);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedRatingRange]);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" color="amber" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen pb-24 sm:pb-8 pt-5 sm:pt-7">
        <div className="mx-auto w-full max-w-[900px] px-5 sm:px-6">
          <Greeting
            name={user.name}
            total={totalNotes}
            thisMonth={monthData?.total ?? null}
          />

          <FilterBar
            search={search}
            setSearch={setSearch}
            typeIds={typeIds}
            setTypeIds={(v) => {
              setTypeIds(v);
              setPage(1);
            }}
            categoryIds={categoryIds}
            setCategoryIds={(v) => {
              setCategoryIds(v);
              setPage(1);
            }}
            dateRange={dateRange}
            setDateRange={(v) => {
              setDateRange(v);
              setPage(1);
            }}
            ratingRange={ratingRange}
            setRatingRange={setRatingRange}
            isStarred={isStarred}
            setIsStarred={(v) => {
              setIsStarred(v);
              setPage(1);
            }}
            withImages={withImages}
            setWithImages={(v) => {
              setWithImages(v);
              setPage(1);
            }}
            typeSelectData={typeSelectData}
            categorySelectData={categorySelectData}
            activeCount={activeCount}
            onClear={clearFilters}
          />

          <section aria-label="Notes">
            {isNotesLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader size="lg" color="amber" />
              </div>
            ) : notes.length === 0 ? (
              <p className="py-16 text-center font-mono text-[13px] text-faint">
                {filters ? "No entries match these filters." : "No entries yet."}
              </p>
            ) : (
              <>
                <Timeline notes={notes} />
                <div className="mt-8">
                  <NotesPagination
                    page={displayPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    isLoading={isNotesLoading}
                  />
                </div>
              </>
            )}
          </section>
        </div>

        <Fab />
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6">
      <span
        className="grid h-16 w-16 place-items-center rounded-[18px]"
        style={{ background: "var(--accent-gradient)" }}
      >
        <span className="font-serif text-[30px] font-semibold text-[var(--on-accent)]">J</span>
      </span>
      <div className="text-center">
        <h1 className="font-serif text-[32px] font-semibold tracking-[-0.015em] text-text">
          The Journal
        </h1>
        <p className="mt-1 text-[14px] text-muted">A warm place for your days.</p>
      </div>
      <GoogleSignInButton />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader size="lg" color="amber" />
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
