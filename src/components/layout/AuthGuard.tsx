"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

interface AuthGuardProps {
  children: React.ReactNode;
}

// Static-export constraint: Next.js middleware can't run on a static site, so
// route protection has to happen client-side on mount. The consequence is a
// brief render cycle before the redirect fires — the loading state below
// prevents a flash of protected content during that window.
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isTokenExpired } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || isTokenExpired()) {
      router.replace("/login");
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, isTokenExpired, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Animated logo mark */}
          <motion.div
            className="w-12 h-12 rounded-xl bg-surface-black flex items-center justify-center"
            animate={{
              scale: [1, 1.06, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-on-dark font-display font-semibold text-lg tracking-tight">
              H
            </span>
          </motion.div>
          <motion.p
            className="text-caption text-ink-muted-48"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading your workspace…
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
