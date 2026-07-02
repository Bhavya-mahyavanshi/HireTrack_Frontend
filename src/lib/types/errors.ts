// Mirrors the two error body shapes GlobalExceptionHandler actually produces.
// IMPORTANT: a bare 401 from an expired/invalid JWT never reaches this
// handler — it's rejected by the Spring Security filter chain before any
// controller runs, so it arrives with NO body at all. Never assume
// error.response.data exists without checking status first (see api/client.ts).

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  message: string;
}

export interface ApiValidationErrorResponse {
  timestamp: string;
  status: number;
  errors: Record<string, string>; // field name -> message
}

export type ApiError = ApiErrorResponse | ApiValidationErrorResponse;

export function isValidationError(
  err: ApiError,
): err is ApiValidationErrorResponse {
  return "errors" in err;
}
