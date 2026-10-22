"use client";

import {
  TicketPriority,
  TicketStatus,
  TicketCategory,
} from "@/lib/store/use-ticket-store";
import {
  AlertTriangle,
  Flame,
  Clock,
  CheckCircle2,
  Lock,
  Code2,
  CreditCard,
  ShieldCheck,
  BookOpen,
  Award,
  HelpCircle,
} from "lucide-react";

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  switch (priority) {
    case "critical":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-bold text-rose-600 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
          </span>
          Urgent
        </span>
      );
    case "high":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-400">
          <Flame className="h-3 w-3" />
          High
        </span>
      );
    case "medium":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-medium text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-500/15 dark:text-cyan-300">
          <Clock className="h-3 w-3" />
          Medium
        </span>
      );
    case "low":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
          Low
        </span>
      );
  }
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  switch (status) {
    case "open":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-bold text-blue-600 dark:border-blue-400/30 dark:bg-blue-500/15 dark:text-blue-400">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Open
        </span>
      );
    case "in-progress":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 dark:border-purple-400/30 dark:bg-purple-500/15 dark:text-purple-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-500" />
          In Progress
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-300">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      );
    case "resolved":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-50/70 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          Resolved
        </span>
      );
    case "closed":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
          <Lock className="h-3 w-3" />
          Closed
        </span>
      );
  }
}

export function CategoryBadge({ category }: { category: TicketCategory }) {
  switch (category) {
    case "technical":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/50 dark:border-purple-500/20">
          <Code2 className="h-3 w-3" />
          Technical
        </span>
      );
    case "billing":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-500/20">
          <CreditCard className="h-3 w-3" />
          Billing
        </span>
      );
    case "account":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/50 dark:border-amber-500/20">
          <ShieldCheck className="h-3 w-3" />
          Account
        </span>
      );
    case "courseware":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-cyan-50 px-2 py-0.5 text-[11px] font-medium text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border border-cyan-200/50 dark:border-cyan-500/20">
          <BookOpen className="h-3 w-3" />
          Course &amp; Content
        </span>
      );
    case "certification":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-500/20">
          <Award className="h-3 w-3" />
          Certificates
        </span>
      );
    case "general":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-white/10">
          <HelpCircle className="h-3 w-3" />
          General
        </span>
      );
  }
}

