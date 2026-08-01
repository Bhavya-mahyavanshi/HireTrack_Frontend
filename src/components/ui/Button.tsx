"use client";

import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

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

// All colors/sizes as plain JS objects read into inline styles — this is
// the same fix applied to Input, Card, and the auth pages: Tailwind's
// utility-class scanner has been unreliable throughout this project, so
// every visual property here bypasses it entirely via style={{}}.
const VARIANT_STYLES: Record<ButtonVariant, { bg: string; color: string; border: string; hoverBg: string }> = {
  primary: { bg: "var(--color-primary)", color: "var(--color-on-primary)", border: "1px solid transparent", hoverBg: "var(--color-primary-focus)" },
  secondary: { bg: "var(--color-surface-chip)", color: "var(--color-ink)", border: "1px solid var(--color-hairline)", hoverBg: "rgba(200,200,205,0.64)" },
  ghost: { bg: "transparent", color: "var(--color-primary)", border: "1px solid transparent", hoverBg: "rgba(0,102,204,0.06)" },
  destructive: { bg: "transparent", color: "var(--color-status-rejected)", border: "1px solid var(--color-status-rejected)", hoverBg: "rgba(196,86,79,0.06)" },
};

const SIZE_STYLES: Record<ButtonSize, { height: number; paddingX: number; fontSize: number; radius: number; gap: number }> = {
  sm: { height: 32, paddingX: 17, fontSize: 14, radius: 11, gap: 8 },
  md: { height: 44, paddingX: 32, fontSize: 17, radius: 18, gap: 8 },
  lg: { height: 56, paddingX: 48, fontSize: 18, radius: 9999, gap: 12 },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", isLoading = false, leftIcon, rightIcon, fullWidth = false, disabled, children, style, ...props },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const v = VARIANT_STYLES[variant];
    const s = SIZE_STYLES[size];

    return (
      <motion.button
        ref={ref}
        whileTap={!isDisabled ? { scale: 0.95 } : undefined}
        whileHover={!isDisabled ? { backgroundColor: v.hoverBg } : undefined}
        transition={{ duration: 0.12, ease: "easeOut" }}
        disabled={isDisabled}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: s.gap,
          height: s.height,
          padding: `0 ${s.paddingX}px`,
          borderRadius: s.radius,
          fontFamily: "var(--font-text)",
          fontWeight: 400,
          fontSize: s.fontSize,
          userSelect: "none",
          background: v.bg,
          color: v.color,
          border: v.border,
          cursor: isDisabled ? "not-allowed" : "pointer",
          opacity: isDisabled ? 0.4 : 1,
          pointerEvents: isDisabled ? "none" : "auto",
          width: fullWidth ? "100%" : "auto",
          boxSizing: "border-box",
          transition: "background-color 150ms ease",
          ...style,
        }}
        {...props}
      >
        {isLoading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", display: "flex" }}
            >
              <Loader2 size={16} strokeWidth={1.5} />
            </motion.span>
            <span style={{ opacity: 0 }}>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{leftIcon}</span>}
            {children}
            {rightIcon && <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
