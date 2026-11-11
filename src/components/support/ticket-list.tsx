"use client";

import { useTicketStore } from "@/lib/store/use-ticket-store";
import {
  PriorityBadge,
  StatusBadge,
  CategoryBadge,
} from "./ticket-badges";
import {
  Search,
  Filter,
  Clock,
  X,
  AlertCircle,
  Plus,
  Info,
  RotateCw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function TicketList() {
  const {
    tickets,
    selectedTicketId,
    setSelectedTicketId,
    filterStatus,
    setFilterStatus,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    searchQuery,
    setSearchQuery,
    setIsCreateModalOpen,
    isLoadingTickets,
    ticketsError,
    reloadTickets,
  } = useTicketStore();

  const statusTabs = [
    { id: "all", label: "All Tickets" },
    { id: "open", label: "Open" },
    { id: "in-progress", label: "In Progress" },
    { id: "pending", label: "Pending" },
    { id: "resolved", label: "Resolved" },
    { id: "closed", label: "Closed" },
  ];

  // Filtering
  const filteredTickets = tickets.filter((ticket) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = ticket.id.toLowerCase().includes(q);
      const matchSubject = ticket.subject.toLowerCase().includes(q);
      const matchMessage = (ticket.message ?? "").toLowerCase().includes(q);
      if (!matchId && !matchSubject && !matchMessage) return false;
    }

    // Status filter
    if (filterStatus !== "all" && ticket.status !== filterStatus) {
      return false;
    }

    // Category filter
    if (filterCategory !== "all" && ticket.category !== filterCategory) {
      return false;
    }

    // Priority filter
    if (filterPriority !== "all" && ticket.priority !== filterPriority) {
      return false;
    }

    return true;
  });

  const getStatusCount = (statusId: string) => {
    if (statusId === "all") return tickets.length;
    return tickets.filter((t) => t.status === statusId).length;
  };

  const formatTicketDate = (isoString: string) => {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
      {/* ── Search & Filter Controls ───────────────────────────── */}
      <div className="p-3 sm:p-3.5 border-b border-slate-200/70 dark:border-white/10 space-y-2.5 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, subject, keyword..."
              className="w-full pl-8.5 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Quick Create Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex sm:hidden h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/30 hover:bg-purple-700 dark:bg-purple-800/80 dark:border dark:border-purple-500/30"
            title="Create Support Ticket"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
            <Filter className="h-3 w-3" />
            <span>Filter:</span>
          </div>

          {/* Category Dropdown */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-700 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">All Categories</option>
            <option value="courseware">Course &amp; Content</option>
            <option value="billing">Billing</option>
            <option value="account">Account &amp; Profile</option>
            <option value="certification">Certificates</option>
            <option value="technical">Technical Issue</option>
            <option value="general">General Help</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-700 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {(filterCategory !== "all" ||
            filterPriority !== "all" ||
            filterStatus !== "all" ||
            searchQuery) && (
            <button
              onClick={() => {
                setFilterCategory("all");
                setFilterPriority("all");
                setFilterStatus("all");
                setSearchQuery("");
              }}
              className="text-[10px] text-purple-600 hover:text-purple-700 dark:text-purple-300 font-semibold ml-auto"
            >
              Reset
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1 pt-0.5">
          {statusTabs.map((tab) => {
            const active = filterStatus === tab.id;
            const count = getStatusCount(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`relative flex items-center gap-1 whitespace-nowrap rounded-xl px-2.5 py-1 text-[11px] font-semibold transition ${
                  active
                    ? "bg-purple-600 text-white shadow-xs dark:bg-purple-900/60 dark:border dark:border-purple-500/30 dark:text-purple-100"
                    : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/5"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.1 text-[9px] font-mono font-bold ${
                    active
                      ? "bg-white/20 text-white dark:bg-white/15 dark:text-purple-200"
                      : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Sync notice ────────────────────────────────────────── */}
      {ticketsError ? (
        <div className="flex items-start justify-between gap-2 border-b border-rose-200/60 bg-rose-50/70 px-3 py-2 text-[10.5px] leading-relaxed text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
          <span className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
            <span>{ticketsError}</span>
          </span>
          <button
            type="button"
            onClick={reloadTickets}
            disabled={isLoadingTickets}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-rose-300/60 px-2 py-0.5 font-semibold transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-400/30 dark:hover:bg-rose-500/20"
          >
            <RotateCw
              className={`h-2.5 w-2.5 ${isLoadingTickets ? "animate-spin" : ""}`}
            />
            Retry
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-2 border-b border-black/[0.05] bg-purple-50/50 px-3 py-2 text-[10.5px] leading-relaxed text-purple-800 dark:border-white/[0.06] dark:bg-purple-500/10 dark:text-purple-200">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          <span>Ticket history is loaded from the support desk.</span>
        </div>
      )}

      {/* ── Ticket List Scrollable Container ───────────────────── */}
      <div className="overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 max-h-[580px]">
        <AnimatePresence mode="popLayout">
          {isLoadingTickets && tickets.length === 0 ? (
            <div className="space-y-3 p-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[104px] animate-pulse rounded-2xl bg-purple-50 dark:bg-white/5"
                />
              ))}
            </div>
          ) : filteredTickets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-6 sm:p-8 text-center"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/5 mb-2.5">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {tickets.length === 0
                  ? "No tickets logged yet"
                  : "No support tickets found"}
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                {tickets.length === 0
                  ? "Create your first ticket and the backend will record it against your learner account."
                  : "No tickets match your active filter criteria. Try adjusting your search or reset your filters."}
              </p>
              {tickets.length === 0 ? (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create your first ticket
                </button>
              ) : (
                <button
                  onClick={() => {
                    setFilterCategory("all");
                    setFilterPriority("all");
                    setFilterStatus("all");
                    setSearchQuery("");
                  }}
                  className="mt-3.5 rounded-xl bg-purple-50 px-3.5 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:border dark:border-purple-500/20"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          ) : (
            filteredTickets.map((ticket) => {
              const isSelected = selectedTicketId === ticket.id;

              return (
                <motion.button
                  key={ticket.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full text-left p-3 sm:p-3.5 transition flex flex-col gap-2 relative group cursor-pointer ${
                    isSelected
                      ? "bg-purple-50/70 dark:bg-purple-950/25"
                      : "hover:bg-slate-50/80 dark:hover:bg-white/[0.03]"
                  }`}
                >
                  {/* Active selection accent line */}
                  {isSelected && (
                    <motion.div
                      layoutId="active-ticket-bar"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 dark:bg-purple-400 rounded-r"
                    />
                  )}

                  {/* Top Row: Ticket ID, Priority, Status */}
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded">
                        {ticket.id}
                      </span>
                      <PriorityBadge priority={ticket.priority} />
                    </div>

                    <StatusBadge status={ticket.status} />
                  </div>

                  {/* Title */}
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    {ticket.subject}
                  </h4>

                  {/* Excerpt */}
                  {ticket.message ? (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {ticket.message}
                    </p>
                  ) : null}

                  {/* Bottom Row: Category and date */}
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1 border-t border-black/[0.03] dark:border-white/[0.04]">
                    <CategoryBadge category={ticket.category} />

                    <div className="flex items-center gap-3">
                      {/* Timestamp */}
                      <span className="flex items-center gap-0.5 font-mono text-[10px]">
                        <Clock className="h-2.5 w-2.5" />
                        {formatTicketDate(ticket.updatedAt || ticket.createdAt)}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

