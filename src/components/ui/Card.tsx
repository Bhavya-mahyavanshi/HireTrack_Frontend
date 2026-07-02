"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";

interface CardProps extends HTMLMotionProps<"div"> {
  // "hoverable" adds a subtle translateY lift on hover — used for Kanban cards
  // and application list items. Stat cards and detail panels stay static.
  hoverable?: boolean;
  // Padding variants — "none" for when the parent controls its own layout
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
  none: "",
  sm: "p-sm",
  md: "p-lg",
  lg: "p-xl",
};

export function Card({
  hoverable = false,
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={
        hoverable
          ? { y: -2, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }
          : undefined
      }
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={clsx(
        "rounded-lg border border-hairline bg-canvas",
        "transition-colors duration-150",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
