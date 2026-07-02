import axios, { AxiosError } from "axios";
import { ApiError } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  // Fail loudly in dev rather than silently hitting a relative path that
  // resolves to nothing on a static-export build with no Node server behind it.
  console.error(
    "NEXT_PUBLIC_API_URL is not set. Copy .env.local.example to .env.local.",
  );
}

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// --- Request interceptor: attach JWT ---
// Reads directly from the auth store's persisted storage rather than importing
// the Zustand store itself, to avoid a circular import (store -> api -> store).
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("hiretrack-auth");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Malformed storage — let the request go out unauthenticated rather
        // than throwing here; the 401 path below handles the consequence.
      }
    }
  }
  return config;
});

// --- Response interceptor: handle 401, normalize error shape ---
// CRITICAL: a 401 from an expired/invalid JWT is rejected by Spring Security's
// filter chain BEFORE any controller runs, so it carries no JSON body at all.
// Every other error (404/403/409/500) goes through GlobalExceptionHandler and
// does have a body. Never assume error.response.data exists unconditionally.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("hiretrack-auth");
        // Hard redirect rather than a router push — guarantees all in-memory
        // state (React Query cache, Zustand) resets, since an expired token
        // means every cached query result is now unauthenticated garbage.
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

/**
 * Extracts a human-readable message from any error this API can throw.
 * Use this in UI error states instead of reaching into error.response.data
 * directly — handles the bodyless-401 case and the two distinct error shapes
 * GlobalExceptionHandler produces (plain message vs. field-validation errors).
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;

    if (axiosError.response?.status === 401) {
      return "Your session has expired. Please log in again.";
    }

    const data = axiosError.response?.data;
    if (data && "message" in data) {
      return data.message;
    }
    if (data && "errors" in data) {
      const firstError = Object.values(data.errors)[0];
      return firstError ?? "Please check the form for errors.";
    }

    if (axiosError.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }
    if (!axiosError.response) {
      return "Could not reach the server. Check your connection and try again.";
    }
  }

  return "Something went wrong. Please try again.";
}
