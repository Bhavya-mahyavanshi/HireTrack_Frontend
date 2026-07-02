import { apiClient } from "./client";
import { ApplicationRequest, ApplicationResponse } from "@/lib/types";

export const applicationsApi = {
  getAll: async (): Promise<ApplicationResponse[]> => {
    const res = await apiClient.get<ApplicationResponse[]>("/api/applications");
    return res.data;
  },

  getById: async (id: number): Promise<ApplicationResponse> => {
    const res = await apiClient.get<ApplicationResponse>(
      `/api/applications/${id}`,
    );
    return res.data;
  },

  create: async (data: ApplicationRequest): Promise<ApplicationResponse> => {
    // Backend auto-calculates match score on creation. Will 409 (ConflictException)
    // if the user already has an application tracked for this jobId — surface
    // that message as-is via getApiErrorMessage, don't reword it.
    const res = await apiClient.post<ApplicationResponse>(
      "/api/applications",
      data,
    );
    return res.data;
  },

  /**
   * PUT is a PARTIAL update on this backend despite the verb — only non-null
   * fields in `data` get written. This is what makes a single-field Kanban
   * drag update cheap: update(id, { status: "OFFER" }) leaves every other
   * field untouched server-side. Don't "helpfully" spread the full cached
   * object into every call; that's unnecessary and risks overwriting a
   * concurrent edit with stale data.
   */
  update: async (
    id: number,
    data: Partial<ApplicationRequest>,
  ): Promise<ApplicationResponse> => {
    const res = await apiClient.put<ApplicationResponse>(
      `/api/applications/${id}`,
      data,
    );
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/applications/${id}`);
  },
};
