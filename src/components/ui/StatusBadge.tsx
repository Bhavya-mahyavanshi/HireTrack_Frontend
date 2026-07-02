import { clsx } from "clsx";
import { ApplicationStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: "sm" | "md";
}

// Human-readable labels for the 8 backend enum values
export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  PHONE_SCREEN: "Phone Screen",
  TECHNICAL: "Technical",
  FINAL_ROUND: "Final Round",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

// Muted, desaturated palette — never Action Blue, never a button color.
// These only ever appear on read-only status indicators.
const STATUS_STYLES: Record<ApplicationStatus, string> = {
  SAVED:
    "bg-[rgba(138,138,146,0.12)] text-status-saved border-[rgba(138,138,146,0.24)]",
  APPLIED:
    "bg-[rgba(90,143,214,0.12)] text-status-applied border-[rgba(90,143,214,0.24)]",
  PHONE_SCREEN:
    "bg-[rgba(192,138,62,0.12)] text-status-interview border-[rgba(192,138,62,0.24)]",
  TECHNICAL:
    "bg-[rgba(192,138,62,0.14)] text-status-interview border-[rgba(192,138,62,0.28)]",
  FINAL_ROUND:
    "bg-[rgba(192,138,62,0.18)] text-status-interview border-[rgba(192,138,62,0.34)]",
  OFFER:
    "bg-[rgba(74,157,110,0.12)] text-status-offer border-[rgba(74,157,110,0.24)]",
  REJECTED:
    "bg-[rgba(196,86,79,0.10)] text-status-rejected border-[rgba(196,86,79,0.22)]",
  WITHDRAWN:
    "bg-[rgba(163,163,168,0.10)] text-status-withdrawn border-[rgba(163,163,168,0.22)]",
};

const sizes = {
  sm: "text-fine-print px-xs py-[2px]",
  md: "text-caption px-sm py-xxs",
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-pill border font-text font-medium",
        "whitespace-nowrap tracking-tight",
        STATUS_STYLES[status],
        sizes[size]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
