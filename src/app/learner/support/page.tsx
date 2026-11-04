"use client";

import {
  useTicketStore,
  HAMMET_SUPPORT_EMAIL,
} from "@/lib/store/use-ticket-store";
import { TicketStats } from "@/components/support/ticket-stats";
import { TicketList } from "@/components/support/ticket-list";
import { TicketDetailView } from "@/components/support/ticket-detail-view";
import { CreateTicketModal } from "@/components/support/create-ticket-modal";

import { SectionKicker, TitleIcon } from "@/components/ui/section-title";
import { LifeBuoy, Plus, Mail, Inbox, MessagesSquare } from "lucide-react";

export default function SupportPage() {
  const { setIsCreateModalOpen, selectedTicketId } = useTicketStore();

  return (
    <div className="min-h-screen px-4 sm:px-7 lg:px-9 py-6 sm:py-8 font-poppins">
      <div className="mx-auto max-w-[1440px] space-y-5">
        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <header className="relative overflow-hidden rounded-3xl border border-purple-500/15 bg-gradient-to-br from-white via-purple-50/70 to-cyan-50/50 p-5 shadow-[0_12px_40px_rgba(139,92,246,0.08)] dark:border-white/10 dark:from-[#130E24] dark:via-[#17112C] dark:to-[#0D091A] dark:shadow-[0_16px_48px_rgba(0,0,0,0.35)] sm:p-7 lg:p-9">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />

          <div className="relative grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="max-w-2xl">
              <SectionKicker icon={LifeBuoy} tone="violet">
                Learner Support Desk
              </SectionKicker>

              <h1 className="mt-3 flex items-center gap-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
                <TitleIcon icon={MessagesSquare} tone="cyan" size="lg" />
                <span>Support &amp; Help Desk</span>
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-sans sm:text-[13px]">
                Have a question, technical issue, or billing inquiry? Submit a
                ticket and the backend records it against your learner account.
                Keep the ticket reference for follow-up, or reach the team at{" "}
                <span className="font-semibold text-purple-700 dark:text-purple-300">
                  {HAMMET_SUPPORT_EMAIL}
                </span>
                .
              </p>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/20 transition hover:bg-purple-700 dark:border dark:border-purple-500/30 dark:bg-purple-700 dark:hover:bg-purple-600"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Ticket</span>
                </button>

                <a
                  href={`mailto:${HAMMET_SUPPORT_EMAIL}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/25 bg-white/80 px-4 py-2.5 text-xs font-semibold text-purple-700 transition hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-purple-200 dark:hover:bg-white/[0.08]"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email support directly</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* ── KPI STATS CARDS ───────────────────────────────────────────── */}
        <TicketStats />

        {/* ── TICKET WORKBENCH ──────────────────────────────────────────── */}
        <section aria-labelledby="tickets-heading">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2
              id="tickets-heading"
              className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white"
            >
              <TitleIcon icon={Inbox} tone="indigo" size="sm" />
              Your submitted tickets
            </h2>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Browser-local references · backend-created
            </span>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
            {/* Left column: ticket list (search, filters, history) */}
            <div
              className={`lg:col-span-5 xl:col-span-4 ${
                selectedTicketId ? "hidden lg:block" : "block"
              }`}
            >
              <TicketList />
            </div>

            {/* Right column: ticket details only */}
            <div
              className={`lg:col-span-7 xl:col-span-8 ${
                selectedTicketId ? "block" : "hidden lg:block"
              }`}
            >
              <TicketDetailView />
            </div>
          </div>
        </section>

        {/* ── CREATE TICKET MODAL ───────────────────────────────────────── */}
        <CreateTicketModal />
      </div>
    </div>
  );
}
