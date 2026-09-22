"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
} from "lucide-react";

import { useTheme } from "@/lib/use-theme";
import Image from "next/image";

const courses = [
  {
    number: "01",
    title: "Introduction to AI",
    description:
      "What it is, what it isn't, and how to talk about it without bluffing.",
    topics: ["How AI learns", "Capabilities", "Limitations"],
  },
  {
    number: "02",
    title: "Generative AI Fundamentals",
    description:
      "How tools like ChatGPT produce what they do, and where they get it wrong.",
    topics: ["Generative AI", "Models", "Output evaluation"],
  },
  {
    number: "03",
    title: "AI Tools for Everyday Work",
    description:
      "Faster research, cleaner writing, less admin. The tools worth your time.",
    topics: ["Research", "Writing", "Workflows"],
  },
  {
    number: "04",
    title: "Prompt Engineering",
    description:
      "How to ask, so you get answers you can actually use.",
    topics: ["Prompt design", "Refinement", "Real tasks"],
  },
];

export default function HomePage() {
  const { theme, toggle } = useTheme();

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F3FF] text-[#17131F] transition-colors duration-300 dark:bg-[#0D0A17] dark:text-white">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-purple-400/15 blur-[120px] dark:bg-purple-700/15" />

        <div className="absolute right-[-180px] top-[28%] h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-[120px] dark:bg-cyan-500/10" />

        <div className="absolute bottom-[-220px] left-[30%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[130px] dark:bg-violet-700/10" />
      </div>

      {/* Navigation */}
      <header className="relative z-20">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="text-[23px] font-black tracking-[-0.05em]"
          >
            <Image
              src="/icon-512x512.png"
              alt="Hammet"
              width={130}
              height={34}
              className="h-8 w-auto mb-4"
            />
            <span className="bg-gradient-to-r from-purple-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              Hammet
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400 md:flex">
            <a
              href="#courses"
              className="transition hover:text-slate-950 dark:hover:text-white"
            >
              Courses
            </a>

            <a
              href="#fellowship"
              className="transition hover:text-slate-950 dark:hover:text-white"
            >
              Fellowship
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggle}
              aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } mode`}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-black/[0.05] hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              <span className="text-lg leading-none">
                {theme === "dark" ? "☼" : "◐"}
              </span>
            </button>

            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-[#17131F] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-purple-800 dark:bg-white dark:text-[#17131F] dark:hover:bg-cyan-100"
            >
              Start learning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:px-10 lg:pb-32 lg:pt-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            {/* Copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/60 px-3.5 py-2 text-xs font-semibold text-purple-700 backdrop-blur-sm dark:border-purple-400/15 dark:bg-white/[0.04] dark:text-purple-300">
                <Sparkles className="h-3.5 w-3.5" />
                AI education without the noise
              </div>

              <h1 className="max-w-4xl text-[clamp(3.25rem,7vw,6.6rem)] font-black leading-[0.91] tracking-[-0.065em] text-[#17131F] dark:text-white">
                Learn AI properly.
                <span className="mt-2 block bg-gradient-to-r from-purple-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  Start with what you&apos;ll actually use.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400 sm:text-xl">
                Short, practical courses for students, graduates and
                working people. No coding background needed. No jargon
                walls.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#17131F] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-purple-950/10 transition hover:-translate-y-0.5 hover:bg-purple-800 dark:bg-white dark:text-[#17131F] dark:hover:bg-cyan-100"
                >
                  Start learning
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="#courses"
                  className="inline-flex items-center gap-2 px-2 py-3.5 text-sm font-semibold text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                >
                  Explore the courses
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: "easeOut",
              }}
              className="relative mx-auto w-full max-w-[560px]"
            >
              <div className="relative aspect-[0.92] overflow-hidden rounded-[2rem] bg-[#17131F] shadow-2xl shadow-purple-950/20 dark:bg-[#120E1D] dark:shadow-black/40">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                    backgroundSize: "44px 44px",
                  }}
                />

                <div
                  aria-hidden="true"
                  className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-400/30 blur-[90px]"
                />

                <div
                  aria-hidden="true"
                  className="absolute -bottom-24 -left-20 h-96 w-96 rounded-full bg-purple-600/50 blur-[100px]"
                />

                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative h-full w-full">
                    <div className="absolute left-[8%] top-[13%] h-32 w-32 rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur-xl" />

                    <div className="absolute bottom-[12%] right-[5%] h-40 w-40 rounded-[2.5rem] border border-cyan-300/20 bg-cyan-300/[0.05] backdrop-blur-xl" />

                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute left-[13%] top-[23%] w-[74%] rounded-[1.75rem] border border-white/10 bg-white/[0.09] p-6 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                          Hammet / AI Foundations
                        </span>

                        <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.8)]" />
                      </div>

                      <div className="mt-12">
                        <p className="text-sm text-white/45">
                          Your learning journey
                        </p>

                        <p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
                          Understand.
                          <br />
                          Then use it.
                        </p>
                      </div>

                      <div className="mt-10 space-y-2">
                        <div className="h-2 rounded-full bg-white/10">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "38%" }}
                            transition={{
                              duration: 1.2,
                              delay: 0.6,
                            }}
                            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-cyan-300"
                          />
                        </div>

                        <div className="flex justify-between text-[11px] text-white/35">
                          <span>AI Foundations</span>
                          <span>Practical</span>
                        </div>
                      </div>
                    </motion.div>

                    <div className="absolute bottom-[10%] left-[9%] rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 backdrop-blur-xl">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                        No coding required
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Opening */}
      <section className="relative z-10 border-y border-black/[0.06] bg-white/45 dark:border-white/[0.06] dark:bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-[0.28fr_0.72fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
                Why Hammet
              </p>
            </div>

            <div>
              <p className="max-w-4xl text-2xl font-medium leading-[1.35] tracking-[-0.025em] text-[#27222F] dark:text-slate-200 sm:text-3xl lg:text-[2.65rem] lg:leading-[1.25]">
                You&apos;ve seen what people are doing with AI. Maybe
                you&apos;ve tried it yourself and got answers that felt
                flat. Maybe you&apos;re wondering if the person next to
                you is quietly pulling ahead.
              </p>

              <p className="mt-8 max-w-3xl text-base leading-7 text-slate-500 dark:text-slate-500 sm:text-lg">
                You don&apos;t need a computer science degree. You need
                someone to show you properly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
              The foundation
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#17131F] dark:text-white sm:text-5xl lg:text-6xl">
              Four courses.
              <br />
              <span className="text-slate-400 dark:text-slate-600">
                One useful foundation.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400 sm:text-lg">
              Each course is 6 to 7 modules. Small enough to finish,
              deep enough to matter.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {courses.map((course, index) => (
              <motion.article
                key={course.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-black/[0.07] bg-white/70 p-7 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-950/[0.06] dark:border-white/[0.07] dark:bg-white/[0.035] dark:hover:border-purple-400/20 dark:hover:bg-white/[0.05] dark:hover:shadow-black/20 sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold tracking-[0.08em] text-purple-600 dark:text-purple-400">
                    {course.number}
                  </span>

                  <ArrowUpRight className="h-5 w-5 text-slate-300 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-purple-500 dark:text-slate-600 dark:group-hover:text-purple-400" />
                </div>

                <h3 className="mt-12 max-w-md text-2xl font-bold tracking-[-0.035em] text-[#17131F] dark:text-white sm:text-[1.75rem]">
                  {course.title}
                </h3>

                <p className="mt-4 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                  {course.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {course.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-[#F5F3FF] px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:bg-white/[0.05] dark:text-slate-400"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  <span>6–7 modules</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span>Practical</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Fellowship */}
      <section id="fellowship" className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10 lg:pb-32">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#17131F] px-7 py-12 shadow-2xl shadow-purple-950/15 dark:bg-[#120E1D] dark:shadow-black/40 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                backgroundSize: "52px 52px",
              }}
            />

            <div
              aria-hidden="true"
              className="absolute -right-32 -top-40 h-[480px] w-[480px] rounded-full bg-cyan-400/20 blur-[100px]"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-40 -left-32 h-[480px] w-[480px] rounded-full bg-purple-600/30 blur-[100px]"
            />

            <div className="relative grid items-end gap-12 lg:grid-cols-[1fr_auto]">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-semibold text-white/60 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  Coming next
                </div>

                <h2 className="mt-7 text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
                  The Hammet
                  <span className="block text-cyan-300">
                    AI Fellowship.
                  </span>
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
                  Nine months, for ages 18 to 26, with real practice
                  inside real companies.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {["9 months", "Ages 18–26", "Real companies"].map(
                    (item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-2 text-xs font-medium text-white/60"
                      >
                        <Check className="h-3.5 w-3.5 text-cyan-300" />
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>

              <a
                href=""
                className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#17131F] transition hover:-translate-y-0.5 hover:bg-cyan-100"
              >
                Join the waitlist
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 pb-28 pt-4 text-center sm:px-8 lg:px-10 lg:pb-36">
          <p className="text-3xl font-black tracking-[-0.045em] text-[#17131F] dark:text-white sm:text-4xl lg:text-5xl">
            Your first course
            <span className="text-purple-600 dark:text-purple-400">
              {" "}
              is already waiting.
            </span>
          </p>

          <Link
            href="/register"
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#17131F] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-purple-950/10 transition hover:-translate-y-0.5 hover:bg-purple-800 dark:bg-white dark:text-[#17131F] dark:hover:bg-cyan-100"
          >
            Create your account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-slate-400 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span className="font-bold tracking-[-0.03em] text-slate-500 dark:text-slate-400">
            Hammet
          </span>

          <span>
            Learn AI properly. Build something useful.
          </span>
        </div>
      </footer>
    </main>
  );
}