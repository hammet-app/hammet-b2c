"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  HelpCircle,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { DoodleKicker, TitleIcon } from "@/components/ui/section-title";
import { QuantumBulbIcon } from "@/components/ui/character-icons";

import { useAuth } from "@/lib/auth/auth-context";
import { learnerApi } from "@/lib/api/learner";
import { ApiError } from "@/lib/api/api-client";
import type {
  CourseEntitlement,
  LearnerQuiz,
  PublishedCourse,
  PublishedModule,
} from "@/lib/api/types/learner";
import { cn } from "@/lib/utils/utils";

type QuizListItem = {
  courseId: string;
  courseTitle: string;
  coursePosition: number;
  moduleId: string;
  moduleTitle: string;
  modulePosition: number;
  moduleCompleted: boolean;
  quiz: LearnerQuiz;
};

type QuizFilter = "all" | "practice" | "exam";

const FILTERS: { id: QuizFilter; label: string }[] = [
  { id: "all", label: "All quizzes" },
  { id: "practice", label: "Practice" },
  { id: "exam", label: "Exams" },
];

function isUnavailableQuizError(error: unknown) {
  if (error instanceof ApiError) {
    return error.status === 403 || error.status === 404;
  }

  const message = (
    error instanceof Error ? error.message : String(error)
  ).toLowerCase();

  return (
    message.includes("not found") ||
    message.includes("404") ||
    message.includes("forbidden") ||
    message.includes("not entitled")
  );
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let cursor = 0;

  async function run() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;

      try {
        results[index] = {
          status: "fulfilled",
          value: await worker(items[index]),
        };
      } catch (reason) {
        results[index] = { status: "rejected", reason };
      }
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(limit, Math.max(1, items.length)) },
      () => run(),
    ),
  );

  return results;
}

