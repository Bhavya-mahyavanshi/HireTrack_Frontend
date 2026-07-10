"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { SkillList } from "@/components/skills/SkillList";
import { AddSkillForm } from "@/components/skills/AddSkillForm";
import { SkillMatchPanel } from "@/components/skills/SkillMatchPanel";
import { useSkills } from "@/hooks/useSkills";
import { useApplications } from "@/hooks/useApplications";

export default function SkillsPage() {
  const { data: skills = [], isLoading: skillsLoading } = useSkills();
  const { data: applications = [], isLoading: appsLoading } = useApplications();

  return (
    <div className="flex flex-col gap-xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-xxs"
      >
        <div className="flex items-center gap-sm">
          <Sparkles className="w-5 h-5 text-ink-muted-48" strokeWidth={1.5} />
          <h1 className="font-display font-semibold text-display-md text-ink tracking-tight">
            Skills
          </h1>
        </div>
        <p className="font-text text-caption text-ink-muted-48">
          {skillsLoading
            ? "Loading your profile…"
            : `${skills.length} skill${skills.length !== 1 ? "s" : ""} in your profile`}
        </p>
      </motion.div>

      <div className="grid desktop-sm:grid-cols-[1fr_380px] gap-lg items-start">
        {/* Left — skill management */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="flex flex-col gap-lg"
        >
          {/* Add skill form */}
          <Card padding="lg">
            <h2 className="font-display font-semibold text-tagline text-ink mb-lg">
              Add a skill
            </h2>
            <AddSkillForm />
          </Card>

          {/* Skill list */}
          <Card padding="lg">
            <h2 className="font-display font-semibold text-tagline text-ink mb-md">
              Your profile
            </h2>
            {skillsLoading ? (
              <div className="flex flex-col gap-md">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-md">
                    <div className="flex flex-col gap-xxs flex-1">
                      <Skeleton variant="text" className="w-32 h-4" />
                      <Skeleton variant="text" className="w-20 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <SkillList skills={skills} />
            )}
          </Card>
        </motion.div>

        {/* Right — match panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.16 }}
        >
          <Card padding="lg">
            <div className="flex flex-col gap-xxs mb-lg">
              <h2 className="font-display font-semibold text-tagline text-ink">
                Match scores
              </h2>
              <p className="text-caption text-ink-muted-48">
                How your skills align with each tracked application
              </p>
            </div>

            {appsLoading ? (
              <div className="flex flex-col gap-md">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-md py-md">
                    <div className="flex flex-col gap-xxs w-36">
                      <Skeleton variant="text" className="w-28 h-4" />
                      <Skeleton variant="text" className="w-20 h-3" />
                    </div>
                    <Skeleton variant="text" className="flex-1 h-2" />
                    <Skeleton variant="pill" className="w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <SkillMatchPanel applications={applications} />
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
