import { FilterX, Search } from "lucide-react";

import type { LogLevel, LogSortOrder } from "@/lib/api/types";
import { inputClassName } from "@/components/layout/hammet/admin-form";
import { logLevelLabels, logLevels } from "@/components/hammet/logs/log-level-badge";

export type LogFilterValues = {
  search: string;
  event: string;
  level: LogLevel | "";
  startDate: string;
  endDate: string;
  order: LogSortOrder;
};

export const emptyLogFilters: LogFilterValues = {
  search: "",
  event: "",
  level: "",
  startDate: "",
  endDate: "",
  order: "desc",
};

type LogFiltersProps = {
  values: LogFilterValues;
  onChange: (patch: Partial<LogFilterValues>) => void;
  onClear: () => void;
  canClear: boolean;
  dateError: string;
};

const fieldClassName = `${inputClassName} bg-white dark:bg-white/[0.03]`;

export function LogFilters({ values, onChange, onClear, canClear, dateError }: LogFiltersProps) {
  return (
    <div className="mb-5 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search logs</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={values.search}
            onChange={(event) => onChange({ search: event.target.value })}
            placeholder="Search message, request ID, path or user email"
            maxLength={200}
            className={`${fieldClassName} pl-11`}
          />
        </label>

        <label className="sm:w-44">
          <span className="sr-only">Filter by level</span>
          <select
            value={values.level}
            onChange={(event) => onChange({ level: event.target.value as LogLevel | "" })}
            className={fieldClassName}
          >
            <option value="">All levels</option>
            {logLevels.map((level) => (
              <option key={level} value={level}>
                {logLevelLabels[level]}
              </option>
            ))}
          </select>
        </label>

        <label className="sm:w-44">
          <span className="sr-only">Sort order</span>
          <select
            value={values.order}
            onChange={(event) => onChange({ order: event.target.value as LogSortOrder })}
            className={fieldClassName}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Filter by event</span>
          <input
            value={values.event}
            onChange={(event) => onChange({ event: event.target.value })}
            placeholder="Event name, e.g. payment_failed"
            maxLength={100}
            className={fieldClassName}
          />
        </label>

        <label className="relative sm:w-48">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            From
          </span>
          <input
            type="date"
            value={values.startDate}
            max={values.endDate || undefined}
            onChange={(event) => onChange({ startDate: event.target.value })}
            aria-label="From date"
            aria-invalid={Boolean(dateError)}
            className={`${fieldClassName} pl-14`}
          />
        </label>

        <label className="relative sm:w-48">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            To
          </span>
          <input
            type="date"
            value={values.endDate}
            min={values.startDate || undefined}
            onChange={(event) => onChange({ endDate: event.target.value })}
            aria-label="To date"
            aria-invalid={Boolean(dateError)}
            className={`${fieldClassName} pl-11`}
          />
        </label>

        <button
          type="button"
          onClick={onClear}
          disabled={!canClear}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-black/[0.08] px-4 py-3 text-xs font-semibold transition hover:bg-white disabled:opacity-40 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
        >
          <FilterX className="h-3.5 w-3.5" />
          Clear filters
        </button>
      </div>

      {dateError && (
        <p role="alert" className="text-xs font-medium text-danger-dark">
          {dateError}
        </p>
      )}
    </div>
  );
}
