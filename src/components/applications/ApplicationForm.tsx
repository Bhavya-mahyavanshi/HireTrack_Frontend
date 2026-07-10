"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { applicationEditSchema, ApplicationEditValues } from "@/lib/validation";
import { APPLICATION_STATUSES, ApplicationResponse } from "@/lib/types";
import { STATUS_LABELS } from "@/components/ui/StatusBadge";
import { useUpdateApplication } from "@/hooks/useApplications";

interface ApplicationFormProps {
  application: ApplicationResponse;
  onSuccess?: () => void;
}

export function ApplicationForm({ application, onSuccess }: ApplicationFormProps) {
  const update = useUpdateApplication();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ApplicationEditValues>({
    resolver: zodResolver(applicationEditSchema),
    defaultValues: {
      status: application.status,
      appliedDate: application.appliedDate ?? "",
      followUpDate: application.followUpDate ?? "",
      notes: application.notes ?? "",
      resumeVersion: application.resumeVersion ?? "",
    },
  });

  const onSubmit = async (data: ApplicationEditValues) => {
    // Only send changed fields — PUT is a partial update on the backend
    const payload: ApplicationEditValues = {};
    if (data.status !== application.status) payload.status = data.status;
    if (data.appliedDate !== (application.appliedDate ?? ""))
      payload.appliedDate = data.appliedDate || undefined;
    if (data.followUpDate !== (application.followUpDate ?? ""))
      payload.followUpDate = data.followUpDate || undefined;
    if (data.notes !== (application.notes ?? ""))
      payload.notes = data.notes || undefined;
    if (data.resumeVersion !== (application.resumeVersion ?? ""))
      payload.resumeVersion = data.resumeVersion || undefined;

    await update.mutateAsync({ id: application.id, data: payload });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-lg">
      {/* Status */}
      <div className="flex flex-col gap-xxs">
        <label className="text-caption text-ink-muted-48 px-xxs">Status</label>
        <select
          className={clsx(
            "w-full rounded-md border border-hairline bg-surface-pearl",
            "font-text text-body text-ink px-md py-3",
            "focus:outline-none focus:border-primary",
            "transition-colors duration-150"
          )}
          {...register("status")}
        >
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="text-caption text-status-rejected px-xxs">
            {errors.status.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-md">
        <Input
          label="Applied date"
          type="date"
          error={errors.appliedDate?.message}
          {...register("appliedDate")}
        />
        <Input
          label="Follow-up date"
          type="date"
          error={errors.followUpDate?.message}
          {...register("followUpDate")}
        />
        <Input
          label="Resume version"
          placeholder="e.g. v3-backend"
          error={errors.resumeVersion?.message}
          {...register("resumeVersion")}
        />
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-xxs">
        <label className="text-caption text-ink-muted-48 px-xxs">Notes</label>
        <textarea
          rows={4}
          placeholder="Interview prep, recruiter contact, company notes…"
          className={clsx(
            "w-full rounded-md border border-hairline bg-surface-pearl",
            "font-text text-body text-ink px-md py-md",
            "focus:outline-none focus:border-primary",
            "resize-none transition-colors duration-150",
            "placeholder:text-ink-muted-48"
          )}
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-caption text-status-rejected px-xxs">
            {errors.notes.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="md"
        variant="primary"
        isLoading={update.isPending}
        disabled={!isDirty}
      >
        Save changes
      </Button>
    </form>
  );
}
