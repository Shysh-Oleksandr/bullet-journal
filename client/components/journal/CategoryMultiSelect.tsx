"use client";

import { Box, Group, MultiSelect } from "@mantine/core";
import { Plus } from "lucide-react";

import { FieldLabel } from "@/components/journal/RatingSegments";
import type { CustomLabel } from "@/lib/notes/types";

const CREATE_VALUE = "__create__";

export interface CategoryMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  labels: CustomLabel[];
  labelByValue: Map<string, CustomLabel>;
  onCreate: () => void;
  label?: string;
  className?: string;
}

/** Multi-select Category field: color-dot chips + checkbox rows + create footer. */
export function CategoryMultiSelect({
  value,
  onChange,
  labels,
  labelByValue,
  onCreate,
  label = "Categories",
  className,
}: CategoryMultiSelectProps) {
  const data = [
    ...labels.map((l) => ({ value: l._id, label: l.labelName })),
    { value: CREATE_VALUE, label: "+ Create new category" },
  ];

  return (
    <div className={className}>
      <FieldLabel>{label}</FieldLabel>
      <MultiSelect
        placeholder="Select categories…"
        data={data}
        value={value}
        onChange={(next) => {
          if (next.includes(CREATE_VALUE)) {
            onCreate();
            onChange(next.filter((v) => v !== CREATE_VALUE));
            return;
          }
          onChange(next);
        }}
        searchable
        hidePickedOptions
        size="md"
        nothingFoundMessage="No category found"
        comboboxProps={{ shadow: "var(--shadow-pop)" }}
        renderOption={({ option }) => {
          if (option.value === CREATE_VALUE) {
            return (
              <Group gap={6} c="var(--accent)" fw={600}>
                <Plus size={14} />
                <span>Create new category</span>
              </Group>
            );
          }
          const l = labelByValue.get(option.value);
          return (
            <Group gap="xs">
              {l && (
                <Box
                  w={12}
                  h={12}
                  style={{ backgroundColor: l.color || "#868e96", borderRadius: 4, flexShrink: 0 }}
                />
              )}
              <span>{option.label}</span>
            </Group>
          );
        }}
      />
    </div>
  );
}
