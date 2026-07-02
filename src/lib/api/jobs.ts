import { apiClient } from "./client";
import { JobResponse } from "@/lib/types";

export const jobsApi = {
  /**
   * Synchronous scrape, ~10s backend timeout. Expect title/company to
   * sometimes come back as literal "Unknown Title" / "Unknown Company" —
   * the scraper's CSS-selector heuristics aren't reliable across every job
   * board. The "New Application" flow (Directory: applications components,
   * later) MUST show an editable review step after this call, never submit
   * the scrape result blind.
   *
   * On scrape failure the backend throws ScrapeFailedException -> HTTP 502
   * with a real message ("check the URL and try again") — getApiErrorMessage
   * will surface it correctly.
   */
  scrape: async (url: string): Promise<JobResponse> => {
    const res = await apiClient.post<JobResponse>("/api/jobs/scrape", { url });
    return res.data;
  },

  getById: async (id: number): Promise<JobResponse> => {
    const res = await apiClient.get<JobResponse>(`/api/jobs/${id}`);
    return res.data;
  },
};
