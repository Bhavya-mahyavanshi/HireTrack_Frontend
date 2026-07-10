"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { scrapeUrlSchema, jobReviewSchema, ScrapeUrlValues, JobReviewValues } from "@/lib/validation";
import { APPLICATION_STATUSES } from "@/lib/types";
import { STATUS_LABELS } from "@/components/ui/StatusBadge";
import { useScrapeJob, useCreateApplication } from "@/hooks/useApplications";
import { getApiErrorMessage } from "@/lib/api/client";
import { JobResponse } from "@/lib/types";
import { useRouter } from "next/navigation";

type Step = "url" | "scraping" | "review";

export function ScrapeJobForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("url");
  const [scrapedJob, setScrapedJob] = useState<JobResponse | null>(null);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const scrape = useScrapeJob();
  const create = useCreateApplication();

  // Step 1 — URL form
  const urlForm = useForm<ScrapeUrlValues>({
    resolver: zodResolver(scrapeUrlSchema),
  });

  // Step 2 — Review form, pre-filled from scrape result
  const reviewForm = useForm<JobReviewValues>({
    resolver: zodResolver(jobReviewSchema),
    defaultValues: {
      status: "SAVED",
      appliedDate: "",
      followUpDate: "",
      notes: "",
      resumeVersion: "",
    },
  });

  const handleScrape = async (data: ScrapeUrlValues) => {
    setScrapeError(null);
    setStep("scraping");
    try {
      const job = await scrape.mutateAsync(data.url);
      setScrapedJob(job);
      // Pre-fill review form with what the scraper found
      reviewForm.reset({
        title: job.title === "Unknown Title" ? "" : job.title,
        company: job.company === "Unknown Company" ? "" : job.company,
        location: job.location ?? "",
        status: "SAVED",
        appliedDate: "",
        followUpDate: "",
        notes: "",
        resumeVersion: "",
      });
      setStep("review");
    } catch (err) {
      setScrapeError(getApiErrorMessage(err));
      setStep("url");
    }
  };

  const handleCreate = async (data: JobReviewValues) => {
    if (!scrapedJob) return;
    await create.mutateAsync({
      jobId: scrapedJob.id,
      status: data.status,
      appliedDate: data.appliedDate || undefined,
      followUpDate: data.followUpDate || undefined,
      notes: data.notes || undefined,
      resumeVersion: data.resumeVersion || undefined,
    });
    router.push("/applications");
  };

  return (
    <div className="flex flex-col gap-xl">
      {/* Step indicator */}
      <div className="flex items-center gap-md">
        {(["url", "review"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-md">
            <div className="flex items-center gap-xs">
              <motion.div
                animate={{
                  backgroundColor:
                    step === s || (step === "scraping" && s === "url")
                      ? "var(--color-primary)"
                      : step === "review" && s === "url"
                      ? "var(--color-status-offer)"
                      : "var(--color-hairline)",
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-fine-print font-semibold text-white"
              >
                {step === "review" && s === "url" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  i + 1
                )}
              </motion.div>
              <span
                className={clsx(
                  "text-caption tracking-tight",
                  step === s ? "text-ink font-medium" : "text-ink-muted-48"
                )}
              >
                {s === "url" ? "Paste URL" : "Review & save"}
              </span>
            </div>
            {i === 0 && (
              <div className="h-px w-8 bg-hairline" />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: URL */}
        {(step === "url" || step === "scraping") && (
          <motion.div
            key="url-step"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
          >
            <form
              onSubmit={urlForm.handleSubmit(handleScrape)}
              className="flex flex-col gap-lg"
              noValidate
            >
              <div>
                <h2 className="font-display font-semibold text-tagline text-ink mb-xs">
                  Paste a job posting URL
                </h2>
                <p className="text-caption text-ink-muted-48">
                  HireTrack will scrape the title, company, location, and
                  required skills automatically.
                </p>
              </div>

              <Input
                label="Job posting URL"
                type="url"
                autoFocus
                leftIcon={<Link2 className="w-4 h-4" strokeWidth={1.5} />}
                error={
                  urlForm.formState.errors.url?.message ?? scrapeError ?? undefined
                }
                hint="Works best with Indeed, LinkedIn, and Greenhouse"
                {...urlForm.register("url")}
              />

              {scrapeError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-sm p-md rounded-lg bg-[rgba(196,86,79,0.06)] border border-[rgba(196,86,79,0.2)]"
                >
                  <AlertCircle
                    className="w-4 h-4 text-status-rejected shrink-0 mt-px"
                    strokeWidth={1.5}
                  />
                  <p className="text-caption text-status-rejected">
                    {scrapeError}
                  </p>
                </motion.div>
              )}

              <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={step === "scraping"}
              >
                {step === "scraping" ? (
                  <span className="flex items-center gap-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Fetching job details…
                  </span>
                ) : (
                  "Fetch job details"
                )}
              </Button>
            </form>
          </motion.div>
        )}

        {/* Step 2: Review */}
        {step === "review" && scrapedJob && (
          <motion.div
            key="review-step"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.22 }}
          >
            <form
              onSubmit={reviewForm.handleSubmit(handleCreate)}
              className="flex flex-col gap-lg"
              noValidate
            >
              <div>
                <h2 className="font-display font-semibold text-tagline text-ink mb-xs">
                  Review & save
                </h2>
                <p className="text-caption text-ink-muted-48">
                  Scraped fields are pre-filled — correct anything that looks
                  wrong before saving.
                </p>
              </div>

              {/* Scraped skill chips */}
              {scrapedJob.requiredSkills && (
                <div className="flex flex-col gap-xs">
                  <span className="text-caption text-ink-muted-48">
                    Skills detected
                  </span>
                  <div className="flex flex-wrap gap-xxs">
                    {scrapedJob.requiredSkills.split(",").filter(Boolean).map((s) => (
                      <span
                        key={s}
                        className="text-fine-print px-xs py-[2px] rounded-pill border border-hairline text-ink-muted-48 bg-canvas-parchment"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-md">
                <Input
                  label="Job title"
                  error={reviewForm.formState.errors.title?.message}
                  {...reviewForm.register("title")}
                />
                <Input
                  label="Company"
                  error={reviewForm.formState.errors.company?.message}
                  {...reviewForm.register("company")}
                />
                <Input
                  label="Location (optional)"
                  error={reviewForm.formState.errors.location?.message}
                  {...reviewForm.register("location")}
                />

                {/* Status select */}
                <div className="flex flex-col gap-xxs">
                  <label className="text-caption text-ink-muted-48 px-xxs">
                    Status
                  </label>
                  <select
                    className={clsx(
                      "w-full rounded-md border border-hairline bg-surface-pearl",
                      "font-text text-body text-ink px-md py-3",
                      "focus:outline-none focus:border-primary",
                      "transition-colors duration-150"
                    )}
                    {...reviewForm.register("status")}
                  >
                    {APPLICATION_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Applied date (optional)"
                  type="date"
                  error={reviewForm.formState.errors.appliedDate?.message}
                  {...reviewForm.register("appliedDate")}
                />
                <Input
                  label="Follow-up date (optional)"
                  type="date"
                  error={reviewForm.formState.errors.followUpDate?.message}
                  {...reviewForm.register("followUpDate")}
                />
                <Input
                  label="Resume version (optional)"
                  placeholder="e.g. v3-backend"
                  error={reviewForm.formState.errors.resumeVersion?.message}
                  {...reviewForm.register("resumeVersion")}
                />
              </div>

              <div className="grid grid-cols-2 gap-md pt-xs">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setStep("url")}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={create.isPending}
                >
                  Save application
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
