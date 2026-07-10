"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";
import { clsx } from "clsx";

const TABS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: BriefcaseBusiness },
  { href: "/skills", label: "Skills", icon: Sparkles },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    // Visible only below the doc's 834px tablet-lg breakpoint
    <nav
      aria-label="Mobile navigation"
      className={clsx(
        "tablet-lg:hidden",
        "fixed bottom-0 left-0 right-0 z-30",
        "bg-surface-black/90 backdrop-blur-xl",
        "border-t border-[rgba(255,255,255,0.08)]",
        // Safe area inset for iPhone home indicator
        "pb-[env(safe-area-inset-bottom)]"
      )}
    >
      <div className="flex items-stretch h-14">
        {TABS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-[3px] relative"
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active pill indicator behind icon */}
              {isActive && (
                <motion.span
                  layoutId="mobile-tab-bg"
                  className="absolute inset-x-3 inset-y-1.5 rounded-lg bg-[rgba(255,255,255,0.06)]"
                  transition={{ type: "spring", stiffness: 500, damping: 42 }}
                />
              )}

              <motion.span
                animate={{
                  color: isActive
                    ? "var(--color-primary-on-dark)"
                    : "var(--color-body-muted)",
                  scale: isActive ? 1.08 : 1,
                }}
                transition={{ duration: 0.18 }}
                className="relative z-10"
              >
                <Icon
                  className="w-5 h-5"
                  strokeWidth={isActive ? 2 : 1.5}
                />
              </motion.span>

              <motion.span
                animate={{
                  color: isActive
                    ? "var(--color-primary-on-dark)"
                    : "var(--color-body-muted)",
                  fontWeight: isActive ? 600 : 400,
                }}
                className="relative z-10 text-[10px] font-text tracking-tight"
              >
                {label}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
