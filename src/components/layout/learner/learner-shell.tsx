"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Home,
  LogOut,
  Menu,
  Settings,
  UserRound,
  X,
  FileBadge,
  Sun,
  Moon,
  CreditCard,
  ShoppingCart,
  Bell,
  Briefcase,
  Crown,
  Award,
  GraduationCap,
} from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { useTheme } from "@/lib/use-theme";
import { useCart } from "@/lib/store/use-cart";
import { useLearnerStore } from "@/lib/store/use-learner-store";
import { CartDropdown } from "./cart-dropdown";
import { ProfileDropdown } from "./profile-dropdown";

const navigation = [
  {
    label: "Home",
    href: "/learner",
    icon: Home,
  },
  {
    label: "Learn",
    href: "/learner/learn",
    icon: BookOpen,
  },
  {
    label: "School of AI foundation",
    href: "/learner/ai-schools",
    icon: GraduationCap,
  },
  {
    label: "Projects",
    href: "/learner/projects",
    icon: FolderKanban,
  },
  {
    label: "Passport",
    href: "/learner/passport",
    icon: FileBadge,
  },
  {
    label: "Portfolio",
    href: "/learner/portfolio",
    icon: Briefcase,
  },
  {
    label: "Hammet Pro",
    href: "/learner/pro",
    icon: Crown,
  },
];

const STORAGE_KEY = "hammet-learner-sidebar-collapsed";
const typingWords = ["LEARN", "BUILD", "CREATE", "GROW"];

interface LearnerShellProps {
  children: React.ReactNode;
}

