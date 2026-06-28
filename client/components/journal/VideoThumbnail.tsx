"use client";

import { useState, type SyntheticEvent } from "react";

import { videoThumbnailUrl } from "@/lib/images/mediaUrls";

interface VideoThumbnailProps {
  url: string;
  className?: string;
  /** When true, load video metadata instead of the static thumb image. */
  preloadVideo?: boolean;
  onDuration?: (sec: number) => void;
}

/**
 * Shows a lightweight JPEG poster ({url}_thumb) when available, falling back
 * to a muted video metadata frame on error or when preloadVideo is set.
 */
export function VideoThumbnail({
  url,
  className,
  preloadVideo = false,
  onDuration,
}: VideoThumbnailProps) {
  const [thumbFailed, setThumbFailed] = useState(preloadVideo);

  const handleLoadedMetadata = (e: SyntheticEvent<HTMLVideoElement>) => {
    e.currentTarget.currentTime = 0.001;
    const d = e.currentTarget.duration;
    if (onDuration && d && Number.isFinite(d)) onDuration(d);
  };

  if (thumbFailed) {
    return (
      <video
        src={url}
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        className={className}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={videoThumbnailUrl(url)}
      alt=""
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => setThumbFailed(true)}
    />
  );
}
