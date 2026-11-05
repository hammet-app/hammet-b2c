"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Activity,
  ArrowRight,
  Award,
  CheckCircle2,
  ClipboardCheck,
  FolderKanban,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils/utils";
import { useLearnerStore } from "@/lib/store/use-learner-store";
import { TitleIcon } from "@/components/ui/section-title";

const toneStyles = {
  emerald:
    "border-emerald-200/70 bg-emerald-50/80 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
  amber:
    "border-amber-200/70 bg-amber-50/80 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
  violet:
    "border-violet-200/70 bg-violet-50/80 text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300",
  cyan:
    "border-cyan-200/70 bg-cyan-50/80 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300",
} as const;

export function LearningSnapshot({ className }: { className?: string }) {
  const projects = useLearnerStore((state) => state.projects);
  const badges = useLearnerStore((state) => state.badges);
  const moduleTestResults = useLearnerStore(
    (state) => state.moduleTestResults
  );

  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (project) => project.status === "completed"
  ).length;
  const activeProjects = projects.filter(
    (project) => project.status === "in-progress"
  );

  const quizResults = Object.values(moduleTestResults);
  const passedQuizzes = quizResults.filter((result) => result.passed).length;

  const overallProgress = totalProjects
    ? Math.round(
        projects.reduce(
          (sum, project) =>
            sum + (project.status === "completed" ? 100 : project.progress || 0),
          0
        ) / totalProjects
      )
    : 0;

  const nextProject =
    activeProjects[0] ??
    projects.find((project) => project.status === "not-started");

  const stats = [
    {
      label: "Projects done",
      value: `${completedProjects}/${totalProjects}`,
      icon: CheckCircle2,
      tone: "emerald" as const,
    },
    {
      label: "Active builds",
      value: activeProjects.length,
      icon: FolderKanban,
      tone: "amber" as const,
    },
    {
      label: "Badges earned",
      value: badges.length,
      icon: Award,
      tone: "violet" as const,
    },
    {
      label: "Quizzes passed",
      value: `${passedQuizzes}/${quizResults.length}`,
      icon: ClipboardCheck,
      tone: "cyan" as const,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={cn(
        "relative mb-8 overflow-hidden rounded-3xl border border-purple-500/15 bg-white/90 p-5 shadow-[0_10px_36px_rgba(139,92,246,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_14px_44px_rgba(0,0,0,0.3)] sm:p-6",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-purple-400/15 blur-3xl dark:bg-purple-500/20" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-48 w-48 rounded-full bg-cyan-300/15 blur-3xl dark:bg-cyan-500/15" />

      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-center">
        {/* Progress summary */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-purple-700 dark:text-cyan-300">
            <TitleIcon icon={Activity} tone="violet" size="sm" />
            <span>Your snapshot</span>
          </div>

          <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-slate-950 dark:text-white sm:text-2xl">
            {completedProjects} of {totalProjects} projects complete
          </h3>

          <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-[13px]">
            {nextProject
              ? `Next up: ${nextProject.title}. Keep the loop moving — one module, one quiz, one build at a time.`
              : "Every project in this path is complete. Revisit a build or start a new school to keep growing."}
          </p>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span>Overall project progress</span>
              <span className="font-mono text-purple-700 dark:text-cyan-300">
                {overallProgress}%
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-purple-600 via-violet-500 to-cyan-400"
              />
            </div>
          </div>

          <Link
            href="/learner/projects"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 transition-colors hover:text-purple-800 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Continue in Project Workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Live metrics */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={cn(
                  "rounded-2xl border p-3",
                  toneStyles[stat.tone]
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    {stat.label}
                  </span>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="mt-1.5 font-mono text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