export function LearnerShell({ children }: LearnerShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  
  const cartItems = useCart((state) => state.items);
  const syncAccountState = useLearnerStore((state) => state.syncAccountState);
  const isPro = useLearnerStore((state) => state.isPro);
  const [mounted, setMounted] = useState(false);

  // Sync test account vs real user accounts
  useEffect(() => {
    syncAccountState(user?.id);
  }, [user?.id, syncAccountState]);

  // Avoid hydration mismatch for cart icon badge
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    const currentWord = typingWords[loopNum % typingWords.length];
    
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (text.length < currentWord.length) {
        // Typing characters
        timer = setTimeout(() => {
          setText(currentWord.substring(0, text.length + 1));
        }, 75);
      } else {
        // Word complete, pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1300);
      }
    } else {
      if (text.length > 0) {
        // Deleting characters quickly
        timer = setTimeout(() => {
          setText(currentWord.substring(0, text.length - 1));
        }, 40);
      } else {
        // Fully deleted, move to next word
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum]);

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-[#F5F3FF] text-slate-950 transition-colors dark:bg-[#0D0A17] dark:text-white">
      {/* Desktop sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 hidden border-r border-black/[0.06] bg-white/80 backdrop-blur-xl transition-[width] duration-300 dark:border-white/[0.06] dark:bg-[#120E1D]/90 lg:flex lg:flex-col",
          collapsed ? "w-[76px]" : "w-[248px]",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-full flex-col",
            collapsed ? "items-center px-3" : "px-4",
          ].join(" ")}
        >
          {/* Brand */}
          <div
            className={[
              "flex h-20 w-full items-center",
              collapsed ? "justify-center" : "justify-between px-2",
            ].join(" ")}
          >
            <Link
              href="/learner"
              className="relative flex items-center font-black tracking-[-0.04em]"
            >
              {collapsed ? (
                <Image
                  src="/icon-512x512.png"
                  alt="Hammet"
                  width={130}
                  height={34}
                  className="h-8 w-auto mb-4"
                />
              ) : (
                <span className="text-[22px] bg-gradient-to-r from-purple-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  Hammet
                </span>
              )}
            </Link>

            {!collapsed && (
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Collapse sidebar"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>

          {collapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
              className="mb-5 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {/* Primary navigation */}
          <nav className="w-full space-y-1">
            {!collapsed && (
              <div className="mb-3 flex items-center px-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#8B5CF6] dark:text-[#A78BFA] select-none">
                <span>{text}</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut" }}
                  className="ml-1 inline-block h-3.5 w-[2.5px] rounded-full bg-[#06B6D4] shadow-[0_0_8px_#06B6D4]"
                />
              </div>
            )}

            {navigation.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/learner"
                  ? pathname === "/learner"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={[
                    "group relative flex h-11 items-center rounded-xl text-sm font-medium transition",
                    collapsed
                      ? "justify-center"
                      : "gap-3 px-3",
                    active
                      ? "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-white",
                  ].join(" ")}
                >
                  {active && (
                    <motion.span
                      layoutId="learner-active-nav"
                      className="absolute left-0 h-5 w-0.5 rounded-full bg-purple-600 dark:bg-cyan-400"
                    />
                  )}

                  <Icon
                    className={[
                      "h-[18px] w-[18px] shrink-0",
                      active
                        ? "text-purple-600 dark:text-cyan-400"
                        : "",
                    ].join(" ")}
                  />

                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Secondary navigation */}
          <div className="w-full border-t border-black/[0.06] pt-4 dark:border-white/[0.06]">
            <Link
              href="/learner/settings"
              title={collapsed ? "Settings" : undefined}
              className={[
                "flex h-11 items-center rounded-xl text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-white",
                collapsed ? "justify-center" : "gap-3 px-3",
              ].join(" ")}
            >
              <Settings className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>Settings</span>}
            </Link>

            <button
              type="button"
              onClick={() => void logout()}
              title={collapsed ? "Sign out" : undefined}
              className={[
                "mt-1 flex h-11 w-full items-center rounded-xl text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400",
                collapsed ? "justify-center" : "gap-3 px-3",
              ].join(" ")}
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>Sign out</span>}
            </button>
          </div>

          {/* Profile */}
          <div
            className={[
              "flex w-full items-center border-t border-black/[0.06] py-4 dark:border-white/[0.06]",
              collapsed ? "justify-center" : "gap-3 px-2",
            ].join(" ")}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-xs font-bold text-white">
              {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold">
                    {user?.fullName ?? "Learner"}
                  </p>
                  {isPro && (
                    <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm ring-1 ring-amber-400/30">
                      <Crown className="h-2.5 w-2.5 fill-white" />
                      PRO
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-slate-400">
                  {isPro ? "Pro Member" : "Learner"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile navigation */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-[#120E1D] lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-20 items-center justify-between px-5">
          <span className="text-[22px] font-black tracking-[-0.04em] bg-gradient-to-r from-purple-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
            Hammet
          </span>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/learner"
                ? pathname === "/learner"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={[
                  "flex h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium transition",
                  active
                    ? "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300"
                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.05]",
                ].join(" ")}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-black/[0.06] p-4 dark:border-white/[0.06]">
          {/* User profile */}
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-xs font-bold text-white">
              {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
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
              <p className="truncate text-xs text-slate-400">
                {isPro ? "Pro Member" : "Learner"}
              </p>
            </div>
          </div>

          <Link
            href="/learner/settings"
            onClick={() => setMobileOpen(false)}
            className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.05]"
          >
            <Settings className="h-[18px] w-[18px]" />
            Settings
          </Link>

          <button
            type="button"
            onClick={() => void logout()}
            className="mt-1 flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main application */}
      <div
        className={[
          "min-h-screen transition-[padding] duration-300",
          collapsed ? "lg:pl-[76px]" : "lg:pl-[248px]",
        ].join(" ")}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-black/[0.06] bg-[#F5F3FF]/85 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#0D0A17]/85">
          <div className="flex h-full items-center justify-between px-5 sm:px-7 lg:px-9">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/70 dark:text-slate-400 dark:hover:bg-white/[0.05] lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden items-center gap-2 text-sm text-slate-400 sm:flex">
                <span>Hammet</span>
                <span>/</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {pathname === "/learner" ? "Home" : "Learner"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CartDropdown />

              <Link
                href="/learner/notifications"
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/50 text-slate-500 shadow-sm ring-1 ring-black/5 transition-all hover:bg-white/80 hover:text-slate-900 dark:bg-white/[0.03] dark:text-slate-400 dark:ring-white/10 dark:hover:bg-white/[0.08] dark:hover:text-white"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0D0A17]" />
              </Link>

              <button
                type="button"
                onClick={toggle}
                aria-label={`Switch to ${
                  theme === "dark" ? "light" : "dark"
                } mode`}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/50 text-slate-500 shadow-sm ring-1 ring-black/5 transition-all hover:bg-white/80 hover:text-slate-900 dark:bg-white/[0.03] dark:text-slate-400 dark:ring-white/10 dark:hover:bg-white/[0.08] dark:hover:text-white"
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: theme === "dark" ? 0 : 1,
                    opacity: theme === "dark" ? 0 : 1,
                    rotate: theme === "dark" ? -90 : 0,
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute"
                >
                  <Sun className="h-[18px] w-[18px]" />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{
                    scale: theme === "dark" ? 1 : 0,
                    opacity: theme === "dark" ? 1 : 0,
                    rotate: theme === "dark" ? 0 : 90,
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute"
                >
                  <Moon className="h-[18px] w-[18px]" />
                </motion.div>
              </button>

              <ProfileDropdown />
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-black/[0.06] bg-white/90 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#120E1D]/90 lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/learner"
                ? pathname === "/learner"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex min-w-[68px] flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium transition",
                  active
                    ? "text-purple-700 dark:text-cyan-400"
                    : "text-slate-400",
                ].join(" ")}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}