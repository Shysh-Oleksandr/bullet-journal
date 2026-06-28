/** S3 stores a JPEG poster frame at `{videoUrl}_thumb`. */
export function videoThumbnailUrl(videoUrl: string): string {
  return `${videoUrl}_thumb`;
}

export function isVideoMimeType(mimeType?: string): boolean {
  return mimeType?.startsWith("video/") ?? false;
}
