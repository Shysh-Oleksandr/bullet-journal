"use client";

import { ColorInput } from "@mantine/core";

import { FieldLabel } from "@/components/journal/RatingSegments";
import { NOTE_COLOR_SWATCHES } from "@/components/journal/tokens";

export interface ColorFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

/** Per-record color: hex input + curated swatch palette + card-edge preview. */
export function ColorField({ value, onChange, label = "Color", className }: ColorFieldProps) {
  return (
    <div className={className}>
      <FieldLabel>{label}</FieldLabel>
      <ColorInput
        value={value}
        onChange={onChange}
        format="hex"
        size="md"
        withEyeDropper={false}
        swatches={[...NOTE_COLOR_SWATCHES]}
        swatchesPerRow={9}
      />
    </div>
  );
}
