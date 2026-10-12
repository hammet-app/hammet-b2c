"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Settings, LogOut, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/lib/auth/auth-context";

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div 
      className="relative z-50"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/learner/profile"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-xs font-bold text-white transition hover:ring-2 hover:ring-purple-500/30"
      >
        {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-xl dark:border-white/[0.06] dark:bg-[#18181B]"
          >
            <div className="border-b border-black/[0.04] p-4 dark:border-white/[0.04]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-sm font-bold text-white shadow-sm">
                  {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {user?.fullName ?? "Learner"}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {user?.email ?? "learner@example.com"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <Link
                href="/learner/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-purple-600 dark:text-slate-200 dark:hover:bg-white/[0.05] dark:hover:text-cyan-400"
              >
                <User className="h-4 w-4 text-slate-400" />
                Profile
              </Link>
              <Link
                href="/learner/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-purple-600 dark:text-slate-200 dark:hover:bg-white/[0.05] dark:hover:text-cyan-400"
              >
                <Settings className="h-4 w-4 text-slate-400" />
                Settings
              </Link>
              
              <Link
                href="/learner/wishlist"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-purple-600 dark:text-slate-200 dark:hover:bg-white/[0.05] dark:hover:text-cyan-400"
              >
                <Heart className="h-4 w-4 text-slate-400" />
                Wishlist
              </Link>
            </div>

            <div className="border-t border-black/[0.04] p-2 dark:border-white/[0.04]">
              <button
                onClick={() => void logout()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

