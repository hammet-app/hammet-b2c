"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, RefreshCw, ScrollText } from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { ApiError } from "@/lib/api/api-client";
import { getHammetLogStats, getHammetLogs } from "@/lib/api/hammet";
import type { LogStats, LogSummary, Pagination } from "@/lib/api/types";
import { canViewLogs } from "@/lib/utils/roles";
import { Alert } from "@/components/ui";
import { Notice, SessionExpiredNotice } from "@/components/hammet/admin-form";
import { LogDetailSheet } from "@/components/hammet/logs/log-detail-sheet";
import {
  LogFilters,
  emptyLogFilters,
  type LogFilterValues,
} from "@/components/hammet/logs/log-filters";
import { LogList } from "@/components/hammet/logs/log-list";
import { LogOverview } from "@/components/hammet/logs/log-overview";

const PAGE_SIZE = 20;

type ListError = {
  title: string;
  message: string;
};

function toStartOfDayIso(date: string) {
  return date ? new Date(`${date}T00:00:00`).toISOString() : null;
}

function toEndOfDayIso(date: string) {
  return date ? new Date(`${date}T23:59:59.999`).toISOString() : null;
}

function describeListError(err: unknown): ListError {
  if (!(err instanceof ApiError)) {
    return {
      title: "Couldn't reach the server",
      message: "Check your connection and try again.",
    };
  }
  if (err.notFound) {
    return {
      title: "Logs aren't available yet",
      message: "The logs service hasn't been connected. Logs will appear here once it is.",
    };
  }
  if (err.forbidden) {
    return {
      title: "Log access required",
      message: "Your account doesn't have permission to view logs.",
    };
  }
  if (err.validation || err.is(400)) {
    return { title: "Invalid filters", message: err.message };
  }
  return { title: "Error loading logs", message: err.message };
}

export default function HammetLogsPage() {
  const { user, accessToken, refreshToken, isLoading: authLoading } = useAuth();
  const canView = canViewLogs(user);

  const [filters, setFilters] = useState<LogFilterValues>(emptyLogFilters);
  const [search, setSearch] = useState("");
  const [event, setEvent] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const [logs, setLogs] = useState<LogSummary[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ListError | null>(null);

  const [stats, setStats] = useState<LogStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const [selectedLog, setSelectedLog] = useState<LogSummary | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const dateError =
    filters.startDate && filters.endDate && filters.endDate < filters.startDate
      ? "The end date must be on or after the start date."
      : "";
  const startDate = toStartOfDayIso(filters.startDate);
  const endDate = toEndOfDayIso(filters.endDate);
  const hasActiveFilters = Boolean(
    search || event || filters.level || filters.startDate || filters.endDate,
  );
  const canClear = (Object.keys(emptyLogFilters) as (keyof LogFilterValues)[]).some(
    (key) => filters[key] !== emptyLogFilters[key],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(filters.search.trim());
      setEvent(filters.event.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters.search, filters.event]);

  useEffect(() => {
    if (!accessToken || !canView || dateError) return;

    const token = accessToken;
    let active = true;
    async function loadLogs() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getHammetLogs(
          {
            page,
            pageSize: PAGE_SIZE,
            level: filters.level || null,
            event: event || null,
            search: search || null,
            startDate,
            endDate,
            order: filters.order,
          },
          token,
          refreshToken ?? (async () => null),
        );
        if (!active) return;
        const totalPages = response.pagination.totalPages;
        if (totalPages > 0 && page > totalPages) {
          setPage(totalPages);
          return;
        }
        setLogs(response.logs);
        setPagination(response.pagination);
      } catch (err) {
        if (active) {
          setLogs([]);
          setPagination(null);
          setError(describeListError(err));
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadLogs();
    return () => {
      active = false;
    };
  }, [
    accessToken,
    refreshToken,
    canView,
    page,
    search,
    event,
    filters.level,
    filters.order,
    startDate,
    endDate,
    dateError,
    reloadKey,
  ]);

  useEffect(() => {
    if (!accessToken || !canView || dateError) return;

    const token = accessToken;
    let active = true;
    async function loadStats() {
      setStatsLoading(true);
      setStatsError("");
      try {
        const response = await getHammetLogStats(
          { startDate, endDate },
          token,
          refreshToken ?? (async () => null),
        );
        if (active) setStats(response);
      } catch (err) {
        if (active) {
          setStats(null);
          setStatsError(
            err instanceof ApiError && err.notFound
              ? "Overview isn't available yet."
              : "Overview couldn't be loaded.",
          );
        }
      } finally {
        if (active) setStatsLoading(false);
      }
    }

    void loadStats();
    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, canView, startDate, endDate, dateError, reloadKey]);

  function handleFilterChange(patch: Partial<LogFilterValues>) {
    setFilters((current) => ({ ...current, ...patch }));
    if ("level" in patch || "startDate" in patch || "endDate" in patch || "order" in patch) {
      setPage(1);
    }
  }

  function handleClearFilters() {
    setFilters(emptyLogFilters);
    setSearch("");
    setEvent("");
    setPage(1);
  }

  function handleSelect(log: LogSummary) {
    setSelectedLog(log);
    setSheetOpen(true);
  }

  if (!authLoading && !accessToken) {
    return <SessionExpiredNotice />;
  }

  if (!authLoading && !canView) {
    return (
      <Notice title="Log access required">
        Logs are available to Hammet platform administrators.
      </Notice>
    );
  }

  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1280px]">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">
              Platform administration
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
              Logs
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Investigate errors and activity reported across Hammet.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            disabled={isLoading || Boolean(dateError)}
            className="flex items-center gap-2 rounded-xl border border-black/[0.08] px-5 py-3 text-sm font-semibold transition hover:bg-white disabled:opacity-50 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </motion.section>

        <LogOverview stats={stats} isLoading={statsLoading} error={statsError} />

        <LogFilters
          values={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
          canClear={canClear}
          dateError={dateError}
        />

        {error ? (
          <Alert title={error.title} variant="error">
            {error.message}
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="ml-2 font-semibold text-purple-700 hover:underline dark:text-cyan-400"
            >
              Try again
            </button>
          </Alert>
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-[76px] animate-pulse rounded-2xl bg-purple-50 dark:bg-[#21183A]"
              />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="rounded-[28px] border border-black/[0.06] bg-white p-12 text-center dark:border-white/[0.06] dark:bg-white/[0.03]">
            <ScrollText className="mx-auto h-9 w-9 text-slate-400" />
            <h2 className="mt-4 text-lg font-semibold">
              {hasActiveFilters ? "No logs match your filters" : "No logs yet"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {hasActiveFilters
                ? "Try a different search, level or date range."
                : "Logged events will appear here."}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 text-sm font-semibold text-purple-700 hover:underline dark:text-cyan-400"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <LogList
            logs={logs}
            selectedId={sheetOpen ? selectedLog?.id ?? null : null}
            onSelect={handleSelect}
          />
        )}

        {pagination && !error && logs.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Page {pagination.page} of {Math.max(1, totalPages)} · {pagination.total.toLocaleString()} logs
            </span>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1 || isLoading}
                  className="flex items-center gap-1 rounded-xl border border-black/[0.08] px-3 py-2 text-xs font-semibold transition hover:bg-white disabled:opacity-40 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page >= totalPages || isLoading}
                  className="flex items-center gap-1 rounded-xl border border-black/[0.08] px-3 py-2 text-xs font-semibold transition hover:bg-white disabled:opacity-40 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <LogDetailSheet log={selectedLog} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
