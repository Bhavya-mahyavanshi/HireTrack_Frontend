"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { ApplicationResponse, ApplicationStatus, KANBAN_COLUMN_ORDER } from "@/lib/types";
import { STATUS_LABELS } from "@/components/ui/StatusBadge";
import { ApplicationCard } from "./ApplicationCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useUpdateStatus } from "@/hooks/useApplications";

interface KanbanBoardProps {
  applications: ApplicationResponse[];
  isLoading: boolean;
}

const COLUMN_ACCENT: Record<ApplicationStatus, string> = {
  SAVED: "border-t-[var(--color-status-saved)]",
  APPLIED: "border-t-[var(--color-status-applied)]",
  PHONE_SCREEN: "border-t-[var(--color-status-interview)]",
  TECHNICAL: "border-t-[var(--color-status-interview)]",
  FINAL_ROUND: "border-t-[var(--color-status-interview)]",
  OFFER: "border-t-[var(--color-status-offer)]",
  REJECTED: "border-t-[var(--color-status-rejected)]",
  WITHDRAWN: "border-t-[var(--color-status-withdrawn)]",
};

interface ColumnProps {
  status: ApplicationStatus;
  cards: ApplicationResponse[];
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragLeave: () => void;
  onDragStart: (id: number) => void;
}

function KanbanColumn({
  status,
  cards,
  isDragOver,
  onDragOver,
  onDrop,
  onDragLeave,
  onDragStart,
}: ColumnProps) {
  return (
    <div className="flex flex-col gap-sm min-w-[240px] w-[240px] flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between px-xs">
        <span className="text-caption-strong text-ink-muted-80 tracking-tight">
          {STATUS_LABELS[status]}
        </span>
        <span
          className={clsx(
            "text-fine-print font-semibold w-5 h-5 rounded-full flex items-center justify-center",
            cards.length > 0
              ? "bg-canvas-parchment text-ink"
              : "text-ink-muted-48"
          )}
        >
          {cards.length}
        </span>
      </div>

      {/* Drop zone */}
      <motion.div
        animate={{
          backgroundColor: isDragOver
            ? "rgba(0,102,204,0.04)"
            : "transparent",
          borderColor: isDragOver
            ? "var(--color-primary)"
            : "var(--color-hairline)",
        }}
        transition={{ duration: 0.15 }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragLeave={onDragLeave}
        className={clsx(
          "flex-1 flex flex-col gap-sm",
          "min-h-[120px] rounded-xl border-2 border-dashed p-xs",
          "transition-colors duration-150",
          // Accent stripe — top border color per status
          "border-t-2 border-t-solid",
          COLUMN_ACCENT[status]
        )}
        style={{
          borderTopStyle: "solid",
          borderTopWidth: "2px",
        }}
      >
        <AnimatePresence>
          {cards.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onDragStart={onDragStart}
            />
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {cards.length === 0 && !isDragOver && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-fine-print text-ink-muted-48 text-center leading-relaxed">
              Drop here
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function KanbanBoard({ applications, isLoading }: KanbanBoardProps) {
  const updateStatus = useUpdateStatus();
  const draggedId = useRef<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ApplicationStatus | null>(null);

  const byStatus = KANBAN_COLUMN_ORDER.reduce(
    (acc, status) => {
      acc[status] = applications.filter((a) => a.status === status);
      return acc;
    },
    {} as Record<ApplicationStatus, ApplicationResponse[]>
  );

  const handleDragStart = (id: number) => {
    draggedId.current = id;
  };

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

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  if (isLoading) {
    return (
      <div className="flex gap-md overflow-x-auto pb-md">
        {KANBAN_COLUMN_ORDER.slice(0, 5).map((status) => (
          <div key={status} className="flex flex-col gap-sm min-w-[240px]">
            <div className="h-4 w-20 rounded bg-canvas-parchment animate-pulse" />
            <div className="rounded-xl border-2 border-dashed border-hairline p-xs flex flex-col gap-sm min-h-[120px]">
              <CardSkeleton />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex gap-md overflow-x-auto pb-md"
      style={{ scrollSnapType: "x mandatory" }}
    >
      {KANBAN_COLUMN_ORDER.map((status) => (
        <div key={status} style={{ scrollSnapAlign: "start" }}>
          <KanbanColumn
            status={status}
            cards={byStatus[status] ?? []}
            isDragOver={dragOverColumn === status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDrop={() => handleDrop(status)}
            onDragLeave={handleDragLeave}
            onDragStart={handleDragStart}
          />
        </div>
      ))}
    </div>
  );
}
