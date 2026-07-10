"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Applications" },
  { href: "/skills", label: "Skills" },
];

export function TopNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const logout = useLogout();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Frosted glass effect on scroll — same pattern Apple.com uses
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close dropdown on outside click
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
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={clsx(
        // Black global nav — explicitly required by design doc
        "fixed top-0 left-0 right-0 z-30",
        "bg-surface-black",
        "transition-shadow duration-300",
        scrolled && "shadow-[0_1px_0_rgba(255,255,255,0.08)]"
      )}
    >
      <div className="max-w-[1069px] mx-auto px-lg h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-xs group"
          aria-label="HireTrack home"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-7 h-7 rounded-md bg-primary flex items-center justify-center"
          >
            <span className="text-on-primary font-display font-semibold text-sm">
              H
            </span>
          </motion.div>
          <span className="font-display font-semibold text-on-dark text-[15px] tracking-tight">
            HireTrack
          </span>
        </Link>

        {/* Nav links — hidden on mobile (MobileNav handles that) */}
        <nav className="hidden tablet-lg:flex items-center gap-xl" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "relative text-[13px] font-text tracking-tight transition-colors duration-150",
                  isActive ? "text-on-dark" : "text-body-muted hover:text-on-dark"
                )}
              >
                {label}
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User menu */}
        <div ref={menuRef} className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="User menu"
            aria-expanded={menuOpen}
            className={clsx(
              "flex items-center gap-xs rounded-pill px-sm py-xxs",
              "transition-colors duration-150",
              "text-body-muted hover:text-on-dark",
              menuOpen && "text-on-dark"
            )}
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-on-primary font-text text-[11px] font-semibold">
                {initials}
              </span>
            </div>
            <span className="hidden tablet-lg:block text-[13px] font-text tracking-tight">
              {user?.name?.split(" ")[0] ?? "Account"}
            </span>
            <motion.span
              animate={{ rotate: menuOpen ? 180 : 0 }}
              transition={{ duration: 0.18 }}
            >
              <ChevronDown className="w-3.5 h-3.5 hidden tablet-lg:block" strokeWidth={2} />
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={clsx(
                  "absolute right-0 top-full mt-xs",
                  "w-52 rounded-lg overflow-hidden",
                  "bg-surface-tile-1 border border-[rgba(255,255,255,0.08)]",
                  "shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                )}
              >
                {/* User info */}
                <div className="px-md py-sm border-b border-[rgba(255,255,255,0.08)]">
                  <p className="text-caption-strong text-on-dark truncate">
                    {user?.name}
                  </p>
                  <p className="text-fine-print text-body-muted truncate mt-xxs">
                    {user?.email}
                  </p>
                </div>

                {/* Menu items */}
                <div className="p-xxs">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className={clsx(
                      "w-full flex items-center gap-sm px-sm py-xs rounded-md",
                      "text-caption text-status-rejected",
                      "hover:bg-[rgba(196,86,79,0.12)]",
                      "transition-colors duration-100 text-left"
                    )}
                  >
                    <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
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
