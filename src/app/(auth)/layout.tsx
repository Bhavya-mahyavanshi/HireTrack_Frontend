"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isTokenExpired } = useAuthStore();

  // Already logged in — skip auth pages entirely
  useEffect(() => {
    if (isAuthenticated && !isTokenExpired()) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isTokenExpired, router]);

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Left panel — decorative, hidden on mobile */}
      <div className="hidden tablet-lg:flex flex-col flex-1 bg-surface-black relative overflow-hidden">
        {/* Ambient gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,102,204,0.4) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute bottom-[-10%] right-[-15%] w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(41,151,255,0.3) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-xxl">
          {/* Logo */}
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-on-primary font-display font-semibold text-sm">
                H
              </span>
            </div>
            <span className="font-display font-semibold text-on-dark text-body-strong tracking-tight">
              HireTrack
            </span>
          </div>

          {/* Hero copy */}
          <div className="flex flex-col gap-lg max-w-sm">
            {/* Animated pipeline visualization */}
            <div className="flex items-center gap-xs mb-md">
              {["Saved", "Applied", "Interview", "Offer"].map((stage, i) => (
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.12, duration: 0.4 }}
                  className="flex items-center gap-xs"
                >
                  <div
                    className="px-sm py-xxs rounded-pill text-fine-print font-text font-medium border"
                    style={{
                      background:
                        i === 0
                          ? "rgba(138,138,146,0.15)"
                          : i === 1
                          ? "rgba(90,143,214,0.15)"
                          : i === 2
                          ? "rgba(192,138,62,0.15)"
                          : "rgba(74,157,110,0.15)",
                      color:
                        i === 0
                          ? "var(--color-status-saved)"
                          : i === 1
                          ? "var(--color-status-applied)"
                          : i === 2
                          ? "var(--color-status-interview)"
                          : "var(--color-status-offer)",
                      borderColor:
                        i === 0
                          ? "rgba(138,138,146,0.25)"
                          : i === 1
                          ? "rgba(90,143,214,0.25)"
                          : i === 2
                          ? "rgba(192,138,62,0.25)"
                          : "rgba(74,157,110,0.25)",
                    }}
                  >
                    {stage}
                  </div>
                  {i < 3 && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      transition={{ delay: 0.6 + i * 0.12 }}
                      className="text-body-muted text-fine-print"
                    >
                      →
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-display text-display-md text-on-dark leading-tight"
            >
              Your job search,{" "}
              <span className="text-primary-on-dark">finally organized.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="font-text text-body text-body-muted leading-relaxed"
            >
              Track every application, surface skill gaps before interviews, and
              never miss a follow-up — all in one place instead of twelve tabs.
            </motion.p>

            {/* Social proof tickers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-md pt-sm"
            >
              {[
                { value: "8", label: "Pipeline stages" },
                { value: "∞", label: "Applications" },
                { value: "0", label: "Missed follow-ups" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="font-display font-semibold text-on-dark text-display-md leading-none">
                    {value}
                  </span>
                  <span className="text-fine-print text-body-muted mt-xxs">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Footer */}
          <p className="text-fine-print text-body-muted opacity-40">
            © {new Date().getFullYear()} HireTrack
          </p>
        </div>
      </div>

      {/* Right panel — the actual form */}
      <div className="flex-1 flex items-center justify-center p-lg tablet-lg:max-w-[480px]">
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo — only shows when left panel is hidden */}
          <div className="flex items-center gap-sm mb-xxl tablet-lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-surface-black flex items-center justify-center">
              <span className="text-on-dark font-display font-semibold text-sm">
                H
              </span>
            </div>
            <span className="font-display font-semibold text-ink text-body-strong tracking-tight">
              HireTrack
            </span>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
}
