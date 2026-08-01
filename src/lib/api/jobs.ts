import { apiClient } from "./client";
import { JobResponse } from "@/lib/types";

export const jobsApi = {
  scrape: async (url: string): Promise<JobResponse> => {
    const res = await apiClient.post<JobResponse>("/api/jobs/scrape", { url });
    return res.data;
  },

  getById: async (id: number): Promise<JobResponse> => {
    const res = await apiClient.get<JobResponse>(`/api/jobs/${id}`);
    return res.data;
  },

  createManual: async (data: {
    title: string;
    company: string;
    location?: string;
    url?: string;
  }): Promise<JobResponse> => {
    const res = await apiClient.post<JobResponse>("/api/jobs/manual", data);
    return res.data;
  },
};
