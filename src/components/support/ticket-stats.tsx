"use client";

import { useTicketStore, HAMMET_SUPPORT_EMAIL } from "@/lib/store/use-ticket-store";
import {
  LifeBuoy,
  Clock,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";

export function TicketStats() {
  const tickets = useTicketStore((state) => state.tickets);

  const total = tickets.length;
  const inProgress = tickets.filter(
    (t) => t.status === "in-progress" || t.status === "open" || t.status === "pending"
  ).length;

  const stats = [
    {
      label: "Support Channel",
      value: "Email Desk",
      sublabel: HAMMET_SUPPORT_EMAIL,
      icon: Mail,
      color: "from-purple-500/15 to-indigo-500/10 text-purple-600 dark:text-purple-400",
      border: "border-purple-200/60 dark:border-purple-500/20",
    },
    {
      label: "My Logged Inquiries",
      value: total,
      sublabel: inProgress > 0 ? `${inProgress} active / awaiting reply` : "All inquiries up to date",
      icon: Clock,
      color: "from-amber-500/15 to-orange-500/10 text-amber-600 dark:text-amber-400",
      border: "border-amber-200/60 dark:border-amber-500/20",
    },
    {
      label: "Response SLA",
      value: "< 24 Hours",
      sublabel: "Direct academic & tech review",
      icon: CheckCircle2,
      color: "from-emerald-500/15 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200/60 dark:border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            className={`relative overflow-hidden rounded-2xl border ${stat.border} bg-white p-3.5 sm:p-4 shadow-xs transition hover:shadow-md dark:bg-slate-900/60`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
              <div
                className={`flex h-7.5 w-7.5 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-inner`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {stat.value}
              </span>
            </div>

            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 truncate font-sans">
              {stat.sublabel}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
