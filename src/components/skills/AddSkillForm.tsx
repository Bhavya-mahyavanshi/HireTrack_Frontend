"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { clsx } from "clsx";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { addSkillSchema, AddSkillValues } from "@/lib/validation";
import { PROFICIENCY_LEVELS } from "@/lib/types";
import { useAddSkill } from "@/hooks/useSkills";

const PROFICIENCY_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export function AddSkillForm() {
  const addSkill = useAddSkill();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddSkillValues>({
    resolver: zodResolver(addSkillSchema),
    defaultValues: { skillName: "", proficiency: "INTERMEDIATE" },
  });

  const onSubmit = async (data: AddSkillValues) => {
    await addSkill.mutateAsync(data);
    reset({ skillName: "", proficiency: "INTERMEDIATE" });
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-md"
    >
      <div className="flex gap-sm items-start">
        {/* Skill name */}
        <div className="flex-1">
          <Input
            label="Skill name"
            autoComplete="off"
            error={errors.skillName?.message}
            {...register("skillName")}
          />
        </div>

        {/* Proficiency */}
        <div className="flex flex-col gap-xxs shrink-0 w-36">
          <label className="text-caption text-ink-muted-48 px-xxs">
            Level
          </label>
          <select
            className={clsx(
              "w-full rounded-md border border-hairline bg-surface-pearl",
              "font-text text-body text-ink px-md py-3",
              "focus:outline-none focus:border-primary",
              "transition-colors duration-150",
              "h-[54px]" // match Input height
            )}
            {...register("proficiency")}
          >
            {PROFICIENCY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {PROFICIENCY_LABELS[level]}
              </option>
            ))}
          </select>
        </div>

        {/* Add button */}
        <div className="pt-[26px] shrink-0">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={addSkill.isPending}
            leftIcon={<Plus className="w-4 h-4" strokeWidth={2} />}
          >
            Add
          </Button>
        </div>
      </div>
    </motion.form>
  );
}
