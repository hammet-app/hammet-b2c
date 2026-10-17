"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Settings, LogOut, Heart, Crown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/lib/auth/auth-context";
import { useLearnerStore } from "@/lib/store/use-learner-store";

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const isPro = useLearnerStore((state) => state.isPro);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const loadAvatar = () => {
      if (typeof window !== "undefined") {
        setAvatar(localStorage.getItem("hammet_user_avatar"));
      }
    };
    loadAvatar();
    window.addEventListener("storage", loadAvatar);
    return () => window.removeEventListener("storage", loadAvatar);
  }, []);

  return (
    <div 
      className="relative z-50"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/learner/profile"
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-xs font-bold text-white transition hover:ring-2 hover:ring-purple-500/30"
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          user?.fullName?.charAt(0)?.toUpperCase() ?? "U"
        )}
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
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-sm font-bold text-white shadow-sm">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    user?.fullName?.charAt(0)?.toUpperCase() ?? "U"
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {user?.fullName ?? "Learner"}
                    </p>
                    {isPro && (
                      <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm ring-1 ring-amber-400/30">
                        <Crown className="h-2.5 w-2.5 fill-white" />
                        PRO
                      </span>
                    )}
                  </div>
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

