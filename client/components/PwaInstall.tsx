"use client";

import { useEffect } from "react";

export function PwaInstall() {
  useEffect(() => {
    import("@khmyznikov/pwa-install");
  }, []);

  return (
    <pwa-install
      manifest-url="/manifest.webmanifest"
      manual-apple="true"
      manual-chrome="true"
    />
  );
}
