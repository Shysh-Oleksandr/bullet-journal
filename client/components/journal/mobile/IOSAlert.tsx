"use client";

import { Modal } from "@mantine/core";

export interface IOSAlertProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  message?: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}

/** Native-style iOS alert (title + message + side-by-side Cancel / confirm). */
export function IOSAlert({
  opened,
  onClose,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive,
  onConfirm,
}: IOSAlertProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered
      size={280}
      radius={14}
      padding={0}
      overlayProps={{ backgroundOpacity: 0.5, blur: 3 }}
      styles={{ content: { background: "var(--surface)", border: "1px solid var(--line)" } }}
    >
      <div className="px-5 pb-4 pt-5 text-center">
        <h3 className="font-serif text-[17px] font-semibold text-text">{title}</h3>
        {message && <p className="mt-1.5 text-[13px] leading-snug text-muted">{message}</p>}
      </div>
      <div className="grid grid-cols-2 border-t border-line">
        <button
          type="button"
          onClick={onClose}
          className="border-r border-line py-3 text-[16px] font-medium text-accent transition-colors hover:bg-surface-2"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="py-3 text-[16px] font-semibold transition-colors hover:bg-surface-2"
          style={{ color: destructive ? "var(--danger-text)" : "var(--accent)" }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
