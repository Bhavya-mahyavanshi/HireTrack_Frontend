"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Building2, MapPin } from "lucide-react";
import { formatDistanceToNow, parseISO, isToday, isTomorrow } from "date-fns";
import { ApplicationResponse } from "@/lib/types";

interface ApplicationCardProps {
  application: ApplicationResponse;
  onDragStart: (id: number) => void;
}

function MatchRing({ score }: { score: number }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score >= 70 ? "var(--color-status-offer)" : score >= 40 ? "var(--color-status-interview)" : "var(--color-status-rejected)";
  return (
    <div style={{ position: "relative", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }} width="36" height="36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="var(--color-hairline)" strokeWidth="2.5" />
        <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" />
      </svg>
      <span style={{ position: "relative", fontSize: 10, fontWeight: 600, color }}>{score}</span>
    </div>
  );
}

function FollowUpChip({ dateStr }: { dateStr: string }) {
  const date = parseISO(dateStr);
  const urgent = isToday(date) || isTomorrow(date);
  const label = isToday(date) ? "Today" : isTomorrow(date) ? "Tomorrow" : formatDistanceToNow(date, { addSuffix: true });
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, padding: "2px 8px", borderRadius: 9999,
      border: `1px solid ${urgent ? "rgba(192,138,62,0.3)" : "var(--color-hairline)"}`,
      color: urgent ? "var(--color-status-interview)" : "var(--color-ink-muted-48)",
      background: urgent ? "rgba(192,138,62,0.08)" : "var(--color-canvas-parchment)",
    }}>
      <Calendar size={10} strokeWidth={2} />
      {label}
    </span>
  );
}

export function ApplicationCard({ application: app, onDragStart }: ApplicationCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      draggable
      onDragStart={() => { setIsDragging(true); onDragStart(app.id); }}
      onDragEnd={() => setIsDragging(false)}
      style={{
        background: "var(--color-canvas)",
        borderRadius: 11,
        border: "1px solid var(--color-hairline)",
        padding: 12,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        opacity: isDragging ? 0.4 : 1,
        boxShadow: isDragging ? "0 8px 24px rgba(0,0,0,0.12)" : "none",
        transform: isDragging ? "rotate(1.5deg)" : "none",
        transition: "box-shadow 150ms ease, opacity 150ms ease",
      }}
    >
      <Link
        href={`/applications/${app.id}`}
        draggable={false}
        onClick={(e) => { if (isDragging) e.preventDefault(); }}
        style={{ display: "flex", flexDirection: "column", gap: 8, textDecoration: "none", color: "inherit" }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <p style={{
            fontFamily: "var(--font-text)", fontSize: 13, fontWeight: 600, color: "var(--color-ink)",
            lineHeight: 1.35, margin: 0, flex: 1,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {app.jobTitle}
          </p>
          {app.matchScore !== null && <MatchRing score={app.matchScore} />}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-ink-muted-48)" }}>
            <Building2 size={11} strokeWidth={1.5} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.company}</span>
          </span>
          {app.location && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-ink-muted-48)" }}>
              <MapPin size={11} strokeWidth={1.5} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.location}</span>
            </span>
          )}
        </div>

        {app.followUpDate && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, paddingTop: 4, borderTop: "1px solid var(--color-hairline)" }}>
            <FollowUpChip dateStr={app.followUpDate} />
          </div>
        )}
      </Link>
    </motion.div>
  );
}
