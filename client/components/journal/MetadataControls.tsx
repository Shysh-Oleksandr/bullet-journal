"use client";

import { CategoryMultiSelect } from "@/components/journal/CategoryMultiSelect";
import { ColorField } from "@/components/journal/ColorField";
import { DateTimeField } from "@/components/journal/DateTimeField";
import { MediaField } from "@/components/journal/MediaField";
import {
  FieldLabel,
  RatingSegments,
} from "@/components/journal/RatingSegments";
import { StarToggle } from "@/components/journal/StarToggle";
import { TypeSelect } from "@/components/journal/TypeSelect";
import type { NoteImageItem } from "@/lib/images/useHandleNoteImages";
import type { CustomLabel } from "@/lib/notes/types";

export interface MetadataControlsProps {
  typeId: string | null;
  setTypeId: (v: string | null) => void;
  categoryIds: string[];
  setCategoryIds: (v: string[]) => void;
  color: string;
  setColor: (v: string) => void;
  startDateValue: Date | null;
  setStartDateValue: (v: Date | null) => void;
  rating: number;
  setRating: (v: number) => void;
  isStarred: boolean;
  setIsStarred: (v: boolean) => void;
  currentImages: NoteImageItem[];
  setCurrentImages: (v: NoteImageItem[]) => void;
  typeLabels: CustomLabel[];
  categoryLabels: CustomLabel[];
  labelByValue: Map<string, CustomLabel>;
  onCreateType: () => void;
  onCreateCategory: () => void;
  disabled?: boolean;
}

/** The full editable control grid shared by the Create screen and Detail edit panel. */
export function MetadataControls(props: MetadataControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DateTimeField
          value={props.startDateValue}
          onChange={props.setStartDateValue}
        />
        <TypeSelect
          value={props.typeId}
          onChange={props.setTypeId}
          labels={props.typeLabels}
          labelByValue={props.labelByValue}
          onCreate={props.onCreateType}
        />
      </div>

      <div className="flex items-end gap-2 w-full">
        <CategoryMultiSelect
          value={props.categoryIds}
          onChange={props.setCategoryIds}
          labels={props.categoryLabels}
          labelByValue={props.labelByValue}
          onCreate={props.onCreateCategory}
          className="w-full"
        />
        <StarToggle
          checked={props.isStarred}
          onChange={props.setIsStarred}
          className="hidden sm:block"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_3fr]">
        <div className="flex items-end gap-2 w-full">
          <ColorField
            value={props.color}
            onChange={props.setColor}
            className="w-full sm:w-auto"
          />
          <StarToggle
            checked={props.isStarred}
            onChange={props.setIsStarred}
            className="block sm:hidden"
          />
        </div>
        <div>
          <FieldLabel>Importance · 1–10</FieldLabel>
          <RatingSegments value={props.rating} onChange={props.setRating} />
        </div>
      </div>

      <MediaField
        value={props.currentImages}
        onChange={props.setCurrentImages}
        disabled={props.disabled}
      />
    </div>
  );
}
