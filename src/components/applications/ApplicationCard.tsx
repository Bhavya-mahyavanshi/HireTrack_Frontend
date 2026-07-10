"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Sparkles, Building2, MapPin } from "lucide-react";
import { clsx } from "clsx";
import { formatDistanceToNow, parseISO, isToday, isTomorrow } from "date-fns";
import { ApplicationResponse } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface ApplicationCardProps {
  application: ApplicationResponse;
  onDragStart: (id: number) => void;
}

function MatchRing({ score }: { score: number }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color =
    score >= 70
      ? "var(--color-status-offer)"
      : score >= 40
      ? "var(--color-status-interview)"
      : "var(--color-status-rejected)";

  return (
    <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="36" height="36">
        {/* Track */}
        <circle
          cx="18" cy="18" r={r}
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="2.5"
        />
        {/* Fill */}
        <circle
          cx="18" cy="18" r={r}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="relative text-[10px] font-semibold font-text leading-none"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

function FollowUpChip({ dateStr }: { dateStr: string }) {
  const date = parseISO(dateStr);
  const urgent = isToday(date) || isTomorrow(date);
  const label = isToday(date)
    ? "Today"
    : isTomorrow(date)
    ? "Tomorrow"
    : formatDistanceToNow(date, { addSuffix: true });

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-xxs",
        "text-fine-print px-xs py-[2px] rounded-pill border",
        urgent
          ? "text-status-interview border-[rgba(192,138,62,0.3)] bg-[rgba(192,138,62,0.08)]"
          : "text-ink-muted-48 border-hairline bg-canvas-parchment"
      )}
    >
      <Calendar className="w-2.5 h-2.5" strokeWidth={2} />
      {label}
    </span>
  );
}

export function ApplicationCard({
  application: app,
  onDragStart,
}: ApplicationCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={() => {
        setIsDragging(true);
        onDragStart(app.id);
      }}
      onDragEnd={() => setIsDragging(false)}
      className={clsx(
        "bg-canvas rounded-lg border border-hairline p-md",
        "cursor-grab active:cursor-grabbing",
        "select-none",
        "transition-shadow duration-150",
        isDragging
          ? "opacity-40 shadow-[0_8px_24px_rgba(0,0,0,0.12)] rotate-[1.5deg]"
          : "hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:-translate-y-px"
      )}
    >
      <Link
        href={`/applications/${app.id}`}
        draggable={false}
        className="flex flex-col gap-sm"
        onClick={(e) => isDragging && e.preventDefault()}
      >
        {/* Title row */}
        <div className="flex items-start justify-between gap-xs">
          <p className="font-text text-caption-strong text-ink leading-snug line-clamp-2 flex-1">
            {app.jobTitle}
          </p>
          {app.matchScore !== null && <MatchRing score={app.matchScore} />}
        </div>

        {/* Company + location */}
        <div className="flex flex-col gap-xxs">
          <span className="flex items-center gap-xxs text-fine-print text-ink-muted-48">
            <Building2 className="w-3 h-3 shrink-0" strokeWidth={1.5} />
            <span className="truncate">{app.company}</span>
          </span>
          {app.location && (
            <span className="flex items-center gap-xxs text-fine-print text-ink-muted-48">
              <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} />
              <span className="truncate">{app.location}</span>
            </span>
          )}
        </div>

        {/* Footer chips */}
        <div className="flex items-center gap-xxs flex-wrap pt-xxs border-t border-hairline">
          {app.followUpDate && <FollowUpChip dateStr={app.followUpDate} />}
          {app.resumeVersion && (
            <span className="inline-flex items-center gap-xxs text-fine-print px-xs py-[2px] rounded-pill border border-hairline text-ink-muted-48 bg-canvas-parchment">
              <Sparkles className="w-2.5 h-2.5" strokeWidth={2} />
              {app.resumeVersion}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
