"use client";

import { useDisclosure } from "@mantine/hooks";
import { X } from "lucide-react";

import { BlockNoteEditor } from "@/components/notes/BlockNoteEditor";
import { CreateLabelModal } from "@/components/notes/CreateLabelModal";
import { PrimaryButton, RoundIconButton } from "@/components/journal/Buttons";
import { MetadataControls } from "@/components/journal/MetadataControls";
import { EMPTY_NOTE_HTML, useNoteEditor } from "@/lib/notes/useNoteEditor";

export function NoteCreate() {
  const editor = useNoteEditor({ mode: "create" });
  const [createTypeOpen, { open: openCreateType, close: closeCreateType }] = useDisclosure(false);
  const [createCategoryOpen, { open: openCreateCategory, close: closeCreateCategory }] =
    useDisclosure(false);

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[900px] items-center gap-3 px-5 py-3 sm:px-6">
          <RoundIconButton href="/" aria-label="Discard and close">
            <X size={18} />
          </RoundIconButton>
          <h1 className="font-serif text-[20px] font-semibold tracking-[-0.01em] text-text">
            New entry
          </h1>
          <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
            Draft · not saved
          </span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-6 px-5 py-6 sm:px-6">
        <MetadataControls
          typeId={editor.typeId}
          setTypeId={editor.setTypeId}
          categoryIds={editor.categoryIds}
          setCategoryIds={editor.setCategoryIds}
          color={editor.color}
          setColor={editor.setColor}
          startDateValue={editor.startDateValue}
          setStartDateValue={editor.setStartDateValue}
          rating={editor.rating}
          setRating={editor.setRating}
          isStarred={editor.isStarred}
          setIsStarred={editor.setIsStarred}
          currentImages={editor.currentImages}
          setCurrentImages={editor.setCurrentImages}
          typeLabels={editor.typeLabels}
          categoryLabels={editor.categoryLabels}
          labelByValue={editor.labelByValue}
          onCreateType={openCreateType}
          onCreateCategory={openCreateCategory}
          disabled={editor.isSaving}
        />

        <BlockNoteEditor initialHtml={EMPTY_NOTE_HTML} onChange={editor.setContent} editable />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/90 backdrop-blur pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto w-full max-w-[900px] px-5 sm:px-6">
          <PrimaryButton onClick={editor.handleSave} loading={editor.isSaving} className="w-full">
            Create entry
          </PrimaryButton>
        </div>
      </div>

      <CreateLabelModal
        opened={createTypeOpen}
        onClose={closeCreateType}
        labelFor="Type"
        onCreated={(label) => editor.setTypeId(label._id)}
      />
      <CreateLabelModal
        opened={createCategoryOpen}
        onClose={closeCreateCategory}
        labelFor="Category"
        onCreated={(label) => editor.setCategoryIds([...editor.categoryIds, label._id])}
      />
    </div>
  );
}
