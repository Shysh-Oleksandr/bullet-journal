"use client";

import { Box, Modal } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ImageLightboxProps {
  opened: boolean;
  onClose: () => void;
  /** All image URLs in order (carousel order). */
  images: string[];
  /** Index of the image to show when opening. */
  initialIndex: number;
}

export function ImageLightbox({
  opened,
  onClose,
  images,
  initialIndex,
}: ImageLightboxProps) {
  const n = images.length;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync to initialIndex when modal opens or initialIndex changes
  useEffect(() => {
    if (opened) {
      setCurrentIndex(
        n > 0 ? ((initialIndex % n) + n) % n : 0,
      );
    }
  }, [opened, initialIndex, n]);

  const goPrev = useCallback(() => {
    if (n === 0) return;
    setCurrentIndex((i) => (i - 1 + n) % n);
  }, [n]);

  const goNext = useCallback(() => {
    if (n === 0) return;
    setCurrentIndex((i) => (i + 1) % n);
  }, [n]);

  useEffect(() => {
    if (!opened) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [opened, onClose, goPrev, goNext]);

  if (n === 0) return null;

  const currentSrc = images[currentIndex];
  if (!currentSrc) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      fullScreen
      withCloseButton={false}
      styles={{
        content: { backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" },
        body: { height: "100%", padding: 0 },
      }}
    >
      <Box
        pos="relative"
        className="flex h-full w-full cursor-default items-center justify-center"
        style={{ minHeight: "80vh" }}
        onClick={onClose}
      >
        <img
          src={currentSrc}
          alt=""
          className="max-h-[85vh] max-w-[85vw] cursor-default object-contain rounded-xl"
          draggable={false}
          onClick={(e) => e.stopPropagation()}
        />

        {n > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 md:left-12"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 md:right-12"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 cursor-default rounded-full bg-black/50 px-3 py-1.5 text-sm text-white/90"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="presentation"
        >
          {currentIndex + 1} / {n}
        </div>
      </Box>
    </Modal>
  );
}