export default function QuizzesPage() {
  const { accessToken, refreshToken } = useAuth();

  const [items, setItems] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partialWarning, setPartialWarning] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<QuizFilter>("all");

  useEffect(() => {
    let cancelled = false;

    async function loadQuizzes() {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setPartialWarning(false);

      try {
        const entitlements = await learnerApi.getEntitlements(
          accessToken,
          refreshToken,
        );

        if (cancelled) return;

        const accessibleCourses = (entitlements.courses ?? []).filter(
          (course: CourseEntitlement) =>
            course.isEntitled || course.isEnrolled,
        );

        const courseResults = await mapWithConcurrency(
          accessibleCourses,
          5,
          (course) => learnerApi.getCourse(course.id, accessToken, refreshToken),
        );

        if (cancelled) return;

        let failedRequests = 0;
        const modules: {
          course: PublishedCourse;
          module: PublishedModule;
        }[] = [];

        courseResults.forEach((result) => {
          if (result.status === "rejected") {
            failedRequests += 1;
            return;
          }

          for (const courseModule of result.value.modules ?? []) {
            if (courseModule.isEnrolled || courseModule.isEntitled) {
              modules.push({ course: result.value, module: courseModule });
            }
          }
        });

        const quizResults = await mapWithConcurrency(
          modules,
          6,
          ({ module }) =>
            learnerApi.getModuleQuiz(module.id, accessToken, refreshToken),
        );

        if (cancelled) return;

        const nextItems: QuizListItem[] = [];
        const seenModules = new Set<string>();

        quizResults.forEach((result, index) => {
          const entry = modules[index];

          if (result.status === "rejected") {
            if (!isUnavailableQuizError(result.reason)) {
              failedRequests += 1;
            }
            return;
          }

          if (seenModules.has(entry.module.id)) return;
          seenModules.add(entry.module.id);

          nextItems.push({
            courseId: entry.course.id,
            courseTitle: entry.course.title,
            coursePosition: entry.course.position ?? 0,
            moduleId: entry.module.id,
            moduleTitle: entry.module.title,
            modulePosition: entry.module.position ?? 0,
            moduleCompleted: entry.module.hasFinished,
            quiz: result.value,
          });
        });

        nextItems.sort(
          (a, b) =>
            a.coursePosition - b.coursePosition ||
            a.modulePosition - b.modulePosition ||
            a.quiz.title.localeCompare(b.quiz.title),
        );

        setItems(nextItems);
        setPartialWarning(failedRequests > 0 && nextItems.length > 0);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load learner quizzes:", err);
        setItems([]);
        setError(
          "We couldn't load your quizzes right now. Check your connection and try again.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadQuizzes();

    return () => {
      cancelled = true;
    };
  }, [accessToken, refreshToken, reloadKey]);

  const visibleItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "exam" ? item.quiz.isExam : !item.quiz.isExam);

      if (!matchesFilter) return false;
      if (!query) return true;

      return [
        item.quiz.title,
        item.quiz.description,
        item.moduleTitle,
        item.courseTitle,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [items, filter, searchQuery]);

  const groups = useMemo(() => {
    const grouped = new Map<
      string,
      {
        courseId: string;
        courseTitle: string;
        items: QuizListItem[];
      }
    >();

    for (const item of visibleItems) {
      const existing = grouped.get(item.courseId);
      if (existing) {
        existing.items.push(item);
      } else {
        grouped.set(item.courseId, {
          courseId: item.courseId,
          courseTitle: item.courseTitle,
          items: [item],
        });
      }
    }

    return [...grouped.values()];
  }, [visibleItems]);

  const totalQuestions = useMemo(
    () =>
      items.reduce(
        (total, item) => total + (item.quiz.questions?.length ?? 0),
        0,
      ),
    [items],
  );
  const examCount = useMemo(
    () => items.filter((item) => item.quiz.isExam).length,
    [items],
  );

  const filterCounts: Record<QuizFilter, number> = {
    all: items.length,
    practice: items.length - examCount,
    exam: examCount,
  };

  function clearFilters() {
    setFilter("all");
    setSearchQuery("");
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#F8F7FF] px-4 pb-28 pt-6 font-poppins transition-colors duration-300 dark:bg-[#0B0813] sm:px-7 sm:pt-8 lg:px-10 lg:pb-16">
      <div className="pointer-events-none absolute -left-48 -top-32 h-[560px] w-[560px] rounded-full bg-purple-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1240px]">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <header className="relative mb-7 overflow-hidden rounded-3xl border border-purple-500/15 bg-gradient-to-br from-white via-purple-50/60 to-cyan-50/50 p-6 shadow-[0_12px_40px_rgba(139,92,246,0.08)] dark:border-white/10 dark:from-[#130E24] dark:via-[#17112C] dark:to-[#0D091A] dark:shadow-[0_16px_48px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl dark:bg-purple-500/20" />
            <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/10" />
            <div className="absolute inset-0 bg-[radial-gradient(#8B5CF6_1.1px,transparent_1.1px)] [background-size:22px_22px] opacity-[0.045] dark:opacity-[0.08]" />
          </div>

          <div className="relative z-10 grid items-center gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="max-w-2xl">
              <DoodleKicker tone="indigo" icon={<QuantumBulbIcon size="sm" />}>
                Assessment Studio
              </DoodleKicker>

              <h1 className="mt-4 flex items-center gap-3 text-3xl font-extrabold tracking-[-0.035em] text-slate-950 dark:text-white sm:text-4xl lg:text-[2.9rem] lg:leading-[1.08]">
                <TitleIcon icon={BookOpen} tone="violet" size="md" />
                <span>Quizzes &amp; assessments</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                Test what you know, sharpen your recall, and track every
                attempt. Practice quizzes and module exams live here, ready
                whenever you are.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-purple-800 shadow-xs dark:border-white/10 dark:bg-white/5 dark:text-purple-300">
                  <ClipboardCheck className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
                  <span>
                    {loading ? "—" : items.length}{" "}
                    {items.length === 1 ? "quiz" : "quizzes"}
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-cyan-800 shadow-xs dark:border-white/10 dark:bg-white/5 dark:text-cyan-300">
                  <HelpCircle className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>
                    {loading ? "—" : totalQuestions}{" "}
                    {totalQuestions === 1 ? "question" : "questions"}
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-amber-800 shadow-xs dark:border-white/10 dark:bg-white/5 dark:text-amber-300">
                  <GraduationCap className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>
                    {loading ? "—" : examCount}{" "}
                    {examCount === 1 ? "exam" : "exams"}
                  </span>
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Answers save automatically
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Retake any quiz
                </span>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[286px] sm:max-w-[330px] lg:max-w-none">
              <div className="aspect-[380/322] w-full" />
            </div>
          </div>
        </header>

        {/* ── Search + filter toolbar ──────────────────────────────── */}
        <div className="mb-7 flex flex-col gap-3 rounded-2xl border border-black/[0.06] bg-white p-3 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03] sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search quizzes, modules, or courses…"
              aria-label="Search quizzes"
              className="w-full rounded-xl border border-transparent bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-500/15 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400/50 dark:focus:bg-white/[0.06]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear quiz search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className="flex shrink-0 items-center gap-1 overflow-x-auto"
            role="group"
            aria-label="Filter quizzes by type"
          >
            {FILTERS.map((option) => {
              const active = filter === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFilter(option.id)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition",
                    active
                      ? "bg-purple-600 text-white shadow-sm dark:bg-cyan-400 dark:text-slate-950"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]",
                  )}
                >
                  <span>{option.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 font-mono text-[10px] leading-none",
                      active
                        ? "bg-white/20 text-white dark:bg-slate-950/15 dark:text-slate-950"
                        : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400",
                    )}
                  >
                    {loading ? "—" : filterCounts[option.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────── */}
        {loading ? (
          <div aria-busy="true" aria-label="Loading quizzes">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-9 w-9 animate-pulse rounded-xl bg-slate-200/80 dark:bg-white/10" />
              <span className="h-5 w-48 animate-pulse rounded bg-slate-200/80 dark:bg-white/10" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse rounded-2xl border border-purple-500/10 bg-white/80 dark:border-white/[0.06] dark:bg-white/[0.02]"
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center rounded-3xl border border-rose-200 bg-rose-50/70 px-6 py-12 text-center dark:border-rose-500/20 dark:bg-rose-500/[0.06]">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
              <AlertCircle className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              Quizzes unavailable
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {error}
            </p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-purple-300/70 bg-gradient-to-br from-white/80 to-purple-50/50 px-6 py-14 text-center dark:border-white/10 dark:from-white/[0.03] dark:to-white/[0.01]">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-cyan-500/15 dark:text-cyan-300">
              <ClipboardCheck className="h-8 w-8" />
            </span>
            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              No quizzes here yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Quizzes appear once your enrolled courses have assessments
              attached to their modules. Explore your schools and pick up where
              you left off.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/learner/ai-schools"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
              >
                Browse AI schools
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/learner/learn"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
              >
                <BookOpen className="h-4 w-4" />
                My learning
              </Link>
            </div>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="rounded-3xl border border-black/[0.06] bg-white px-6 py-14 text-center dark:border-white/[0.08] dark:bg-white/[0.03]">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300">
              <Search className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No quizzes match your filters
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-300">
              Try a different search term or switch back to all quizzes.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-purple-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {partialWarning && (
              <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/[0.08] dark:text-amber-200 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Some courses couldn&apos;t be checked. Showing the quizzes
                    we could load.
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setReloadKey((key) => key + 1)}
                  className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-amber-300 bg-white/70 px-2.5 py-1.5 text-xs font-bold text-amber-800 transition hover:bg-white dark:border-amber-400/30 dark:bg-transparent dark:text-amber-200 dark:hover:bg-amber-400/10 sm:self-auto"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh
                </button>
              </div>
            )}

            <div className="space-y-10">
              {groups.map((group, groupIndex) => (
                <section
                  key={group.courseId}
                  aria-labelledby={`course-${group.courseId}`}
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-cyan-500/15 dark:text-cyan-300">
                        <GraduationCap className="h-4.5 w-4.5" />
                      </span>
                      <div className="min-w-0">
                        <h2
                          id={`course-${group.courseId}`}
                          className="truncate text-base font-bold text-slate-900 dark:text-white sm:text-lg"
                        >
                          {group.courseTitle}
                        </h2>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {group.items.length}{" "}
                          {group.items.length === 1 ? "assessment" : "assessments"}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/learner/courses/${group.courseId}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 transition hover:text-purple-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                    >
                      View course
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {group.items.map((item, index) => (
                      <QuizCard
                        key={item.moduleId}
                        item={item}
                        index={index}
                        entranceDelay={Math.min(
                          groupIndex * 0.05 + index * 0.04,
                          0.3,
                        )}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function QuizCard({
  item,
  index,
  entranceDelay,
}: {
  item: QuizListItem;
  index: number;
  entranceDelay: number;
}) {
  const questionCount = item.quiz.questions?.length ?? 0;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm transition-colors duration-200",
        "hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/[0.07] focus-within:ring-2 focus-within:ring-purple-500/40 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-cyan-400/30 dark:hover:shadow-black/30",
      )}
    >
      <div className="pointer-events-none absolute -right-5 -top-5 flex h-24 w-24 items-center justify-center rounded-full bg-purple-500/[0.06] dark:bg-cyan-400/[0.05]">
        <span className="font-mono text-4xl font-bold text-purple-600/[0.10] dark:text-cyan-300/[0.12]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em]",
            item.quiz.isExam
              ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300"
              : "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-500/25 dark:bg-purple-500/10 dark:text-cyan-300",
          )}
        >
          {item.quiz.isExam ? (
            <GraduationCap className="h-3 w-3" />
          ) : (
            <HelpCircle className="h-3 w-3" />
          )}
          <span>{item.quiz.isExam ? "Module exam" : "Practice quiz"}</span>
        </span>

        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Module {item.modulePosition}
        </span>
      </div>

      <div className="relative mt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
          {item.moduleTitle}
        </p>
        <h3 className="mt-1 text-base font-bold leading-snug text-slate-900 dark:text-white">
          {item.quiz.title}
        </h3>
        {item.quiz.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {item.quiz.description}
          </p>
        )}
      </div>

      <div className="relative mt-4 flex items-center gap-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <ClipboardCheck className="h-3.5 w-3.5 text-purple-500 dark:text-cyan-400" />
          {questionCount} {questionCount === 1 ? "question" : "questions"}
        </span>
        {item.moduleCompleted && (
          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Module complete
          </span>
        )}
      </div>

      <div className="relative mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/[0.07]">
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          {item.quiz.isExam ? "Exam attempt" : "Untimed practice"}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition group-hover:bg-purple-700 dark:bg-cyan-400 dark:text-slate-950 dark:group-hover:bg-cyan-300">
          Start quiz
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>

      <Link
        href={`/learner/quizzes/${item.courseId}/${item.moduleId}`}
        className="absolute inset-0 z-10 rounded-2xl"
        aria-label={`Start ${item.quiz.title} for ${item.moduleTitle}`}
      />
    </article>
  );
}
