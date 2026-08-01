// Mirrors: model/ApplicationStatus.java, dto/request/ApplicationRequest.java,
// dto/response/ApplicationResponse.java

export const APPLICATION_STATUSES = [
  "SAVED",
  "APPLIED",
  "PHONE_SCREEN",
  "TECHNICAL",
  "FINAL_ROUND",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

// Order matters here — this is the left-to-right Kanban column order, and the
// "funnel" stages used for the dashboard hero visualization (SAVED through
// OFFER form the forward path; REJECTED/WITHDRAWN are terminal off-ramps).
export const KANBAN_COLUMN_ORDER: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "PHONE_SCREEN",
  "TECHNICAL",
  "FINAL_ROUND",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

export interface ApplicationRequest {
  jobId?: number; // required on create, omitted on update (PUT is a partial update — see ApplicationService)
  status?: ApplicationStatus;
  appliedDate?: string; // ISO date "YYYY-MM-DD" — backend LocalDate
  followUpDate?: string;
  notes?: string;
  resumeVersion?: string;
}

export interface ApplicationResponse {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  status: ApplicationStatus;
  appliedDate: string | null;
  followUpDate: string | null;
  notes: string | null;
  resumeVersion: string | null;
  matchScore: number | null; // null until a match has ever been calculated
  url: string | null; // the original job posting URL — null for very old
  // manually-created applications from before this field
  // was added to the backend
}
