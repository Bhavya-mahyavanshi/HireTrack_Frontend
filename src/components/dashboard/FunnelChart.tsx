"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FunnelData, ApplicationStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/components/ui/StatusBadge";
import { clsx } from "clsx";

interface FunnelChartProps {
  data: FunnelData;
}

// Forward-path stages in order — the funnel.
// REJECTED/WITHDRAWN rendered separately as off-ramp stats below the chart.
const FUNNEL_STAGES: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "PHONE_SCREEN",
  "TECHNICAL",
  "FINAL_ROUND",
  "OFFER",
];

const TERMINAL_STAGES: ApplicationStatus[] = ["REJECTED", "WITHDRAWN"];

const STAGE_COLORS: Record<ApplicationStatus, string> = {
  SAVED: "var(--color-status-saved)",
  APPLIED: "var(--color-status-applied)",
  PHONE_SCREEN: "var(--color-status-interview)",
  TECHNICAL: "var(--color-status-interview)",
  FINAL_ROUND: "var(--color-status-interview)",
  OFFER: "var(--color-status-offer)",
  REJECTED: "var(--color-status-rejected)",
  WITHDRAWN: "var(--color-status-withdrawn)",
};

// Short axis labels so they fit in the bar chart's x-axis
const SHORT_LABELS: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  PHONE_SCREEN: "Phone",
  TECHNICAL: "Tech",
  FINAL_ROUND: "Final",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; payload: { status: ApplicationStatus } }[];
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const { value, payload: item } = payload[0]!;
  return (
    <div
      className={clsx(
        "rounded-lg border border-hairline bg-canvas px-md py-sm",
        "shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
      )}
    >
      <p className="text-caption-strong text-ink">
        {STATUS_LABELS[item.status]}
      </p>
      <p className="text-display-md font-display font-semibold text-ink leading-none mt-xxs">
        {value}
      </p>
      <p className="text-fine-print text-ink-muted-48 mt-xxs">
        application{value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export function FunnelChart({ data }: FunnelChartProps) {
  const byStatus = Object.fromEntries(
    data.map((d) => [d.status, d.count])
  ) as Record<ApplicationStatus, number>;

  const funnelData = FUNNEL_STAGES.map((status) => ({
    status,
    count: byStatus[status] ?? 0,
    label: SHORT_LABELS[status],
  }));

  const terminalData = TERMINAL_STAGES.map((status) => ({
    status,
    count: byStatus[status] ?? 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
      className="rounded-xl border border-hairline bg-canvas p-lg flex flex-col gap-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-tagline text-ink tracking-tight">
            Application Pipeline
          </h2>
          <p className="text-caption text-ink-muted-48 mt-xxs">
            Your job search funnel at a glance
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={funnelData}
            margin={{ top: 4, right: 0, left: -28, bottom: 0 }}
            barCategoryGap="28%"
          >
            <XAxis
              dataKey="label"
              tick={{
                fontFamily: "var(--font-text)",
                fontSize: 11,
                fill: "var(--color-ink-muted-48)",
                letterSpacing: "-0.1px",
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{
                fontFamily: "var(--font-text)",
                fontSize: 11,
                fill: "var(--color-ink-muted-48)",
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0,0,0,0.03)", radius: 6 }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={52}>
              {funnelData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STAGE_COLORS[entry.status]}
                  fillOpacity={entry.count === 0 ? 0.2 : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Terminal off-ramps */}
      {terminalData.some((d) => d.count > 0) && (
        <div className="flex gap-md pt-xs border-t border-hairline">
          {terminalData.map(({ status, count }) => (
            <div key={status} className="flex items-center gap-xs">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: STAGE_COLORS[status] }}
              />
              <span className="text-caption text-ink-muted-48">
                {STATUS_LABELS[status]}:{" "}
                <span className="text-ink font-medium">{count}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
