"use client";

import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, style, onFocus, onBlur, onChange, defaultValue, placeholder, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(defaultValue));

    // Date/time/month/week inputs always render a native format hint
    // (e.g. "yyyy-mm-dd") even when empty — there's no real blank state to
    // hide the label behind, so always float the label for these types.
    const alwaysFloat = type === "date" || type === "time" || type === "month" || type === "week";
    const isFloated = isFocused || hasValue || alwaysFloat;

    const borderColor = error
      ? "var(--color-status-rejected)"
      : isFocused
      ? "var(--color-primary)"
      : "var(--color-hairline)";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
            borderRadius: 11,
            border: `1px solid ${borderColor}`,
            background: "var(--color-surface-pearl)",
            boxSizing: "border-box",
            boxShadow: isFocused ? "0 0 0 3px rgba(0, 102, 204, 0.12)" : "none",
            transition: "border-color 150ms ease, box-shadow 150ms ease",
          }}
        >
          {leftIcon && (
            <span
              style={{
                paddingLeft: 17,
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                color: isFocused ? "var(--color-primary)" : "var(--color-ink-muted-48)",
                transition: "color 150ms ease",
              }}
            >
              {leftIcon}
            </span>
          )}

          <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
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
                left: leftIcon ? 0 : 16,
                top: "50%",
                translateY: "-50%",
                pointerEvents: "none",
                fontFamily: "var(--font-text)",
                fontSize: 17,
                letterSpacing: "-0.374px",
                lineHeight: 1,
                whiteSpace: "nowrap",
                zIndex: 1,
              }}
            >
              {label}
            </motion.label>

            <input
              ref={ref}
              type={type}
              defaultValue={defaultValue}
              // Only render the native placeholder once the label has
              // floated out of the way — otherwise both draw in the same
              // spot and overlap, as seen with the Resume Version field.
              placeholder={isFloated ? placeholder : undefined}
              onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
              onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
              onChange={(e) => {
                setHasValue(e.target.value.length > 0);
                onChange?.(e);
              }}
              style={{
                width: "100%",
                background: "transparent",
                outline: "none",
                border: "none",
                fontFamily: "var(--font-text)",
                fontSize: 17,
                color: "var(--color-ink)",
                paddingTop: 24,
                paddingBottom: 8,
                paddingLeft: leftIcon ? 8 : 16,
                paddingRight: rightIcon ? 8 : 16,
                boxSizing: "border-box",
                position: "relative",
                zIndex: 2,
                ...style,
              }}
              {...props}
            />
          </div>

          {rightIcon && (
            <span style={{ paddingRight: 17, display: "flex", alignItems: "center", flexShrink: 0, color: "var(--color-ink-muted-48)" }}>
              {rightIcon}
            </span>
          )}
        </div>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              style={{ fontSize: 14, color: "var(--color-status-rejected)", padding: "0 4px", margin: 0 }}
            >
              {error}
            </motion.p>
          ) : hint ? (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: 14, color: "var(--color-ink-muted-48)", padding: "0 4px", margin: 0 }}
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
