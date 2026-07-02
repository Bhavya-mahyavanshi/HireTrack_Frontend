import { z } from "zod";
import { PROFICIENCY_LEVELS } from "@/lib/types";

// Mirrors backend SkillRequest — skillName required, proficiency optional enum
export const addSkillSchema = z.object({
  skillName: z
    .string()
    .min(1, "Skill name is required")
    .max(100, "Skill name must be under 100 characters")
    .trim()
    .transform((val) => {
      // Capitalize first letter for consistent display and exact-match scoring.
      // The backend normalizes to lowercase before matching, so casing here
      // only affects display — but consistent casing avoids confusing "react"
      // vs "React" entries in the user's own skill list.
      return val.charAt(0).toUpperCase() + val.slice(1);
    }),
  proficiency: z
    .enum(PROFICIENCY_LEVELS, {
      errorMap: () => ({
        message: "Select Beginner, Intermediate, or Advanced",
      }),
    })
    .optional(),
});

export type AddSkillValues = z.infer<typeof addSkillSchema>;
