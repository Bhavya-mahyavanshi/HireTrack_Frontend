"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Applications" },
  { href: "/skills", label: "Skills" },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const clearAuth = useLogout();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const handleLogout = () => {
    setMenuOpen(false);
    clearAuth();
    router.push("/login");
  };

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 30,
        background: "var(--color-surface-black)",
        boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,0.08)" : "none",
        transition: "box-shadow 300ms ease",
      }}
    >
      <div style={{
        maxWidth: 1069, margin: "0 auto", padding: "0 24px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxSizing: "border-box",
      }}>
        {/* Logo */}
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }} aria-label="HireTrack home">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: "var(--color-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ color: "var(--color-on-primary)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>H</span>
          </motion.div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--color-on-dark)", fontSize: 15, letterSpacing: "-0.2px" }}>
            HireTrack
          </span>
        </Link>

        {/* Nav links — hidden below 900px, MobileNav handles that breakpoint */}
        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }} aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    position: "relative", fontSize: 13, fontFamily: "var(--font-text)",
                    letterSpacing: "-0.1px", textDecoration: "none",
                    color: isActive ? "var(--color-on-dark)" : "var(--color-body-muted)",
                    transition: "color 150ms ease",
                  }}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      style={{
                        position: "absolute", bottom: -18, left: 0, right: 0, height: 2,
                        background: "var(--color-primary)", borderRadius: 9999,
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* User menu */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="User menu"
            aria-expanded={menuOpen}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              borderRadius: 9999, padding: "4px 12px",
              background: "transparent", border: "none", cursor: "pointer",
              color: menuOpen ? "var(--color-on-dark)" : "var(--color-body-muted)",
              transition: "color 150ms ease",
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
              background: "var(--color-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "var(--color-on-primary)", fontFamily: "var(--font-text)", fontSize: 11, fontWeight: 600 }}>
                {initials}
              </span>
            </div>
            {!isMobile && (
              <span style={{ fontSize: 13, fontFamily: "var(--font-text)" }}>
                {user?.name?.split(" ")[0] ?? "Account"}
              </span>
            )}
            {!isMobile && (
              <motion.span animate={{ rotate: menuOpen ? 180 : 0 }} transition={{ duration: 0.18 }} style={{ display: "flex" }}>
                <ChevronDown size={14} strokeWidth={2} />
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{
                  position: "absolute", right: 0, top: "100%", marginTop: 8,
                  width: 208, borderRadius: 11, overflow: "hidden",
                  background: "var(--color-surface-tile-1)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                <div style={{ padding: "12px 17px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-on-dark)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.name}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--color-body-muted)", margin: "4px 0 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.email}
                  </p>
                </div>

                <div style={{ padding: 4 }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 12,
                      padding: "8px 12px", borderRadius: 8, border: "none",
                      background: "transparent", cursor: "pointer", textAlign: "left",
                      fontSize: 14, color: "var(--color-status-rejected)",
                      fontFamily: "var(--font-text)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(196,86,79,0.12)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <LogOut size={14} strokeWidth={1.5} />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
