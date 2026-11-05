"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils/utils";

export type SectionTone =
  | "violet"
  | "cyan"
  | "emerald"
  | "amber"
  | "rose"
  | "indigo";

const toneStyles: Record<
  SectionTone,
  { icon: string; pill: string }
> = {
  violet: {
    icon: "border-violet-300/70 bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-violet-500/30 dark:border-violet-400/30",
    pill: "border-violet-200/80 bg-violet-50/90 text-violet-700 dark:border-violet-400/25 dark:bg-violet-500/10 dark:text-violet-200",
  },
  cyan: {
    icon: "border-cyan-300/70 bg-gradient-to-br from-cyan-400 to-sky-600 text-white shadow-cyan-500/30 dark:border-cyan-300/30",
    pill: "border-cyan-200/80 bg-cyan-50/90 text-cyan-700 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-200",
  },
  emerald: {
    icon: "border-emerald-300/70 bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-emerald-500/30 dark:border-emerald-300/30",
    pill: "border-emerald-200/80 bg-emerald-50/90 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-200",
  },
  amber: {
    icon: "border-amber-300/70 bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-amber-500/30 dark:border-amber-300/30",
    pill: "border-amber-200/80 bg-amber-50/90 text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-200",
  },
  rose: {
    icon: "border-rose-300/70 bg-gradient-to-br from-rose-400 to-pink-600 text-white shadow-rose-500/30 dark:border-rose-300/30",
    pill: "border-rose-200/80 bg-rose-50/90 text-rose-700 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-200",
  },
  indigo: {
    icon: "border-indigo-300/70 bg-gradient-to-br from-indigo-500 to-blue-700 text-white shadow-indigo-500/30 dark:border-indigo-400/30",
    pill: "border-indigo-200/80 bg-indigo-50/90 text-indigo-700 dark:border-indigo-400/25 dark:bg-indigo-400/10 dark:text-indigo-200",
  },
};

const sizeStyles = {
  sm: { box: "h-7 w-7 rounded-lg", icon: "h-3.5 w-3.5" },
  md: { box: "h-9 w-9 rounded-xl", icon: "h-4.5 w-4.5" },
  lg: { box: "h-11 w-11 rounded-2xl", icon: "h-5.5 w-5.5" },
} as const;

interface TitleIconProps {
  icon: LucideIcon;
  tone?: SectionTone;
  size?: keyof typeof sizeStyles;
  className?: string;
}

/**
 * Small, colourful icon badge used next to page titles and section headings.
 * The tone prop keeps the hierarchy readable without every badge looking alike.
 */
export function TitleIcon({
  icon: Icon,
  tone = "violet",
  size = "md",
  className,
}: TitleIconProps) {
  const styles = sizeStyles[size];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center border shadow-sm",
        styles.box,
        toneStyles[tone].icon,
        className,
      )}
    >
      <Icon className={styles.icon} strokeWidth={2.4} />
    </span>
  );
}

interface SectionKickerProps {
  icon: LucideIcon;
  tone?: SectionTone;
  children: React.ReactNode;
  className?: string;
}

/** The pill-shaped eyebrow used above headings (e.g. "Project Workspace"). */
export function SectionKicker({
  icon: Icon,
  tone = "violet",
  children,
  className,
}: SectionKickerProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em]",
        toneStyles[tone].pill,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
      <span>{children}</span>
    </div>
  );
}

interface DoodleKickerProps {
  /** A ready-rendered character/doodle icon node. */
  icon: React.ReactNode;
  tone?: SectionTone;
  children: React.ReactNode;
  className?: string;
}

/**
 * Eyebrow pill for the illustrated doodle icon set. Keeps the hand-drawn
 * character icons aligned with the typographic section artwork.
 */
export function DoodleKicker({
  icon,
  tone = "violet",
  children,
  className,
}: DoodleKickerProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 pr-3.5 text-[11px] font-bold uppercase tracking-[0.14em]",
        toneStyles[tone].pill,
        className,
      )}
    >
      <span className="inline-flex shrink-0 items-center justify-center [&>div]:!h-6 [&>div]:!w-6 [&>div]:!shadow-none">
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}
