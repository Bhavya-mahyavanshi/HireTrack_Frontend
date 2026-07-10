"use client";

import { motion } from "framer-motion";
import { AuthGuard } from "./AuthGuard";
import { TopNav } from "./TopNav";
import { MobileNav } from "./MobileNav";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-canvas-parchment">
        <TopNav />

        <motion.main
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut", delay: 0.05 }}
          className={[
            // Top padding clears the fixed 56px TopNav
            "pt-14",
            // Bottom padding on mobile clears the fixed 56px MobileNav + safe area
            "pb-20 tablet-lg:pb-0",
            // Max-width and horizontal centering match the design doc's grid
            "max-w-[1069px] mx-auto",
            "px-lg",
            // Vertical breathing room per the doc's section spacing token
            "py-xl tablet-lg:py-section",
          ].join(" ")}
        >
          {children}
        </motion.main>

        <MobileNav />
      </div>
    </AuthGuard>
  );
}
