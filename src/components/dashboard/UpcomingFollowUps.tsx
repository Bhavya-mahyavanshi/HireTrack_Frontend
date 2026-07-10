"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow, parseISO, isToday, isTomorrow } from "date-fns";
import { Calendar, ChevronRight, Bell } from "lucide-react";
import { clsx } from "clsx";
import { ApplicationResponse } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface UpcomingFollowUpsProps {
  items: ApplicationResponse[];
}

function getDateLabel(dateStr: string): { label: string; urgent: boolean } {
  const date = parseISO(dateStr);
  if (isToday(date)) return { label: "Today", urgent: true };
  if (isTomorrow(date)) return { label: "Tomorrow", urgent: true };
  return {
    label: formatDistanceToNow(date, { addSuffix: true }),
    urgent: false,
  };
}

export function UpcomingFollowUps({ items }: UpcomingFollowUpsProps) {
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-xl border border-hairline bg-canvas p-lg flex flex-col gap-md"
      >
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-lg bg-canvas-parchment flex items-center justify-center">
            <Bell className="w-4 h-4 text-ink-muted-48" strokeWidth={1.5} />
          </div>
          <h2 className="font-display font-semibold text-tagline text-ink tracking-tight">
            Follow-ups
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-xl text-center">
          <Calendar
            className="w-8 h-8 text-ink-muted-48 mb-md"
            strokeWidth={1}
          />
          <p className="text-caption-strong text-ink">All clear</p>
          <p className="text-caption text-ink-muted-48 mt-xxs">
            No follow-ups due in the next 7 days.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-xl border border-hairline bg-canvas p-lg flex flex-col gap-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-lg bg-[rgba(192,138,62,0.08)] flex items-center justify-center">
            <Bell
              className="w-4 h-4 text-status-interview"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="font-display font-semibold text-tagline text-ink tracking-tight">
            Follow-ups
          </h2>
        </div>
        {/* Badge showing count */}
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-status-interview text-[10px] font-semibold text-white">
          {items.length}
        </span>
      </div>

      {/* List */}
      <ul className="flex flex-col divide-y divide-hairline -mx-lg">
        <AnimatePresence>
          {items.map((app, i) => {
            const { label, urgent } = getDateLabel(app.followUpDate!);
            return (
              <motion.li
                key={app.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.06, duration: 0.3 }}
              >
                <Link
                  href={`/applications/${app.id}`}
                  className={clsx(
                    "flex items-center gap-md px-lg py-md",
                    "hover:bg-canvas-parchment transition-colors duration-150",
                    "group"
                  )}
                >
                  {/* Urgency dot */}
                  <span
                    className={clsx(
                      "w-2 h-2 rounded-full shrink-0 mt-px",
                      urgent
                        ? "bg-status-interview"
                        : "bg-hairline"
                    )}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-caption-strong text-ink truncate">
                      {app.jobTitle}
                    </p>
                    <p className="text-fine-print text-ink-muted-48 truncate mt-xxs">
                      {app.company}
                    </p>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-xxs shrink-0">
                    <StatusBadge status={app.status} size="sm" />
                    <span
                      className={clsx(
                        "text-fine-print",
                        urgent ? "text-status-interview font-medium" : "text-ink-muted-48"
                      )}
                    >
                      {label}
                    </span>
                  </div>

                  <ChevronRight
                    className="w-3.5 h-3.5 text-ink-muted-48 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    strokeWidth={2}
                  />
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}
