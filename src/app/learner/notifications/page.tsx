"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  CheckCircle2,
  Info,
  Star,
  CreditCard,
  ChevronRight,
  ExternalLink,
  X,
  Trash2,
  Check,
  Sparkles,
  Award,
  BookOpen,
  FolderKanban,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

interface NotificationItem {
  id: number;
  type: "success" | "info" | "payment" | "achievement";
  category: "Access" | "Platform" | "Billing" | "Milestones";
  title: string;
  message: string;
  fullBody: string;
  time: string;
  date: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: "success",
    category: "Access",
    title: "School of AI Foundation Unlocked!",
    message: "Your enrollment was confirmed. You now hold full access to all 4 core diploma courses.",
    fullBody: "Welcome to the School of AI Foundation! Your lifetime license has been verified on the Hammet network. You can now access all four courses including Introduction to Modern LLMs, Neural Network Architectures, Generative AI Systems, and Autonomous Agents. Your GPU sandbox compute environment is also provisioned and ready.",
    time: "2 mins ago",
    date: "Today, 11:42 AM",
    read: false,
    actionLabel: "Explore School Courses",
    actionUrl: "/learner/ai-schools",
  },
  {
    id: 2,
    type: "achievement",
    category: "Milestones",
    title: "Achievement Unlocked: Fast Learner Badge",
    message: "You completed 3 curriculum modules in 24 hours. Your Skill Passport has been updated.",
    fullBody: "Congratulations on your momentum! By finishing 3 modules in a single study session, you've earned the 'Fast Learner' badge. This verifiable micro-credential has been cryptographically signed and added to your official Skill Passport with a unique verification hash.",
    time: "3 hours ago",
    date: "Today, 8:15 AM",
    read: false,
    actionLabel: "View Skill Passport",
    actionUrl: "/learner/passport",
  },
  {
    id: 3,
    type: "payment",
    category: "Billing",
    title: "Payment Receipt • TXN-HMT-894102",
    message: "Your payment of ₦25,000 was settled via Instant Bank Transfer. Download your receipt.",
    fullBody: "We have confirmed your payment of ₦25,000 for 'School of AI Foundation Enrollment' via Providus Bank Automated Transfer. Your digital invoice and VAT receipt have been generated and archived in your billing history.",
    time: "Yesterday",
    date: "Yesterday, 3:20 PM",
    read: true,
    actionLabel: "Review Order & Checkout",
    actionUrl: "/learner/checkout",
  },
  {
    id: 4,
    type: "info",
    category: "Platform",
    title: "New Autonomous Agent Lab Available",
    message: "LangGraph Multi-Tool Swarms project has been added to your Projects lab workspace.",
    fullBody: "A new capstone engineering challenge is now live in your Projects section: 'Autonomous Support Swarm with Tool Calling & Human-in-the-Loop'. Build multi-agent orchestrators with deterministic state recovery and test your code directly against our rubric.",
    time: "2 days ago",
    date: "Oct 10, 10:00 AM",
    read: true,
    actionLabel: "Open Projects Lab",
    actionUrl: "/learner/projects",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "Access" | "Milestones" | "Billing">("all");
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleOpenNotification = (n: NotificationItem) => {
    // Mark this notification as read
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
    );
    setSelectedNotification({ ...n, read: true });
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  const filtered = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !n.read;
    return n.category === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen px-4 pb-28 pt-6 sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 bg-[#F5F3FF] dark:bg-[#0D0A17] font-poppins transition-colors duration-300">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-purple-600 dark:text-cyan-400">
              <Bell className="h-4 w-4" />
              <span>Notification Center</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Notifications
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Stay updated on course releases, verified credentials, and account activity.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-white/10 dark:text-cyan-300 dark:hover:bg-white/5 font-semibold text-xs"
            >
              <Check className="mr-1.5 h-3.5 w-3.5" />
              Mark all as read
            </Button>
          )}
        </motion.header>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Updates" },
            { id: "unread", label: `Unread (${unreadCount})` },
            { id: "Access", label: "Course Access" },
            { id: "Milestones", label: "Milestones" },
            { id: "Billing", label: "Billing" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
                activeFilter === tab.id
                  ? "bg-purple-600 text-white shadow-sm dark:bg-cyan-500 dark:text-slate-950"
                  : "bg-white/70 text-slate-600 hover:bg-white hover:text-slate-900 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/10 border border-black/[0.04] dark:border-white/[0.05]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="rounded-3xl border border-black/[0.06] bg-white p-3 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]"
        >
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-cyan-400">
                <Bell className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                All caught up!
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                No notifications found in this category.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((n, idx) => {
                const isUnread = !n.read;
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    onClick={() => handleOpenNotification(n)}
                    className={cn(
                      "group relative flex items-start gap-4 rounded-2xl p-4 transition-all duration-200 cursor-pointer border",
                      isUnread
                        ? "bg-purple-50/70 border-purple-200/80 hover:bg-purple-50 dark:bg-purple-950/20 dark:border-purple-500/30 dark:hover:bg-purple-900/30"
                        : "bg-white hover:bg-slate-50 border-black/[0.03] dark:bg-transparent dark:border-white/[0.03] dark:hover:bg-white/[0.03]"
                    )}
                  >
                    {/* Unread Left Pill */}
                    {isUnread && (
                      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-purple-600 dark:bg-cyan-400" />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold shadow-sm transition",
                        n.type === "success"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : n.type === "achievement"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                          : n.type === "payment"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                      )}
                    >
                      {n.type === "success" && <CheckCircle2 className="h-5 w-5" />}
                      {n.type === "achievement" && <Star className="h-5 w-5" />}
                      {n.type === "payment" && <CreditCard className="h-5 w-5" />}
                      {n.type === "info" && <Info className="h-5 w-5" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {n.category}
                          </span>
                          <h4
                            className={cn(
                              "text-sm font-bold truncate",
                              isUnread ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                            )}
                          >
                            {n.title}
                          </h4>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {n.time}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>

                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-[11px] font-semibold text-purple-600 dark:text-cyan-400 group-hover:underline">
                          Read details & open →
                        </span>
                      </div>
                    </div>

                    <div className="hidden sm:flex self-center text-slate-300 group-hover:text-purple-600 dark:text-slate-600 dark:group-hover:text-cyan-400 transition">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── NOTIFICATION DETAIL MODAL / DRAWER ──────────────────────────────── */}
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotification(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-3xl border border-black/[0.08] bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-[#151026]"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm",
                      selectedNotification.type === "success"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                        : selectedNotification.type === "achievement"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                        : selectedNotification.type === "payment"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                    )}
                  >
                    {selectedNotification.type === "success" && <CheckCircle2 className="h-6 w-6" />}
                    {selectedNotification.type === "achievement" && <Star className="h-6 w-6" />}
                    {selectedNotification.type === "payment" && <CreditCard className="h-6 w-6" />}
                    {selectedNotification.type === "info" && <Info className="h-6 w-6" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                      {selectedNotification.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {selectedNotification.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedNotification(null)}
                  className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Timestamp */}
              <div className="text-xs text-slate-400 mb-4 border-b border-slate-100 pb-3 dark:border-white/5">
                Sent: {selectedNotification.date} • {selectedNotification.time}
              </div>

              {/* Body */}
              <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <p>{selectedNotification.fullBody}</p>
              </div>

              {/* Actions & Links */}
              <div className="mt-8 flex flex-col gap-3">
                {selectedNotification.actionUrl && (
                  <Link
                    href={selectedNotification.actionUrl}
                    onClick={() => setSelectedNotification(null)}
                    className="w-full"
                  >
                    <Button className="w-full rounded-xl bg-purple-600 py-3 font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400">
                      <span>{selectedNotification.actionLabel || "View Details"}</span>
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => handleDeleteNotification(selectedNotification.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Notification</span>
                  </button>

                  <Button
                    variant="outline"
                    onClick={() => setSelectedNotification(null)}
                    className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
