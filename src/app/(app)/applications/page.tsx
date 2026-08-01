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
    <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LayoutGrid size={20} strokeWidth={1.5} color="var(--color-ink-muted-48)" />
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 34, color: "var(--color-ink)", margin: 0 }}>
              Applications
            </h1>
          </div>
          <p style={{ fontSize: 14, color: "var(--color-ink-muted-48)", margin: 0 }}>
            {isLoading ? "Loading your pipeline…" : `${applications.length} application${applications.length !== 1 ? "s" : ""} tracked`}
          </p>
        </div>

        <Link href="/applications/new" style={{ textDecoration: "none" }}>
          <Button variant="primary" size="md" leftIcon={<Plus size={16} strokeWidth={2} />}>
            Add application
          </Button>
        </Link>
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <KanbanBoard applications={applications} isLoading={isLoading} />
      </div>

      {!isLoading && applications.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", textAlign: "center", gap: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--color-canvas-parchment)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LayoutGrid size={32} strokeWidth={1} color="var(--color-ink-muted-48)" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 21, color: "var(--color-ink)", margin: 0 }}>
              Your pipeline is empty
            </p>
            <p style={{ fontSize: 14, color: "var(--color-ink-muted-48)", lineHeight: 1.6, margin: 0 }}>
              Add your first application by pasting a job posting URL — HireTrack
              will pull the details automatically.
            </p>
          </div>
          <Link href="/applications/new" style={{ textDecoration: "none" }}>
            <Button variant="primary" size="lg" leftIcon={<Plus size={16} strokeWidth={2} />}>
              Add your first application
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
