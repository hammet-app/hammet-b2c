"use client";

import { useState, useEffect } from "react";
import {
  useTicketStore,
  TicketAttachment,
  HAMMET_SUPPORT_EMAIL,
} from "@/lib/store/use-ticket-store";
import {
  PriorityBadge,
  StatusBadge,
  CategoryBadge,
} from "./ticket-badges";
import {
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Mail,
  ExternalLink,
  ShieldCheck,
  Printer,
  ChevronLeft,
  X,
  FileText,
  FileCode,
  Image as ImageIcon,
  RotateCcw,
} from "lucide-react";
import { GlowingMagicSparkle } from "@/components/ui/vibrant-ai-icons";
import { motion, AnimatePresence } from "motion/react";

export function TicketDetailView() {
  const {
    tickets,
    selectedTicketId,
    setSelectedTicketId,
    updateTicketStatus,
  } = useTicketStore();

  const [copiedId, setCopiedId] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activePreview, setActivePreview] = useState<TicketAttachment | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ticket = tickets.find((t) => t.id === selectedTicketId);

  if (!ticket) {
    return (
      <div className="flex h-full min-h-[480px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-white/10 dark:bg-slate-900/40">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 mb-3">
          <Mail className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No Ticket Selected
        </h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
          Select an inquiry from the left list to view details, track reference ID, and communicate with the Hammet support team via email.
        </p>
      </div>
    );
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(ticket.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(HAMMET_SUPPORT_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const formattedDate = new Date(ticket.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const mailtoUrl = `mailto:${HAMMET_SUPPORT_EMAIL}?subject=${encodeURIComponent(
    `[${ticket.id}] ${ticket.title}`
  )}&body=${encodeURIComponent(
    `Hello Hammet Support Team,\n\nI am following up on my support request [${ticket.id}]:\n\n---\n"${ticket.title}"\n---\n\n(Please write your additional notes or questions here)`
  )}`;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
      {/* ── HEADER PANEL ───────────────────────────────────────── */}
      <div className="p-4 sm:p-5 border-b border-slate-200/70 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Mobile Back Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedTicketId(null)}
              className="lg:hidden p-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {ticket.id}
                </span>
                <button
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
                  title="Copy Ticket ID"
                >
                  {copiedId ? (
                    <>
                      <Check className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-2.5 w-2.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <CategoryBadge category={ticket.category} />
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>

              <h2 className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {ticket.title}
              </h2>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <a
              href={mailtoUrl}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Email Hammet</span>
            </a>

            <button
              onClick={() =>
                updateTicketStatus(
                  ticket.id,
                  ticket.status === "resolved" ? "open" : "resolved"
                )
              }
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                ticket.status === "resolved"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{ticket.status === "resolved" ? "Re-open Inquiry" : "Mark Resolved"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── SCROLLABLE DETAILS BODY ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Support Channel Guidance Notice */}
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-purple-50/30 p-4 dark:border-purple-500/20 dark:from-purple-950/20 dark:via-indigo-950/15 dark:to-purple-950/10">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
              <Mail className="h-4.5 w-4.5" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex flex-wrap items-center gap-2 font-bold text-slate-900 dark:text-white">
                <span>Official Support Desk:</span>
                <span className="font-mono text-purple-700 dark:text-purple-300 select-all">
                  {HAMMET_SUPPORT_EMAIL}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="rounded bg-white/80 dark:bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-white"
                >
                  {copiedEmail ? "Copied!" : "Copy Email"}
                </button>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                All learner tickets are handled directly by our engineering, billing, and curriculum team via email. Responses and updates are sent directly to your registered email address.
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-4 text-[11px] font-medium text-slate-500 dark:text-slate-400 border-t border-purple-500/15 pt-2">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Direct Team Inbox
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-purple-500" />
                  Target Response: {ticket.slaTarget || "Within 24 Hours"}
                </span>
                <span>•</span>
                <span>Submitted: {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Original Inquiry Content Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-white/[0.02]">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3 dark:border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white">Inquiry Details</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 dark:text-slate-400">Ref: {ticket.id}</span>
            </div>
            <span className="text-[11px] text-slate-400">{formattedDate}</span>
          </div>

          <div className="mt-4 whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {ticket.description}
          </div>

          {/* Attachments (if any) */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-3 dark:border-white/5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Attached Files ({ticket.attachments.length})
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {ticket.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  >
                    <FileText className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium truncate max-w-[200px]">{att.name}</span>
                    <span className="text-[10px] text-slate-400">({att.size})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Email Communication Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.02]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Need to add details or follow up?
              </h4>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Send an email directly from your mail client referencing ticket <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{ticket.id}</span> in the subject line.
              </p>
            </div>

            <a
              href={mailtoUrl}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 transition shadow-sm"
            >
              <Mail className="h-4 w-4" />
              <span>Compose Email Follow-up</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
