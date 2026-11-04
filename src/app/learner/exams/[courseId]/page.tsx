"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Loader2, RefreshCw } from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { learnerApi } from "@/lib/api/learner";
import { ApiError } from "@/lib/api/api-client";
import type { LearnerQuiz, PublishedCourse, QuizAttempt } from "@/lib/api/types/learner";
import { useFeatureFlag } from "@/lib/features/use-feature-flag";

type ExamPageProps = { params: Promise<{ courseId: string }> };

export default function CourseExamPage({ params }: ExamPageProps) {
  const { courseId } = use(params);
  const { accessToken, refreshToken } = useAuth();
  const examsEnabled = useFeatureFlag("learner_course_exams");
  const [course, setCourse] = useState<PublishedCourse | null>(null);
  const [exam, setExam] = useState<LearnerQuiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const saveQueuesRef = useRef<Record<string, Promise<void>>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadExam() {
      if (!accessToken || !examsEnabled) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setNotFound(false);
      setSubmitted(false);
      setAnswers({});
      setQuestionIndex(0);
      setAttempt(null);
      saveQueuesRef.current = {};

      try {
        const [courseResult, examResult] = await Promise.all([
          learnerApi.getCourse(courseId, accessToken, refreshToken),
          learnerApi.getCourseExam(courseId, accessToken, refreshToken),
        ]);
        if (cancelled) return;

        const sortedExam: LearnerQuiz = {
          ...examResult,
          questions: [...examResult.questions]
            .sort((a, b) => a.position - b.position)
            .map((question) => ({
              ...question,
              options: [...question.options].sort((a, b) => a.position - b.position),
            })),
        };
        setCourse(courseResult);
        setExam(sortedExam);

        const activeAttempt = await learnerApi.startQuizAttempt(
          sortedExam.id,
          accessToken,
          refreshToken,
        );
        if (cancelled) return;
        setAttempt(activeAttempt);
        setAnswers(activeAttempt.answers ?? {});
        setSubmitted(Boolean(activeAttempt.submittedAt));
      } catch (loadError) {
        if (cancelled) return;
        if (loadError instanceof ApiError && [403, 404].includes(loadError.status)) {
          setNotFound(true);
        } else {
          console.error("Failed to load course exam:", loadError);
          setError("We couldn't load this exam right now. Check your connection and try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadExam();
    return () => {
      cancelled = true;
    };
  }, [courseId, accessToken, refreshToken, examsEnabled, reloadKey]);

  const questions = useMemo(() => exam?.questions ?? [], [exam]);
  const currentQuestion = questions[questionIndex];
  const answeredCount = questions.reduce(
    (count, question) => count + (answers[question.id] ? 1 : 0),
    0,
  );

  async function chooseAnswer(questionId: string, optionId: string) {
    if (submitted || submitting || !attempt || !accessToken) return;
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
    setError(null);
    const previous = saveQueuesRef.current[questionId] ?? Promise.resolve();
    const next = previous
      .catch(() => undefined)
      .then(() => learnerApi.saveQuizAnswer(
        attempt.id,
        questionId,
        optionId,
        accessToken,
        refreshToken,
      ))
      .catch((saveError: unknown) => {
        console.warn("Unable to save exam answer:", saveError);
        setError("An answer could not be saved. Please choose it again before submitting.");
      });
    saveQueuesRef.current[questionId] = next;
  }

  async function submitExam() {
    if (!exam || !attempt || !accessToken || submitting || answeredCount !== questions.length) return;
    setSubmitting(true);
    setError(null);
    try {
      await Promise.all(Object.values(saveQueuesRef.current));
      await Promise.all(
        questions.map((question) =>
          learnerApi.saveQuizAnswer(
            attempt.id,
            question.id,
            answers[question.id],
            accessToken,
            refreshToken,
          ),
        ),
      );
      await learnerApi.submitQuizAttempt(attempt.id, accessToken, refreshToken);
      setSubmitted(true);
    } catch (submitError) {
      console.error("Unable to submit exam:", submitError);
      setError("We couldn't submit your exam. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!examsEnabled) {
    return (
      <main className="min-h-screen bg-[#F8F7FF] px-4 py-20 text-center font-poppins dark:bg-[#0B0813]">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Exams aren&apos;t available</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">This feature is currently turned off for your account.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7FF] px-4 pb-28 pt-6 font-poppins dark:bg-[#0B0813] sm:px-7 sm:pt-9 lg:px-10 lg:pb-16">
      <div className="mx-auto max-w-4xl">
        <Link href="/learner/exams" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-purple-700 dark:text-slate-300 dark:hover:text-cyan-300">
          <ArrowLeft className="h-4 w-4" /> All exams
        </Link>

        {loading ? (
          <div className="mt-6 space-y-5" aria-busy="true" aria-label="Loading exam">
            <div className="h-40 animate-pulse rounded-3xl bg-white dark:bg-white/[0.04]" />
            <div className="h-[430px] animate-pulse rounded-3xl bg-white dark:bg-white/[0.04]" />
          </div>
        ) : notFound ? (
          <section className="mt-6 rounded-3xl border border-black/[0.06] bg-white px-6 py-14 text-center dark:border-white/[0.08] dark:bg-white/[0.03]">
            <GraduationCap className="mx-auto h-10 w-10 text-purple-500 dark:text-cyan-300" />
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">Exam unavailable</h1>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 dark:text-slate-300">This course has no published exam yet, or your access has changed.</p>
          </section>
        ) : error && !exam ? (
          <section className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-6 py-12 text-center dark:border-rose-500/20 dark:bg-rose-500/[0.06]">
            <h1 className="text-xl font-bold text-rose-900 dark:text-rose-200">Couldn&apos;t load this exam</h1>
            <p className="mt-2 text-sm text-rose-800 dark:text-rose-200">{error}</p>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
          </section>
        ) : error && exam && !attempt ? (
          <section className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-6 py-12 text-center dark:border-rose-500/20 dark:bg-rose-500/[0.06]">
            <h1 className="text-xl font-bold text-rose-900 dark:text-rose-200">Exam attempt unavailable</h1>
            <p className="mt-2 text-sm text-rose-800 dark:text-rose-200">{error}</p>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
          </section>
        ) : submitted ? (
          <section className="mt-6 rounded-3xl border border-emerald-200 bg-white p-7 text-center shadow-sm dark:border-emerald-500/20 dark:bg-white/[0.03] sm:p-10">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Exam submitted</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Course completed</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Your exam for {course?.title ?? "this course"} has been recorded. The course is now marked complete.
            </p>
            <Link href={`/learner/courses/${courseId}`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
              Review course <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        ) : exam && currentQuestion ? (
          <>
            <header className="mt-6 rounded-3xl border border-purple-500/15 bg-gradient-to-br from-white via-purple-50/60 to-cyan-50/50 p-6 shadow-sm dark:border-white/10 dark:from-[#130E24] dark:via-[#17112C] dark:to-[#0D091A] sm:p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase text-purple-800 dark:bg-cyan-400/10 dark:text-cyan-300">
                <GraduationCap className="h-4 w-4" /> Course exam
              </span>
              <p className="mt-4 text-sm font-semibold text-purple-700 dark:text-cyan-300">{course?.title}</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">{exam.title}</h1>
              {exam.description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{exam.description}</p>}
              <div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Question {questionIndex + 1} of {questions.length}</span>
                <span>{answeredCount} answered</span>
                <span>Attempt #{attempt?.attemptNumber ?? "—"}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-purple-100 dark:bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all" style={{ width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%` }} />
              </div>
            </header>

            <section className="mt-5 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03] sm:p-9">
              <p className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-cyan-300">Question {questionIndex + 1}</p>
              <h2 className="mt-3 text-xl font-bold leading-relaxed text-slate-900 dark:text-white">{currentQuestion.question}</h2>
              <div className="mt-6 grid gap-3">
                {currentQuestion.options.map((option, index) => {
                  const selected = answers[currentQuestion.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => void chooseAnswer(currentQuestion.id, option.id)}
                      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${selected ? "border-purple-500 bg-purple-50 ring-2 ring-purple-500/10 dark:border-cyan-400/60 dark:bg-cyan-400/[0.08]" : "border-slate-200 hover:border-purple-300 hover:bg-slate-50 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/[0.04]"}`}
                    >
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${selected ? "bg-purple-600 text-white dark:bg-cyan-400 dark:text-slate-950" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"}`}>{String.fromCharCode(65 + index)}</span>
                      <span className="pt-1 text-sm font-medium text-slate-700 dark:text-slate-200">{option.text}</span>
                    </button>
                  );
                })}
              </div>
              {error && <p role="alert" className="mt-4 text-sm font-medium text-rose-700 dark:text-rose-300">{error}</p>}
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-white/[0.07] sm:flex-row sm:items-center sm:justify-between">
                <button type="button" disabled={questionIndex === 0 || submitting} onClick={() => setQuestionIndex((index) => index - 1)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 disabled:opacity-40 dark:border-white/10 dark:text-slate-200">Previous</button>
                {questionIndex < questions.length - 1 ? (
                  <button type="button" onClick={() => setQuestionIndex((index) => index + 1)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white dark:bg-cyan-400 dark:text-slate-950">Next <ArrowRight className="h-4 w-4" /></button>
                ) : (
                  <button type="button" disabled={answeredCount !== questions.length || submitting || !attempt} onClick={() => void submitExam()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-400 dark:text-slate-950">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    {submitting ? "Submitting…" : "Submit exam"}
                  </button>
                )}
              </div>
            </section>
          </>
        ) : (
          <section className="mt-6 rounded-3xl border border-black/[0.06] bg-white p-8 text-center dark:border-white/[0.08] dark:bg-white/[0.03]">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">No questions are available yet</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Please check back when the course exam has questions.</p>
          </section>
        )}
      </div>
    </main>
  );
}
