"use client";

import { Drawer } from "@mantine/core";

export interface ActionSheetAction {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

export interface ActionSheetProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  actions: ActionSheetAction[];
}

/** iOS-style action sheet (stacked buttons + Cancel). E.g. the add-media sheet. */
export function ActionSheet({ opened, onClose, title, actions }: ActionSheetProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      size="auto"
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0.45, blur: 1 }}
      styles={{
        content: { background: "transparent", boxShadow: "none" },
        body: { padding: 0 },
      }}
    >
      <div className="px-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
          {title && (
            <div className="border-b border-line px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
              {title}
            </div>
          )}
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => {
                a.onClick();
                onClose();
              }}
              className="block w-full border-b border-line px-4 py-3.5 text-center text-[16px] font-semibold transition-colors last:border-b-0 hover:bg-surface-2"
              style={{ color: a.destructive ? "var(--danger-text)" : "var(--accent)" }}
            >
              {a.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 block w-full rounded-[14px] border border-line bg-surface px-4 py-3.5 text-center text-[16px] font-semibold text-text transition-colors hover:bg-surface-2"
        >
          Cancel
        </button>
      </div>
    </Drawer>
  );
}
