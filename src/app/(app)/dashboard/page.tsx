"use client";

import { motion } from "framer-motion";
import {
  Send,
  MessageSquare,
  Trophy,
  XCircle,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { UpcomingFollowUps } from "@/components/dashboard/UpcomingFollowUps";
import { StatSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { useAuthStore } from "@/store/authStore";
import {
  useDashboardStats,
  useFunnelData,
  useUpcomingFollowUps,
} from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: funnel, isLoading: funnelLoading } = useFunnelData();
  const { data: upcoming, isLoading: upcomingLoading } = useUpcomingFollowUps();

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-col gap-xxl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-xxs"
      >
        <h1 className="font-display font-semibold text-display-md text-ink tracking-tight">
          {greeting},{" "}
          <span className="text-primary">{firstName}.</span>
        </h1>
        <p className="font-text text-body text-ink-muted-48">
          Here&apos;s where your job search stands today.
        </p>
      </motion.div>

      {statsLoading ? (
        <div className="grid grid-cols-2 desktop-sm:grid-cols-4 gap-md">
          {[...Array(4)].map((_, i) => <StatSkeleton key={i} />)}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 desktop-sm:grid-cols-4 gap-md">
          <StatsCard label="Applied" value={stats.totalApplied} icon={Send} accent="blue" delay={0} />
          <StatsCard label="Interviews" value={stats.totalInterviews} icon={MessageSquare} accent="amber" delay={80} />
          <StatsCard label="Offers" value={stats.totalOffers} icon={Trophy} accent="green" delay={160} />
          <StatsCard label="Rejected" value={stats.totalRejected} icon={XCircle} accent="red" delay={240} />
        </div>
      ) : null}

      <div className="grid desktop-sm:grid-cols-[1fr_340px] gap-lg items-start">
        {funnelLoading ? (
          <div className="rounded-xl border border-hairline bg-canvas p-lg flex flex-col gap-lg">
            <Skeleton variant="title" className="w-48" />
            <Skeleton variant="card" className="h-48" />
          </div>
        ) : funnel ? <FunnelChart data={funnel} /> : null}

        {upcomingLoading ? (
          <div className="rounded-xl border border-hairline bg-canvas p-lg flex flex-col gap-md">
            <Skeleton variant="title" className="w-32" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-md py-sm">
                <Skeleton variant="circle" className="w-2 h-2 rounded-full" />
                <div className="flex-1 flex flex-col gap-xxs">
                  <Skeleton variant="text" className="w-3/4 h-3" />
                  <Skeleton variant="text" className="w-1/2 h-3" />
                </div>
                <Skeleton variant="pill" />
              </div>
            ))}
          </div>
        ) : upcoming ? <UpcomingFollowUps items={upcoming} /> : null}
      </div>

      {stats?.statusBreakdown && stats.statusBreakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-wrap gap-sm"
        >
          {stats.statusBreakdown
            .filter((s) => s.count > 0)
            .map(({ status, count }) => (
              <div
                key={status}
                className="flex items-center gap-xs px-md py-xs rounded-pill border border-hairline bg-canvas text-caption text-ink-muted-48"
              >
                <span className="font-medium text-ink">{count}</span>
                {status.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </div>
            ))}
        </motion.div>
      )}
    </div>
  );
}
