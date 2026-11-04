"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, RefreshCw } from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { learnerApi } from "@/lib/api/learner";
import { ApiError } from "@/lib/api/api-client";
import type { LearnerQuiz, PublishedCourse } from "@/lib/api/types/learner";
import { useFeatureFlag } from "@/lib/features/use-feature-flag";

type CourseExam = { course: PublishedCourse; exam: LearnerQuiz };

export default function ExamsPage() {
  const { accessToken, refreshToken } = useAuth();
  const examsEnabled = useFeatureFlag("exam");
  const [items, setItems] = useState<CourseExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadExams() {
      if (!accessToken || !examsEnabled) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const entitlements = await learnerApi.getEntitlements(
          accessToken,
          refreshToken,
        );
        const accessibleCourses = (entitlements.courses ?? []).filter(
          (course) => course.isEntitled && course.isEnrolled,
        );
        const results = await Promise.allSettled(
          accessibleCourses.map(async (courseStatus) => {
            const [course, exam] = await Promise.all([
              learnerApi.getCourse(courseStatus.id, accessToken, refreshToken),
              learnerApi.getCourseExam(courseStatus.id, accessToken, refreshToken),
            ]);
            return { course, exam };
          }),
        );

        if (cancelled) return;

        const nextItems: CourseExam[] = [];
        let unexpectedFailures = 0;
        for (const result of results) {
          if (result.status === "fulfilled") {
            nextItems.push(result.value);
          } else if (
            !(result.reason instanceof ApiError && [403, 404].includes(result.reason.status))
          ) {
            unexpectedFailures += 1;
          }
        }

        nextItems.sort(
          (a, b) =>
            (a.course.position ?? 0) - (b.course.position ?? 0) ||
            a.course.title.localeCompare(b.course.title),
        );
        setItems(nextItems);
        if (unexpectedFailures > 0 && nextItems.length === 0) {
          setError("We couldn't load your exams right now. Please try again.");
        }
      } catch (loadError) {
        if (cancelled) return;
        console.error("Failed to load course exams:", loadError);
        setError("We couldn't load your exams right now. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadExams();
    return () => {
      cancelled = true;
    };
  }, [accessToken, refreshToken, examsEnabled, reloadKey]);

  if (!examsEnabled) {
    return (
      <main className="min-h-screen bg-[#F8F7FF] px-4 py-20 text-center font-poppins dark:bg-[#0B0813]">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Exams aren&apos;t available</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">This feature is currently turned off for your account.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7FF] px-4 pb-28 pt-7 font-poppins dark:bg-[#0B0813] sm:px-7 lg:px-10 lg:pb-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 rounded-3xl border border-purple-500/15 bg-gradient-to-br from-white via-purple-50/60 to-cyan-50/50 p-7 shadow-sm dark:border-white/10 dark:from-[#130E24] dark:via-[#17112C] dark:to-[#0D091A] sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-800 dark:bg-cyan-400/10 dark:text-cyan-300">
            <GraduationCap className="h-4 w-4" /> Course assessments
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Your exams
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Each exam belongs to a course. Choose a course to open its final assessment.
          </p>
        </header>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2" aria-busy="true" aria-label="Loading exams">
            {[1, 2].map((item) => <div key={item} className="h-40 animate-pulse rounded-2xl bg-white dark:bg-white/[0.04]" />)}
          </div>
        ) : error ? (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-500/20 dark:bg-rose-500/[0.06]">
            <p className="text-sm text-rose-800 dark:text-rose-200">{error}</p>
            <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
          </section>
        ) : items.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-purple-300/70 bg-white/80 px-6 py-14 text-center dark:border-white/10 dark:bg-white/[0.03]">
            <GraduationCap className="mx-auto h-10 w-10 text-purple-500 dark:text-cyan-300" />
            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">No course exams available</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
              Exams will appear here for courses you can access once they are published.
            </p>
          </section>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map(({ course, exam }) => (
              <Link
                key={course.id}
                href={`/learner/exams/${course.id}`}
                className="group rounded-2xl border border-purple-500/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-cyan-400/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                  <BookOpen className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{course.title}</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{exam.title}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500 dark:border-white/[0.07] dark:text-slate-400">
                  <span>{exam.questions.length} questions</span>
                  <span className="inline-flex items-center gap-1 text-purple-700 group-hover:gap-2 dark:text-cyan-300">Open exam <ArrowRight className="h-3.5 w-3.5" /></span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
