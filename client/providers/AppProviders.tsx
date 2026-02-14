"use client";

import { DatesProvider } from "@mantine/dates";
import { QueryClientProvider } from "@tanstack/react-query";

import { AuthInit } from "@/components/AuthInit";
import { HeaderBar } from "@/components/HeaderBar";
import { UnauthorizedInterceptor } from "@/components/UnauthorizedInterceptor";
import { queryClient } from "@/lib/queryClient";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DatesProvider settings={{ firstDayOfWeek: 1 }}>
        <UnauthorizedInterceptor>
          <AuthInit />
          <HeaderBar />
          {children}
        </UnauthorizedInterceptor>
      </DatesProvider>
    </QueryClientProvider>
  );
}
