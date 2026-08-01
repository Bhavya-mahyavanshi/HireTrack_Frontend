"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Trash2,
  RefreshCw,
  Building2,
  MapPin,
  Calendar,
  FileText,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pill } from "@/components/ui/Pill";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { useApplication, useDeleteApplication } from "@/hooks/useApplications";
import { useRecalculateMatch } from "@/hooks/useSkills";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: app, isLoading } = useApplication(id);
  const deleteApp = useDeleteApplication();
  const recalculate = useRecalculateMatch(id);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    matchedSkills: string[];
    missingSkills: string[];
  } | null>(null);

  const handleDelete = async () => {
    await deleteApp.mutateAsync(id);
    router.push("/applications");
  };

  const handleRecalculate = async () => {
    const result = await recalculate.mutateAsync();
    setMatchResult({
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-xl max-w-3xl mx-auto">
        <Skeleton variant="text" className="w-32 h-4" />
        <div className="flex flex-col gap-md">
          <Skeleton variant="title" className="w-64 h-9" />
          <Skeleton variant="text" className="w-48 h-4" />
        </div>
        <Card padding="lg">
          <div className="flex flex-col gap-md">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="text" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center py-section gap-lg text-center">
        <p className="font-display font-semibold text-tagline text-ink">
          Application not found
        </p>
        <Link href="/applications">
          <Button variant="secondary" size="md">
            Back to applications
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-xl max-w-3xl mx-auto">
      {/* Back nav */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Link
          href="/applications"
          className="inline-flex items-center gap-xs text-caption text-ink-muted-48 hover:text-ink transition-colors duration-150"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          Applications
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex items-start justify-between gap-lg"
      >
        <div className="flex flex-col gap-sm flex-1 min-w-0">
          <h1 className="font-display font-semibold text-display-md text-ink tracking-tight leading-tight">
            {app.jobTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-md">
            <span className="flex items-center gap-xs text-body text-ink-muted-48">
              <Building2 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              {app.company}
            </span>
            {app.location && (
              <span className="flex items-center gap-xs text-body text-ink-muted-48">
                <MapPin className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                {app.location}
              </span>
            )}
            <StatusBadge status={app.status} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-sm shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRecalculate}
            isLoading={recalculate.isPending}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />}
          >
            Recalculate
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            leftIcon={<Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />}
          >
            Delete
          </Button>
        </div>
      </motion.div>

      <div className="grid desktop-sm:grid-cols-[1fr_280px] gap-lg items-start">
        {/* Edit form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <Card padding="lg">
            <h2 className="font-display font-semibold text-tagline text-ink mb-lg">
              Edit application
            </h2>
            <ApplicationForm application={app} />
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.18 }}
          className="flex flex-col gap-md"
        >
          {/* Match score card */}
          <Card padding="md">
            <div className="flex flex-col gap-md">
              <h3 className="font-text text-caption-strong text-ink">
                Skill match
              </h3>

              {app.matchScore !== null ? (
                <div className="flex flex-col gap-sm">
                  {/* Score ring — large version */}
                  <div className="flex items-center gap-md">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      {(() => {
                        const r = 24;
                        const circ = 2 * Math.PI * r;
                        const filled = (app.matchScore / 100) * circ;
                        const color =
                          app.matchScore >= 70
                            ? "var(--color-status-offer)"
                            : app.matchScore >= 40
                            ? "var(--color-status-interview)"
                            : "var(--color-status-rejected)";
                        return (
                          <svg className="absolute inset-0 -rotate-90" width="56" height="56">
                            <circle cx="28" cy="28" r={r} fill="none" stroke="var(--color-hairline)" strokeWidth="3" />
                            <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="3"
                              strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" />
                          </svg>
                        );
                      })()}
                      <span className="relative font-display font-semibold text-body-strong text-ink">
                        {app.matchScore}%
                      </span>
                    </div>
                    <div className="flex flex-col gap-xxs">
                      <p className="text-caption-strong text-ink">
                        {app.matchScore >= 70
                          ? "Strong match"
                          : app.matchScore >= 40
                          ? "Partial match"
                          : "Low match"}
                      </p>
                      <p className="text-fine-print text-ink-muted-48">
                        vs. your skill profile
                      </p>
                    </div>
                  </div>

                  {/* Matched / missing pills from last recalculate */}
                  {matchResult && (
                    <div className="flex flex-col gap-xs pt-xs border-t border-hairline">
                      {matchResult.matchedSkills.length > 0 && (
                        <div className="flex flex-col gap-xxs">
                          <span className="text-fine-print text-ink-muted-48">Matched</span>
                          <div className="flex flex-wrap gap-xxs">
                            {matchResult.matchedSkills.map((s) => (
                              <Pill key={s} label={s} variant="matched" />
                            ))}
                          </div>
                        </div>
                      )}
                      {matchResult.missingSkills.length > 0 && (
                        <div className="flex flex-col gap-xxs">
                          <span className="text-fine-print text-ink-muted-48">Missing</span>
                          <div className="flex flex-wrap gap-xxs">
                            {matchResult.missingSkills.map((s) => (
                              <Pill key={s} label={s} variant="missing" />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-caption text-ink-muted-48">
                  No match score yet. Add skills to your profile and hit
                  Recalculate.
                </p>
              )}
            </div>
          </Card>

          {/* Meta card */}
          <Card padding="md">
            <div className="flex flex-col gap-sm">
              <h3 className="font-text text-caption-strong text-ink">Details</h3>
              {app.appliedDate && (
                <div className="flex items-center gap-xs text-caption text-ink-muted-48">
                  <Calendar className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                  Applied {format(parseISO(app.appliedDate), "MMM d, yyyy")}
                </div>
              )}
              {app.resumeVersion && (
                <div className="flex items-center gap-xs text-caption text-ink-muted-48">
                  <FileText className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                  {app.resumeVersion}
                </div>
              )}
              {/* FIX: Button doesn't support an `as` prop — it's always a
                  <button>, never a link. Use a plain <a> styled to match the
                  ghost button instead, per app.url (adjust field name below
                  if your ApplicationResponse type stores it differently). */}
              {app.url && (
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    width: "100%",
                    height: 32,
                    borderRadius: 11,
                    fontFamily: "var(--font-text)",
                    fontSize: 14,
                    color: "var(--color-primary)",
                    textDecoration: "none",
                    background: "transparent",
                  }}
                >
                  View job posting
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete application"
        description="This cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="md" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="md"
              isLoading={deleteApp.isPending}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-body text-ink-muted-48">
          Are you sure you want to remove{" "}
          <span className="text-ink font-medium">{app.jobTitle}</span> at{" "}
          <span className="text-ink font-medium">{app.company}</span> from your
          tracker?
        </p>
      </Modal>
    </div>
  );
}
