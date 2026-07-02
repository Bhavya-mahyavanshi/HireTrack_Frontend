import { z } from "zod";
import { APPLICATION_STATUSES } from "@/lib/types";

// Step 1 of "New Application" flow — just the URL
export const scrapeUrlSchema = z.object({
  url: z
    .string()
    .min(1, "Paste a job posting URL to continue")
    .url("That doesn't look like a valid URL — include https://")
    .refine(
      (url) => url.startsWith("https://") || url.startsWith("http://"),
      "URL must start with http:// or https://",
    ),
});

// Step 2 — editable review after scrape returns, before saving the application.
// Every field is optional except jobId (already resolved by the time we reach
// this step). Fields are pre-filled from the scrape result and user can correct
// them — backend will use whatever we send.
export const jobReviewSchema = z.object({
  title: z
    .string()
    .min(1, "Job title is required")
    .max(200, "Title must be under 200 characters"),
  company: z
    .string()
    .min(1, "Company name is required")
    .max(200, "Company must be under 200 characters"),
  location: z
    .string()
    .max(200, "Location must be under 200 characters")
    .optional(),
  status: z.enum(APPLICATION_STATUSES, {
    errorMap: () => ({ message: "Select a valid application status" }),
  }),
  appliedDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
      "Use YYYY-MM-DD format",
    ),
  followUpDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
      "Use YYYY-MM-DD format",
    ),
  notes: z.string().max(2000, "Notes must be under 2000 characters").optional(),
  resumeVersion: z
    .string()
    .max(100, "Resume version must be under 100 characters")
    .optional(),
});

// Application edit form — all fields optional since PUT is a partial update
export const applicationEditSchema = z.object({
  status: z
    .enum(APPLICATION_STATUSES, {
      errorMap: () => ({ message: "Select a valid application status" }),
    })
    .optional(),
  appliedDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
      "Use YYYY-MM-DD format",
    ),
  followUpDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
      "Use YYYY-MM-DD format",
    ),
  notes: z.string().max(2000, "Notes must be under 2000 characters").optional(),
  resumeVersion: z
    .string()
    .max(100, "Resume version must be under 100 characters")
    .optional(),
});

export type ScrapeUrlValues = z.infer<typeof scrapeUrlSchema>;
export type JobReviewValues = z.infer<typeof jobReviewSchema>;
export type ApplicationEditValues = z.infer<typeof applicationEditSchema>;
