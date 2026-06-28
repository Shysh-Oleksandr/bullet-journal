import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Journal",
    short_name: "The Journal",
    description: "A warm, personal journaling PWA",
    start_url: "/",
    display: "standalone",
    background_color: "#1b1714",
    theme_color: "#1b1714",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
