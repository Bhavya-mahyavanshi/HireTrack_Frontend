"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { SkillResponse, Proficiency } from "@/lib/types";
import { useDeleteSkill } from "@/hooks/useSkills";

interface SkillListProps {
  skills: SkillResponse[];
}

const PROFICIENCY_CONFIG: Record<
  Proficiency,
  { label: string; dots: number; color: string }
> = {
  BEGINNER: {
    label: "Beginner",
    dots: 1,
    color: "var(--color-status-saved)",
  },
  INTERMEDIATE: {
    label: "Intermediate",
    dots: 2,
    color: "var(--color-status-applied)",
  },
  ADVANCED: {
    label: "Advanced",
    dots: 3,
    color: "var(--color-status-offer)",
  },
};

function ProficiencyDots({
  proficiency,
}: {
  proficiency: Proficiency | null;
}) {
  if (!proficiency) return null;
  const config = PROFICIENCY_CONFIG[proficiency];
  return (
    <div className="flex items-center gap-xxs">
      {[1, 2, 3].map((level) => (
        <motion.span
          key={level}
          className="w-1.5 h-1.5 rounded-full"
          animate={{
            backgroundColor:
              level <= config.dots
                ? config.color
                : "var(--color-hairline)",
          }}
          transition={{ duration: 0.2, delay: level * 0.05 }}
        />
      ))}
      <span className="text-fine-print text-ink-muted-48 ml-xxs">
        {config.label}
      </span>
    </div>
  );
}

export function SkillList({ skills }: SkillListProps) {
  const deleteSkill = useDeleteSkill();

  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-xl text-center gap-md">
        <Sparkles className="w-8 h-8 text-ink-muted-48" strokeWidth={1} />
        <div className="flex flex-col gap-xxs">
          <p className="text-caption-strong text-ink">No skills yet</p>
          <p className="text-caption text-ink-muted-48">
            Add skills to get match scores on your applications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-hairline">
      <AnimatePresence initial={false}>
        {skills.map((skill, i) => (
          <motion.li
            key={skill.id}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ x: -8 }}
              animate={{ x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              className={clsx(
                "flex items-center justify-between gap-md",
                "py-md px-xs group"
              )}
            >
              <div className="flex flex-col gap-xxs flex-1 min-w-0">
                <span className="font-text text-caption-strong text-ink truncate">
                  {skill.skillName}
                </span>
                <ProficiencyDots proficiency={skill.proficiency} />
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteSkill.mutate(skill.id)}
                disabled={deleteSkill.isPending}
                aria-label={`Remove ${skill.skillName}`}
                className={clsx(
                  "flex items-center justify-center w-7 h-7 rounded-md",
                  "text-ink-muted-48 hover:text-status-rejected",
                  "opacity-0 group-hover:opacity-100",
                  "hover:bg-[rgba(196,86,79,0.08)]",
                  "transition-all duration-150",
                  "focus-visible:opacity-100 focus-visible:outline-none",
                  "focus-visible:ring-1 focus-visible:ring-status-rejected"
                )}
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
              </motion.button>
            </motion.div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
