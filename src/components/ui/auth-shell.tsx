"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/utils";
import { Moon, Sun } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/lib/use-theme";

// ── AuthShell ────────────────────────────────────────────────────────────────

interface AuthShellProps {
  children: ReactNode;
  /** Optionally widen the card for multi-column steps */
  wide?: boolean;
}

export function AuthShell({ children }: AuthShellProps) {
  const { theme, toggle } = useTheme();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-text-primary">
      {/* Ambient colour field */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -left-40 -top-40",
          "h-[520px] w-[520px] rounded-full blur-[120px]",
          "bg-purple/20 dark:bg-cyan/10"
        )}
      />

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -bottom-48 -right-40",
          "h-[560px] w-[560px] rounded-full blur-[130px]",
          "bg-cyan/12 dark:bg-purple/10"
        )}
      />

      {/* Subtle central glow */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2",
          "h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2",
          "rounded-full blur-[140px]",
          "bg-purple/8 dark:bg-cyan/5"
        )}
      />

      {/* Header */}
      <header className="relative z-20 flex h-16 items-center justify-between px-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[9px]"
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
            className="text-[14px] font-bold tracking-tight"
            style={{ fontFamily: "var(--font-head)" }}
          >
            Hammet
          </span>
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-label={
            theme === "dark"
              ? "Switch to light theme"
              : "Switch to dark theme"
          }
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            "border border-border/70 bg-surface/60 backdrop-blur-sm",
            "text-text-muted transition-all duration-200",
            "hover:border-purple/30 hover:bg-purple/5 hover:text-purple",
            "dark:hover:border-cyan/30 dark:hover:bg-cyan/5 dark:hover:text-cyan",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-purple/30 dark:focus-visible:ring-cyan/30"
          )}
        >
          {theme === "dark" ? (
            <Sun size={15} strokeWidth={2} />
          ) : (
            <Moon size={15} strokeWidth={2} />
          )}
        </button>
      </header>

      {/* Authentication environment */}
      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(390px,460px)] lg:gap-16 xl:gap-24">
          {/* Editorial / visual side */}
          <div className="relative hidden min-h-[620px] items-center lg:flex">
            {/* Colour field */}
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute -left-20 top-1/2",
                "h-[560px] w-[560px] -translate-y-1/2 rounded-[120px]",
                "rotate-[-8deg] opacity-95",
                "bg-gradient-to-br from-purple via-[#6D28D9] to-[#4C1D95]",
                "shadow-[0_40px_120px_rgba(91,33,182,0.22)]",
                "dark:from-[#31206B] dark:via-[#24134F] dark:to-[#120B2A]",
                "dark:shadow-[0_40px_120px_rgba(6,182,212,0.08)]"
              )}
            />

            {/* Cyan colour wash */}
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute left-[310px] top-[110px]",
                "h-[220px] w-[220px] rounded-full blur-[70px]",
                "bg-cyan/35 dark:bg-cyan/20"
              )}
            />

            {/* Purple colour wash */}
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute -left-8 bottom-[90px]",
                "h-[260px] w-[260px] rounded-full blur-[80px]",
                "bg-[#A855F7]/30 dark:bg-purple/20"
              )}
            />

            <div className="relative z-10 w-full max-w-[600px] px-12">
              {/* Decorative geometry */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-2 -top-12 z-0 h-24 w-24 rotate-12 rounded-[28px] border border-white/20 bg-white/10 backdrop-blur-sm"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-4 z-0 h-14 w-14 rounded-full border border-cyan/40 bg-cyan/10"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-24 z-0 h-8 w-8 rotate-45 rounded-[10px] bg-cyan/30"
              />

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="relative z-10"
              >
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan">
                  Hammet
                </p>

                <h2
                  className="max-w-[560px] text-[clamp(3.5rem,6vw,6.5rem)] font-extrabold leading-[0.88] tracking-[-0.065em] text-white"
                  style={{ fontFamily: "var(--font-head)" }}
                >
                  Learn.
                  <br />
                  Build.
                  <br />
                  <span className="text-cyan">Create.</span>
                </h2>

                <p className="mt-8 max-w-[420px] text-[15px] leading-7 text-white/75">
                  Education for people who want to understand
                  what they build—and build something worth
                  understanding.
                </p>
              </motion.div>

              {/* Abstract visual language */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 right-0 h-[250px] w-[330px]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: -6 }}
                  animate={{ opacity: 1, y: 0, rotate: -6 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15,
                    ease: "easeOut",
                  }}
                  className="absolute right-12 top-10 h-32 w-52 rounded-[28px] border border-white/20 bg-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.12)] backdrop-blur-md"
                />

                <motion.div
                  initial={{ opacity: 0, y: 24, rotate: 8 }}
                  animate={{ opacity: 1, y: 0, rotate: 8 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.25,
                    ease: "easeOut",
                  }}
                  className="absolute right-0 top-20 h-32 w-52 rounded-[28px] border border-cyan/30 bg-cyan/15 shadow-[0_20px_70px_rgba(6,182,212,0.15)] backdrop-blur-md"
                />

                <div className="absolute left-12 top-0 h-24 w-24 rounded-full border border-white/20" />

                <div className="absolute left-[84px] top-[28px] h-2 w-2 rounded-full bg-cyan shadow-[0_0_14px_rgba(6,182,212,0.8)]" />
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="flex w-full items-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              className="w-full"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
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