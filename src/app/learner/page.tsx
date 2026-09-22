"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BookOpen,
  FolderKanban,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";

export default function LearnerHomePage() {
  const { user } = useAuth();

  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1280px]">
        {/* Greeting */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">
            Your learning space
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
            Good evening, {firstName}.
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Your learning journey starts here.
          </p>
        </motion.section>

        {/* Learning hero */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="relative mb-10 overflow-hidden rounded-[28px] bg-[#24134F] p-7 text-white shadow-[0_24px_80px_rgba(76,29,149,0.18)] sm:p-9 lg:p-11"
        >
          {/* Ambient light */}
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-purple-500/25 blur-3xl" />

          {/* Decorative geometry */}
          <div className="pointer-events-none absolute right-12 top-10 hidden h-36 w-36 rotate-12 rounded-[32px] border border-white/10 bg-white/[0.03] lg:block" />
          <div className="pointer-events-none absolute right-28 top-24 hidden h-24 w-24 -rotate-12 rounded-[24px] border border-cyan-300/10 lg:block" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-purple-100">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                Your first learning journey
              </div>

              <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                School of AI Foundations
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-purple-100/75 sm:text-base">
                Build your foundation for understanding and working with AI,
                from the fundamentals to practical everyday use.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/80">
                  4 courses
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/80">
                  Beginner → Intermediate
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/80">
                  Practical projects
                </span>
              </div>
            </div>

            <div className="flex lg:justify-end">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Coming soon
              </div>
            </div>
          </div>
        </motion.section>

        {/* Supporting sections */}
        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Work */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
          >
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Evidence
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                  Your work
                </h2>
              </div>

              <Link
                href="/learner/projects"
                className="hidden items-center gap-1 text-sm font-medium text-purple-700 hover:text-purple-800 dark:text-cyan-400 sm:flex"
              >
                View projects
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative min-h-[220px] overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-7 dark:border-white/[0.06] dark:bg-white/[0.03]">
              <div className="flex h-full min-h-[164px] flex-col justify-between">
                <div>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                    <FolderKanban className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-semibold tracking-[-0.025em]">
                    Nothing here yet.
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Projects you complete on Hammet will appear here as
                    evidence of what you can build and do.
                  </p>
                </div>

                <p className="mt-6 text-xs font-medium text-slate-400">
                  Your first projects will arrive with School of AI
                  Foundations.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Passport */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
          >
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Identity
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                Digital Passport
              </h2>
            </div>

            <Link
              href="/learner/passport"
              className="group relative block min-h-[220px] overflow-hidden rounded-2xl bg-[#EDE9FE] p-7 transition-transform duration-300 hover:-translate-y-0.5 dark:bg-[#21183A]"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-400/20 blur-2xl transition-transform duration-500 group-hover:scale-125" />

              <div className="relative flex h-full min-h-[164px] flex-col justify-between">
                <div>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-purple-700 dark:bg-white/[0.08] dark:text-purple-300">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-semibold tracking-[-0.025em]">
                    Your professional record.
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Your profile will bring together what you&apos;ve learned,
                    built, and demonstrated.
                  </p>
                </div>

                <div className="flex items-center gap-1 text-sm font-semibold text-purple-700 dark:text-cyan-400">
                  View passport
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          </motion.section>
        </div>
      </div>
    </div>
  );
}