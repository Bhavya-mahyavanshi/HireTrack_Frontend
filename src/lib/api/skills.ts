import { apiClient } from "./client";
import { SkillRequest, SkillResponse, SkillMatchResponse } from "@/lib/types";

export const skillsApi = {
  getAll: async (): Promise<SkillResponse[]> => {
    const res = await apiClient.get<SkillResponse[]>("/api/skills");
    return res.data;
  },

  add: async (data: SkillRequest): Promise<SkillResponse> => {
    const res = await apiClient.post<SkillResponse>("/api/skills", data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/skills/${id}`);
  },

  /**
   * Match score is calculated automatically server-side ONLY on application
   * creation — it does NOT recalculate when the user edits their skill list
   * afterward. The application detail page (later directory) must expose an
   * explicit "Recalculate match" action calling this, not assume the score
   * shown is current.
   */
  recalculateMatch: async (
    applicationId: number,
  ): Promise<SkillMatchResponse> => {
    const res = await apiClient.post<SkillMatchResponse>(
      `/api/skills/match/${applicationId}`,
    );
    return res.data;
  },
};
