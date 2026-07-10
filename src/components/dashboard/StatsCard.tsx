"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accent?: "blue" | "amber" | "green" | "red" | "muted";
  delay?: number;
  suffix?: string;
}

const accents = {
  blue: {
    icon: "text-status-applied",
    bg: "bg-[rgba(90,143,214,0.08)]",
    border: "border-[rgba(90,143,214,0.16)]",
    value: "text-status-applied",
  },
  amber: {
    icon: "text-status-interview",
    bg: "bg-[rgba(192,138,62,0.08)]",
    border: "border-[rgba(192,138,62,0.16)]",
    value: "text-status-interview",
  },
  green: {
    icon: "text-status-offer",
    bg: "bg-[rgba(74,157,110,0.08)]",
    border: "border-[rgba(74,157,110,0.16)]",
    value: "text-status-offer",
  },
  red: {
    icon: "text-status-rejected",
    bg: "bg-[rgba(196,86,79,0.08)]",
    border: "border-[rgba(196,86,79,0.16)]",
    value: "text-status-rejected",
  },
  muted: {
    icon: "text-ink-muted-48",
    bg: "bg-canvas-parchment",
    border: "border-hairline",
    value: "text-ink",
  },
};

// Smooth count-up from 0 to target over ~800ms
function useCountUp(target: number, delay: number = 0) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const duration = 700;

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) raf.current = requestAnimationFrame(tick);
      };

      raf.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf.current);
    };
  }, [target, delay]);

  return count;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  accent = "muted",
  delay = 0,
  suffix = "",
}: StatsCardProps) {
  const displayValue = useCountUp(value, delay);
  const style = accents[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: delay / 1000 }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      className={clsx(
        "rounded-xl border p-lg flex flex-col gap-md",
        "bg-canvas",
        style.border,
        "cursor-default select-none"
      )}
    >
      {/* Icon */}
      <div
        className={clsx(
          "w-9 h-9 rounded-lg flex items-center justify-center",
          style.bg
        )}
      >
        <Icon className={clsx("w-4 h-4", style.icon)} strokeWidth={1.75} />
      </div>

      {/* Value */}
      <div className="flex flex-col gap-xxs">
        <span
          className={clsx(
            "font-display font-semibold leading-none tracking-tight",
            "text-[40px]",
            style.value
          )}
        >
          {displayValue}
          {suffix && (
            <span className="text-display-md ml-xxs opacity-60">{suffix}</span>
          )}
        </span>
        <span className="font-text text-caption text-ink-muted-48 tracking-tight">
          {label}
        </span>
      </div>
    </motion.div>
  );
}
