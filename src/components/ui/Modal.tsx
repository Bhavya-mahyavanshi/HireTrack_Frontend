"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const SIZES: Record<string, number> = { sm: 420, md: 520, lg: 680 };

export function Modal({ isOpen, onClose, title, description, size = "md", children, footer }: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => closeRef.current?.focus(), 50);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 40,
              background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
            }}
            aria-hidden="true"
          />

          <div
            style={{
              position: "fixed", inset: 0, zIndex: 50,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 24, boxSizing: "border-box",
            }}
          >
            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: SIZES[size],
                maxHeight: "90vh",
                background: "var(--color-canvas)",
                borderRadius: 18,
                border: "1px solid var(--color-hairline)",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                padding: "24px 24px 16px 24px", borderBottom: "1px solid var(--color-hairline)", flexShrink: 0,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 id="modal-title" style={{
                    fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 21,
                    color: "var(--color-ink)", margin: 0, width: "100%",
                  }}>
                    {title}
                  </h2>
                  {description && (
                    <p style={{ fontSize: 14, color: "var(--color-ink-muted-48)", margin: "4px 0 0 0", width: "100%" }}>
                      {description}
                    </p>
                  )}
                </div>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  aria-label="Close"
                  style={{
                    marginLeft: 24, display: "flex", alignItems: "center", justifyContent: "center",
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    color: "var(--color-ink-muted-48)", background: "transparent",
                    border: "none", cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-canvas-parchment)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              {/* Body */}
              <div style={{ flex: 1, overflowY: "auto", padding: 24, boxSizing: "border-box", width: "100%" }}>
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div style={{
                  flexShrink: 0, borderTop: "1px solid var(--color-hairline)",
                  padding: "16px 24px 24px 24px", display: "flex",
                  alignItems: "center", justifyContent: "flex-end", gap: 12,
                }}>
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
