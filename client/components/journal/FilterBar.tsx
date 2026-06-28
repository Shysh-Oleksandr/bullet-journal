"use client";

import { MultiSelect, RangeSlider, Switch, Text, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { BottomSheet } from "@/components/journal/mobile/BottomSheet";
import { FieldLabel } from "@/components/journal/RatingSegments";

export interface FilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  typeIds: string[];
  setTypeIds: (v: string[]) => void;
  categoryIds: string[];
  setCategoryIds: (v: string[]) => void;
  dateRange: [string | null, string | null];
  setDateRange: (v: [string | null, string | null]) => void;
  ratingRange: [number, number];
  setRatingRange: (v: [number, number]) => void;
  isStarred: boolean;
  setIsStarred: (v: boolean) => void;
  withImages: boolean;
  setWithImages: (v: boolean) => void;
  typeSelectData: { value: string; label: string }[];
  categorySelectData: { value: string; label: string }[];
  activeCount: number;
  onClear: () => void;
}

/** Active filters count for the hidden-panel controls (type, rating, starred, withImages). */
function expandedActiveCount(props: FilterBarProps): number {
  return (
    props.typeIds.length +
    (props.ratingRange[0] > 1 || props.ratingRange[1] < 10 ? 1 : 0) +
    (props.isStarred ? 1 : 0) +
    (props.withImages ? 1 : 0)
  );
}

/** Expanded filter panel — type, rating, starred, with images. */
function ExpandedFilterPanel(props: FilterBarProps) {
  return (
    <div className="mt-3 rounded-[14px] border border-line bg-surface p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Type</FieldLabel>
          <MultiSelect
            placeholder="Any type"
            data={props.typeSelectData}
            value={props.typeIds}
            onChange={props.setTypeIds}
            searchable
            clearable
            size="md"
          />
        </div>
        <div>
          <FieldLabel>
            Importance {props.ratingRange[0]}–{props.ratingRange[1]}
          </FieldLabel>
          <div className="pt-3 pb-2" style={{ touchAction: "none", userSelect: "none" }}>
            <RangeSlider
              min={1}
              max={10}
              step={1}
              minRange={1}
              value={props.ratingRange}
              onChange={props.setRatingRange}
              onChangeEnd={props.setRatingRange}
              color="amber"
              size="lg"
              styles={{ thumb: { cursor: "grab" } }}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Switch
          label="Starred only"
          checked={props.isStarred}
          onChange={(e) => props.setIsStarred(e.currentTarget.checked)}
          color="amber"
        />
        <Switch
          label="With images"
          checked={props.withImages}
          onChange={(e) => props.setWithImages(e.currentTarget.checked)}
          color="amber"
        />
        {props.activeCount > 0 && (
          <Text
            size="sm"
            c="var(--accent)"
            className="ml-auto cursor-pointer hover:underline"
            onClick={props.onClear}
          >
            Clear all
          </Text>
        )}
      </div>
    </div>
  );
}

/** Full filter controls for the mobile sheet. */
function FilterControls(props: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 py-2">
      <div>
        <FieldLabel>Type</FieldLabel>
        <MultiSelect
          placeholder="Any type"
          data={props.typeSelectData}
          value={props.typeIds}
          onChange={props.setTypeIds}
          searchable
          clearable
          size="md"
        />
      </div>
      <div>
        <FieldLabel>Category</FieldLabel>
        <MultiSelect
          placeholder="Any category"
          data={props.categorySelectData}
          value={props.categoryIds}
          onChange={props.setCategoryIds}
          searchable
          clearable
          size="md"
        />
      </div>
      <div>
        <FieldLabel>Date range</FieldLabel>
        <DatePickerInput
          type="range"
          placeholder="Start – End"
          value={props.dateRange}
          onChange={props.setDateRange}
          size="md"
          clearable
        />
      </div>
      <div>
        <FieldLabel>
          Importance {props.ratingRange[0]}–{props.ratingRange[1]}
        </FieldLabel>
        <div className="pt-3 pb-2" style={{ touchAction: "none", userSelect: "none" }}>
          <RangeSlider
            min={1}
            max={10}
            step={1}
            minRange={1}
            value={props.ratingRange}
            onChange={props.setRatingRange}
            onChangeEnd={props.setRatingRange}
            color="amber"
            size="lg"
            styles={{ thumb: { cursor: "grab" } }}
          />
        </div>
      </div>
      <Switch
        label="Starred only"
        checked={props.isStarred}
        onChange={(e) => props.setIsStarred(e.currentTarget.checked)}
        color="amber"
      />
      <Switch
        label="With images"
        checked={props.withImages}
        onChange={(e) => props.setWithImages(e.currentTarget.checked)}
        color="amber"
      />
      {props.activeCount > 0 && (
        <Text
          size="sm"
          c="var(--accent)"
          className="cursor-pointer self-start hover:underline"
          onClick={props.onClear}
        >
          Clear all filters
        </Text>
      )}
    </div>
  );
}

