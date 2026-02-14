"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCallback, useEffect, useRef } from "react";

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
    <div className="rounded-md transition-shadow duration-200 focus-within:shadow-[0_0_0_2px_rgba(59,130,246,0.35),0_0_14px_rgba(59,130,246,0.2)] dark:focus-within:shadow-[0_0_0_2px_rgba(96,165,250,0.4),0_0_18px_rgba(59,130,246,0.25)]">
      <BlockNoteView
        editor={editor}
        editable={editable}
        className="rounded-md border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 [&_.bn-editor]:min-h-[300px] [&_.bn-editor]:py-1 focus-within:border-blue-500 dark:focus-within:border-blue-400"
      />
    </div>
  );
}
