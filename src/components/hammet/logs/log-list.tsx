import type { LogSummary } from "@/lib/api/types";
import { LogLevelBadge } from "@/components/hammet/logs/log-level-badge";

export function formatLogTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const columnsClassName =
  "md:grid md:grid-cols-[168px_88px_minmax(0,1.4fr)_minmax(0,1fr)_64px] md:items-center md:gap-4";

type LogListProps = {
  logs: LogSummary[];
  selectedId: string | null;
  onSelect: (log: LogSummary) => void;
};

export function LogList({ logs, selectedId, onSelect }: LogListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white dark:border-white/[0.06] dark:bg-white/[0.03]">
      <div
        className={`hidden border-b border-black/[0.06] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:border-white/[0.06] dark:text-slate-500 ${columnsClassName}`}
      >
        <span>Time</span>
        <span>Level</span>
        <span>Event</span>
        <span>Request</span>
        <span className="text-right">Status</span>
      </div>

      <ul className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
        {logs.map((log) => (
          <li key={log.id}>
            <button
              type="button"
              onClick={() => onSelect(log)}
              aria-label={`View ${log.level} log ${log.event} from ${formatLogTime(log.timestamp)}`}
              className={[
                "block w-full px-5 py-4 text-left transition hover:bg-purple-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-500 sm:px-6 dark:hover:bg-white/[0.04] dark:focus-visible:ring-cyan-400",
                columnsClassName,
                selectedId === log.id ? "bg-purple-50/60 dark:bg-white/[0.04]" : "",
              ].join(" ")}
            >
              <span className="flex items-center justify-between gap-3 md:contents">
                <time dateTime={log.timestamp} className="text-xs text-slate-500 dark:text-slate-400">
                  {formatLogTime(log.timestamp)}
                </time>
                <span>
                  <LogLevelBadge level={log.level} />
                </span>
              </span>

              <span className="mt-2 block min-w-0 md:mt-0">
                <span className="block truncate text-sm font-semibold">{log.event}</span>
                <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">{log.message}</span>
              </span>

              <span className="mt-2 block min-w-0 text-xs md:mt-0">
                {log.method || log.path ? (
                  <span className="block truncate">
                    {log.method && <span className="font-semibold">{log.method} </span>}
                    <span className="text-slate-600 dark:text-slate-300">{log.path}</span>
                  </span>
                ) : (
                  <span className="block text-slate-400">No request</span>
                )}
                {log.userId && (
                  <span className="mt-0.5 block truncate text-slate-500 dark:text-slate-400">User {log.userId}</span>
                )}
              </span>

              <span className="mt-2 block text-xs font-semibold md:mt-0 md:text-right">
                <span className="font-normal text-slate-400 md:hidden">Status </span>
                {log.statusCode ?? <span className="font-normal text-slate-400">—</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
