"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Send,
} from "lucide-react";

import { learnerApi } from "@/lib/api/learner";
import type { LearnerQuiz, QuizQuestion } from "@/lib/api/types/learner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

interface ModuleQuizProps {
  moduleId: string;
  moduleTitle: string;
  token?: string | null;
  onRefresh: () => Promise<string | null>;
}

export function ModuleQuiz({
  moduleId,
  moduleTitle,
  token,
  onRefresh,
}: ModuleQuizProps) {
  const [quiz, setQuiz] = useState<LearnerQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Active quiz-taking state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchQuiz() {
      if (!moduleId) return;

      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        const data = await learnerApi.getModuleQuiz(
          moduleId,
          token ?? "",
          onRefresh,
        );

        if (!cancelled) {
          // Sort questions and options by position
          const sortedQuestions = (data.questions ?? [])
            .slice()
            .sort((a, b) => a.position - b.position)
            .map((q) => ({
              ...q,
              options: (q.options ?? [])
                .slice()
                .sort((a, b) => a.position - b.position),
            }));

          setQuiz({ ...data, questions: sortedQuestions });
          setCurrentQuestionIndex(0);
          setSelectedAnswers({});
          setIsSubmitted(false);
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        // If the backend returns 404 or "Quiz not found", mark as notFound
        if (
          msg.toLowerCase().includes("not found") ||
          msg.includes("404") ||
          (err && typeof err === "object" && "status" in err && (err as { status: number }).status === 404)
        ) {
          setNotFound(true);
          setQuiz(null);
        } else {
          setError("Unable to load module quiz. Please try again.");
          setQuiz(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchQuiz();

    return () => {
      cancelled = true;
    };
  }, [moduleId, token, onRefresh]);

  const questions: QuizQuestion[] = useMemo(
    () => quiz?.questions ?? [],
    [quiz],
  );
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = totalQuestions > 0 && answeredCount === totalQuestions;

  function handleSelectOption(questionId: string, optionId: string) {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  }

  function handleReset() {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-black/[0.06] bg-slate-50/70 p-6 dark:border-white/[0.06] dark:bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 animate-spin items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-cyan-500/10 dark:text-cyan-400">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
            <div className="mt-1.5 h-3 w-48 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center dark:border-white/10">
        <HelpCircle className="mx-auto h-7 w-7 text-slate-400 dark:text-slate-500" />
        <h4 className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          No Quiz For This Module
        </h4>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          This module does not require an assessment. Continue exploring the
          module resources and masterclass video.
        </p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 text-xs text-rose-800 dark:border-rose-500/20 dark:bg-rose-950/20 dark:text-rose-300">
        <div className="flex items-center gap-2 font-bold">
          <AlertCircle className="h-4 w-4" />
          <span>{error ?? "No quiz data available"}</span>
        </div>
      </div>
    );
  }

  if (totalQuestions === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 p-5 text-center dark:border-white/10">
        <BookOpen className="mx-auto h-6 w-6 text-slate-400" />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Quiz questions are being prepared for this module.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4 rounded-3xl border border-black/[0.08] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#151026] sm:p-6">
      {/* Quiz Header */}
      <header className="flex flex-col gap-2 border-b border-slate-100 pb-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                quiz.isExam
                  ? "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30"
                  : "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-cyan-300 border border-purple-200 dark:border-purple-500/30",
              )}
            >
              <HelpCircle className="h-3 w-3" />
              <span>{quiz.isExam ? "Module Exam" : "Module Quiz"}</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {totalQuestions} {totalQuestions === 1 ? "Question" : "Questions"}
            </span>
          </div>
          <h3 className="mt-1.5 text-base font-bold text-slate-900 dark:text-white">
            {quiz.title}
          </h3>
          {quiz.description && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {quiz.description}
            </p>
          )}
        </div>

        {/* Progress summary */}
        <div className="flex items-center gap-2 sm:self-center">
          <div className="text-right">
            <span className="font-mono text-xs font-bold text-purple-700 dark:text-cyan-400">
              {answeredCount}/{totalQuestions}
            </span>
            <span className="block text-[10px] text-slate-400">Answered</span>
          </div>
          <div className="h-8 w-1 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div
              className="w-full bg-purple-600 dark:bg-cyan-400 transition-all duration-300"
              style={{
                height: `${Math.round((answeredCount / totalQuestions) * 100)}%`,
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Quiz Body: Question Flow or Submission Review */}
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key={`question-${currentQuestion?.id}`}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Question title */}
            <div className="rounded-2xl bg-purple-50/50 p-4 dark:bg-white/[0.02]">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <h4 className="mt-1 text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                {currentQuestion.question}
              </h4>
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected =
                  selectedAnswers[currentQuestion.id] === option.id;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      handleSelectOption(currentQuestion.id, option.id)
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left text-xs font-medium transition-all sm:text-sm",
                      isSelected
                        ? "border-purple-600 bg-purple-50/80 text-purple-950 shadow-xs dark:border-cyan-400 dark:bg-cyan-500/10 dark:text-cyan-100"
                        : "border-black/[0.06] bg-slate-50/60 text-slate-700 hover:border-purple-300 hover:bg-white dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-300 dark:hover:border-cyan-500/30 dark:hover:bg-white/[0.04]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition",
                        isSelected
                          ? "bg-purple-600 text-white dark:bg-cyan-400 dark:text-slate-950"
                          : "bg-slate-200/80 text-slate-600 dark:bg-white/10 dark:text-slate-400",
                      )}
                    >
                      {letter}
                    </span>
                    <span className="flex-1 leading-relaxed">
                      {option.text}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-600 dark:text-cyan-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Question Quick-Selector Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  const isAnswered = Boolean(selectedAnswers[q.id]);
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold transition",
                        isCurrent
                          ? "bg-purple-600 text-white shadow-xs dark:bg-cyan-400 dark:text-slate-950 ring-2 ring-purple-600/30"
                          : isAnswered
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10",
                      )}
                      aria-label={`Jump to question ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next / Submit Controls */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentQuestionIndex === 0}
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                  }
                  className="rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span>Previous</span>
                </Button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(totalQuestions - 1, prev + 1),
                      )
                    }
                    className="rounded-xl bg-purple-600 font-bold text-white hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    disabled={!isComplete}
                    onClick={() => setIsSubmitted(true)}
                    className="rounded-xl bg-purple-600 font-bold text-white hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    <span>Review &amp; Finish</span>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Submission Completed & Review View */
          <motion.div
            key="submitted-state"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 py-2"
          >
            <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-cyan-500/10 p-6 text-center dark:border-white/10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-600/30 dark:bg-cyan-400 dark:text-slate-950">
                <Award className="h-7 w-7" />
              </div>
              <h4 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                Quiz Answers Recorded!
              </h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                You have completed all {totalQuestions} questions for &ldquo;
                {moduleTitle}&rdquo;. Your responses have been safely saved.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{answeredCount} of {totalQuestions} Answered</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800 dark:bg-purple-500/20 dark:text-cyan-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Assessment Completed</span>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/10">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="rounded-xl text-xs"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Retake Quiz
              </Button>
              <span className="text-[11px] text-slate-400">
                Backend route: /learner/modules/{moduleId}/quiz
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
