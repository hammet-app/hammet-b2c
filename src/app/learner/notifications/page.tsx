"use client";

import { motion } from "motion/react";
import { Bell, CheckCircle2, Info, Star, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const mockNotifications = [
  {
    id: 1,
    type: "success",
    title: "School of AI Foundation Unlocked!",
    message: "Your purchase was successful. You can now access all modules in this school.",
    time: "2 mins ago",
    read: false,
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    id: 2,
    type: "info",
    title: "New Course Available",
    message: "A new module on Advanced LLMs has just been added to your learning path.",
    time: "3 hours ago",
    read: false,
    icon: Info,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Receipt",
    message: "Your receipt for 'Introduction to AI' is ready to download.",
    time: "Yesterday",
    read: true,
    icon: CreditCard,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-500/10",
  },
  {
    id: 4,
    type: "achievement",
    title: "Achievement Unlocked: Fast Learner",
    message: "You completed 3 modules in one day! Keep up the great work.",
    time: "2 days ago",
    read: true,
    icon: Star,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10 relative overflow-hidden">
      <div className="mx-auto max-w-3xl">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-purple-600 dark:text-cyan-400">
              <Bell className="h-3.5 w-3.5" />
              Updates
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl dark:text-white">
              Notifications
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Stay updated on your courses, achievements, and account activity.
            </p>
          </div>
          
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-white shrink-0 bg-white/50 dark:bg-white/[0.02] px-4 py-2 rounded-xl border border-black/[0.06] dark:border-white/[0.06] shadow-sm backdrop-blur-md"
            >
              Mark all as read
            </button>
          )}
        </motion.header>

        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="rounded-2xl border border-black/[0.06] bg-white/60 p-2 shadow-sm backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.02]"
        >
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="mx-auto mb-4 h-8 w-8 text-slate-300 dark:text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">All caught up!</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">You have no new notifications right now.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {notifications.map((notification, idx) => {
                const Icon = notification.icon;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 + (idx * 0.05) }}
                    className={`group relative flex gap-4 rounded-xl p-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.03] ${
                      !notification.read ? 'bg-purple-50/50 dark:bg-purple-500/5' : ''
                    }`}
                  >
                    {!notification.read && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 dark:bg-cyan-400 rounded-r-full" />
                    )}
                    
                    <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notification.bgColor} ${notification.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className={`text-sm font-semibold truncate ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

