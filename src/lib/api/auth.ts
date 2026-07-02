import { apiClient } from "./client";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/lib/types";

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>("/api/auth/register", data);
    return res.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>("/api/auth/login", data);
    return res.data;
  },

  // No GET /api/auth/me exists on the backend (verified absent). There is no
  // server-side session check available — logout is purely a client-side
  // token clear, and "is my token still valid" is only ever answered
  // implicitly, by the next authenticated call either succeeding or 401'ing.
};
