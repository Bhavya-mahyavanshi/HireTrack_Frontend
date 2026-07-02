"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  // Footer slot — lets each modal control its own CTA layout
  footer?: React.ReactNode;
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
}: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus the close button on open for keyboard accessibility
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeRef.current?.focus(), 50);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-lg">
            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 34,
              }}
              className={clsx(
                "relative w-full bg-canvas",
                "rounded-xl border border-hairline",
                "flex flex-col max-h-[90vh]",
                sizes[size]
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-xl pb-md border-b border-hairline shrink-0">
                <div>
                  <h2
                    id="modal-title"
                    className="font-display text-tagline text-ink"
                  >
                    {title}
                  </h2>
                  {description && (
                    <p className="text-caption text-ink-muted-48 mt-xxs">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  aria-label="Close"
                  className={clsx(
                    "ml-lg flex items-center justify-center",
                    "w-8 h-8 rounded-full shrink-0",
                    "text-ink-muted-48 hover:text-ink",
                    "bg-transparent hover:bg-canvas-parchment",
                    "transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  )}
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-xl">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="shrink-0 border-t border-hairline p-xl pt-md flex items-center justify-end gap-sm">
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
