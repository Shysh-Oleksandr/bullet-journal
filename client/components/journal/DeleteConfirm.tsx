"use client";

import { Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Trash2 } from "lucide-react";

import { IOSAlert } from "@/components/journal/mobile/IOSAlert";

export interface DeleteConfirmProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

/** Delete confirmation — desktop modal, mobile iOS alert. */
export function DeleteConfirm({ opened, onClose, onConfirm, title }: DeleteConfirmProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const message = (
    <>
      &ldquo;{title}&rdquo; will be permanently removed. This can&rsquo;t be undone.
    </>
  );

  if (isMobile) {
    return (
      <IOSAlert
        opened={opened}
        onClose={onClose}
        title="Delete this entry?"
        message={message}
        confirmLabel="Delete"
        destructive
        onConfirm={onConfirm}
      />
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered
      size={400}
      radius={16}
      overlayProps={{ backgroundOpacity: 0.55, blur: 4 }}
      styles={{ content: { background: "var(--surface)", border: "1px solid var(--line)" } }}
    >
      <div className="flex flex-col items-center px-2 py-2 text-center">
        <span
          className="grid h-14 w-14 place-items-center rounded-full"
          style={{ background: "rgba(217,138,114,0.14)", color: "var(--danger-text)" }}
        >
          <Trash2 size={24} />
        </span>
        <h3 className="mt-4 font-serif text-[22px] font-semibold text-text">Delete this entry?</h3>
        <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">{message}</p>
        <div className="mt-6 flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-[13px] border border-line bg-surface-2 py-2.5 text-[14px] font-semibold text-text transition-colors hover:brightness-110"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-[13px] py-2.5 text-[14px] font-semibold text-white transition-[filter] hover:brightness-110"
            style={{ background: "var(--danger-gradient)" }}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
