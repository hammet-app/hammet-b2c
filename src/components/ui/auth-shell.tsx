"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/utils";
import { Moon, Sun, AlertCircle } from "lucide-react";
import { useTheme } from "@/lib/use-theme";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Auth3DCard } from "@/components/ui/auth-3d-card";
import { InteractiveAuthGradient } from "@/components/ui/interactive-auth-gradient";
import { AuthCornerIllustration } from "@/components/ui/auth-corner-illustrations";

// ── AuthShell ────────────────────────────────────────────────────────────────

interface AuthShellProps {
  children: ReactNode;
  /** Optionally widen the card for multi-column steps */
  wide?: boolean;
  /** Mode to display context-specific bottom-right welcome illustration */
  mode?: "login" | "register";
}

export function AuthShell({ children, wide, mode }: AuthShellProps) {
  const { theme, toggle } = useTheme();

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-text-primary">
      {/* Smooth light gradient changing animation with interactive pointer reaction */}
      <InteractiveAuthGradient />

      {/* Header */}
      <header className="relative z-20 flex h-16 items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple/50 rounded-lg"
          title="Hammet Home"
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[9px] transition-transform duration-200 group-hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, #5B21B6 0%, #7C3AED 55%, #06B6D4 100%)",
              boxShadow:
                "0 4px 18px rgba(91,33,182,0.28), 0 0 24px rgba(6,182,212,0.08)",
            }}
          >
            <Image
              src="/favicon.ico"
              alt=""
              width={20}
              height={20}
              className="rounded-[5px]"
              priority
            />
          </div>

          <span
            className="text-[14px] font-bold tracking-tight text-slate-900 dark:text-white"
            style={{ fontFamily: "var(--font-head)" }}
          >
            Hammet
          </span>
        </Link>

        <ThemeToggle />
      </header>

      {/* Authentication environment */}
      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 sm:px-8">
        <div className="mx-auto grid w-full max-w-[1120px] grid-cols-1 items-center justify-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Editorial / visual side: 3D, solid, animated and interactive (Reference Image 1) */}
          <div className="relative hidden min-h-[600px] items-center justify-center lg:flex">
            <Auth3DCard />
          </div>

          {/* Page content */}
          <div className="flex w-full items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              className="w-full flex justify-center"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── BORDERLINE CORNER WELCOME ILLUSTRATION ── */}
      {mode && <AuthCornerIllustration mode={mode} />}
    </main>
  );
}

// ── AuthLogo ─────────────────────────────────────────────────────────────────

function AuthLogo() {
  return (
    <div className="flex items-center gap-2.5 mb-1">
      <div
        className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
        style={{
          background: "linear-gradient(135deg, #5B21B6, #3B0764)",
          boxShadow: "0 2px 8px rgba(91,33,182,0.35)",
        }}
        aria-hidden="true"
      >
        <Image
          src="/favicon.ico"
          alt=""
          className="w-5 h-5 rounded-[5px]"
        />
      </div>
      <span
        className="text-[13.5px] font-bold text-text-primary tracking-tight"
        style={{ fontFamily: "var(--font-head)" }}
      >
        AI Studies <span className="text-purple dark:text-cyan-light">by Hammet</span>
      </span>
    </div>
  );
}

// ── AuthHeading ───────────────────────────────────────────────────────────────

interface AuthHeadingProps {
  title: string;
  description?: string;
}

export function AuthHeading({ title, description }: AuthHeadingProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1
        className="text-[22px] font-extrabold text-text-primary leading-tight tracking-tight"
        style={{ fontFamily: "var(--font-head)" }}
      >
        {title}
      </h1>
      {description && (
        <p className="text-[13px] text-text-muted leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

// ── AuthAlert ─────────────────────────────────────────────────────────────────

interface AuthAlertProps {
  message: string;
}

export function AuthAlert({ message }: AuthAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-xl px-3.5 py-3",
        "bg-danger-light/40 border border-danger/20",
        "dark:bg-danger/10 dark:border-danger/25",
        "text-[12.5px] text-danger leading-relaxed"
      )}
    >
      <AlertCircle size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

// ── AuthDivider ───────────────────────────────────────────────────────────────

export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-[11px] text-text-muted uppercase tracking-widest">
      <div className="flex-1 h-px bg-border" />
      {label}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

// ── FieldError ────────────────────────────────────────────────────────────────

interface FieldErrorProps {
  message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p className="text-[11.5px] text-danger leading-snug mt-0.5" role="alert">
      {message}
    </p>
  );
}