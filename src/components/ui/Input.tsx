"use client";

import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, leftIcon, rightIcon, className, onFocus, onBlur, ...props },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = Boolean(props.value || props.defaultValue);
    const isFloated = isFocused || hasValue;

    return (
      <div className="flex flex-col gap-xxs w-full">
        <div
          className={clsx(
            "relative flex items-center",
            "rounded-md border transition-colors duration-150",
            "bg-surface-pearl",
            error
              ? "border-status-rejected"
              : isFocused
              ? "border-primary"
              : "border-hairline",
          )}
        >
          {leftIcon && (
            <span
              className={clsx(
                "pl-md flex items-center shrink-0 transition-colors duration-150",
                isFocused ? "text-primary" : "text-ink-muted-48"
              )}
            >
              {leftIcon}
            </span>
          )}

          <div className="relative flex-1">
            {/* Floating label */}
            <motion.label
              animate={
                isFloated
                  ? { y: -10, scale: 0.78, color: isFocused ? "var(--color-primary)" : "var(--color-ink-muted-48)" }
                  : { y: 0, scale: 1, color: "var(--color-ink-muted-48)" }
              }
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              style={{
                originX: 0,
                position: "absolute",
                left: leftIcon ? "0px" : "16px",
                top: "50%",
                translateY: "-50%",
                pointerEvents: "none",
                fontFamily: "var(--font-text)",
                fontSize: "17px",
                letterSpacing: "-0.374px",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </motion.label>

            <input
              ref={ref}
              onFocus={(e) => {
                setIsFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                onBlur?.(e);
              }}
              className={clsx(
                "w-full bg-transparent outline-none",
                "font-text text-body text-ink",
                "pt-6 pb-2 px-md",
                leftIcon && "pl-xs",
                rightIcon && "pr-xs",
                className
              )}
              {...props}
            />
          </div>

          {rightIcon && (
            <span className="pr-md flex items-center shrink-0 text-ink-muted-48">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error / hint */}
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-caption text-status-rejected px-xxs"
            >
              {error}
            </motion.p>
          ) : hint ? (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-caption text-ink-muted-48 px-xxs"
            >
              {hint}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";
