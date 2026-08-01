"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Bell,
  BarChart3,
  Link2,
  Smartphone,
  Monitor,
  Globe,
} from "lucide-react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";

const PIPELINE = [
  {
    label: "Saved",
    color: "var(--color-status-saved)",
    bg: "rgba(138,138,146,0.14)",
  },
  {
    label: "Applied",
    color: "var(--color-status-applied)",
    bg: "rgba(90,143,214,0.14)",
  },
  {
    label: "Phone Screen",
    color: "var(--color-status-interview)",
    bg: "rgba(192,138,62,0.14)",
  },
  {
    label: "Technical",
    color: "var(--color-status-interview)",
    bg: "rgba(192,138,62,0.18)",
  },
  {
    label: "Final Round",
    color: "var(--color-status-interview)",
    bg: "rgba(192,138,62,0.22)",
  },
  {
    label: "Offer",
    color: "var(--color-status-offer)",
    bg: "rgba(74,157,110,0.14)",
  },
];

const FEATURES = [
  {
    icon: Link2,
    title: "Paste a URL. We do the rest.",
    body: "HireTrack scrapes the job title, company, location, and required skills automatically. No manual entry.",
  },
  {
    icon: Sparkles,
    title: "Know your skill gap before the interview.",
    body: "Match your profile against the role's requirements. See exactly which skills you have and which ones to study.",
  },
  {
    icon: Bell,
    title: "Never ghost a follow-up again.",
    body: "Set a follow-up date on any application. HireTrack emails you the morning it's due — once, not every day.",
  },
  {
    icon: BarChart3,
    title: "Your pipeline, at a glance.",
    body: "Eight stages from Saved to Offer, all in one Kanban board. Drag a card to update the status in one move.",
  },
];

const PLATFORMS = [
  { icon: Globe, label: "Web app" },
  { icon: Monitor, label: "Desktop" },
  { icon: Smartphone, label: "Mobile PWA" },
];

