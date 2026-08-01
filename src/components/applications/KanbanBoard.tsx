"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ApplicationResponse, ApplicationStatus, KANBAN_COLUMN_ORDER } from "@/lib/types";
import { STATUS_LABELS } from "@/components/ui/StatusBadge";
import { ApplicationCard } from "./ApplicationCard";
import { useUpdateStatus } from "@/hooks/useApplications";

interface KanbanBoardProps {
  applications: ApplicationResponse[];
  isLoading: boolean;
}

const COLUMN_ACCENT: Record<ApplicationStatus, string> = {
  SAVED: "var(--color-status-saved)",
  APPLIED: "var(--color-status-applied)",
  PHONE_SCREEN: "var(--color-status-interview)",
  TECHNICAL: "var(--color-status-interview)",
  FINAL_ROUND: "var(--color-status-interview)",
  OFFER: "var(--color-status-offer)",
  REJECTED: "var(--color-status-rejected)",
  WITHDRAWN: "var(--color-status-withdrawn)",
};

function KanbanColumn({
  status, cards, isDragOver, onDragOver, onDrop, onDragLeave, onDragStart,
}: {
  status: ApplicationStatus;
  cards: ApplicationResponse[];
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragLeave: () => void;
  onDragStart: (id: number) => void;
}) {
  const dashedColor = isDragOver ? "var(--color-primary)" : "var(--color-hairline)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 240, width: 240, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink-muted-80)" }}>
          {STATUS_LABELS[status]}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600, width: 20, height: 20, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: cards.length > 0 ? "var(--color-canvas-parchment)" : "transparent",
          color: cards.length > 0 ? "var(--color-ink)" : "var(--color-ink-muted-48)",
        }}>
          {cards.length}
        </span>
      </div>

      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragLeave={onDragLeave}
        style={{
          flex: 1, display: "flex", flexDirection: "column", gap: 8,
          minHeight: 160, borderRadius: 14, padding: 8, boxSizing: "border-box",
          // FIX: split into individual sides instead of shorthand `border` +
          // `borderTop` together — mixing shorthand and longhand for the
          // same property is undefined behavior in React's style diffing.
          borderLeftWidth: 2, borderLeftStyle: "dashed", borderLeftColor: dashedColor,
          borderRightWidth: 2, borderRightStyle: "dashed", borderRightColor: dashedColor,
          borderBottomWidth: 2, borderBottomStyle: "dashed", borderBottomColor: dashedColor,
          borderTopWidth: 3, borderTopStyle: "solid", borderTopColor: COLUMN_ACCENT[status],
          background: isDragOver ? "rgba(0,102,204,0.04)" : "transparent",
          transition: "background 150ms ease, border-color 150ms ease",
        }}
      >
        <AnimatePresence>
          {cards.map((app) => (
            <ApplicationCard key={app.id} application={app} onDragStart={onDragStart} />
          ))}
        </AnimatePresence>

        {cards.length === 0 && !isDragOver && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 100 }}>
            <p style={{ fontSize: 11, color: "var(--color-ink-muted-48)", textAlign: "center", margin: 0 }}>
              Drop here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({ applications, isLoading }: KanbanBoardProps) {
  const updateStatus = useUpdateStatus();
  const draggedId = useRef<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ApplicationStatus | null>(null);

  const byStatus = KANBAN_COLUMN_ORDER.reduce((acc, status) => {
    acc[status] = applications.filter((a) => a.status === status);
    return acc;
  }, {} as Record<ApplicationStatus, ApplicationResponse[]>);

  const handleDragStart = (id: number) => { draggedId.current = id; };

  const handleDragOver = (e: React.DragEvent, status: ApplicationStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDrop = (status: ApplicationStatus) => {
    if (draggedId.current === null) return;
    const app = applications.find((a) => a.id === draggedId.current);
    if (!app || app.status === status) {
      setDragOverColumn(null);
      draggedId.current = null;
      return;
    }
    updateStatus.mutate({ id: draggedId.current, status });
    draggedId.current = null;
    setDragOverColumn(null);
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 16 }}>
        {KANBAN_COLUMN_ORDER.slice(0, 5).map((status) => (
          <div key={status} style={{ minWidth: 240, height: 140, borderRadius: 14, background: "var(--color-canvas-parchment)" }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 16, width: "100%" }}>
      {KANBAN_COLUMN_ORDER.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          cards={byStatus[status] ?? []}
          isDragOver={dragOverColumn === status}
          onDragOver={(e) => handleDragOver(e, status)}
          onDrop={() => handleDrop(status)}
          onDragLeave={() => setDragOverColumn(null)}
          onDragStart={handleDragStart}
        />
      ))}
    </div>
  );
}
