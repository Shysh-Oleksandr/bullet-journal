"use client";

import {
  AddBlockButton,
  SideMenu,
  SideMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCallback, useEffect, useRef } from "react";
import { useMediaQuery } from "@mantine/hooks";

export interface BlockNoteEditorProps {
  initialHtml?: string;
  onChange?: (html: string) => void;
  editable?: boolean;
}

export function BlockNoteEditor({
  initialHtml,
  onChange,
  editable = true,
}: BlockNoteEditorProps) {
  const editor = useCreateBlockNote();
  const initialHtmlApplied = useRef(false);
  const prevInitialHtml = useRef(initialHtml);

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (prevInitialHtml.current !== initialHtml) {
      prevInitialHtml.current = initialHtml;
      initialHtmlApplied.current = false;
    }
  }, [initialHtml]);

  useEffect(() => {
    if (
      initialHtml == null ||
      initialHtml === "" ||
      initialHtmlApplied.current
    ) {
      return;
    }
    try {
      const blocks = editor.tryParseHTMLToBlocks(initialHtml);
      if (blocks.length > 0) {
        editor.replaceBlocks(editor.document, blocks);
      }
      initialHtmlApplied.current = true;
    } catch {
      // ignore parse errors; keep default empty document
    }
  }, [editor, initialHtml]);

  const handleChange = useCallback(() => {
    if (onChange) {
      const html = editor.blocksToHTMLLossy(editor.document);
      onChange(html);
    }
  }, [editor, onChange]);

  useEffect(() => {
    return editor.onChange(handleChange);
  }, [editor, handleChange]);

  return (
    <div className="rounded-[14px] transition-shadow duration-200 focus-within:shadow-[0_0_0_2px_var(--accent-border),0_0_14px_var(--accent-soft)]">
      <BlockNoteView
        editor={editor}
        editable={editable}
        sideMenu={!isMobile}
        className="rounded-[14px] [&>div]:rounded-[14px]! border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 [&_.bn-editor]:min-h-[400px] sm:[&_.bn-editor]:min-h-[500px] [&_.bn-editor]:py-1 [&_.bn-editor]:pr-3! [&_.bn-editor]:sm:pr-8! [&_.bn-editor]:pl-[27px]! [&_.bn-editor]:sm:pl-[54px]! focus-within:border-accent"
      >
        {isMobile && (
          <SideMenuController
            sideMenu={(props) => (
              <SideMenu {...props}>
                <AddBlockButton />
              </SideMenu>
            )}
          />
        )}
      </BlockNoteView>
    </div>
  );
}
