// Mirrors: dto/request/RegisterRequest.java, dto/request/LoginRequest.java,
// dto/response/AuthResponse.java

export interface RegisterRequest {
  name: string;
  email: string;
  password: string; // backend @Valid enforces min 8 chars — mirrored in the Zod schema, not here
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: "Bearer";
  email: string;
  name: string;
}

// There is no GET /api/auth/me on the backend (verified absent). Session
// rehydration on page reload has to come from what AuthResponse returned at
// login, persisted client-side — see store/authStore.ts in a later directory.
export interface AuthUser {
  email: string;
  name: string;
}
