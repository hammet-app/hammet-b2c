"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Lock,
  GraduationCap,
  Sparkles,
  Zap,
  Award,
} from "lucide-react";
import { GlowingMagicSparkle } from "@/components/ui/vibrant-ai-icons";
import {
  HugeAcademicWatermark,
  HugeCourseAcademicWatermark,
} from "@/components/ui/educational-illustrations";

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
    <div className="relative min-h-screen overflow-x-hidden px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 lg:pt-10 font-poppins bg-[#F8F7FF] dark:bg-[#0B0813]">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[640px] w-[640px] rounded-full bg-gradient-to-tr from-purple-500/12 via-indigo-500/08 to-transparent blur-3xl transform-gpu" />
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[560px] w-[560px] rounded-full bg-gradient-to-bl from-cyan-400/12 via-purple-600/08 to-transparent blur-3xl transform-gpu" />

      <div className="relative mx-auto max-w-[1280px]">
        {/* Page heading */}
        <header
          className="group relative mb-12 mt-20 sm:mt-24 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-white via-purple-50/40 to-indigo-50/50 p-7 sm:p-10 lg:p-12 shadow-[0_12px_40px_rgba(139,92,246,0.10)] dark:border-white/[0.08] dark:bg-gradient-to-br dark:from-[#130E24] dark:via-[#17112C] dark:to-[#0D091A]"
        >
          {/* Peeking Human atop the banner */}
          <div className="pointer-events-none absolute right-6 sm:right-16 top-0 z-30 flex -translate-y-[calc(100%-1px)] select-none flex-row items-end gap-3.5">
            <div className="mb-4 rounded-2xl border border-purple-200/90 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-[0_8px_24px_rgba(0,0,0,0.10)] dark:border-white/10 dark:bg-slate-900 dark:text-cyan-300 sm:text-sm">
              Ready to learn AI! 💡
            </div>
            <img
              src="/peeking-human.png"
              alt="Peeking learner illustration"
              className="h-24 w-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)] sm:h-28"
            />
          </div>

          {/* Inner background container with overflow-hidden */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            {/* Subtle Ambient Radial Glowing Lights */}
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15" />
            <div className="absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-cyan-400/08 blur-3xl dark:bg-cyan-500/10" />
            
            {/* Coordinate dot grid pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#8B5CF6_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-[0.05] dark:opacity-[0.08]" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-purple-700 shadow-sm dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-300">
              <GlowingMagicSparkle size="xs" />
              <span>AI Learner Portal</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
              My learning
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
              Build your AI foundation. A structured journey from understanding AI to using it effectively and building practical capability.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-purple-800 shadow-xs dark:border-white/10 dark:bg-white/5 dark:text-purple-300">
                <GraduationCap className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
                <span>Accredited AI Curriculums</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-indigo-800 shadow-xs dark:border-white/10 dark:bg-white/5 dark:text-indigo-300">
                <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Self-Paced Mastery</span>
              </span>
            </div>
          </div>
        </header>

        {/* School hero */}
        <section
          className="relative mb-12 overflow-hidden rounded-[28px] bg-[#24134F] p-7 text-white shadow-[0_24px_80px_rgba(76,29,149,0.16)] sm:p-9 lg:p-11"
        >
          {/* Ambient geometry */}
          <div className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-[38%] h-[420px] w-[420px] rounded-full bg-purple-500/25 blur-3xl" />

          {/* Academic watermark in hero section */}
          <div className="pointer-events-none absolute -right-4 -bottom-6 h-64 w-64 opacity-10 text-white select-none">
            <HugeAcademicWatermark className="h-full w-full" />
          </div>

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-purple-100">
                <GlowingMagicSparkle size="xs" />
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
                Enrolled Curriculum
              </div>
            </div>
          </div>
        </section>

        {/* Journey heading */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-purple-600 dark:text-cyan-400">
            The journey
          </p>

          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Four courses. One progression.
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Each course builds on what came before it.
              </p>
            </div>
          </div>
        </div>

        {/* Course sequence */}
        <div className="relative">
          {/* Connecting line */}
          <div className="pointer-events-none absolute left-[27px] top-8 hidden h-[calc(100%-64px)] w-px bg-gradient-to-b from-purple-300 via-violet-200 to-cyan-200 dark:from-purple-500/40 dark:via-purple-500/20 dark:to-cyan-500/30 lg:block" />

          <div className="space-y-4">
            {courses.map((course) => (
              <article
                key={course.number}
                className="group relative overflow-hidden rounded-3xl border border-purple-500/15 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-purple-500/35 dark:border-white/[0.08] dark:bg-[#151221] dark:hover:border-cyan-500/30"
              >
                {/* Background container */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute inset-0 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] dark:opacity-[0.06]" />
                  {/* Huge Course Academic Watermark at top-right */}
                  <div className="absolute -right-2 top-2 h-32 w-32 pointer-events-none select-none text-purple-600/[0.06] dark:text-cyan-400/[0.07] transition-transform duration-500 group-hover:scale-105">
                    <HugeCourseAcademicWatermark className="h-full w-full" />
                  </div>
                </div>

                <div className="relative z-10 grid lg:grid-cols-[72px_1fr_auto]">
                  {/* Number */}
                  <div className="hidden items-start justify-center pt-7 lg:flex">
                    <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-200 bg-[#F5F3FF] text-xs font-bold text-purple-700 shadow-xs dark:border-purple-500/20 dark:bg-[#171126] dark:text-purple-300">
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

                    <h3 className="text-xl font-bold tracking-[-0.03em] text-slate-900 group-hover:text-purple-700 transition-colors dark:text-white dark:group-hover:text-cyan-300">
                      {course.title}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {course.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {course.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full bg-slate-100/80 border border-slate-200/60 px-3 py-1 text-[11px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-400"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Course metadata - Clean bottom row */}
                  <div className="flex items-end justify-between gap-5 border-t border-slate-100 p-6 sm:p-7 dark:border-white/[0.06] lg:flex-col lg:items-end lg:justify-between lg:border-l lg:border-t-0 lg:pl-7">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock3 className="h-3.5 w-3.5" />
                      {course.modules} modules
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-cyan-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Ready to Learn</span>
                    </div>
                  </div>
                </div>

                {/* Hover accent */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-purple-600 to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />
              </article>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div
          className="mt-10 flex items-start gap-3 rounded-2xl border border-purple-200/80 bg-purple-50/70 p-5 shadow-xs dark:border-purple-500/15 dark:bg-purple-500/[0.05]"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-300" />

          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            The School of AI Foundations is active on your profile. Your self-paced AI curriculum is ready for you to study without delay.
          </p>

          <ArrowRight className="ml-auto mt-0.5 hidden h-4 w-4 shrink-0 text-purple-400 sm:block" />
        </div>
      </div>
    </div>
  );
}
