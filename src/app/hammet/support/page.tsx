"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  LifeBuoy,
  Mail,
  RotateCw,
} from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { getHammetSupportTickets } from "@/lib/api/hammet";
import type {
  Pagination,
  SupportTicketListItem,
  SupportTicketStatus,
} from "@/lib/api/types";
import { canManageSupport, getInitials } from "@/lib/utils/roles";
import { cn } from "@/lib/utils/utils";
import { Alert } from "@/components/ui";
import {
  Notice,
  SessionExpiredNotice,
} from "@/components/hammet/admin-form";
import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/components/support/ticket-badges";

const PAGE_SIZE = 20;

const STATUS_FILTERS: { id: SupportTicketStatus | "all"; label: string }[] = [
  { id: "all", label: "All tickets" },
  { id: "open", label: "Open" },
  { id: "in-progress", label: "In progress" },
  { id: "pending", label: "Pending" },
  { id: "resolved", label: "Resolved" },
  { id: "closed", label: "Closed" },
];

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HammetSupportPage() {
  const { user, accessToken, refreshToken, isLoading: authLoading } = useAuth();
  const canManage = canManageSupport(user);
  const reduceMotion = useReducedMotion();

  const [statusFilter, setStatusFilter] = useState<SupportTicketStatus | "all">(
    "all",
  );
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const [tickets, setTickets] = useState<SupportTicketListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken || !canManage) return;

    const token = accessToken;
    let active = true;

    async function loadTickets() {
      setIsLoading(true);
      setError("");
      try {
        const response = await getHammetSupportTickets(
          {
            page,
            pageSize: PAGE_SIZE,
            status: statusFilter === "all" ? null : statusFilter,
          },
          token,
          refreshToken ?? (async () => null),
        );
        if (active) {
          setTickets(response.tickets);
          setPagination(response.pagination);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load support tickets.",
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadTickets();
    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, canManage, page, statusFilter, reloadKey]);

  if (!authLoading && !accessToken) {
    return <SessionExpiredNotice />;
  }

  if (!authLoading && !canManage) {
    return (
      <Notice title="Support">
        You do not have access to view learner support tickets.
      </Notice>
    );
  }

  const totalPages = pagination?.totalPages ?? 0;
  const hasFilter = statusFilter !== "all";

  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1050px]">
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">
              Administration
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
              Support
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Read every learner support request, newest first, and filter by
              status to focus on what still needs attention.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {pagination && (
              <span
                aria-live="polite"
                className="flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-slate-300"
              >
                <LifeBuoy className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
                {pagination.total}{" "}
                {pagination.total === 1 ? "ticket" : "tickets"}
              </span>
            )}

            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
            >
              <RotateCw
                className={cn("h-3.5 w-3.5", isLoading && "animate-spin")}
              />
              Refresh
            </button>
          </div>
        </motion.section>

        {/* Status filter */}
        <div
          role="group"
          aria-label="Filter tickets by status"
          className="mb-5 flex gap-1 overflow-x-auto rounded-2xl border border-black/[0.06] bg-white p-1.5 [scrollbar-width:none] dark:border-white/[0.06] dark:bg-white/[0.03]"
        >
          {STATUS_FILTERS.map((filter) => {
            const active = statusFilter === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setStatusFilter(filter.id);
                  setPage(1);
                }}
                className={cn(
                  "relative shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 dark:focus-visible:ring-cyan-400/40",
                  active
                    ? "text-white dark:text-[#24134F]"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="support-status-pill"
                    aria-hidden="true"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                    className="absolute inset-0 rounded-xl bg-[#24134F] shadow-[0_6px_18px_rgba(36,19,79,0.22)] dark:bg-cyan-400 dark:shadow-[0_6px_18px_rgba(34,211,238,0.18)]"
                  />
                )}
                <span className="relative z-10">{filter.label}</span>
              </button>
            );
          })}
        </div>

        {error && (
          <Alert title="Error loading support tickets" variant="error">
            {error}
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[132px] animate-pulse rounded-2xl bg-purple-50 dark:bg-[#21183A]"
              />
            ))}
          </div>
        ) : tickets.length === 0 && !error ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-[28px] border border-black/[0.06] bg-white p-10 text-center dark:border-white/[0.06] dark:bg-white/[0.03]"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
              <Inbox className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold">
              {hasFilter
                ? `No ${STATUS_FILTERS.find((filter) => filter.id === statusFilter)?.label.toLowerCase()} tickets`
                : "No support tickets yet"}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              {hasFilter
                ? "Try another status to see the rest of the tickets."
                : "Learner requests will appear here as soon as they are submitted."}
            </p>
          </motion.div>
        ) : (
          <ul className="space-y-3">
            {tickets.map((ticket, index) => (
              <motion.li
                key={ticket.id}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.24),
                }}
              >
                <article className="group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-5 transition-colors hover:border-purple-200 dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:border-cyan-400/25">
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-purple-500 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-[#EDE9FE] px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-purple-700 dark:bg-[#21183A] dark:text-purple-300">
                          {ticket.id}
                        </span>
                        <PriorityBadge priority={ticket.priority} />
                        <CategoryBadge category={ticket.category} />
                      </div>

                      <h2 className="mt-2.5 text-[15px] font-semibold leading-6 tracking-[-0.01em] text-slate-950 dark:text-white">
                        {ticket.subject}
                      </h2>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-50 text-[10px] font-bold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                            {getInitials(ticket.learner.fullName)}
                          </span>
                          <span className="truncate font-medium text-slate-700 dark:text-slate-200">
                            {ticket.learner.fullName}
                          </span>
                        </span>

                        <a
                          href={`mailto:${ticket.learner.email}`}
                          className="flex min-w-0 items-center gap-1.5 break-all transition-colors hover:text-purple-700 dark:hover:text-cyan-400"
                        >
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          {ticket.learner.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                      <StatusBadge status={ticket.status} />

                      <p className="text-[11px] text-slate-400 sm:text-right">
                        Opened{" "}
                        <time dateTime={ticket.createdAt} suppressHydrationWarning>
                          {formatDate(ticket.createdAt)}
                        </time>
                      </p>

                      {ticket.updatedAt !== ticket.createdAt && (
                        <p className="text-[11px] text-slate-400 sm:text-right">
                          Updated{" "}
                          <time
                            dateTime={ticket.updatedAt}
                            suppressHydrationWarning
                          >
                            {formatDate(ticket.updatedAt)}
                          </time>
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              </motion.li>
            ))}
          </ul>
        )}

        {pagination && !isLoading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Page {pagination.page} of {totalPages}
            </span>

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
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page >= totalPages || isLoading}
                className="flex items-center gap-1 rounded-xl border border-black/[0.08] px-3 py-2 text-xs font-semibold transition hover:bg-white disabled:opacity-40 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
