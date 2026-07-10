"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { KanbanBoard } from "@/components/applications/KanbanBoard";
import { useApplications } from "@/hooks/useApplications";

export default function ApplicationsPage() {
  const { data: applications = [], isLoading } = useApplications();

  return (
    <div className="flex flex-col gap-xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div className="flex flex-col gap-xxs">
          <div className="flex items-center gap-sm">
            <LayoutGrid className="w-5 h-5 text-ink-muted-48" strokeWidth={1.5} />
            <h1 className="font-display font-semibold text-display-md text-ink tracking-tight">
              Applications
            </h1>
          </div>
          <p className="font-text text-caption text-ink-muted-48">
            {isLoading
              ? "Loading your pipeline…"
              : `${applications.length} application${applications.length !== 1 ? "s" : ""} tracked`}
          </p>
        </div>

        <Link href="/applications/new">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" strokeWidth={2} />}
          >
            <span className="hidden tablet:inline">Add application</span>
            <span className="tablet:hidden">Add</span>
          </Button>
        </Link>
      </motion.div>

      {/* Kanban board */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        // Negative horizontal margin to let the board bleed past the shell's padding,
        // then re-add it inside so scrollbar appears at the right edge
        className="-mx-lg px-lg overflow-x-auto"
      >
        <KanbanBoard applications={applications} isLoading={isLoading} />
      </motion.div>

      {/* Empty state */}
      {!isLoading && applications.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-section text-center gap-lg"
        >
          <div className="w-16 h-16 rounded-2xl bg-canvas-parchment flex items-center justify-center">
            <LayoutGrid className="w-8 h-8 text-ink-muted-48" strokeWidth={1} />
          </div>
          <div className="flex flex-col gap-xs max-w-xs">
            <p className="font-display font-semibold text-tagline text-ink">
              Your pipeline is empty
            </p>
            <p className="text-caption text-ink-muted-48 leading-relaxed">
              Add your first application by pasting a job posting URL — HireTrack
              will pull the details automatically.
            </p>
          </div>
          <Link href="/applications/new">
            <Button variant="primary" size="lg" leftIcon={<Plus className="w-4 h-4" strokeWidth={2} />}>
              Add your first application
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