function PipelineViz() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      className="relative mx-auto max-w-2xl w-full shadow-product rounded-2xl overflow-hidden"
    >
      <div className="bg-surface-tile-1 border border-[rgba(255,255,255,0.07)] rounded-2xl p-xl">
        <div className="flex items-center gap-xs mb-xl">
          {[
            "rgba(196,86,79,0.7)",
            "rgba(192,138,62,0.7)",
            "rgba(74,157,110,0.7)",
          ].map((c, i) => (
            <span
              key={i}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: c }}
            />
          ))}
          <div className="flex-1 mx-lg h-6 rounded-md bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
            <span className="text-fine-print text-body-muted opacity-50">
              hiretrack.app/applications
            </span>
          </div>
        </div>

        <div className="flex gap-sm overflow-hidden">
          {PIPELINE.map((stage, i) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.6 + i * 0.1,
                duration: 0.45,
                ease: "easeOut",
              }}
              className="flex flex-col gap-sm min-w-[130px] flex-shrink-0"
            >
              <div className="flex items-center justify-between px-xs">
                <span
                  className="text-fine-print font-semibold"
                  style={{ color: stage.color }}
                >
                  {stage.label}
                </span>
                <span className="text-fine-print text-body-muted opacity-40">
                  {i === 0 ? 4 : i === 1 ? 7 : i === 2 ? 3 : i === 3 ? 2 : 1}
                </span>
              </div>
              <div
                className="rounded-xl border-2 border-dashed p-xs flex flex-col gap-xs min-h-[120px]"
                style={{
                  borderColor: `${stage.color}33`,
                  borderTopColor: stage.color,
                  borderTopStyle: "solid",
                  borderTopWidth: "2px",
                }}
              >
                {[...Array(i === 1 ? 2 : 1)].map((_, ci) => (
                  <motion.div
                    key={ci}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 + ci * 0.08 }}
                    className="rounded-lg p-xs flex flex-col gap-xxs"
                    style={{ backgroundColor: stage.bg }}
                  >
                    <div className="h-2 rounded bg-[rgba(255,255,255,0.15)] w-3/4" />
                    <div className="h-1.5 rounded bg-[rgba(255,255,255,0.08)] w-1/2" />
                    <div className="flex items-center gap-xxs mt-xxs">
                      <div
                        className="h-1 rounded-full flex-1"
                        style={{ backgroundColor: `${stage.color}44` }}
                      />
                      <span
                        className="text-[8px] font-semibold"
                        style={{ color: stage.color }}
                      >
                        {60 + ((i * 7 + ci * 5) % 35)}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
  index,
}: {
  icon: typeof Link2;
  title: string;
  body: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: "easeOut", delay: (index % 2) * 0.1 }}
      className={clsx(
        "rounded-2xl p-xl flex flex-col gap-lg",
        "bg-surface-tile-1 border border-[rgba(255,255,255,0.06)]",
        "hover:border-[rgba(255,255,255,0.1)] transition-colors duration-300",
      )}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: "rgba(0,102,204,0.18)" }}
      >
        <Icon className="w-5 h-5 text-primary-on-dark" strokeWidth={1.75} />
      </div>
      <div className="flex flex-col gap-sm">
        <h3 className="font-display font-semibold text-tagline text-on-dark leading-snug">
          {title}
        </h3>
        <p className="font-text text-body text-body-muted leading-relaxed">
          {body}
        </p>
      </div>
    </motion.div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45 }}
      className="flex flex-col items-center text-center gap-xxs"
    >
      <span
        className="font-display font-semibold text-on-dark"
        style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
      >
        {value}
      </span>
      <span className="text-caption text-body-muted">{label}</span>
    </motion.div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, -40]);

  return (
    <div className="bg-surface-black min-h-screen overflow-x-hidden">
      {/* Global nav */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-surface-black/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1069px] mx-auto px-lg h-14 flex items-center justify-between">
          <div className="flex items-center gap-xs">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-on-primary font-display font-semibold text-sm">
                H
              </span>
            </div>
            <span className="font-display font-semibold text-on-dark text-[15px] tracking-tight">
              HireTrack
            </span>
          </div>
          <div className="flex items-center gap-sm">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <span className="text-body-muted hover:text-on-dark transition-colors">
                  Sign in
                </span>
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex flex-col items-center justify-center px-lg pt-14 pb-xxl overflow-hidden"
      >
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(0,102,204,0.22) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.28, 0.15] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(41,151,255,0.18) 0%, transparent 70%)",
          }}
        />

        {/* w-full added here so the max-w-4xl cap actually has room to apply,
            instead of the flex column shrinking every child to content width */}
        <div className="relative z-10 flex flex-col items-center text-center gap-xl max-w-4xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-xs px-md py-xs rounded-pill border border-[rgba(0,102,204,0.4)] bg-[rgba(0,102,204,0.1)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary-on-dark animate-pulse" />
            <span className="text-caption text-primary-on-dark font-medium tracking-tight">
              Job search, finally organized
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-semibold text-on-dark leading-[1.04] tracking-[-0.5px] w-full"
            style={{ fontSize: "clamp(40px, 7vw, 72px)" }}
          >
            Stop visiting <br className="hidden tablet:block" />
            twelve tabs.{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary-on-dark) 0%, #64b5ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Start tracking.
            </span>
          </motion.h1>

          {/* THE FIX: w-full + max-w-xl + mx-auto together. Under flex-col
              items-center, a block with only max-w-xl shrinks to its content
              width (one word per line). w-full forces it to fill the flex
              container first, THEN max-w-xl caps that width, THEN mx-auto
              centers the capped box. All three classes are required together. */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32 }}
            style={{
              fontFamily: "var(--font-text)",
              fontWeight: 300,
              color: "var(--color-body-muted)",
              lineHeight: 1.6,
              fontSize: "clamp(17px, 2.5vw, 21px)",
              width: "100%",
              maxWidth: "576px",
              margin: "0 auto",
              display: "block",
            }}
          >
            HireTrack keeps every application, skill match, and follow-up in one
            place — so you can focus on landing the job, not managing
            spreadsheets.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.44 }}
            className="flex flex-wrap items-center justify-center gap-sm"
          >
            <Link href="/register">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={2} />}
              >
                Start for free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                <span className="text-body-muted">Sign in</span>
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex items-center gap-lg"
          >
            {PLATFORMS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-xs text-fine-print text-body-muted opacity-60"
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                {label}
              </div>
            ))}
          </motion.div>

          <div className="w-full mt-md">
            <PipelineViz />
          </div>
        </div>
      </motion.section>

      {/* Stats strip */}
      <section className="border-y border-[rgba(255,255,255,0.06)] py-xl px-lg">
        <div className="max-w-[1069px] mx-auto grid grid-cols-3 gap-lg">
          <StatItem value="8" label="Pipeline stages" />
          <StatItem value="100%" label="Free to use" />
          <StatItem value="0" label="Spreadsheets needed" />
        </div>
      </section>

      {/* Feature tiles */}
      <section className="py-section px-lg">
        <div className="max-w-[1069px] mx-auto flex flex-col gap-xxl">
          <div className="flex flex-col items-center text-center gap-md w-full">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-display font-semibold text-on-dark w-full"
              style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
            >
              Everything your job search needs.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-body text-body-muted leading-relaxed font-light"
              style={{
                width: "100%",
                maxWidth: "512px",
                margin: "0 auto",
                display: "block",
              }}
            >
              Built by a job seeker, for job seekers.
            </motion.p>
          </div>

          <div className="grid tablet:grid-cols-2 gap-md">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-section px-lg">
        <div className="max-w-[1069px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className={clsx(
              "rounded-2xl p-xxl",
              "bg-gradient-to-br from-[rgba(0,102,204,0.28)] to-[rgba(41,151,255,0.10)]",
              "border border-[rgba(0,102,204,0.3)]",
              "flex flex-col items-center text-center gap-xl",
            )}
          >
            <div
              className="flex flex-col gap-md text-center"
              style={{ width: "100%", maxWidth: "512px", margin: "0 auto" }}
            >
              <h2
                className="font-display font-semibold text-on-dark"
                style={{
                  fontSize: "clamp(28px, 4.5vw, 40px)",
                  width: "100%",
                  display: "block",
                }}
              >
                Your next offer is one organized search away.
              </h2>
              <p
                className="text-body text-body-muted font-light leading-relaxed"
                style={{ width: "100%", display: "block" }}
              >
                Join the job seekers who stopped losing track of applications
                and started landing interviews.
              </p>
            </div>
            <Link href="/register">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={2} />}
              >
                Create your free account
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] py-xl px-lg">
        <div className="max-w-[1069px] mx-auto flex items-center justify-between flex-wrap gap-md">
          <div className="flex items-center gap-xs">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-on-primary font-display font-semibold text-xs">
                H
              </span>
            </div>
            <span className="font-display font-semibold text-on-dark text-[13px] tracking-tight">
              HireTrack
            </span>
          </div>
          <p className="text-fine-print text-body-muted opacity-40">
            © {new Date().getFullYear()} HireTrack. Built for job seekers.
          </p>
          <div className="flex items-center gap-lg">
            <Link
              href="/login"
              className="text-fine-print text-body-muted hover:text-on-dark transition-colors duration-150"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-fine-print text-primary-on-dark hover:opacity-80 transition-opacity duration-150"
            >
              Get started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
