const MAX_THUMB_DIMENSION = 1280;

/** Extract the first frame of a video File as a JPEG File. */
export async function extractVideoThumbnail(videoFile: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(videoFile);
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;

    const cleanup = () => URL.revokeObjectURL(objectUrl);

    video.onloadedmetadata = () => {
      video.currentTime = 0.001;
    };

    video.onseeked = () => {
      let { videoWidth: w, videoHeight: h } = video;
      if (w > MAX_THUMB_DIMENSION || h > MAX_THUMB_DIMENSION) {
        const ratio = Math.min(MAX_THUMB_DIMENSION / w, MAX_THUMB_DIMENSION / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(video, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          cleanup();
          if (!blob) { reject(new Error("canvas.toBlob returned null")); return; }
          resolve(new File([blob], "thumb.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.85,
      );
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Failed to load video for thumbnail extraction"));
    };
  });
}
