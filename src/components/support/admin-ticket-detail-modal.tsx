"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import {
  CalendarDays,
  Check,
  Clock3,
  Copy,
  Mail,
  UserRound,
  X,
} from "lucide-react";

import type { SupportTicketListItem } from "@/lib/api/types";
import { getInitials } from "@/lib/utils/roles";
import { CategoryBadge, PriorityBadge, StatusBadge } from "./ticket-badges";

type AdminTicketDetailModalProps = {
  ticket: SupportTicketListItem | null;
  onClose: () => void;
};

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // Clipboard API can be unavailable (insecure context or denied
    // permission); fall back to the legacy selection-based copy.
    try {
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.top = "-1000px";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const succeeded = document.execCommand("copy");
      document.body.removeChild(field);
      return succeeded;
    } catch {
      return false;
    }
  }
}

export function AdminTicketDetailModal({
  ticket,
  onClose,
}: AdminTicketDetailModalProps) {
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const open = ticket !== null;

  useEffect(() => {
    // Defer to the next frame so hydration completes before mounting the
    // portal; this avoids a synchronous state update inside the effect.
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Lenis owns scroll on the root element, so `overflow: hidden` alone does
    // not stop the page behind the dialog from scrolling.
    lenis?.stop();

    // The portal is already committed when this effect runs, so focus can move
    // straight to the close button without waiting for an animation frame.
    closeRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
      restoreFocusRef.current?.focus?.();
      restoreFocusRef.current = null;
    };
  }, [open, onClose, lenis]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {ticket && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[120] flex items-end justify-center overflow-hidden sm:items-center sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-ticket-detail-title"
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-[121] flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-black/[0.06] bg-white shadow-2xl sm:max-h-[88vh] sm:max-w-2xl sm:rounded-3xl dark:border-white/[0.08] dark:bg-[#120D24]"
          >
            {/* Pinned header */}
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-black/[0.06] bg-slate-50/70 px-5 py-4 sm:px-6 dark:border-white/[0.08] dark:bg-white/[0.02]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#EDE9FE] px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-purple-700 dark:bg-[#21183A] dark:text-purple-300">
                    {ticket.id}
                  </span>
                  <StatusBadge status={ticket.status} />
                </div>

                <h2
                  id="admin-ticket-detail-title"
                  className="mt-2 text-base font-semibold leading-6 tracking-[-0.01em] text-slate-950 sm:text-lg dark:text-white"
                >
                  {ticket.subject}
                </h2>
              </div>

              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close ticket details"
                className="shrink-0 rounded-xl border border-black/[0.08] bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white dark:focus-visible:ring-cyan-400/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div
              data-lenis-prevent
              className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6"
            >
              <section
                aria-label="Learner"
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-slate-50/60 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-xs font-bold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                    {getInitials(ticket.learner.fullName)}
                  </span>

                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-slate-900 dark:text-white">
                      <UserRound className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      {ticket.learner.fullName}
                    </p>
                    <a
                      href={`mailto:${ticket.learner.email}`}
                      className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500 transition hover:text-purple-700 dark:text-slate-400 dark:hover:text-cyan-400"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{ticket.learner.email}</span>
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={ticket.category} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </section>

              <section
                aria-label="Ticket timeline"
                className="grid gap-2 sm:grid-cols-2"
              >
                <div className="rounded-2xl border border-black/[0.06] px-4 py-3 dark:border-white/[0.06]">
                  <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    <CalendarDays className="h-3 w-3" />
                    Opened
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                    {formatDateTime(ticket.createdAt)}
                  </p>
                </div>

                <div className="rounded-2xl border border-black/[0.06] px-4 py-3 dark:border-white/[0.06]">
                  <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    <Clock3 className="h-3 w-3" />
                    Last updated
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                    {formatDateTime(ticket.updatedAt)}
                  </p>
                </div>
              </section>

              <section
                aria-label="Learner message"
                className="rounded-2xl border border-black/[0.06] p-4 dark:border-white/[0.06]"
              >
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Learner message
                </h3>

                {ticket.message ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {ticket.message}
                  </p>
                ) : (
                  <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                    The ticket list response does not include the message body.
                    Reply by email and quote{" "}
                    <span className="font-mono font-semibold text-purple-700 dark:text-purple-300">
                      {ticket.id}
                    </span>{" "}
                    to reach the learner with full context.
                  </p>
                )}
              </section>
            </div>

            {/* Pinned footer */}
            <div className="flex shrink-0 flex-col gap-2 border-t border-black/[0.06] bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-white/[0.08] dark:bg-white/[0.02]">
              <CopyTicketId ticketId={ticket.id} />

              <a
                href={`mailto:${ticket.learner.email}?subject=${encodeURIComponent(
                  `Re: ${ticket.id} — ${ticket.subject}`,
                )}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#24134F] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2f1a63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300"
              >
                <Mail className="h-3.5 w-3.5" />
                Reply by email
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function CopyTicketId({ ticketId }: { ticketId: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(async () => {
    const copiedSuccessfully = await copyText(ticketId);

    if (!copiedSuccessfully) return;

    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }, [ticketId]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06] dark:focus-visible:ring-cyan-400/40"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          Reference copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copy reference
        </>
      )}
    </button>
  );
}
