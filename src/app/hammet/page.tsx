"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  Plus,
  Users,
} from "lucide-react";

const stats = [
  {
    label: "AI Schools",
    value: "2",
    description: "Learning environments",
    icon: Building2,
    className:
      "bg-[#EDE9FE] text-purple-700 dark:bg-[#21183A] dark:text-purple-300",
  },
  {
    label: "Courses",
    value: "8",
    description: "Across all schools",
    icon: BookOpen,
    className:
      "bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300",
  },
  {
    label: "Learners",
    value: "124",
    description: "Registered learners",
    icon: Users,
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
];

const courses = [
  {
    title: "Introduction to AI",
    school: "School of AI Foundations",
    modules: 6,
  },
  {
    title: "Generative AI Fundamentals",
    school: "School of AI Foundations",
    modules: 8,
  },
  {
    title: "AI Tools for Everyday Work",
    school: "School of AI Foundations",
    modules: 5,
  },
  {
    title: "Prompt Engineering",
    school: "School of AI Foundations",
    modules: 7,
  },
];

const schools = [
  {
    name: "School of AI Foundations",
    description: "Build a practical foundation for understanding and working with AI.",
    courses: 4,
  },
  {
    name: "AI for Professionals",
    description: "Practical AI skills for modern professional workflows.",
    courses: 4,
  },
];

export default function HammetDashboardPage() {
  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">
            B2C administration
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
            Dashboard
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Manage Hammet&apos;s schools, courses, and learning experience.
          </p>
        </motion.section>

        {/* Overview */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-10 grid gap-4 sm:grid-cols-3"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.08 + index * 0.05,
                }}
                className={`relative overflow-hidden rounded-2xl p-6 ${stat.className}`}
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/30 blur-2xl dark:bg-white/[0.04]" />

                <div className="relative">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/75 dark:bg-white/[0.08]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-65">
                    {stat.label}
                  </p>

                  <div className="mt-1 flex items-end justify-between gap-4">
                    <p className="text-3xl font-semibold tracking-[-0.04em]">
                      {stat.value}
                    </p>

                    <p className="pb-1 text-xs opacity-60">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        {/* Main workspace */}
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          {/* Courses */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
          >
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Content
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                  Courses
                </h2>
              </div>

              <Link
                href="/hammet/courses"
                className="hidden items-center gap-1 text-sm font-medium text-purple-700 hover:text-purple-800 dark:text-cyan-400 sm:flex"
              >
                View all
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white dark:border-white/[0.06] dark:bg-white/[0.03]">
              {courses.map((course, index) => (
                <Link
                  key={course.title}
                  href={`/hammet/courses/${index + 1}`}
                  className="group flex items-center gap-4 border-b border-black/[0.05] px-6 py-5 transition-colors last:border-0 hover:bg-purple-50/50 dark:border-white/[0.05] dark:hover:bg-white/[0.04]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold tracking-[-0.015em]">
                      {course.title}
                    </h3>

                    <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                      {course.school}
                    </p>
                  </div>

                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-sm font-medium">
                      {course.modules}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      modules
                    </p>
                  </div>

                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-purple-600 dark:text-slate-600 dark:group-hover:text-cyan-400" />
                </Link>
              ))}
            </div>
          </motion.section>

          {/* AI Schools */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
          >
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Structure
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                AI Schools
              </h2>
            </div>

            <div className="space-y-3">
              {schools.map((school) => (
                <Link
                  key={school.name}
                  href="/hammet/ai-schools"
                  className="group relative block overflow-hidden rounded-2xl bg-[#EDE9FE] p-6 transition-transform duration-300 hover:-translate-y-0.5 dark:bg-[#21183A]"
                >
                  <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-purple-400/20 blur-2xl transition-transform duration-500 group-hover:scale-125" />

                  <div className="relative">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-purple-700 dark:bg-white/[0.08] dark:text-purple-300">
                      <Building2 className="h-5 w-5" />
                    </div>

                    <h3 className="text-base font-semibold tracking-[-0.025em]">
                      {school.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {school.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {school.courses} courses
                      </span>

                      <ArrowUpRight className="h-4 w-4 text-purple-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-cyan-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Quick actions */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
          className="mt-10"
        >
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Actions
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
              Create
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/hammet/ai-schools/new"
              className="group flex items-center gap-4 rounded-2xl border border-black/[0.06] bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-[0_12px_40px_rgba(76,29,149,0.08)] dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:border-purple-400/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                <Plus className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">Create AI School</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Add a new learning environment.
                </p>
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-slate-600" />
            </Link>

            <Link
              href="/hammet/courses/new"
              className="group flex items-center gap-4 rounded-2xl border border-black/[0.06] bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_12px_40px_rgba(6,182,212,0.08)] dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:border-cyan-400/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300">
                <Plus className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">Create Course</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Add a course to an AI School.
                </p>
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-slate-600" />
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}