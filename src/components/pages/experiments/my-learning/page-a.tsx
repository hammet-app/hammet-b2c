"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Lock,
  Sparkles,
} from "lucide-react";

const courses = [
  {
    number: "01",
    title: "Introduction to AI",
    level: "Beginner",
    modules: 6,
    description:
      "Understand what AI is, how it learns, what it can and cannot do, and how it affects the way we work and live.",
    topics: [
      "How AI learns",
      "AI capabilities and limitations",
      "Responsible AI",
      "AI, work, and society",
    ],
  },
  {
    number: "02",
    title: "Generative AI Fundamentals",
    level: "Beginner",
    modules: 6,
    description:
      "Understand generative AI, the models behind it, how to interact with it, and how to evaluate its outputs responsibly.",
    topics: [
      "Generative AI",
      "Models behind AI",
      "Prompting fundamentals",
      "Output evaluation",
    ],
  },
  {
    number: "03",
    title: "AI Tools for Everyday Work",
    level: "Beginner",
    modules: 7,
    description:
      "Learn how to use AI effectively across writing, research, planning, collaboration, documents, presentations, and workflows.",
    topics: [
      "Writing and communication",
      "Research and analysis",
      "Planning and collaboration",
      "Workflow improvement",
    ],
  },
  {
    number: "04",
    title: "Prompt Engineering",
    level: "Beginner → Intermediate",
    modules: 7,
    description:
      "Move from basic prompting to structured prompt design, refinement, debugging, complex workflows, and prompt evaluation.",
    topics: [
      "Prompt anatomy",
      "Core prompting techniques",
      "Prompt debugging",
      "Structured workflows",
    ],
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1280px]">
        {/* Page heading */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10 max-w-2xl"
        >
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-purple-600 dark:text-cyan-400">
            <BookOpen className="h-3.5 w-3.5" />
            Learning
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl dark:text-white">
            Build your AI foundation.
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
            A structured journey from understanding AI to using it effectively
            and building practical capability.
          </p>
        </motion.header>

        {/* School hero */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="relative mb-12 overflow-hidden rounded-[28px] bg-[#24134F] p-7 text-white shadow-[0_24px_80px_rgba(76,29,149,0.16)] sm:p-9 lg:p-11"
        >
          {/* Ambient geometry */}
          <div className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-[38%] h-[420px] w-[420px] rounded-full bg-purple-500/25 blur-3xl" />

          <div className="pointer-events-none absolute right-16 top-10 hidden h-40 w-40 rotate-12 rounded-[34px] border border-white/10 bg-white/[0.025] lg:block" />
          <div className="pointer-events-none absolute right-32 top-24 hidden h-28 w-28 -rotate-12 rounded-[26px] border border-cyan-300/10 lg:block" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-purple-100">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                School of AI Foundations
              </div>

              <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                Your AI learning journey.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-purple-100/75 sm:text-base">
                Four connected courses designed to take you from AI
                fundamentals through practical AI use and into prompt
                engineering.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/80">
                  4 courses
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/80">
                  26 modules
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/80">
                  Practical work
                </span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Coming soon
              </div>
            </div>
          </div>
        </motion.section>

        {/* Journey heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
            The journey
          </p>

          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.035em]">
                Four courses. One progression.
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Each course builds on what came before it.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Course sequence */}
        <div className="relative">
          {/* Connecting line */}
          <div className="pointer-events-none absolute left-[27px] top-8 hidden h-[calc(100%-64px)] w-px bg-gradient-to-b from-purple-300 via-violet-200 to-cyan-200 dark:from-purple-500/40 dark:via-purple-500/20 dark:to-cyan-500/30 lg:block" />

          <div className="space-y-4">
            {courses.map((course, index) => (
              <motion.article
                key={course.number}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.12 + index * 0.06,
                }}
                className="group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white transition-colors dark:border-white/[0.06] dark:bg-white/[0.03]"
              >
                <div className="grid lg:grid-cols-[72px_1fr_auto]">
                  {/* Number */}
                  <div className="hidden items-start justify-center pt-7 lg:flex">
                    <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-purple-200 bg-[#F5F3FF] text-xs font-bold text-purple-700 dark:border-purple-500/20 dark:bg-[#171126] dark:text-purple-300">
                      {course.number}
                    </div>
                  </div>

                  {/* Course content */}
                  <div className="p-6 sm:p-7 lg:pl-3">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.13em] text-purple-600 dark:text-cyan-400">
                        Course {course.number}
                      </span>

                      <span className="text-slate-300 dark:text-slate-600">
                        ·
                      </span>

                      <span className="text-xs text-slate-400">
                        {course.level}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold tracking-[-0.03em]">
                      {course.title}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {course.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {course.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:bg-white/[0.05] dark:text-slate-400"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Course metadata */}
                  <div className="flex items-end justify-between gap-5 border-t border-black/[0.05] p-6 sm:p-7 lg:flex-col lg:items-end lg:justify-between lg:border-l lg:border-t-0 lg:pl-7">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock3 className="h-3.5 w-3.5" />
                      {course.modules} modules
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <Lock className="h-3.5 w-3.5" />
                      Coming soon
                    </div>
                  </div>
                </div>

                {/* Hover accent */}
                <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-purple-600 to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />
              </motion.article>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="mt-10 flex items-start gap-3 rounded-2xl border border-purple-100 bg-purple-50/70 p-5 dark:border-purple-500/10 dark:bg-purple-500/[0.05]"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-300" />

          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            The School of AI Foundations is currently being prepared. Your
            learning journey will become available here when the school
            launches.
          </p>

          <ArrowRight className="ml-auto mt-0.5 hidden h-4 w-4 shrink-0 text-purple-400 sm:block" />
        </motion.div>
      </div>
    </div>
  );
}