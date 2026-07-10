"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCw, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { ApplicationResponse } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { useUpdateApplication } from "@/hooks/useApplications";

interface SkillMatchPanelProps {
  applications: ApplicationResponse[];
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70
      ? "var(--color-status-offer)"
      : score >= 40
      ? "var(--color-status-interview)"
      : "var(--color-status-rejected)";

  return (
    <div className="flex items-center gap-sm flex-1">
      <div className="flex-1 h-1.5 rounded-full bg-hairline overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          style={{ backgroundColor: color }}
        />
      </div>
      <span
        className="text-caption-strong w-8 text-right shrink-0"
        style={{ color }}
      >
        {score}%
      </span>
    </div>
  );
}

export function SkillMatchPanel({ applications }: SkillMatchPanelProps) {
  const scored = applications
    .filter((a) => a.matchScore !== null)
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

  const unscored = applications.filter((a) => a.matchScore === null);

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-xl text-center gap-md">
        <p className="text-caption text-ink-muted-48">
          Add applications to see match scores here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-md">
      {/* Scored applications */}
      {scored.length > 0 && (
        <ul className="flex flex-col divide-y divide-hairline">
          {scored.map((app, i) => (
            <motion.li
              key={app.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
            >
              <Link
                href={`/applications/${app.id}`}
                className={clsx(
                  "flex items-center gap-md py-md px-xs",
                  "hover:bg-canvas-parchment rounded-md",
                  "transition-colors duration-150 group"
                )}
              >
                <div className="flex flex-col gap-xxs min-w-0 w-36 shrink-0">
                  <span className="text-caption-strong text-ink truncate">
                    {app.jobTitle}
                  </span>
                  <span className="text-fine-print text-ink-muted-48 truncate">
                    {app.company}
                  </span>
                </div>
                <ScoreBar score={app.matchScore!} />
                <StatusBadge status={app.status} size="sm" />
                <ChevronRight
                  className="w-3.5 h-3.5 text-ink-muted-48 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  strokeWidth={2}
                />
              </Link>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Unscored — prompt to recalculate from their detail page */}
      {unscored.length > 0 && (
        <div className="flex flex-col gap-sm pt-md border-t border-hairline">
          <p className="text-caption text-ink-muted-48 px-xs">
            {unscored.length} application{unscored.length !== 1 ? "s" : ""} without
            a score yet — open each one and hit{" "}
            <span className="font-medium text-ink">Recalculate</span> to score them.
          </p>
          <ul className="flex flex-col gap-xxs">
            {unscored.map((app) => (
              <li key={app.id}>
                <Link
                  href={`/applications/${app.id}`}
                  className={clsx(
                    "flex items-center gap-sm py-xs px-xs rounded-md",
                    "hover:bg-canvas-parchment transition-colors duration-150",
                    "text-caption text-ink-muted-48 group"
                  )}
                >
                  <RefreshCw className="w-3 h-3 shrink-0" strokeWidth={1.75} />
                  <span className="flex-1 truncate">
                    {app.jobTitle}{" "}
                    <span className="text-fine-print">· {app.company}</span>
                  </span>
                  <ChevronRight
                    className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    strokeWidth={2}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
