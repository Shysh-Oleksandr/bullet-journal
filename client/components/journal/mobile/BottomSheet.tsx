"use client";

import { Drawer } from "@mantine/core";
import { X } from "lucide-react";

export interface BottomSheetProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ opened, onClose, title, children }: BottomSheetProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      size="auto"
      withCloseButton={false}
      radius="24px 24px 0 0"
      overlayProps={{ backgroundOpacity: 0.5, blur: 2 }}
      styles={{
        content: { background: "var(--surface)", maxHeight: "85vh" },
        body: { padding: 0 },
      }}
    >
      <div className="flex flex-col">
        <div className="flex justify-center pt-2.5 pb-1">
          <span className="h-1 w-9 rounded-full bg-line" />
        </div>
        {title && (
          <h2 className="px-5 pb-2 pt-1 text-center font-serif text-[18px] font-semibold text-text">
            {title}
          </h2>
        )}
        <div className="max-h-[75vh] overflow-y-auto px-4 pt-1 pb-2">
          {children}
        </div>
        <div className="px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-line bg-surface-2 py-3 text-[14px] font-medium text-muted transition-colors hover:text-text active:bg-surface"
          >
            <X size={16} />
            Close
          </button>
        </div>
      </div>
    </Drawer>
  );
}
