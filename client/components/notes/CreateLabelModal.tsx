"use client";

import {
  Button,
  ColorInput,
  Group,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { useState } from "react";

import { useCreateLabelMutation } from "@/lib/custom-labels/api";
import type { CustomLabel } from "@/lib/notes/types";

import type { LabelFor } from "@/lib/custom-labels/api";

const DEFAULT_LABEL_COLOR = "#868e96";

export interface CreateLabelModalProps {
  opened: boolean;
  onClose: () => void;
  labelFor: LabelFor;
  onCreated: (label: CustomLabel) => void;
}

export function CreateLabelModal({
  opened,
  onClose,
  labelFor,
  onCreated,
}: CreateLabelModalProps) {
  const [labelName, setLabelName] = useState("");
  const [color, setColor] = useState(DEFAULT_LABEL_COLOR);
  const createMutation = useCreateLabelMutation();

  const handleSubmit = async () => {
    const name = labelName.trim();
    if (!name) return;
    try {
      const customLabel = await createMutation.mutateAsync({
        labelName: name,
        color: color || DEFAULT_LABEL_COLOR,
        labelFor,
        isCategoryLabel: labelFor === "Category",
      });
      onCreated(customLabel);
      setLabelName("");
      setColor(DEFAULT_LABEL_COLOR);
      onClose();
    } catch (err) {
      console.error("Failed to create label", err);
    }
  };

  const handleClose = () => {
    setLabelName("");
    setColor(DEFAULT_LABEL_COLOR);
    onClose();
  };

  const title =
    labelFor === "Type"
      ? "Create new type"
      : labelFor === "Category"
        ? "Create new category"
        : "Create new label";

  return (
    <Modal opened={opened} onClose={handleClose} title={title} centered>
      <Stack gap="md">
        <TextInput
          label="Name"
          placeholder="Label name"
          value={labelName}
          onChange={(e) => setLabelName(e.target.value)}
        />
        <ColorInput
          label="Color"
          value={color}
          onChange={setColor}
          format="hex"
          withPreview
        />
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="filled"
            loading={createMutation.isPending}
            onClick={handleSubmit}
            disabled={!labelName.trim()}
          >
            Create
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
