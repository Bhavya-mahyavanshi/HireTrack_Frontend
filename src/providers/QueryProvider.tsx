"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

// QueryClient is created inside the component (not module scope) so that each
// request in a server-side context gets its own instance. Even though this is
// a static-export app with no SSR, it's the correct pattern and costs nothing.
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 60 seconds — job-tracker data doesn't change by the millisecond.
            // Aggressive staling forces unnecessary refetches and makes Kanban
            // drags feel laggy because the cache invalidates before the
            // optimistic update settles.
            staleTime: 1000 * 60,
            // Retry once on failure before surfacing an error state. Don't
            // retry 401s — those should hard-redirect to login immediately
            // (handled in client.ts interceptor), retrying just delays that.
            retry: (failureCount, error: unknown) => {
              const axiosError = error as {
                response?: { status: number };
              };
              if (axiosError?.response?.status === 401) return false;
              if (axiosError?.response?.status === 403) return false;
              if (axiosError?.response?.status === 404) return false;
              return failureCount < 1;
            },
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
