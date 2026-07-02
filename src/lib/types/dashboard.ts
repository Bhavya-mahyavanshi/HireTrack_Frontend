// Mirrors: dto/response/DashboardResponse.java, dto/response/StatusCount.java,
// and the funnel/upcoming endpoint shapes from DashboardController.

import { ApplicationResponse, ApplicationStatus } from "./application";

export interface StatusCount {
  status: ApplicationStatus;
  count: number;
}

export interface DashboardStats {
  totalApplied: number;
  totalInterviews: number; // bundles PHONE_SCREEN + TECHNICAL + FINAL_ROUND server-side
  totalOffers: number;
  totalRejected: number;
  statusBreakdown: StatusCount[]; // includes SAVED/WITHDRAWN even though the 4 headline stats exclude them
  upcomingFollowUps: ApplicationResponse[];
}

// GET /api/dashboard/funnel — separate endpoint, all 8 statuses always present
export type FunnelData = StatusCount[];

// GET /api/dashboard/upcoming — follow-ups due within 7 days
export type UpcomingFollowUps = ApplicationResponse[];
