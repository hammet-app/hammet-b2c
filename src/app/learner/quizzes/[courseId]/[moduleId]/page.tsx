"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  Loader2,
  RefreshCw,
  RotateCcw,
  Send,
  Sparkles,
  Trophy,
} from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { learnerApi } from "@/lib/api/learner";
import { ApiError } from "@/lib/api/api-client";
import type {
  LearnerQuiz,
  PublishedCourse,
  QuizAttempt,
  QuizQuestion,
} from "@/lib/api/types/learner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

type QuizPageProps = {
  params: Promise<{ courseId: string; moduleId: string }>;
};

function isQuizUnavailable(error: unknown) {
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

function sortQuiz(data: LearnerQuiz): LearnerQuiz {
  return {
    ...data,
    questions: (data.questions ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((question) => ({
        ...question,
        options: (question.options ?? [])
          .slice()
          .sort((a, b) => a.position - b.position),
      })),
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  const { courseId, moduleId } = use(params);
  const { accessToken, refreshToken } = useAuth();
  const reduceMotion = useReducedMotion();

  const [quiz, setQuiz] = useState<LearnerQuiz | null>(null);
  const [course, setCourse] = useState<PublishedCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [attemptWarning, setAttemptWarning] = useState(false);
  const [retryingAttempt, setRetryingAttempt] = useState(false);
  const [syncWarning, setSyncWarning] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const hasNavigatedRef = useRef(false);
  const unsavedAnswersRef = useRef<Set<string>>(new Set());
  const saveQueuesRef = useRef<Record<string, Promise<unknown>>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadQuiz() {
      if (!accessToken) return;

      setLoading(true);
      setError(null);
      setNotFound(false);
      setQuiz(null);
      setCourse(null);
      setAttempt(null);
      setAttemptWarning(false);
      setSyncWarning(false);
      setSubmitError(null);
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setDirection(0);
      setIsSubmitted(false);
      hasNavigatedRef.current = false;
      unsavedAnswersRef.current = new Set();
      saveQueuesRef.current = {};

      const [quizResult, courseResult] = await Promise.allSettled([
        learnerApi.getModuleQuiz(moduleId, accessToken, refreshToken),
        learnerApi.getCourse(courseId, accessToken, refreshToken),
      ]);

      if (cancelled) return;

      if (courseResult.status === "fulfilled") {
        setCourse(courseResult.value);
      }

      if (quizResult.status === "rejected") {
        if (isQuizUnavailable(quizResult.reason)) {
          setNotFound(true);
        } else {
          setError(
            "We couldn't load this quiz right now. Check your connection and try again.",
          );
        }
        setLoading(false);
        return;
      }

      const data = sortQuiz(quizResult.value);
      setQuiz(data);

      try {
        const activeAttempt = await learnerApi.startQuizAttempt(
          data.id,
          accessToken,
          refreshToken,
        );

        if (cancelled) return;

        setAttempt(activeAttempt);

        if (
          activeAttempt.answers &&
          Object.keys(activeAttempt.answers).length > 0
        ) {
          setSelectedAnswers({ ...activeAttempt.answers });
        }

        if (activeAttempt.submittedAt) {
          setIsSubmitted(true);
        }
      } catch (attemptError) {
        if (cancelled) return;
        console.warn("Unable to start a quiz attempt session:", attemptError);
        setAttemptWarning(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadQuiz();

    return () => {
      cancelled = true;
    };
  }, [courseId, moduleId, accessToken, refreshToken, reloadKey]);

  const questions: QuizQuestion[] = useMemo(
    () => quiz?.questions ?? [],
    [quiz],
  );
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = useMemo(
    () =>
      questions.reduce(
        (total, question) =>
          total + (selectedAnswers[question.id] ? 1 : 0),
        0,
      ),
    [questions, selectedAnswers],
  );
  const progress =
    totalQuestions === 0
      ? 0
      : Math.round((answeredCount / totalQuestions) * 100);
  const isComplete = totalQuestions > 0 && answeredCount === totalQuestions;

  const currentModule = useMemo(
    () => course?.modules?.find((module) => module.id === moduleId) ?? null,
    [course, moduleId],
  );
  const courseTitle = course?.title ?? null;
  const moduleTitle = currentModule?.title ?? null;
  const modulePosition = currentModule?.position ?? null;

  useEffect(() => {
    if (!hasNavigatedRef.current) return;
    questionHeadingRef.current?.focus({ preventScroll: true });
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback(
    (index: number) => {
      setDirection(index > currentQuestionIndex ? 1 : -1);
      setCurrentQuestionIndex(index);
      hasNavigatedRef.current = true;
    },
    [currentQuestionIndex],
  );

  const persistAnswer = useCallback(
    (questionId: string, optionId: string) => {
      if (!attempt?.id || !accessToken) return;

      const previous =
        saveQueuesRef.current[questionId] ?? Promise.resolve();
      const next = previous
        .catch(() => undefined)
        .then(() =>
          learnerApi.saveQuizAnswer(
            attempt.id,
            questionId,
            optionId,
            accessToken,
            refreshToken,
          ),
        )
        .then(() => {
          unsavedAnswersRef.current.delete(questionId);
          if (unsavedAnswersRef.current.size === 0) {
            setSyncWarning(false);
          }
        })
        .catch((saveError) => {
          console.warn("Unable to save quiz answer:", saveError);
          unsavedAnswersRef.current.add(questionId);
          setSyncWarning(true);
        });

      saveQueuesRef.current[questionId] = next;
    },
    [attempt, accessToken, refreshToken],
  );

  function handleSelectOption(questionId: string, optionId: string) {
    if (isSubmitted || isSubmitting) return;

    setSelectedAnswers((previous) => ({
      ...previous,
      [questionId]: optionId,
    }));

    persistAnswer(questionId, optionId);
  }

  async function handleSubmitQuiz() {
    if (!quiz || isSubmitting || !isComplete) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (attempt?.id && accessToken) {
        const pendingAnswers = [...unsavedAnswersRef.current];

        if (pendingAnswers.length > 0) {
          await Promise.allSettled(
            pendingAnswers.map((questionId) =>
              learnerApi
                .saveQuizAnswer(
                  attempt.id,
                  questionId,
                  selectedAnswers[questionId],
                  accessToken,
                  refreshToken,
                )
                .then(() => {
                  unsavedAnswersRef.current.delete(questionId);
                }),
            ),
          );
        }

        await learnerApi.submitQuizAttempt(
          attempt.id,
          accessToken,
          refreshToken,
        );
        setSyncWarning(false);
      }

      setIsSubmitted(true);
    } catch (submitError) {
      console.warn("Unable to submit quiz attempt:", submitError);
      setSubmitError(
        "We couldn't submit your answers. Check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRetakeQuiz() {
    if (!quiz || !accessToken) return;

    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setDirection(0);
    setIsSubmitted(false);
    setSubmitError(null);
    setSyncWarning(false);
    setAttemptWarning(false);
    unsavedAnswersRef.current = new Set();
    saveQueuesRef.current = {};

    try {
      const nextAttempt = await learnerApi.startQuizAttempt(
        quiz.id,
        accessToken,
        refreshToken,
      );
      setAttempt(nextAttempt);

      if (
        nextAttempt.answers &&
        Object.keys(nextAttempt.answers).length > 0
      ) {
        setSelectedAnswers({ ...nextAttempt.answers });
      }

      if (nextAttempt.submittedAt) {
        setIsSubmitted(true);
      }
    } catch (retakeError) {
      console.warn("Unable to start a fresh quiz attempt:", retakeError);
      setAttempt(null);
      setAttemptWarning(true);
    }
  }

  async function handleRetryAttempt() {
    if (!quiz || !accessToken || retryingAttempt) return;

    setRetryingAttempt(true);

    try {
      const activeAttempt = await learnerApi.startQuizAttempt(
        quiz.id,
        accessToken,
        refreshToken,
      );

      setAttempt(activeAttempt);
      setAttemptWarning(false);

      await Promise.allSettled(
        Object.entries(selectedAnswers).map(([questionId, optionId]) =>
          learnerApi.saveQuizAnswer(
            activeAttempt.id,
            questionId,
            optionId,
            accessToken,
            refreshToken,
          ),
        ),
      );
    } catch (retryError) {
      console.warn("Unable to restart quiz attempt:", retryError);
      setAttemptWarning(true);
    } finally {
      setRetryingAttempt(false);
    }
  }

  /* ── Loading ───────────────────────────────────────────────────── */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F3FF] px-4 pb-28 pt-6 font-poppins transition-colors duration-300 dark:bg-[#0D0A17] sm:px-7 sm:pt-10 lg:px-10 lg:pb-16">
        <div className="mx-auto max-w-[1120px] animate-pulse space-y-6">
          <div className="h-5 w-36 rounded bg-white/80 dark:bg-white/[0.06]" />
          <div className="h-52 rounded-3xl border border-black/[0.04] bg-white/80 dark:border-white/[0.05] dark:bg-white/[0.03]" />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="h-[430px] rounded-3xl bg-white/80 dark:bg-white/[0.03]" />
            <div className="h-80 rounded-3xl bg-white/80 dark:bg-white/[0.03]" />
          </div>
        </div>
      </main>
    );
  }

  /* ── Not found / no access ────────────────────────────────────── */
  if (notFound) {
    return (
      <main className="min-h-screen bg-[#F5F3FF] px-4 pb-28 pt-6 font-poppins dark:bg-[#0D0A17] sm:px-7 sm:pt-10 lg:px-10 lg:pb-16">
        <div className="mx-auto max-w-xl">
          <BackToQuizzes />
          <div className="rounded-3xl border border-black/[0.06] bg-white px-6 py-12 text-center shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-cyan-500/15 dark:text-cyan-300">
              <HelpCircle className="h-8 w-8" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Quiz not available
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              This module doesn&apos;t have a quiz yet, or your access to it has
              changed. You can head back to your quizzes or open the course to
              keep learning.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/learner/quizzes"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
              >
                <ArrowLeft className="h-4 w-4" />
                All quizzes
              </Link>
              <Link
                href={`/learner/courses/${courseId}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
              >
                <BookOpen className="h-4 w-4" />
                View course
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── Load error ───────────────────────────────────────────────── */
  if (error || !quiz) {
    return (
      <main className="min-h-screen bg-[#F5F3FF] px-4 pb-28 pt-6 font-poppins dark:bg-[#0D0A17] sm:px-7 sm:pt-10 lg:px-10 lg:pb-16">
        <div className="mx-auto max-w-xl">
          <BackToQuizzes />
          <div className="rounded-3xl border border-rose-200 bg-rose-50/70 px-6 py-12 text-center dark:border-rose-500/20 dark:bg-rose-500/[0.06]">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
              <AlertCircle className="h-8 w-8" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Couldn&apos;t load this quiz
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {error ?? "The quiz data is unavailable right now."}
            </p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ── Submitted ────────────────────────────────────────────────── */
  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-[#F5F3FF] px-4 pb-28 pt-6 font-poppins transition-colors duration-300 dark:bg-[#0D0A17] sm:px-7 sm:pt-10 lg:px-10 lg:pb-16">
        <div className="mx-auto max-w-2xl">
          <BackToQuizzes />

          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 0.45, ease: "easeOut" }
            }
            className="relative overflow-hidden rounded-3xl border border-purple-200/70 bg-white p-6 shadow-[0_18px_60px_rgba(139,92,246,0.12)] dark:border-white/[0.08] dark:bg-[#151026] dark:shadow-[0_18px_60px_rgba(0,0,0,0.4)] sm:p-9"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />
              <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(#8B5CF6_1.1px,transparent_1.1px)] [background-size:22px_22px] opacity-[0.05] dark:opacity-[0.08]" />
            </div>

            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : { rotate: [0, -5, 5, 0], scale: [1, 1.06, 1] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
              className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 dark:from-cyan-400 dark:to-cyan-500 dark:text-slate-950"
            >
              <Trophy className="h-10 w-10" />
              <Sparkles className="absolute -right-2 -top-2 h-5 w-5 text-amber-400" />
            </motion.div>

            <div className="relative mt-5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Quiz submitted
              </span>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Nicely done!
              </h1>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Your answers for{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {quiz.title}
                </span>{" "}
                have been recorded. You can retake it any time to sharpen your
                recall.
              </p>
            </div>

            <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/[0.05] bg-slate-50/70 px-4 py-3 text-center dark:border-white/[0.06] dark:bg-white/[0.03]">
                <span className="block font-mono text-xl font-bold text-purple-700 dark:text-cyan-300">
                  {answeredCount}/{totalQuestions}
                </span>
                <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Answered
                </span>
              </div>
              <div className="rounded-2xl border border-black/[0.05] bg-slate-50/70 px-4 py-3 text-center dark:border-white/[0.06] dark:bg-white/[0.03]">
                <span className="block font-mono text-xl font-bold text-purple-700 dark:text-cyan-300">
                  {attempt ? `#${attempt.attemptNumber}` : "—"}
                </span>
                <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Attempt
                </span>
              </div>
              <div className="col-span-2 rounded-2xl border border-black/[0.05] bg-slate-50/70 px-4 py-3 text-center dark:border-white/[0.06] dark:bg-white/[0.03] sm:col-span-1">
                <span className="block font-mono text-xl font-bold text-purple-700 dark:text-cyan-300">
                  {modulePosition !== null ? `M${modulePosition}` : "—"}
                </span>
                <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Module
                </span>
              </div>
            </div>

            {attempt === null && (
              <div className="relative mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  This attempt couldn&apos;t be saved to your learning record.
                  Retake the quiz once your connection is stable so it counts.
                </span>
              </div>
            )}

            <div className="relative mt-6 flex flex-col-reverse items-stretch gap-2.5 sm:flex-row sm:items-center sm:justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleRetakeQuiz()}
                className="h-11 rounded-xl border-slate-200 px-5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.06]"
              >
                <RotateCcw className="mr-1.5 h-4 w-4" />
                Retake quiz
              </Button>
              <Link
                href="/learner/quizzes"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
              >
                Back to all quizzes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-[11px] font-medium text-slate-500 dark:border-white/[0.07] dark:text-slate-400">
              <Link
                href={`/learner/courses/${courseId}`}
                className="inline-flex items-center gap-1.5 transition hover:text-purple-600 dark:hover:text-cyan-300"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Review the course
              </Link>
              <Link
                href="/learner/learn"
                className="inline-flex items-center gap-1.5 transition hover:text-purple-600 dark:hover:text-cyan-300"
              >
                <GraduationCap className="h-3.5 w-3.5" />
                My learning
              </Link>
            </div>
          </motion.section>
        </div>
      </main>
    );
  }

  /* ── No questions yet ─────────────────────────────────────────── */
  if (totalQuestions === 0) {
    return (
      <main className="min-h-screen bg-[#F5F3FF] px-4 pb-28 pt-6 font-poppins dark:bg-[#0D0A17] sm:px-7 sm:pt-10 lg:px-10 lg:pb-16">
        <div className="mx-auto max-w-xl">
          <BackToQuizzes />
          <div className="rounded-3xl border border-black/[0.06] bg-white px-6 py-12 text-center shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-cyan-500/15 dark:text-cyan-300">
              <ClipboardCheck className="h-8 w-8" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Questions are on the way
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              This quiz has been created but its questions haven&apos;t been
              published yet. Check back soon or keep working through the course.
            </p>
            <Link
              href={`/learner/courses/${courseId}`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            >
              <BookOpen className="h-4 w-4" />
              Back to course
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isExam = Boolean(quiz.isExam);
  const optionLetter = (index: number) =>
    String.fromCharCode(65 + index);

  /* ── Quiz runner ──────────────────────────────────────────────── */
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#F5F3FF] px-4 pb-28 pt-6 font-poppins transition-colors duration-300 dark:bg-[#0D0A17] sm:px-7 sm:pt-10 lg:px-10 lg:pb-16">
      <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1120px]">
        <BackToQuizzes />

        {/* Quiz header */}
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion ? undefined : { duration: 0.4, ease: "easeOut" }
          }
          className="relative mb-6 overflow-hidden rounded-3xl border border-purple-500/15 bg-gradient-to-br from-white via-purple-50/50 to-cyan-50/40 p-5 shadow-sm dark:border-white/[0.08] dark:from-[#130E24] dark:via-[#17112C] dark:to-[#0D091A] sm:p-7"
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-purple-500/12 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.04] dark:opacity-[0.07]" />

          <div className="relative z-10">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400"
            >
              <Link
                href="/learner/quizzes"
                className="transition hover:text-purple-600 dark:hover:text-cyan-300"
              >
                Quizzes
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />
              {courseTitle ? (
                <Link
                  href={`/learner/courses/${courseId}`}
                  className="max-w-[220px] truncate transition hover:text-purple-600 dark:hover:text-cyan-300 sm:max-w-xs"
                >
                  {courseTitle}
                </Link>
              ) : (
                <span>Course</span>
              )}
              <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />
              <span className="text-slate-700 dark:text-slate-200">
                {modulePosition !== null
                  ? `Module ${modulePosition}`
                  : "Module quiz"}
              </span>
            </nav>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em]",
                  isExam
                    ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300"
                    : "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-500/25 dark:bg-purple-500/10 dark:text-cyan-300",
                )}
              >
                {isExam ? (
                  <GraduationCap className="h-3 w-3" />
                ) : (
                  <HelpCircle className="h-3 w-3" />
                )}
                {isExam ? "Module exam" : "Practice quiz"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <ClipboardCheck className="h-3 w-3" />
                {totalQuestions}{" "}
                {totalQuestions === 1 ? "question" : "questions"}
              </span>
              {attempt && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 font-mono text-[10px] font-bold text-purple-700 dark:border-white/10 dark:bg-white/5 dark:text-cyan-300">
                  Attempt #{attempt.attemptNumber}
                </span>
              )}
            </div>

            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {quiz.title}
            </h1>
            {moduleTitle && (
              <p className="mt-1 text-xs font-semibold text-purple-600 dark:text-cyan-400">
                {moduleTitle}
              </p>
            )}
            {quiz.description && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {quiz.description}
              </p>
            )}

            <div className="mt-5 flex items-center gap-3">
              <div
                role="progressbar"
                aria-label="Quiz progress"
                aria-valuemin={0}
                aria-valuemax={totalQuestions}
                aria-valuenow={answeredCount}
                className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10"
              >
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.35, ease: "easeOut" }
                  }
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-cyan-400 dark:to-cyan-300"
                />
              </div>
              <span className="shrink-0 font-mono text-xs font-bold text-purple-700 dark:text-cyan-300">
                {answeredCount}/{totalQuestions}
              </span>
            </div>
          </div>
        </motion.header>

        {/* Attempt warnings */}
        <AnimatePresence initial={false}>
          {(attemptWarning || submitError) && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <div
                role="status"
                className="flex flex-col gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    {submitError ??
                      "We couldn't start a saved attempt. You can still answer and review, but progress may not be saved."}
                  </span>
                </p>
                {attemptWarning && !submitError && (
                  <button
                    type="button"
                    onClick={() => void handleRetryAttempt()}
                    disabled={retryingAttempt}
                    className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-amber-300 bg-white/70 px-2.5 py-1.5 text-[11px] font-bold text-amber-800 transition hover:bg-white disabled:opacity-60 dark:border-amber-400/30 dark:bg-transparent dark:text-amber-200 dark:hover:bg-amber-400/10 sm:self-auto"
                  >
                    {retryingAttempt ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    Retry
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Question card */}
          <section
            aria-label="Quiz question"
            className="min-w-0 rounded-3xl border border-black/[0.06] bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#151026] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-white/[0.08]">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-purple-600 dark:text-cyan-400">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <p className="mt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  {isComplete
                    ? "Every question answered — ready when you are."
                    : `${totalQuestions - answeredCount} question${
                        totalQuestions - answeredCount === 1 ? "" : "s"
                      } left to answer.`}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-lg font-bold text-purple-700 dark:text-cyan-300">
                  {answeredCount}
                  <span className="text-sm font-semibold text-slate-400">
                    /{totalQuestions}
                  </span>
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Answered
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={currentQuestion.id}
                custom={direction}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, x: direction >= 0 ? 24 : -24 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, x: direction >= 0 ? -24 : 24 }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 0.22, ease: "easeOut" }
                }
              >
                <h2
                  ref={questionHeadingRef}
                  tabIndex={-1}
                  id={`quiz-question-${currentQuestion.id}`}
                  className="mt-5 text-lg font-bold leading-snug text-slate-900 outline-none dark:text-white sm:text-xl"
                >
                  {currentQuestion.question}
                </h2>

                <div
                  role="radiogroup"
                  aria-labelledby={`quiz-question-${currentQuestion.id}`}
                  className="mt-5 space-y-2.5"
                >
                  {currentQuestion.options.map((option, optionIndex) => {
                    const isSelected =
                      selectedAnswers[currentQuestion.id] === option.id;
                    const letter = optionLetter(optionIndex);

                    return (
                      <label
                        key={option.id}
                        className={cn(
                          "relative flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-left text-sm font-medium transition-all duration-150 focus-within:ring-2 focus-within:ring-purple-500/40 dark:focus-within:ring-cyan-400/40",
                          isSelected
                            ? "border-purple-600 bg-purple-50/80 text-purple-950 shadow-xs dark:border-cyan-400 dark:bg-cyan-500/10 dark:text-cyan-100"
                            : "border-black/[0.06] bg-slate-50/60 text-slate-700 hover:border-purple-300 hover:bg-white dark:border-white/[0.07] dark:bg-white/[0.02] dark:text-slate-300 dark:hover:border-cyan-500/30 dark:hover:bg-white/[0.04]",
                          (isSubmitted || isSubmitting) &&
                            "pointer-events-none opacity-70",
                        )}
                      >
                        <input
                          type="radio"
                          name={`answer-${currentQuestion.id}`}
                          value={option.id}
                          checked={isSelected}
                          onChange={() =>
                            handleSelectOption(
                              currentQuestion.id,
                              option.id,
                            )
                          }
                          disabled={isSubmitted || isSubmitting}
                          className="sr-only"
                        />
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition",
                            isSelected
                              ? "bg-purple-600 text-white dark:bg-cyan-400 dark:text-slate-950"
                              : "bg-slate-200/80 text-slate-600 dark:bg-white/10 dark:text-slate-400",
                          )}
                        >
                          {letter}
                        </span>
                        <span className="flex-1 pt-1 leading-relaxed">
                          {option.text}
                        </span>
                        <span
                          className={cn(
                            "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
                            isSelected
                              ? "border-purple-600 bg-purple-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950"
                              : "border-slate-300 dark:border-white/20",
                          )}
                        >
                          {isSelected && (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-col-reverse items-stretch justify-between gap-2.5 border-t border-slate-100 pt-4 dark:border-white/[0.08] sm:flex-row sm:items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      goToQuestion(Math.max(0, currentQuestionIndex - 1))
                    }
                    disabled={currentQuestionIndex === 0 || isSubmitting}
                    className="h-10 rounded-xl border-slate-200 px-4 text-xs font-bold text-slate-700 dark:border-white/10 dark:text-slate-200"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Button>

                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <Button
                      type="button"
                      onClick={() =>
                        goToQuestion(
                          Math.min(
                            totalQuestions - 1,
                            currentQuestionIndex + 1,
                          ),
                        )
                      }
                      disabled={isSubmitting}
                      className="h-10 rounded-xl bg-purple-600 px-4 text-xs font-bold text-white shadow-sm hover:bg-purple-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
                    >
                      Next question
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => void handleSubmitQuiz()}
                      disabled={!isComplete || isSubmitting}
                      className="h-10 rounded-xl bg-purple-600 px-4 text-xs font-bold text-white shadow-sm hover:bg-purple-700 lg:hidden dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <Send className="mr-1.5 h-4 w-4" />
                          Submit quiz
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {currentQuestionIndex === totalQuestions - 1 &&
                  !isComplete && (
                    <p className="mt-2 text-right text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      Answer all questions to submit —{" "}
                      {totalQuestions - answeredCount} remaining.
                    </p>
                  )}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#151026]">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Your progress
                </h2>
                <span className="rounded-full bg-purple-50 px-2 py-0.5 font-mono text-[11px] font-bold text-purple-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                  {progress}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.35, ease: "easeOut" }
                  }
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-cyan-400 dark:to-cyan-300"
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span>{answeredCount} answered</span>
                <span>{totalQuestions - answeredCount} left</span>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4 dark:border-white/[0.07]">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Question map
                </h3>
                <div className="mt-2.5 grid grid-cols-7 gap-1.5">
                  {questions.map((question, index) => {
                    const isCurrent = index === currentQuestionIndex;
                    const isAnswered = Boolean(selectedAnswers[question.id]);

                    return (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => goToQuestion(index)}
                        aria-label={`Go to question ${index + 1}${
                          isAnswered ? ", answered" : ""
                        }`}
                        aria-current={isCurrent ? "step" : undefined}
                        className={cn(
                          "flex h-8 w-full items-center justify-center rounded-lg font-mono text-[11px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 dark:focus-visible:ring-cyan-400/40",
                          isCurrent
                            ? "bg-purple-600 text-white shadow-sm ring-2 ring-purple-600/25 dark:bg-cyan-400 dark:text-slate-950 dark:ring-cyan-400/25"
                            : isAnswered
                              ? "bg-purple-100 text-purple-800 hover:bg-purple-200/80 dark:bg-purple-500/20 dark:text-purple-200 dark:hover:bg-purple-500/30"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/[0.06] dark:text-slate-400 dark:hover:bg-white/10",
                        )}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                type="button"
                onClick={() => void handleSubmitQuiz()}
                disabled={!isComplete || isSubmitting}
                className="mt-5 h-11 w-full rounded-xl bg-purple-600 text-sm font-bold text-white shadow-sm hover:bg-purple-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="mr-1.5 h-4 w-4" />
                    Submit quiz
                  </>
                )}
              </Button>
              <p className="mt-2 text-center text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
                {isComplete
                  ? "All questions answered. You're good to submit."
                  : `Answer all ${totalQuestions} questions to unlock submission.`}
              </p>

              {syncWarning && (
                <p
                  role="status"
                  className="mt-3 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-2 text-[10px] font-medium leading-relaxed text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                >
                  <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
                  Some answers haven&apos;t synced yet. We&apos;ll retry when you
                  submit.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-purple-200/60 bg-purple-50/60 p-4 dark:border-purple-500/20 dark:bg-purple-500/[0.07]">
              <p className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-200">
                <Lightbulb className="h-4 w-4 text-purple-600 dark:text-cyan-300" />
                Good to know
              </p>
              <ul className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-purple-800/80 dark:text-purple-200/70">
                <li className="flex items-start gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-500" />
                  Answers save automatically as you go.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-500" />
                  Jump between questions any time.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-500" />
                  Retake the quiz after submitting.
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-4 py-3 text-[11px] font-medium text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                {isExam ? "Module exam" : "Practice quiz"}
              </span>
              <span className="font-mono">
                {answeredCount}/{totalQuestions}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function BackToQuizzes() {
  return (
    <Link
      href="/learner/quizzes"
      className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to all quizzes
    </Link>
  );
}
