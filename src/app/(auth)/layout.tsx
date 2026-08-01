"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

// This redesign uses inline styles (referencing the @theme CSS variables
// from tokens.css directly) for every layout-critical property — width,
// max-width, display, flex structure. Confirmed via direct inspection of
// compiled CSS: Tailwind's utility-class generation was unreliable in this
// project (only 1 of dozens of expected classes compiled), while @theme's
// CSS custom properties compiled correctly 100% of the time. Inline styles
// read those same variables directly, so they render correctly regardless
// of whether Tailwind's class scanner is working.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isTokenExpired } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !isTokenExpired()) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isTokenExpired, router]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-canvas)", display: "flex" }}>
      {/* Left panel — decorative, hidden below 900px */}
      <div
        className="hide-on-mobile"
        style={{
          flex: 1,
          background: "var(--color-surface-black)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,102,204,0.4) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-15%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(41,151,255,0.3) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            width: "100%",
            padding: 48,
            boxSizing: "border-box",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: "var(--color-primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <span style={{ color: "var(--color-on-primary)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>H</span>
            </div>
            <span style={{ color: "var(--color-on-dark)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, letterSpacing: "-0.3px" }}>
              HireTrack
            </span>
          </div>

          {/* Hero copy block — fixed width in px, not a Tailwind max-w class */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%", maxWidth: 420 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              {["Saved", "Applied", "Interview", "Offer"].map((stage, i) => {
                const colors = [
                  { bg: "rgba(138,138,146,0.15)", fg: "var(--color-status-saved)", bd: "rgba(138,138,146,0.25)" },
                  { bg: "rgba(90,143,214,0.15)", fg: "var(--color-status-applied)", bd: "rgba(90,143,214,0.25)" },
                  { bg: "rgba(192,138,62,0.15)", fg: "var(--color-status-interview)", bd: "rgba(192,138,62,0.25)" },
                  { bg: "rgba(74,157,110,0.15)", fg: "var(--color-status-offer)", bd: "rgba(74,157,110,0.25)" },
                ][i];
                return (
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.12, duration: 0.4 }}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        padding: "4px 12px", borderRadius: 9999, fontSize: 12,
                        fontFamily: "var(--font-text)", fontWeight: 500, whiteSpace: "nowrap",
                        background: colors.bg, color: colors.fg, border: `1px solid ${colors.bd}`,
                      }}
                    >
                      {stage}
                    </div>
                    {i < 3 && (
                      <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                        transition={{ delay: 0.6 + i * 0.12 }}
                        style={{ color: "var(--color-body-muted)", fontSize: 12 }}
                      >
                        →
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                fontFamily: "var(--font-display)", fontWeight: 600,
                fontSize: 34, lineHeight: 1.2, color: "var(--color-on-dark)",
                width: "100%", display: "block", margin: 0,
              }}
            >
              Your job search,{" "}
              <span style={{ color: "var(--color-primary-on-dark)" }}>finally organized.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              style={{
                fontFamily: "var(--font-text)", fontSize: 16, lineHeight: 1.6,
                color: "var(--color-body-muted)", width: "100%", display: "block", margin: 0,
              }}
            >
              Track every application, surface skill gaps before interviews, and
              never miss a follow-up — all in one place instead of twelve tabs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              style={{ display: "flex", alignItems: "center", gap: 24, paddingTop: 8, flexWrap: "wrap" }}
            >
              {[
                { value: "8", label: "Pipeline stages" },
                { value: "∞", label: "Applications" },
                { value: "0", label: "Missed follow-ups" },
              ].map(({ value, label }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, color: "var(--color-on-dark)", lineHeight: 1 }}>
                    {value}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--color-body-muted)", marginTop: 4, whiteSpace: "nowrap" }}>
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          <p style={{ fontSize: 12, color: "var(--color-body-muted)", opacity: 0.4, width: "100%", margin: 0 }}>
            © {new Date().getFullYear()} HireTrack
          </p>
        </div>
      </div>

      {/* Right panel — the form */}
      <div
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24, boxSizing: "border-box",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: 380, margin: "0 auto" }}
        >
          <div className="show-on-mobile" style={{ display: "none", alignItems: "center", gap: 8, marginBottom: 48 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: "var(--color-surface-black)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "var(--color-on-dark)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>H</span>
            </div>
            <span style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17 }}>
              HireTrack
            </span>
          </div>

          {children}
        </motion.div>
      </div>

      {/* Minimal responsive rules — plain CSS, not Tailwind, so they can't
          silently fail to compile the way utility classes did. */}
      <style jsx global>{`
        @media (max-width: 899px) {
          .hide-on-mobile { display: none !important; }
          .show-on-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
