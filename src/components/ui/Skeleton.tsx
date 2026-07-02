import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
  // Convenience shapes so callers don't have to pass raw className every time
  variant?: "text" | "title" | "card" | "pill" | "circle";
}

const variantClasses = {
  text: "h-4 w-full rounded-xs",
  title: "h-7 w-48 rounded-xs",
  card: "h-32 w-full rounded-lg",
  pill: "h-6 w-16 rounded-pill",
  circle: "h-10 w-10 rounded-full",
};

export function Skeleton({ variant = "text", className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden bg-canvas-parchment",
        variantClasses[variant],
        className
      )}
      aria-hidden="true"
    >
      {/* Shimmer sweep */}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
        }}
      />
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

// Pre-composed skeleton layouts for common page sections
export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-hairline bg-canvas p-lg flex flex-col gap-sm">
      <Skeleton variant="pill" className="w-20" />
      <Skeleton variant="title" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
      <div className="flex gap-xs mt-xxs">
        <Skeleton variant="pill" />
        <Skeleton variant="pill" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="rounded-lg border border-hairline bg-canvas p-lg flex flex-col gap-xs">
      <Skeleton variant="text" className="w-24 h-3" />
      <Skeleton variant="title" className="w-16 h-9" />
      <Skeleton variant="text" className="w-32 h-3" />
    </div>
  );
}
