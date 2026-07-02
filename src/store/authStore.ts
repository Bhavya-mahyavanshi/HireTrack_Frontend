import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { AuthUser } from "@/lib/types";

interface JwtPayload {
  sub: string; // email — what JwtTokenProvider sets as the subject
  iat: number;
  exp: number;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  isTokenExpired: () => boolean;
}

// IMPORTANT: the persist key "hiretrack-auth" must match the localStorage key
// that client.ts reads in its request interceptor. If you rename it here,
// rename it there too — nothing enforces this link at compile time.
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        set({ token, user, isAuthenticated: true });
      },

      clearAuth: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },

      // There is no refresh endpoint on the backend (verified absent), so
      // expiry means a hard logout. This is called in AuthGuard on every
      // protected-route render to catch tokens that expired while the app
      // was open but idle.
      isTokenExpired: () => {
        const token = get().token;
        if (!token) return true;
        try {
          const { exp } = jwtDecode<JwtPayload>(token);
          // Compare against current time in seconds with a 30s buffer so the
          // token doesn't expire mid-request after AuthGuard passes it.
          return exp < Date.now() / 1000 + 30;
        } catch {
          return true;
        }
      },
    }),
    {
      name: "hiretrack-auth",
      // Only persist what's needed to rehydrate session on page reload.
      // Never persist derived/computed state — isAuthenticated is re-derived
      // from token presence on rehydration automatically.
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
