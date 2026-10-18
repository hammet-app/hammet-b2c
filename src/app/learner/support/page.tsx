"use client";

import { useTicketStore } from "@/lib/store/use-ticket-store";
import { TicketStats } from "@/components/support/ticket-stats";
import { TicketList } from "@/components/support/ticket-list";
import { TicketDetailView } from "@/components/support/ticket-detail-view";
import { CreateTicketModal } from "@/components/support/create-ticket-modal";
import {
  LifeBuoy,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Server,
  HelpCircle,
} from "lucide-react";
import { motion } from "motion/react";

export default function SupportPage() {
  const { setIsCreateModalOpen } = useTicketStore();

  return (
    <div className="min-h-screen px-5 sm:px-7 lg:px-9 py-6 sm:py-8 font-poppins">
      <div className="mx-auto max-w-[1440px] space-y-5">
        {/* ── BREADCRUMB & HEADER ────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              <LifeBuoy className="h-3.5 w-3.5" />
              <span>Learner Support</span>
            </div>

            <h1 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Support Tickets
            </h1>

            <p className="mt-1 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 max-w-xl font-sans leading-relaxed">
              Need help? Submit a ticket and our team will assist you with courses, certificates, billing, or account issues.
            </p>
          </div>

          {/* Primary Create Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 dark:bg-purple-800/80 dark:hover:bg-purple-750 dark:border dark:border-purple-500/30 dark:shadow-none transition"
            >
              <Plus className="h-4 w-4" />
              <span>New Ticket</span>
            </button>
          </div>
        </div>

        {/* ── KPI STATS CARDS ───────────────────────────────────────────── */}
        <TicketStats />

        {/* ── MASTER-DETAIL TICKET WORKBENCH ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[600px] sm:h-[630px] xl:h-[660px]">
          {/* Left Column: Ticket List (Search, Filters, Cards) */}
          <div className="lg:col-span-5 xl:col-span-4 h-full">
            <TicketList />
          </div>

          {/* Right Column: Active Ticket Digital Record & Timeline */}
          <div className="lg:col-span-7 xl:col-span-8 h-full">
            <TicketDetailView />
          </div>
        </div>

        {/* ── CREATE TICKET MODAL ───────────────────────────────────────── */}
        <CreateTicketModal />
      </div>
    </div>
  );
}

