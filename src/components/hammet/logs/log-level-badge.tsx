import type { LogLevel } from "@/lib/api/types";
import { cn } from "@/lib/utils/utils";

export const logLevels: LogLevel[] = ["critical", "error", "warning", "info", "debug"];

export const logLevelLabels: Record<LogLevel, string> = {
  critical: "Critical",
  error: "Error",
  warning: "Warning",
  info: "Info",
  debug: "Debug",
};

const levelClassNames: Record<LogLevel, string> = {
  critical: "bg-danger text-white",
  error: "bg-danger-light text-danger-dark",
  warning: "bg-warning-light text-warning-dark",
  info: "bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300",
  debug: "bg-slate-100 text-slate-600 dark:bg-white/[0.08] dark:text-slate-300",
};

export function LogLevelBadge({ level, className }: { level: LogLevel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        levelClassNames[level] ?? levelClassNames.debug,
        className,
      )}
    >
      {logLevelLabels[level] ?? level}
    </span>
  );
}
