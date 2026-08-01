"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, CheckCircle, AlertCircle, PenLine } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  scrapeUrlSchema,
  jobReviewSchema,
  ScrapeUrlValues,
  JobReviewValues,
} from "@/lib/validation";
import { APPLICATION_STATUSES, JobResponse } from "@/lib/types";
import { STATUS_LABELS } from "@/components/ui/StatusBadge";
import { useScrapeJob, useCreateApplication } from "@/hooks/useApplications";
import { getApiErrorMessage } from "@/lib/api/client";
import { jobsApi } from "@/lib/api/jobs";

type Step = "url" | "scraping" | "review";

export function ScrapeJobForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("url");
  const [scrapedJob, setScrapedJob] = useState<JobResponse | null>(null);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [isManual, setIsManual] = useState(false);
  const [pastedUrl, setPastedUrl] = useState("");

  const scrape = useScrapeJob();
  const create = useCreateApplication();

  const urlForm = useForm<ScrapeUrlValues>({ resolver: zodResolver(scrapeUrlSchema) });
  const reviewForm = useForm<JobReviewValues>({
    resolver: zodResolver(jobReviewSchema),
    defaultValues: { status: "SAVED", appliedDate: "", followUpDate: "", notes: "", resumeVersion: "" },
  });

  const goToManualReview = () => {
    setIsManual(true);
    setScrapeError(null);
    reviewForm.reset({ title: "", company: "", location: "", status: "SAVED", appliedDate: "", followUpDate: "", notes: "", resumeVersion: "" });
    setStep("review");
  };

  const handleScrape = async (data: ScrapeUrlValues) => {
    setScrapeError(null);
    setPastedUrl(data.url);
    setStep("scraping");
    try {
      const job = await scrape.mutateAsync(data.url);
      setScrapedJob(job);
      setIsManual(false);
      // CORE FIX: if the scraper returned placeholder values, treat it as a
      // failure and route straight to manual entry instead of saving
      // "Unknown Title" / "Unknown Company" as real data.
      if (job.title === "Unknown Title" || job.company === "Unknown Company") {
        setScrapeError(
          "We fetched the page but couldn't identify the job title or company automatically. Enter the details manually below."
        );
        reviewForm.reset({
          title: job.title === "Unknown Title" ? "" : job.title,
          company: job.company === "Unknown Company" ? "" : job.company,
          location: job.location ?? "",
          status: "SAVED", appliedDate: "", followUpDate: "", notes: "", resumeVersion: "",
        });
        setIsManual(true);
        setStep("review");
        return;
      }
      reviewForm.reset({
        title: job.title, company: job.company, location: job.location ?? "",
        status: "SAVED", appliedDate: "", followUpDate: "", notes: "", resumeVersion: "",
      });
      setStep("review");
    } catch (err) {
      setScrapeError(getApiErrorMessage(err));
      setStep("url");
    }
  };

  const handleCreate = async (data: JobReviewValues) => {
    let jobId: number;
    if (isManual || !scrapedJob) {
      const manualJob = await jobsApi.createManual({
        title: data.title, company: data.company, location: data.location, url: pastedUrl || undefined,
      });
      jobId = manualJob.id;
    } else {
      jobId = scrapedJob.id;
    }

    await create.mutateAsync({
      jobId,
      status: data.status,
      appliedDate: data.appliedDate || undefined,
      followUpDate: data.followUpDate || undefined,
      notes: data.notes || undefined,
      resumeVersion: data.resumeVersion || undefined,
    });
    router.push("/applications");
  };

  const selectStyle: React.CSSProperties = {
    width: "100%", borderRadius: 11, border: "1px solid var(--color-hairline)",
    background: "var(--color-surface-pearl)", fontFamily: "var(--font-text)",
    fontSize: 17, color: "var(--color-ink)", padding: "12px 16px", boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%" }}>
      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {(["url", "review"] as const).map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <motion.div
                animate={{
                  backgroundColor:
                    step === s || (step === "scraping" && s === "url") ? "var(--color-primary)"
                    : step === "review" && s === "url" ? "var(--color-status-offer)"
                    : "var(--color-hairline)",
                }}
                style={{
                  width: 24, height: 24, borderRadius: "50%", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 12,
                  fontWeight: 600, color: "white",
                }}
              >
                {step === "review" && s === "url" ? <CheckCircle size={16} /> : i + 1}
              </motion.div>
              <span style={{ fontSize: 14, color: step === s ? "var(--color-ink)" : "var(--color-ink-muted-48)", fontWeight: step === s ? 500 : 400 }}>
                {s === "url" ? "Paste URL" : "Review & save"}
              </span>
            </div>
            {i === 0 && <div style={{ height: 1, width: 32, background: "var(--color-hairline)" }} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {(step === "url" || step === "scraping") && (
          <motion.div key="url-step" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
            <form onSubmit={urlForm.handleSubmit(handleScrape)} noValidate style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 21, color: "var(--color-ink)", margin: "0 0 4px 0" }}>
                  Paste a job posting URL
                </h2>
                <p style={{ fontSize: 14, color: "var(--color-ink-muted-48)", margin: 0 }}>
                  HireTrack will try to fetch the details automatically. If it can&apos;t, you can enter them manually.
                </p>
              </div>

              <Input
                label="Job posting URL"
                type="url"
                autoFocus
                leftIcon={<Link2 size={16} strokeWidth={1.5} />}
                error={urlForm.formState.errors.url?.message}
                hint="Works best with Greenhouse, Lever, and Ashby links"
                {...urlForm.register("url")}
              />

              {scrapeError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex", flexDirection: "column", gap: 16, padding: 16,
                    borderRadius: 11, background: "rgba(196,86,79,0.06)", border: "1px solid rgba(196,86,79,0.2)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <AlertCircle size={16} strokeWidth={1.5} color="var(--color-status-rejected)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: 14, color: "var(--color-status-rejected)", margin: 0 }}>{scrapeError}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 8, borderTop: "1px solid rgba(196,86,79,0.15)" }}>
                    <PenLine size={16} strokeWidth={1.5} color="var(--color-ink-muted-48)" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)", margin: 0 }}>Enter details manually instead</p>
                      <p style={{ fontSize: 11, color: "var(--color-ink-muted-48)", margin: "4px 0 0 0" }}>
                        Skip auto-fill and type the job details yourself.
                      </p>
                    </div>
                    <Button type="button" variant="secondary" size="sm" onClick={goToManualReview}>
                      Enter manually
                    </Button>
                  </div>
                </motion.div>
              )}

              <Button type="submit" size="lg" fullWidth isLoading={step === "scraping"}>
                Fetch job details
              </Button>
            </form>
          </motion.div>
        )}

        {step === "review" && (
          <motion.div key="review-step" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
            <form onSubmit={reviewForm.handleSubmit(handleCreate)} noValidate style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 21, color: "var(--color-ink)", margin: "0 0 4px 0" }}>
                  {isManual ? "Enter job details" : "Review & save"}
                </h2>
                <p style={{ fontSize: 14, color: "var(--color-ink-muted-48)", margin: 0 }}>
                  {isManual ? "Fill in the details from the job posting." : "Scraped fields are pre-filled — correct anything that looks wrong before saving."}
                </p>
              </div>

              {!isManual && scrapedJob?.requiredSkills && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 14, color: "var(--color-ink-muted-48)" }}>Skills detected</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {scrapedJob.requiredSkills.split(",").filter(Boolean).map((s) => (
                      <span key={s} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 9999, border: "1px solid var(--color-hairline)", color: "var(--color-ink-muted-48)", background: "var(--color-canvas-parchment)" }}>
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 17 }}>
                <Input label="Job title" error={reviewForm.formState.errors.title?.message} {...reviewForm.register("title")} />
                <Input label="Company" error={reviewForm.formState.errors.company?.message} {...reviewForm.register("company")} />
                <Input label="Location (optional)" error={reviewForm.formState.errors.location?.message} {...reviewForm.register("location")} />

                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 14, color: "var(--color-ink-muted-48)", padding: "0 4px" }}>Status</label>
                  <select style={selectStyle} {...reviewForm.register("status")}>
                    {APPLICATION_STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>

                <Input label="Applied date (optional)" type="date" error={reviewForm.formState.errors.appliedDate?.message} {...reviewForm.register("appliedDate")} />
                <Input label="Follow-up date (optional)" type="date" error={reviewForm.formState.errors.followUpDate?.message} {...reviewForm.register("followUpDate")} />
                <Input label="Resume version (optional)" placeholder="e.g. v3-backend" error={reviewForm.formState.errors.resumeVersion?.message} {...reviewForm.register("resumeVersion")} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 17, paddingTop: 8 }}>
                <Button type="button" variant="secondary" size="md" onClick={() => { setStep("url"); setScrapeError(null); setIsManual(false); }}>
                  Back
                </Button>
                <Button type="submit" variant="primary" size="md" isLoading={create.isPending}>
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
