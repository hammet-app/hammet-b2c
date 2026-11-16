import type { LogStats } from "@/lib/api/types";
import { LogLevelBadge, logLevels } from "@/components/hammet/logs/log-level-badge";

type LogOverviewProps = {
  stats: LogStats | null;
  isLoading: boolean;
  error: string;
};

export function LogOverview({ stats, isLoading, error }: LogOverviewProps) {
  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-[92px] animate-pulse rounded-2xl bg-purple-50 dark:bg-[#21183A]" />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <p className="mb-8 rounded-2xl border border-black/[0.06] bg-white px-5 py-4 text-sm text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-slate-400">
        {error || "Overview unavailable."}
      </p>
    );
  }

  return (
    <section aria-label="Log overview" className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <div className="rounded-2xl bg-[#EDE9FE] p-5 text-purple-700 dark:bg-[#21183A] dark:text-purple-300">
        <p className="text-xs font-semibold">Total events</p>
        <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{stats.total.toLocaleString()}</p>
      </div>

      {logLevels.map((level) => (
        <div
          key={level}
          className="rounded-2xl border border-black/[0.06] bg-white p-5 dark:border-white/[0.06] dark:bg-white/[0.03]"
        >
          <LogLevelBadge level={level} />
          <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
            {(stats.byLevel[level] ?? 0).toLocaleString()}
          </p>
        </div>
      ))}
    </section>
  );
}
