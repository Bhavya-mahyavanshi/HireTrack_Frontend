"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { clsx } from "clsx";

interface PillProps {
  label: string;
  variant?: "default" | "matched" | "missing";
  onRemove?: () => void;
  onClick?: () => void;
}

const variants = {
  // Translucent chip — the exact surface the doc defines for configurator chips
  default:
    "bg-surface-chip text-ink border border-hairline",
  // Skill match states — only used on the match panel, never as CTAs
  matched:
    "bg-[rgba(74,157,110,0.10)] text-status-offer border border-[rgba(74,157,110,0.22)]",
  missing:
    "bg-[rgba(196,86,79,0.08)] text-status-rejected border border-[rgba(196,86,79,0.20)]",
};

export function Pill({ label, variant = "default", onRemove, onClick }: PillProps) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-xxs",
        "rounded-pill px-sm py-xxs",
        "font-text text-caption-strong",
        "whitespace-nowrap select-none",
        variants[variant],
        onClick && "cursor-pointer",
      )}
    >
      {label}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${label}`}
          className={clsx(
            "flex items-center justify-center",
            "w-3.5 h-3.5 rounded-full ml-xxs",
            "opacity-60 hover:opacity-100",
            "transition-opacity duration-100",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
          )}
        >
          <X className="w-2.5 h-2.5" strokeWidth={2.5} />
        </button>
      )}
    </motion.span>
  );
}
