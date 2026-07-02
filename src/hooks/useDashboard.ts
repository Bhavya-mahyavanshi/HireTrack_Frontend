"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";

export const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  stats: ["dashboard", "stats"] as const,
  funnel: ["dashboard", "funnel"] as const,
  upcoming: ["dashboard", "upcoming"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.stats,
    queryFn: dashboardApi.getStats,
  });
}

export function useFunnelData() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.funnel,
    queryFn: dashboardApi.getFunnel,
  });
}

export function useUpcomingFollowUps() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.upcoming,
    queryFn: dashboardApi.getUpcoming,
  });
}
