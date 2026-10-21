"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useLenis } from "lenis/react";
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
  MessageSquare,
  LifeBuoy,
} from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { useTheme } from "@/lib/use-theme";
import { useCart } from "@/lib/store/use-cart";
import { useLearnerStore } from "@/lib/store/use-learner-store";
import { CartDropdown } from "./cart-dropdown";
import { ProfileDropdown } from "./profile-dropdown";
import { ChatWidget } from "./chat-widget";

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
  {
    label: "Community Chat",
    href: "/learner/chat",
    icon: MessageSquare,
  },
  {
    label: "Support Tickets",
    href: "/learner/support",
    icon: LifeBuoy,
  },
];

const STORAGE_KEY = "hammet-learner-sidebar-collapsed";
const typingWords = ["LEARN", "BUILD", "CREATE", "GROW"];

function TypewriterWord({ collapsed }: { collapsed: boolean }) {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    if (collapsed) return;
    const currentWord = typingWords[loopNum % typingWords.length];

    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (text.length < currentWord.length) {
        timer = setTimeout(() => {
          setText(currentWord.substring(0, text.length + 1));
        }, 80);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1400);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(currentWord.substring(0, text.length - 1));
        }, 40);
      } else {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, collapsed]);

  return <span>{text}</span>;
}

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

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const lenis = useLenis();

  // Desktop media query tracker for responsive layout synchronization
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Debounced resize of Lenis after sidebar animation settles (eliminates frame-by-frame DOM reflow)
  useEffect(() => {
    const timer = setTimeout(() => {
      lenis?.resize();
    }, 160);
    return () => clearTimeout(timer);
  }, [collapsed, lenis]);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  const sidebarTransition = {
    duration: 0.14,
    ease: "easeOut" as const,
  };

  return (
    <div className="min-h-screen bg-[#F5F3FF] text-slate-950 transition-colors dark:bg-[#0D0A17] dark:text-white">
      {/* Desktop sidebar with snappy GPU-accelerated Motion animation */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 76 : 248,
        }}
        transition={sidebarTransition}
        onAnimationComplete={() => {
          lenis?.resize();
        }}
        className="fixed inset-y-0 left-0 z-40 hidden border-r border-black/[0.06] bg-white dark:border-white/[0.06] dark:bg-[#120E1D] lg:flex lg:flex-col overflow-hidden will-change-[width] transform-gpu"
      >
        <div className="flex h-full flex-col px-3">
          {/* Brand */}
          <div
            className={[
              "flex h-20 w-full items-center",
              collapsed ? "justify-center" : "justify-between px-1",
            ].join(" ")}
          >
            <Link
              href="/learner"
              className="relative flex items-center font-black tracking-[-0.04em] shrink-0 h-9"
            >
              <AnimatePresence mode="wait" initial={false}>
                {collapsed ? (
                  <motion.div
                    key="brand-icon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.12 }}
                  >
                    <Image
                      src="/icon-512x512.png"
                      alt="Hammet"
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-xl object-contain mb-3"
                    />
                  </motion.div>
                ) : (
                  <motion.span
                    key="brand-text"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.12 }}
                    className="text-[22px] bg-gradient-to-r from-purple-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent font-black"
                  >
                    Hammet
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {!collapsed && (
              <motion.button
                type="button"
                onClick={toggleSidebar}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Collapse sidebar"
                className="group/toggle flex h-8 w-8 items-center justify-center rounded-xl border border-purple-500/15 bg-purple-50/60 text-slate-500 shadow-sm transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-100/80 hover:text-purple-700 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:border-purple-400/40 dark:hover:bg-purple-500/15 dark:hover:text-purple-200 dark:hover:shadow-[0_0_14px_rgba(168,85,247,0.35)]"
              >
                <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover/toggle:-translate-x-0.5" />
              </motion.button>
            )}
          </div>

          {collapsed && (
            <motion.button
              type="button"
              onClick={toggleSidebar}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Expand sidebar"
              className="group/toggle mb-4 mx-auto flex h-8 w-8 items-center justify-center rounded-xl border border-purple-500/15 bg-purple-50/60 text-slate-500 shadow-sm transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-100/80 hover:text-purple-700 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:border-purple-400/40 dark:hover:bg-purple-500/15 dark:hover:text-purple-200 dark:hover:shadow-[0_0_14px_rgba(168,85,247,0.35)]"
            >
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover/toggle:translate-x-0.5" />
            </motion.button>
          )}

          {/* Primary navigation */}
          <nav className="w-full space-y-1">
            <motion.div
              animate={{
                height: collapsed ? 0 : 16,
                opacity: collapsed ? 0 : 1,
                marginBottom: collapsed ? 0 : 12,
              }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center px-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8B5CF6] dark:text-[#A78BFA] select-none overflow-hidden"
            >
              <TypewriterWord collapsed={collapsed} />
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut" }}
                className="ml-1 inline-block h-3.5 w-[2.5px] rounded-full bg-[#06B6D4] shadow-[0_0_8px_#06B6D4]"
              />
            </motion.div>

            {navigation.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/learner"
                  ? pathname === "/learner"
                  : pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={[
                    "group relative flex h-11 items-center rounded-xl text-sm font-medium transition-colors duration-150 overflow-hidden select-none",
                    collapsed ? "justify-center px-0" : "px-3 gap-3",
                    active
                      ? "text-purple-700 font-semibold dark:text-cyan-300"
                      : "text-slate-600 hover:text-purple-700 dark:text-slate-400 dark:hover:text-purple-300",
                  ].join(" ")}
                >
                  {active && (
                    <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-purple-600 shadow-[0_0_8px_rgba(168,85,247,0.8)] dark:bg-cyan-400" />
                  )}

                  <Icon
                    className={[
                      "h-[18px] w-[18px] shrink-0 transition-colors duration-150",
                      active
                        ? "text-purple-600 dark:text-cyan-400"
                        : "text-slate-400 group-hover:text-purple-700 dark:text-slate-400 dark:group-hover:text-purple-300",
                    ].join(" ")}
                  />

                  <motion.span
                    animate={{
                      opacity: collapsed ? 0 : 1,
                      width: collapsed ? 0 : "auto",
                    }}
                    transition={{
                      duration: 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={[
                      "truncate whitespace-nowrap overflow-hidden transition-colors duration-150",
                      active
                        ? "text-purple-700 dark:text-cyan-300 font-semibold"
                        : "text-slate-600 group-hover:text-purple-700 dark:text-slate-400 dark:group-hover:text-purple-300",
                    ].join(" ")}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              );
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Secondary navigation */}
          <div className="w-full border-t border-black/[0.06] pt-3 dark:border-white/[0.06]">
            <Link
              href="/learner/settings"
              title={collapsed ? "Settings" : undefined}
              className={[
                "group flex h-11 items-center rounded-xl text-sm font-medium text-slate-600 transition-colors duration-150 hover:text-purple-700 dark:text-slate-400 dark:hover:text-purple-300 overflow-hidden select-none",
                collapsed ? "justify-center px-0" : "px-3 gap-3",
              ].join(" ")}
            >
              <Settings className="h-[18px] w-[18px] shrink-0 text-slate-400 transition-colors duration-150 group-hover:text-purple-700 dark:text-slate-400 dark:group-hover:text-purple-300" />
              <motion.span
                animate={{
                  opacity: collapsed ? 0 : 1,
                  width: collapsed ? 0 : "auto",
                }}
                transition={{
                  duration: 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="truncate whitespace-nowrap overflow-hidden transition-colors duration-150 group-hover:text-purple-700 dark:group-hover:text-purple-300"
              >
                Settings
              </motion.span>
            </Link>

            <button
              type="button"
              onClick={() => void logout()}
              title={collapsed ? "Sign out" : undefined}
              className={[
                "mt-1 flex h-11 w-full items-center rounded-xl text-sm font-medium text-slate-600 transition-colors duration-150 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 overflow-hidden select-none",
                collapsed ? "justify-center px-0" : "px-3 gap-3",
              ].join(" ")}
            >
              <LogOut className="h-[18px] w-[18px] shrink-0 text-slate-400 transition-colors duration-150 group-hover:text-red-600 dark:group-hover:text-red-400" />
              <motion.span
                animate={{
                  opacity: collapsed ? 0 : 1,
                  width: collapsed ? 0 : "auto",
                }}
                transition={{
                  duration: 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="truncate whitespace-nowrap overflow-hidden transition-colors duration-150 group-hover:text-red-600 dark:group-hover:text-red-400"
              >
                Sign out
              </motion.span>
            </button>
          </div>

          {/* Profile */}
          <div
            className={[
              "flex w-full items-center border-t border-black/[0.06] py-3 dark:border-white/[0.06] overflow-hidden",
              collapsed ? "justify-center px-0" : "px-2 gap-3",
            ].join(" ")}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-xs font-bold text-white shadow-xs">
              {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
            </div>

            <motion.div
              animate={{
                opacity: collapsed ? 0 : 1,
                width: collapsed ? 0 : "auto",
              }}
              transition={{
                duration: 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="min-w-0 flex-1 overflow-hidden"
            >
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
            </motion.div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile drawer with Motion AnimatePresence */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              key="mobile-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 480, damping: 38 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white shadow-2xl dark:bg-[#120E1D] lg:hidden"
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
                      : pathname === item.href || pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={[
                        "group flex h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-150 select-none",
                        active
                          ? "text-purple-700 font-semibold dark:text-cyan-300"
                          : "text-slate-600 hover:text-purple-700 dark:text-slate-400 dark:hover:text-purple-300",
                      ].join(" ")}
                    >
                      <Icon className="h-[18px] w-[18px] transition-colors duration-150 text-slate-400 group-hover:text-purple-700 dark:text-slate-400 dark:group-hover:text-purple-300" />
                      <span className="truncate whitespace-nowrap transition-colors duration-150 text-slate-600 group-hover:text-purple-700 dark:text-slate-400 dark:group-hover:text-purple-300">
                        {item.label}
                      </span>
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
                  className="group flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-slate-600 transition-colors duration-150 hover:text-purple-700 dark:text-slate-400 dark:hover:text-purple-300 select-none"
                >
                  <Settings className="h-[18px] w-[18px] text-slate-400 transition-colors duration-150 group-hover:text-purple-700 dark:text-slate-400 dark:group-hover:text-purple-300" />
                  <span className="transition-colors duration-150 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                    Settings
                  </span>
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
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main application container with synchronized Motion transition */}
      <motion.div
        initial={false}
        animate={{
          paddingLeft: isDesktop ? (collapsed ? 76 : 248) : 0,
        }}
        transition={sidebarTransition}
        className="min-h-screen will-change-[padding-left]"
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

        {/* Global Floating Community Chat Launcher & Widget */}
        <ChatWidget />
      </motion.div>

      {/* Mobile bottom navigation with fluid horizontal touch swipe */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-black/[0.06] bg-white/95 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#120E1D]/95 lg:hidden shadow-lg">
        <div className="relative mx-auto flex w-full max-w-lg items-center gap-1.5 overflow-x-auto scroll-smooth px-3 py-1 overscroll-x-contain touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
                  "flex shrink-0 min-w-[62px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-all duration-150 active:scale-95",
                  active
                    ? "text-purple-700 bg-purple-50 dark:text-cyan-300 dark:bg-purple-500/15 font-bold shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
                ].join(" ")}
              >
                <Icon className={`h-[18px] w-[18px] transition-transform ${active ? "scale-110 text-purple-600 dark:text-cyan-400" : ""}`} />
                <span className="truncate max-w-[70px] whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}