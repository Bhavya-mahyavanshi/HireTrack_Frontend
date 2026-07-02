import { apiClient } from "./client";
import { DashboardStats, FunnelData, UpcomingFollowUps } from "@/lib/types";

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await apiClient.get<DashboardStats>("/api/dashboard/stats");
    return res.data;
  },

  getFunnel: async (): Promise<FunnelData> => {
    const res = await apiClient.get<FunnelData>("/api/dashboard/funnel");
    return res.data;
  },

  getUpcoming: async (): Promise<UpcomingFollowUps> => {
    const res = await apiClient.get<UpcomingFollowUps>(
      "/api/dashboard/upcoming",
    );
    return res.data;
  },
};