export function FilterBar(props: FilterBarProps) {
  const [sheetOpen, { open, close }] = useDisclosure(false);
  const [panelOpen, { toggle: togglePanel }] = useDisclosure(false);
  const hiddenCount = expandedActiveCount(props);

  return (
    <div className="mb-6">
      {/* Desktop: search + category + date inline, Filters button expands panel */}
      <div className="hidden sm:block">
        <div className="flex flex-wrap items-center gap-2">
          <TextInput
            placeholder="Search notes…"
            leftSection={<Search size={15} />}
            value={props.search}
            onChange={(e) => props.setSearch(e.target.value)}
            size="md"
            className="min-w-[200px] flex-1"
          />
          <MultiSelect
            placeholder="Category"
            data={props.categorySelectData}
            value={props.categoryIds}
            onChange={props.setCategoryIds}
            searchable
            clearable
            size="md"
            className="w-[170px]"
          />
          <DatePickerInput
            type="range"
            placeholder="Date"
            value={props.dateRange}
            onChange={props.setDateRange}
            size="md"
            clearable
            className="w-[170px]"
          />
          <button
            type="button"
            onClick={togglePanel}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] border px-3 py-2.5 text-[13px] font-medium transition-colors"
            style={{
              borderColor: panelOpen || hiddenCount > 0 ? "var(--accent-border)" : "var(--line)",
              backgroundColor: panelOpen || hiddenCount > 0 ? "var(--accent-soft)" : "var(--surface)",
              color: panelOpen || hiddenCount > 0 ? "var(--accent)" : "var(--muted)",
            }}
          >
            <SlidersHorizontal size={15} />
            Filters
            {hiddenCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-(--accent-soft) px-1 text-[11px] font-semibold text-accent border border-(--accent-border)">
                {hiddenCount}
              </span>
            )}
          </button>
          {props.activeCount > 0 && (
            <button
              type="button"
              onClick={props.onClear}
              className="grid h-9 w-9 place-items-center rounded-full text-faint transition-colors hover:text-text hover:bg-surface-2"
              aria-label="Clear all filters"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {panelOpen && <ExpandedFilterPanel {...props} />}
      </div>

      {/* Mobile: search + Filters button → bottom sheet */}
      <div className="flex items-center gap-2 sm:hidden">
        <TextInput
          placeholder="Search…"
          leftSection={<Search size={15} />}
          value={props.search}
          onChange={(e) => props.setSearch(e.target.value)}
          size="md"
          className="flex-1"
        />
        <button
          type="button"
          onClick={open}
          className="inline-flex items-center gap-1.5 rounded-[10px] border border-line bg-surface px-3 py-2.5 text-[13px] font-medium text-text"
        >
          <SlidersHorizontal size={15} />
          Filters
          {props.activeCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--accent-soft)] px-1 text-[11px] font-semibold text-accent">
              {props.activeCount}
            </span>
          )}
        </button>
      </div>

      <BottomSheet opened={sheetOpen} onClose={close} title="Filters">
        <FilterControls {...props} />
      </BottomSheet>
    </div>
  );
}
