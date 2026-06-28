"use client";

import { Box, Group, Select } from "@mantine/core";
import { Plus } from "lucide-react";

import { FieldLabel } from "@/components/journal/RatingSegments";
import type { CustomLabel } from "@/lib/notes/types";

const CREATE_VALUE = "__create__";

export interface TypeSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  labels: CustomLabel[];
  labelByValue: Map<string, CustomLabel>;
  onCreate: () => void;
  label?: string;
}

function Dot({ color }: { color: string }) {
  return (
    <Box
      w={12}
      h={12}
      style={{ backgroundColor: color || "#868e96", borderRadius: 4, flexShrink: 0 }}
    />
  );
}

/** Single-select Type field with color dots + a "+ Create new type" footer row. */
export function TypeSelect({
  value,
  onChange,
  labels,
  labelByValue,
  onCreate,
  label = "Type",
}: TypeSelectProps) {
  const data = [
    ...labels.map((l) => ({ value: l._id, label: l.labelName })),
    { value: CREATE_VALUE, label: "+ Create new type" },
  ];
  const selected = value ? labelByValue.get(value) : null;

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <Select
        placeholder="Select type"
        data={data}
        value={value}
        onChange={(v) => {
          if (v === CREATE_VALUE) {
            onCreate();
            return;
          }
          onChange(v);
        }}
        searchable
        clearable
        size="md"
        nothingFoundMessage="No type found"
        leftSection={selected ? <Dot color={selected.color} /> : undefined}
        comboboxProps={{ shadow: "var(--shadow-pop)" }}
        renderOption={({ option }) => {
          if (option.value === CREATE_VALUE) {
            return (
              <Group gap={6} c="var(--accent)" fw={600}>
                <Plus size={14} />
                <span>Create new type</span>
              </Group>
            );
          }
          const l = labelByValue.get(option.value);
          return (
            <Group gap="xs">
              {l && <Dot color={l.color} />}
              <span>{option.label}</span>
            </Group>
          );
        }}
      />
    </div>
  );
}
