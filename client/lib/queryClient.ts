import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: false,
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
