"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ScrapeJobForm } from "@/components/applications/ScrapeJobForm";
import { Card } from "@/components/ui/Card";

export default function NewApplicationPage() {
  return (
    <div className="flex flex-col gap-xl max-w-2xl mx-auto">
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
          Back to applications
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-col gap-xxs"
      >
        <h1 className="font-display font-semibold text-display-md text-ink tracking-tight">
          Add application
        </h1>
        <p className="font-text text-body text-ink-muted-48">
          Paste a job posting URL and HireTrack handles the rest.
        </p>
      </motion.div>

      {/* Scrape form card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <Card padding="lg">
          <ScrapeJobForm />
        </Card>
      </motion.div>
    </div>
  );
}
