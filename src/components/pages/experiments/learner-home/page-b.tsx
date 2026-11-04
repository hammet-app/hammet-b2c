"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  FolderKanban,
  Brain,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  HelpCircle,
  Lock,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { GlowingMagicSparkle } from "@/components/ui/vibrant-ai-icons";
import { TitleIcon, DoodleKicker } from "@/components/ui/section-title";
import {
  KnowledgeAppleIcon,
  MilestoneSignIcon,
  TerminalDoodleIcon,
  NeuroBotIcon,
} from "@/components/ui/character-icons";
import { LearningSnapshot } from "@/components/learner/learning-snapshot";

import { useAuth } from "@/lib/auth/auth-context";

export default function LearnerHomePage() {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(" ")[0] ?? "there";
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-screen px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 lg:pt-10">
      <div className="mx-auto max-w-[1280px]">
        {/* Greeting */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-purple-200/80 bg-white/95 px-4 py-1.5 shadow-[0_4px_20px_rgba(139,92,246,0.08)] dark:border-purple-500/30 dark:bg-purple-950/40 dark:shadow-[0_4px_20px_rgba(139,92,246,0.2)]">
            <div className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            </div>
            <span className="font-poppins text-xs font-semibold tracking-tight text-purple-950 dark:text-purple-200">
              Cohort 2026
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500/15 to-cyan-500/15 px-2.5 py-0.5 font-poppins text-[10.5px] font-semibold text-purple-800 dark:text-cyan-200 border border-purple-300/30 dark:border-cyan-400/30">
              <GlowingMagicSparkle size="xs" />
              Active Lab
            </span>
          </div>

          <h1 className="mt-3 flex flex-wrap items-center gap-2.5 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:gap-3 sm:text-4xl lg:text-5xl dark:text-white">
            <motion.span
              aria-hidden="true"
              className="inline-flex shrink-0 items-center justify-center"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { rotate: [0, 18, -10, 16, -6, 0], y: [0, -3, 0, -2, 0] }
              }
              transition={{
                duration: 1.1,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 2.6,
              }}
            >
              <img
                src="/waving-hand.png"
                alt=""
                className="h-9 w-9 select-none object-contain drop-shadow-[0_6px_10px_rgba(139,92,246,0.32)] sm:h-11 sm:w-11 lg:h-13 lg:w-13"
              />
            </motion.span>
            <span>Welcome back, {firstName}.</span>
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Your personalized intelligence workspace is ready. Pick up right where you left off.
          </p>
        </motion.section>

        {/* Learning hero with AI sketched bot welcoming you */}
        <div className="relative mb-14 mt-12 sm:mt-16">
          {/* Learning hero card */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="relative rounded-[28px] bg-[#160B30] p-7 text-white shadow-[0_24px_80px_rgba(76,29,149,0.28)] border border-purple-500/30 sm:p-9 lg:p-11"
          >
            {/* AI sketched bot sitting exactly on the top-right border line */}
            <motion.div
              initial={{ opacity: 0, y: -18, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.2 }}
              className="absolute top-0 right-4 sm:right-12 -translate-y-full z-20 pointer-events-none flex items-end gap-2"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 6 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.45 }}
                className="mb-5 hidden rounded-2xl rounded-br-sm border border-purple-200/50 bg-white/95 px-3.5 py-1.5 text-[11px] font-semibold text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.12)] backdrop-blur sm:block dark:border-cyan-500/30 dark:bg-slate-900/95 dark:text-cyan-300"
              >
                Welcome! Let&apos;s build AI 🤖
              </motion.div>
              <img
                src="/ai-bot-welcome.png"
                alt="AI Assistant bot welcoming you"
                className="h-20 sm:h-28 w-auto object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)] select-none pointer-events-none"
              />
            </motion.div>

            {/* Inner background container with overflow-hidden */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
              {/* Background image representing AI & neural networks */}
              <div
                className="absolute inset-0 bg-cover bg-right sm:bg-center opacity-30 mix-blend-screen transition-opacity duration-700"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1600')`,
                }}
              />

              {/* Neural glow & ambient lighting */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#160B30] via-[#160B30]/85 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#160B30]/90 via-transparent to-transparent" />
              <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl" />

              {/* Subtle glowing AI Neural Core icon at bottom-right corner */}
              <div className="absolute -right-8 -bottom-10 z-0 opacity-15 transition-transform duration-700 hover:scale-105">
                <svg
                  width="280"
                  height="280"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-purple-400 drop-shadow-[0_0_16px_rgba(168,85,247,0.3)] animate-pulse"
                >
                  <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="1.75" strokeDasharray="6 4" />
                  <circle cx="100" cy="100" r="24" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
                  <circle cx="100" cy="40" r="8" stroke="currentColor" strokeWidth="1.75" fill="#160B30" />
                  <circle cx="100" cy="160" r="8" stroke="currentColor" strokeWidth="1.75" fill="#160B30" />
                  <circle cx="40" cy="100" r="8" stroke="currentColor" strokeWidth="1.75" fill="#160B30" />
                  <circle cx="160" cy="100" r="8" stroke="currentColor" strokeWidth="1.75" fill="#160B30" />
                  <path d="M100 48V76M100 124V152M48 100H76M124 100H152" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </div>
            </div>

            <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200 backdrop-blur-sm">
                  <Brain className="h-3.5 w-3.5 text-cyan-300" />
                  Your first learning journey
                </div>

                <h2 className="max-w-xl text-3xl font-bold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                  School of{" "}
                  <span className="bg-gradient-to-r from-fuchsia-300 via-violet-300 to-cyan-300 bg-clip-text font-black text-transparent">
                    AI
                  </span>{" "}
                  <span className="bg-gradient-to-r from-violet-200 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                    Foundations
                  </span>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-purple-100/80 sm:text-base">
                  Build your foundation for understanding and working with AI,
                  from mathematical fundamentals to practical everyday autonomous systems.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm">
                    4 core courses
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm">
                    Beginner → Intermediate
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm">
                    Practical projects & labs
                  </span>
                </div>
              </div>

              <div className="flex lg:justify-end">
                <Link
                  href="/learner/ai-schools"
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-cyan-200 shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-300/30 hover:scale-[1.02]"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-300 animate-ping" />
                  Explore School
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Available AI Schools Section with Glowing Huge Background Icon */}
        <div className="mb-14">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <DoodleKicker tone="violet" icon={<KnowledgeAppleIcon size="sm" />}>
                Explore Academies
              </DoodleKicker>
              <h2 className="mt-2 flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                <TitleIcon icon={BookOpen} tone="indigo" size="sm" />
                <span>Available AI Schools</span>
              </h2>
            </div>
            <Link
              href="/learner/ai-schools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 hover:text-purple-800 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
            >
              Browse all schools
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-white via-purple-50/20 to-purple-100/10 p-7 shadow-md sm:p-9 dark:border-purple-500/20 dark:from-white/[0.04] dark:via-purple-950/10 dark:to-transparent"
          >
            {/* Subtle Glowing Purple Graduation Cap & Open Book in Bottom Right Corner */}
            <div className="pointer-events-none absolute -right-6 -bottom-8 z-0 opacity-15 dark:opacity-10 transition-transform duration-700 group-hover:scale-105">
              <svg
                width="340"
                height="340"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-purple-600 dark:text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.25)]"
              >
                {/* Mortarboard Cap */}
                <path
                  d="M100 25L175 62L100 99L25 62L100 25Z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M50 75V125C50 145 75 160 100 160C125 160 150 145 150 125V75"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M175 62V125C175 130 178 135 182 135C186 135 189 130 189 125V70"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Academic Open Book */}
                <path
                  d="M30 175C55 165 80 168 100 178C120 168 145 165 170 175V135C145 125 120 128 100 138C80 128 55 125 30 135V175Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                    Full Diploma Track
                  </span>
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-bold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                    4 Core Courses
                  </span>
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                    School of AI Foundations
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300 max-w-xl">
                  Comprehensive industry-recognized tracks designed to take you from foundational mathematics and prompt engineering to production autonomous agent architectures.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Hours of Content
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Hands-on Projects
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Accredited Certificate
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4">
                <div className="text-left lg:text-right">
                  <p className="text-xs uppercase font-semibold text-slate-400">Complete Academy Tuition</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-slate-950 dark:text-white">₦25,000</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Save 20% Bundle
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                  <Link
                    href="/learner/ai-schools/ai-foundations"
                    className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-600/25 transition-all hover:bg-purple-700 hover:scale-[1.02]"
                  >
                    View Curriculum
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── DATA-DRIVEN SNAPSHOT + LEARNING LOOP ── */}
        <div className="mb-16">
          <div className="mb-6">
            <DoodleKicker tone="cyan" icon={<MilestoneSignIcon size="sm" />}>
              The learning loop
            </DoodleKicker>
            <h2 className="mt-2 flex items-center gap-2.5 text-3xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-4xl dark:text-white">
              <TitleIcon icon={Workflow} tone="violet" size="md" />
              <span>From your first module to your final project.</span>
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Schools, courses, modules, quizzes, and project submissions — one workspace, one path forward.
            </p>
          </div>

          <LearningSnapshot />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {/* Card 1: Courses & modules */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-7 shadow-sm transition-all hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.02]"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-purple-600 dark:text-cyan-400">Courses & modules</span>
                    <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                      Follow a structured path, not a playlist.
                    </h3>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-hover:bg-purple-600 group-hover:text-white dark:bg-white/10 dark:text-slate-300">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Course progress list */}
                <div className="mt-6 rounded-2xl border border-black/[0.06] bg-slate-50/70 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <div className="flex items-center justify-between gap-2 border-b border-black/[0.05] pb-2.5 dark:border-white/[0.05]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <GraduationCap className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                      School of AI Foundations
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                      4 courses
                    </span>
                  </div>

                  <div className="divide-y divide-black/[0.04] text-xs dark:divide-white/[0.04]">
                    <div className="flex items-center justify-between gap-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          Module 01 · Foundations
                        </span>
                      </div>
                      <span className="shrink-0 whitespace-nowrap text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Completed
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                          <span className="h-2.5 w-2.5 rounded-full bg-purple-600 ring-4 ring-purple-100 dark:bg-cyan-400 dark:ring-cyan-500/20" />
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          Module 02 · Prompt engineering
                        </span>
                      </div>
                      <span className="shrink-0 whitespace-nowrap text-[10px] font-bold text-purple-600 dark:text-cyan-400">
                        In progress
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                        <span className="font-medium text-slate-500 dark:text-slate-400">
                          Module 03 · Model evaluation
                        </span>
                      </div>
                      <span className="shrink-0 whitespace-nowrap text-[10px] font-bold text-slate-400">Up next</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                        <span className="font-medium text-slate-500 dark:text-slate-400">
                          Module 04 · Applied project
                        </span>
                      </div>
                      <span className="shrink-0 whitespace-nowrap text-[10px] font-bold text-slate-400">Locked</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px] font-semibold">
                    <span className="text-slate-500 dark:text-slate-400">
                      1 of 7 modules complete
                    </span>
                    <span className="text-purple-600 dark:text-cyan-400">14%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
                    <div className="h-full w-[14%] rounded-full bg-purple-600 dark:bg-cyan-400" />
                  </div>
                </div>
              </div>

              <Link
                href="/learner/ai-schools"
                className="mt-5 flex items-center justify-between rounded-full border border-black/[0.08] bg-white px-4 py-2.5 shadow-sm transition hover:border-purple-300 dark:border-white/10 dark:bg-slate-900/90 dark:hover:border-cyan-500/40"
              >
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <BookOpen className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                  Continue your curriculum
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-purple-600 transition-transform group-hover:translate-x-0.5 dark:text-cyan-400" />
              </Link>
            </motion.div>

            {/* Card 2: Module quizzes */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-7 shadow-sm transition-all hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.02]"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">Module quizzes</span>
                    <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                      Check what you know before moving on.
                    </h3>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-hover:bg-purple-600 group-hover:text-white dark:bg-white/10 dark:text-slate-300">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Sample quiz question */}
                <div className="mt-6 rounded-2xl border border-black/[0.06] bg-slate-50/70 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <div className="flex items-center justify-between gap-2 border-b border-black/[0.05] pb-2 dark:border-white/[0.05]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <HelpCircle className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      Module quiz
                    </div>
                    <span className="rounded bg-slate-200/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      Question 3 of 5
                    </span>
                  </div>

                  <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
                    Which of these best describes supervised learning?
                  </p>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2.5 rounded-xl border border-purple-300 bg-white px-3 py-2 text-[11px] font-medium text-purple-950 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-100">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-purple-600 font-mono text-[10px] font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
                        A
                      </span>
                      Learning from labelled examples
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl border border-black/[0.05] bg-white px-3 py-2 text-[11px] font-medium text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-400">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 font-mono text-[10px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-400">
                        B
                      </span>
                      Learning from rewards and penalties
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl border border-black/[0.05] bg-white px-3 py-2 text-[11px] font-medium text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-400">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 font-mono text-[10px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-400">
                        C
                      </span>
                      Learning without any training data
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    Answers save as you go
                  </div>
                </div>
              </div>

              <Link
                href="/learner/ai-schools"
                className="mt-5 flex items-center justify-between rounded-full border border-black/[0.08] bg-white px-4 py-2.5 shadow-sm transition hover:border-cyan-300 dark:border-white/10 dark:bg-slate-900/90 dark:hover:border-cyan-500/40"
              >
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  Open a course to take a quiz
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-cyan-600 transition-transform group-hover:translate-x-0.5 dark:text-cyan-400" />
              </Link>
            </motion.div>

            {/* Card 3: Project workspace */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="group relative md:col-span-2 overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-7 shadow-sm transition-all hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.02]"
            >
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="max-w-xl">
                  <span className="text-xs font-semibold text-purple-600 dark:text-cyan-400">
                    Project workspace
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                    Turn each module into something you can show.
                  </h3>
                  <p className="mt-1 max-w-lg text-xs text-slate-600 dark:text-slate-400">
                    Submit your project link, track your progress, and keep every build in one place.
                  </p>
                  <Link
                    href="/learner/projects"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 transition-colors hover:text-purple-800 dark:text-cyan-400 dark:hover:text-cyan-300"
                  >
                    Open project workspace
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>

                {/* Sample project submission card */}
                <div className="w-full max-w-sm rounded-2xl border border-black/[0.06] bg-slate-50/70 p-4 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-cyan-300">
                        <FolderKanban className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Prompt evaluation harness
                        </p>
                        <p className="text-[10px] text-slate-400">Project submission</p>
                      </div>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                      In progress
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-black/[0.05] bg-white px-2.5 py-1.5 text-[10px] text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-slate-400">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    github.com/your-name/project
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                    <span>Progress</span>
                    <span className="text-purple-600 dark:text-cyan-400">65%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
                    <div className="h-full w-[65%] rounded-full bg-purple-600 dark:bg-cyan-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Supporting sections with Huge Glowing Line-Art Icons */}
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Work / Evidence */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
          >
            <div className="mb-4 flex items-end justify-between">
              <div>
                <DoodleKicker tone="indigo" icon={<TerminalDoodleIcon size="sm" />}>
                  Evidence
                </DoodleKicker>
                <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold tracking-[-0.03em]">
                  <TitleIcon icon={FolderKanban} tone="indigo" size="sm" />
                  <span>Your work</span>
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

            <div className="group relative min-h-[220px] overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-7 shadow-sm transition-all hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.03]">
              {/* Huge glowing Code Terminal & Quantum Flask Icon in Bottom Right */}
              <div className="pointer-events-none absolute -right-6 -bottom-8 z-0 opacity-25 dark:opacity-20 transition-transform duration-700 group-hover:scale-105">
                <svg
                  width="220"
                  height="220"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-purple-600 dark:text-cyan-400 drop-shadow-[0_0_16px_rgba(168,85,247,0.3)] animate-pulse"
                >
                  <rect x="25" y="30" width="150" height="110" rx="14" stroke="currentColor" strokeWidth="3" />
                  <path d="M25 60H175" stroke="currentColor" strokeWidth="2" />
                  <circle cx="45" cy="45" r="3" fill="currentColor" />
                  <circle cx="58" cy="45" r="3" fill="currentColor" />
                  <circle cx="71" cy="45" r="3" fill="currentColor" />
                  <path d="M50 90L70 105L50 120" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M85 120H125" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              <div className="relative z-10 flex h-full min-h-[164px] flex-col justify-between">
                <div>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                    <FolderKanban className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-semibold tracking-[-0.025em]">
                    Nothing here yet.
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Projects you complete on Hammet will appear here as
                    verifiable evidence of what you can build and do.
                  </p>
                </div>

                <p className="mt-6 text-xs font-medium text-slate-400">
                  Your first projects will arrive with School of AI Foundations.
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
              <DoodleKicker tone="amber" icon={<NeuroBotIcon size="sm" />}>
                Identity
              </DoodleKicker>
              <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold tracking-[-0.03em]">
                <TitleIcon icon={ShieldCheck} tone="amber" size="sm" />
                <span>Digital Passport</span>
              </h2>
            </div>

            <Link
              href="/learner/passport"
              className="group relative block min-h-[220px] overflow-hidden rounded-2xl bg-[#EDE9FE] p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-[#21183A]"
            >
              {/* Huge glowing Accreditation Shield Icon in Bottom Right */}
              <div className="pointer-events-none absolute -right-6 -bottom-8 z-0 opacity-30 dark:opacity-25 transition-transform duration-700 group-hover:scale-105">
                <svg
                  width="220"
                  height="220"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-purple-700 dark:text-purple-300 drop-shadow-[0_0_16px_rgba(147,51,234,0.35)]"
                >
                  <path
                    d="M100 20L160 50V110C160 150 100 180 100 180C100 180 40 150 40 110V50L100 20Z"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="currentColor"
                    fillOpacity="0.05"
                  />
                  <path
                    d="M80 100L95 115L125 85"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="relative z-10 flex h-full min-h-[164px] flex-col justify-between">
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