"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { skillsApi } from "@/lib/api/skills";
import { getApiErrorMessage } from "@/lib/api/client";
import { SkillRequest } from "@/lib/types";
import { APPLICATION_KEYS } from "./useApplications";

export const SKILL_KEYS = {
  all: ["skills"] as const,
};

export function useSkills() {
  return useQuery({
    queryKey: SKILL_KEYS.all,
    queryFn: skillsApi.getAll,
  });
}

export function useAddSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SkillRequest) => skillsApi.add(data),
    onSuccess: (newSkill) => {
      // Optimistic append — no need to refetch the full list for an add
      queryClient.setQueryData(
        SKILL_KEYS.all,
        (old: (typeof newSkill)[] | undefined) =>
          old ? [...old, newSkill] : [newSkill],
      );
      toast.success(`${newSkill.skillName} added to your profile.`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => skillsApi.delete(id),
    onMutate: async (id) => {
      // Optimistic removal
      await queryClient.cancelQueries({ queryKey: SKILL_KEYS.all });
      const previous = queryClient.getQueryData(SKILL_KEYS.all);
      queryClient.setQueryData(
        SKILL_KEYS.all,
        (old: { id: number }[] | undefined) =>
          old ? old.filter((s) => s.id !== id) : [],
      );
      return { previous };
    },
    onError: (error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SKILL_KEYS.all, context.previous);
      }
      toast.error(getApiErrorMessage(error));
    },
    onSettled: () => {
      // Confirm server state after optimistic removal settles
      queryClient.invalidateQueries({ queryKey: SKILL_KEYS.all });
    },
  });
}

export function useRecalculateMatch(applicationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => skillsApi.recalculateMatch(applicationId),
    onSuccess: (result) => {
      // Invalidate the specific application so its matchScore reflects the new
      // calculation — the score lives on ApplicationResponse.matchScore and
      // won't update until this query refetches.
      queryClient.invalidateQueries({
        queryKey: APPLICATION_KEYS.detail(applicationId),
      });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.all });
      toast.success(
        `Match recalculated — ${result.matchScore}% (${result.matchedSkills.length} skills matched).`,
      );
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
