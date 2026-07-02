"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { applicationsApi } from "@/lib/api/applications";
import { jobsApi } from "@/lib/api/jobs";
import { getApiErrorMessage } from "@/lib/api/client";
import { ApplicationRequest, ApplicationStatus } from "@/lib/types";

// Query keys as constants — prevents typo-driven cache misses across files
export const APPLICATION_KEYS = {
  all: ["applications"] as const,
  detail: (id: number) => ["applications", id] as const,
};

export function useApplications() {
  return useQuery({
    queryKey: APPLICATION_KEYS.all,
    queryFn: applicationsApi.getAll,
  });
}

export function useApplication(id: number) {
  return useQuery({
    queryKey: APPLICATION_KEYS.detail(id),
    queryFn: () => applicationsApi.getById(id),
    enabled: !!id,
  });
}

export function useScrapeJob() {
  return useMutation({
    mutationFn: (url: string) => jobsApi.scrape(url),
    // No onError toast here — the scrape form component handles it inline
    // so the user sees the error next to the URL field, not a floating toast.
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApplicationRequest) => applicationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Application added to your tracker.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

/**
 * Kanban status drag — only sends the new status, leaving every other field
 * untouched. PUT is a partial update on this backend (verified in review).
 */
export function useUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ApplicationStatus }) =>
      applicationsApi.update(id, { status }),
    onMutate: async ({ id, status }) => {
      // Optimistic update — move the card immediately, revert on error
      await queryClient.cancelQueries({ queryKey: APPLICATION_KEYS.all });
      const previous = queryClient.getQueryData(APPLICATION_KEYS.all);

      queryClient.setQueryData(APPLICATION_KEYS.all, (old: typeof previous) => {
        if (!Array.isArray(old)) return old;
        return old.map((app) => (app.id === id ? { ...app, status } : app));
      });

      return { previous };
    },
    onError: (error, _vars, context) => {
      // Roll back the optimistic update
      if (context?.previous) {
        queryClient.setQueryData(APPLICATION_KEYS.all, context.previous);
      }
      toast.error(getApiErrorMessage(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<ApplicationRequest>;
    }) => applicationsApi.update(id, data),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Application updated.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => applicationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Application removed.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
