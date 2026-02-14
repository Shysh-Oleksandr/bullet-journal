"use client";

import { client } from "@/lib/api/client";
import { useUnauthorizedResponseInterceptor } from "@/lib/auth/useUnauthorizedResponseInterceptor";

export function UnauthorizedInterceptor({
  children,
}: { children: React.ReactNode }) {
  useUnauthorizedResponseInterceptor(client);
  return <>{children}</>;
}
