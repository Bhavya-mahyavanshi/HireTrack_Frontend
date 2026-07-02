"use client";

import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  // "Action Blue is the only CTA color — non-negotiable" per design doc
  primary:
    "bg-primary text-on-primary hover:bg-primary-focus border border-transparent",
  // Utility card style from the doc: translucent chip surface, hairline border
  secondary:
    "bg-surface-chip text-ink border border-hairline hover:bg-[rgba(200,200,205,0.64)]",
  ghost:
    "bg-transparent text-primary border border-transparent hover:bg-[rgba(0,102,204,0.06)]",
  destructive:
    "bg-transparent text-status-rejected border border-status-rejected hover:bg-[rgba(196,86,79,0.06)]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-md text-button-utility rounded-md gap-xs",
  md: "h-11 px-xl text-body rounded-lg gap-xs",
  // Large pill CTA — the doc's "pill-shaped CTA" as the highest-emphasis action
  lg: "h-14 px-xxl text-button-large rounded-pill gap-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        // The ONE press micro-interaction the design doc defines
        whileTap={!isDisabled ? { scale: 0.95 } : undefined}
        whileHover={!isDisabled ? { opacity: 0.92 } : undefined}
        transition={{ duration: 0.12, ease: "easeOut" }}
        disabled={isDisabled}
        className={clsx(
          // Base
          "relative inline-flex items-center justify-center",
          "font-text font-light select-none",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          // Variant + size
          variants[variant],
          sizes[size],
          // States
          isDisabled && "opacity-40 cursor-not-allowed pointer-events-none",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute"
            >
              <Loader2 className="w-4 h-4" strokeWidth={1.5} />
            </motion.span>
            <span className="opacity-0">{children}</span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="flex items-center shrink-0">{leftIcon}</span>
            )}
            {children}
            {rightIcon && (
              <span className="flex items-center shrink-0">{rightIcon}</span>
            )}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
