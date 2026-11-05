"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Check, FileText, Layers, ListChecks, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/lib/auth/auth-context";
import type {
  AddAiQuizRequest,
  AiQuiz,
  AiResource,
  AiResourceType,
  UpdateAiModuleRequest,
} from "@/lib/api/types";
import { addAiQuiz, updateAiModule } from "@/lib/api/hammet";
import { ApiError } from "@/lib/api/api-client";
import { is_enabled } from "@/lib/features/flags";
import { trackGloriaEvent } from "@/lib/analytics";
import { canManageAiCatalog } from "@/lib/utils/roles";
import { Alert } from "@/components/ui";
import {
  Notice,
  SessionExpiredNotice,
  cardClassName,
  inputClassName,
  parseWholeNumber,
  primaryButtonClassName,
} from "@/components/hammet/admin-form";

const RESOURCE_TYPES: { value: AiResourceType; label: string }[] = [
  { value: "link", label: "Link" },
  { value: "video", label: "Video" },
  { value: "article", label: "Article" },
  { value: "document", label: "Document" },
];

// The backend rejects questions that don't have exactly 4 options.
const OPTIONS_PER_QUESTION = 4;

type ResourceRow = {
  key: number;
  title: string;
  resourceType: AiResourceType;
  url: string;
  position: string;
};

type QuestionRow = {
  key: number;
  question: string;
  options: string[];
  correctIndex: number | null;
};

let nextRowKey = 0;
function newKey() {
  nextRowKey += 1;
  return nextRowKey;
}

function emptyResourceRow(position: string): ResourceRow {
  return { key: newKey(), title: "", resourceType: "link", url: "", position };
}

function emptyQuestionRow(): QuestionRow {
  return { key: newKey(), question: "", options: Array(OPTIONS_PER_QUESTION).fill(""), correctIndex: null };
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isResourceRowValid(row: ResourceRow) {
  return row.title.trim() !== "" && isValidUrl(row.url.trim()) && parseWholeNumber(row.position) !== null;
}

function isQuestionRowValid(row: QuestionRow) {
  return row.question.trim() !== "" && row.options.every((option) => option.trim() !== "") && row.correctIndex !== null;
}

const secondaryButtonClassName =
  "flex shrink-0 items-center gap-2 rounded-xl border border-black/[0.08] px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50 dark:border-white/[0.08] dark:hover:bg-white/[0.04]";

const removeButtonClassName =
  "flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400";

function EditAiModuleContent() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") ?? "";
  const schoolId = searchParams.get("schoolId") ?? "";
  const moduleTitle = searchParams.get("title") ?? "";
  const { user, accessToken, refreshToken, isLoading: authLoading } = useAuth();
  const canEdit = canManageAiCatalog(user);

  const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    is_enabled("gloria_module_creation").then((value) => setFeatureEnabled(Boolean(value)));
  }, []);

  // Module details: there's no route to read a module back, so blank means "leave unchanged".
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState("");
  const [masterclass, setMasterclass] = useState("");
  const [resourceRows, setResourceRows] = useState<ResourceRow[]>([]);
  const [addedResources, setAddedResources] = useState<AiResource[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizPosition, setQuizPosition] = useState("1");
  const [passingScore, setPassingScore] = useState("");
  const [isExam, setIsExam] = useState(false);
  const [questions, setQuestions] = useState<QuestionRow[]>(() => [emptyQuestionRow()]);
  const [createdQuizzes, setCreatedQuizzes] = useState<AiQuiz[]>([]);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [quizError, setQuizError] = useState("");

  // ---- module details + resources ----

  const parsedPosition = position.trim() === "" ? undefined : parseWholeNumber(position);
  const isPositionValid = parsedPosition !== null;
  const isMasterclassValid = masterclass.trim() === "" || isValidUrl(masterclass.trim());
  const areResourcesValid = resourceRows.every(isResourceRowValid);
  const hasDetailChanges =
    title.trim() !== "" || description.trim() !== "" || position.trim() !== "" || masterclass.trim() !== "";
  const canSaveModule =
    (hasDetailChanges || resourceRows.length > 0) && isPositionValid && isMasterclassValid && areResourcesValid;

  function updateResourceRow(key: number, patch: Partial<Omit<ResourceRow, "key">>) {
    setResourceRows((rows) => rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function addResourceRow() {
    const used = [...addedResources.map((item) => item.position), ...resourceRows.map((row) => Number(row.position) || 0)];
    setResourceRows((rows) => [...rows, emptyResourceRow(String(Math.max(0, ...used) + 1))]);
  }

  async function handleSaveModule() {
    if (!user || !accessToken || !canSaveModule || parsedPosition === null) return;
    setIsSaving(true);
    setIsSaved(false);
    setSaveError("");

    try {
      const body = {
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        position: parsedPosition,
        masterclass: masterclass.trim() || undefined,
        resources:
          resourceRows.length > 0
            ? resourceRows.map((row) => ({
                title: row.title.trim(),
                resourceType: row.resourceType,
                moduleId,
                url: row.url.trim(),
                position: Number(row.position),
              }))
            : undefined,
      } satisfies UpdateAiModuleRequest;

      const updated = await updateAiModule(moduleId, body, accessToken, refreshToken);
      if (resourceRows.length > 0) {
        trackGloriaEvent("gloria_resources_created", { moduleId, count: resourceRows.length });
      }
      setAddedResources((current) => [...current, ...updated.resources]);
      setResourceRows([]);
      setTitle("");
      setDescription("");
      setPosition("");
      setMasterclass("");
      setIsSaved(true);
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  // ---- quiz ----

  const parsedQuizPosition = parseWholeNumber(quizPosition);
  const parsedPassingScore = parseWholeNumber(passingScore);
  const isQuizValid =
    quizTitle.trim() !== "" &&
    quizDescription.trim() !== "" &&
    parsedQuizPosition !== null &&
    parsedPassingScore !== null &&
    questions.length > 0 &&
    questions.every(isQuestionRowValid);

  function updateQuestion(key: number, patch: Partial<Omit<QuestionRow, "key">>) {
    setQuestions((rows) => rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function updateOption(key: number, index: number, value: string) {
    setQuestions((rows) =>
      rows.map((row) =>
        row.key === key ? { ...row, options: row.options.map((option, i) => (i === index ? value : option)) } : row
      )
    );
  }

  async function handleCreateQuiz() {
    if (!user || !accessToken || !isQuizValid || parsedQuizPosition === null || parsedPassingScore === null) return;
    setIsCreatingQuiz(true);
    setQuizError("");

    try {
      const body = {
        title: quizTitle.trim(),
        description: quizDescription.trim(),
        position: parsedQuizPosition,
        passingScore: parsedPassingScore,
        isExam,
        questions: questions.map((row, questionIndex) => ({
          question: row.question.trim(),
          position: questionIndex + 1,
          options: row.options.map((option, optionIndex) => ({
            text: option.trim(),
            position: optionIndex + 1,
            isCorrect: optionIndex === row.correctIndex,
          })),
        })),
      } satisfies AddAiQuizRequest;

      const quiz = await addAiQuiz(moduleId, body, accessToken, refreshToken);
      trackGloriaEvent("gloria_quiz_created", {
        moduleId,
        quizId: quiz.id,
        questions: quiz.questions.length,
        isExam,
      });
      setCreatedQuizzes((current) => [...current, quiz]);
      setQuizTitle("");
      setQuizDescription("");
      setQuizPosition(String(parsedQuizPosition + 1));
      setPassingScore("");
      setIsExam(false);
      setQuestions([emptyQuestionRow()]);
    } catch (err) {
      trackGloriaEvent("gloria_quiz_create_failed", {
        moduleId,
        error: err instanceof Error ? err.message : "Unknown error",
      });
      setQuizError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsCreatingQuiz(false);
    }
  }

  if (!authLoading && !accessToken) {
    return <SessionExpiredNotice />;
  }

  if (!canEdit) {
    return <Notice title="Edit AI module">You do not have access to edit AI modules.</Notice>;
  }

  if (featureEnabled === false) {
    return (
      <Notice title="Module editing is disabled">
        Turn on the gloria_module_creation flag in Growthbook to roll out module editing.
      </Notice>
    );
  }

  const backHref = courseId
    ? `/hammet/courses/${encodeURIComponent(courseId)}/edit?schoolId=${encodeURIComponent(schoolId)}`
    : "/hammet/courses";

  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1050px]">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <Link
            href={backHref}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-purple-700 dark:text-slate-400 dark:hover:text-cyan-400"
          >
            <ArrowLeft className="h-4 w-4" />
            {courseId ? "Back to course" : "Back to courses"}
          </Link>

          <p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">AI Modules</p>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
            {moduleTitle ? `Edit ${moduleTitle}` : "Edit AI module"}
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Update the module, add resources, and add quizzes.
          </p>
        </motion.section>

        <div className="mx-auto max-w-[760px] space-y-6">
          {/* Module details */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className={cardClassName}
          >
            <div className="mb-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                <Layers className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">Module details</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Leave a field blank to keep its current value.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Title</span>
                  <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={moduleTitle || "Unchanged"} className={inputClassName} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Position</span>
                  <input type="number" min={0} step={1} value={position} onChange={(event) => setPosition(event.target.value)} placeholder="Unchanged" className={inputClassName} />
                </label>
              </div>
              {!isPositionValid && (
                <span className="-mt-3 block text-xs text-red-600 dark:text-red-400">Position must be a whole number of 0 or more.</span>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Description</span>
                <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Unchanged" rows={4} className={`${inputClassName} resize-y`} />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Masterclass link</span>
                <input value={masterclass} onChange={(event) => setMasterclass(event.target.value)} placeholder="Unchanged" className={inputClassName} />
                {!isMasterclassValid && (
                  <span className="mt-2 block text-xs text-red-600 dark:text-red-400">Enter a full http(s) link.</span>
                )}
              </label>
            </div>
          </motion.section>

          {/* Resources */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className={cardClassName}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold tracking-[-0.03em]">Add resources</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Links to videos, articles and documents. File upload isn&apos;t available yet.
                </p>
              </div>

              <button type="button" onClick={addResourceRow} className={secondaryButtonClassName}>
                <Plus className="h-4 w-4" />
                Add resource
              </button>
            </div>

            {resourceRows.length === 0 ? (
              <p className="rounded-xl border border-dashed border-black/[0.1] p-5 text-center text-sm text-slate-500 dark:border-white/[0.1] dark:text-slate-400">
                No new resources. Use &ldquo;Add resource&rdquo; to add one.
              </p>
            ) : (
              <div className="space-y-4">
                {resourceRows.map((row, index) => (
                  <div key={row.key} className="rounded-2xl border border-black/[0.06] p-5 dark:border-white/[0.06]">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-semibold">New resource {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => setResourceRows((rows) => rows.filter((item) => item.key !== row.key))}
                        aria-label={`Remove new resource ${index + 1}`}
                        className={removeButtonClassName}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium">Title</span>
                        <input value={row.title} onChange={(event) => updateResourceRow(row.key, { title: event.target.value })} className={inputClassName} />
                      </label>

                      <div className="grid gap-4 sm:grid-cols-[160px_1fr_110px]">
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium">Type</span>
                          <select
                            value={row.resourceType}
                            onChange={(event) => updateResourceRow(row.key, { resourceType: event.target.value as AiResourceType })}
                            className={inputClassName}
                          >
                            {RESOURCE_TYPES.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium">URL</span>
                          <input value={row.url} onChange={(event) => updateResourceRow(row.key, { url: event.target.value })} placeholder="https://" className={inputClassName} />
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium">Position</span>
                          <input type="number" min={0} step={1} value={row.position} onChange={(event) => updateResourceRow(row.key, { position: event.target.value })} className={inputClassName} />
                        </label>
                      </div>

                      {!isResourceRowValid(row) && (row.title || row.url) && (
                        <span className="block text-xs text-red-600 dark:text-red-400">
                          Title, a full http(s) URL and a whole-number position are required.
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {addedResources.length > 0 && (
              <div className="mt-6 border-t border-black/[0.06] pt-6 dark:border-white/[0.06]">
                <p className="mb-3 text-sm font-semibold">Resources added in this session</p>
                <ul className="space-y-2">
                  {addedResources.map((item, index) => (
                    <li key={`${item.url}-${index}`} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm dark:bg-white/[0.04]">
                      <span className="truncate">
                        <span className="text-slate-400">{item.position}.</span> {item.title}
                      </span>
                      <span className="shrink-0 rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                        {item.resourceType}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>

          <div>
            <button type="button" onClick={handleSaveModule} className={primaryButtonClassName} disabled={isSaving || !canSaveModule}>
              <Save className="h-4 w-4" />
              {isSaving
                ? "Saving..."
                : resourceRows.length > 0
                  ? `Save module and add ${resourceRows.length} resource${resourceRows.length === 1 ? "" : "s"}`
                  : "Save module changes"}
            </button>

            {isSaved && (
              <p className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
                <Check className="h-4 w-4" />
                Module saved
              </p>
            )}

            {saveError && (
              <div className="mt-4">
                <Alert title="Error saving AI module" variant="error">
                  {saveError}
                </Alert>
              </div>
            )}
          </div>

          {/* Quiz */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className={cardClassName}
          >
            <div className="mb-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300">
                <ListChecks className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">Add a quiz</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Each question needs exactly {OPTIONS_PER_QUESTION} options with one correct answer.
              </p>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Quiz title</span>
                <input value={quizTitle} onChange={(event) => setQuizTitle(event.target.value)} className={inputClassName} />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Description</span>
                <textarea value={quizDescription} onChange={(event) => setQuizDescription(event.target.value)} rows={3} className={`${inputClassName} resize-y`} />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Position</span>
                  <input type="number" min={0} step={1} value={quizPosition} onChange={(event) => setQuizPosition(event.target.value)} className={inputClassName} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Passing score</span>
                  <input type="number" min={0} step={1} value={passingScore} onChange={(event) => setPassingScore(event.target.value)} placeholder="e.g. 70" className={inputClassName} />
                </label>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/[0.06] p-4 dark:border-white/[0.06]">
                <input type="checkbox" checked={isExam} onChange={(event) => setIsExam(event.target.checked)} className="h-4 w-4 accent-purple-600" />
                <span>
                  <span className="block text-sm font-medium">This is an exam</span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Mark the module&apos;s final assessment as an exam.</span>
                </span>
              </label>

              <div className="space-y-4">
                {questions.map((row, questionIndex) => (
                  <fieldset key={row.key} className="rounded-2xl border border-black/[0.06] p-5 dark:border-white/[0.06]">
                    <div className="mb-4 flex items-center justify-between">
                      <legend className="text-sm font-semibold">Question {questionIndex + 1}</legend>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setQuestions((rows) => rows.filter((item) => item.key !== row.key))}
                          aria-label={`Remove question ${questionIndex + 1}`}
                          className={removeButtonClassName}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <input
                      value={row.question}
                      onChange={(event) => updateQuestion(row.key, { question: event.target.value })}
                      placeholder="Question"
                      aria-label={`Question ${questionIndex + 1}`}
                      className={inputClassName}
                    />

                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Options — select the correct answer</p>
                      {row.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`correct-${row.key}`}
                            checked={row.correctIndex === optionIndex}
                            onChange={() => updateQuestion(row.key, { correctIndex: optionIndex })}
                            aria-label={`Option ${optionIndex + 1} is correct`}
                            className="h-4 w-4 shrink-0 accent-purple-600"
                          />
                          <input
                            value={option}
                            onChange={(event) => updateOption(row.key, optionIndex, event.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                            aria-label={`Question ${questionIndex + 1} option ${optionIndex + 1}`}
                            className={inputClassName}
                          />
                        </div>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>

              <button type="button" onClick={() => setQuestions((rows) => [...rows, emptyQuestionRow()])} className={secondaryButtonClassName}>
                <Plus className="h-4 w-4" />
                Add question
              </button>
            </div>

            <button type="button" onClick={handleCreateQuiz} className={`${primaryButtonClassName} mt-7`} disabled={isCreatingQuiz || !isQuizValid}>
              <Plus className="h-4 w-4" />
              {isCreatingQuiz ? "Creating quiz..." : "Create quiz"}
            </button>

            {quizError && (
              <div className="mt-4">
                <Alert title="Error creating quiz" variant="error">
                  {quizError}
                </Alert>
              </div>
            )}

            {createdQuizzes.length > 0 && (
              <div className="mt-6 border-t border-black/[0.06] pt-6 dark:border-white/[0.06]">
                <p className="mb-3 text-sm font-semibold">Quizzes added in this session</p>
                <ul className="space-y-2">
                  {createdQuizzes.map((quiz) => (
                    <li key={quiz.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm dark:bg-white/[0.04]">
                      <span className="flex min-w-0 items-center gap-2">
                        <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                        <span className="truncate">{quiz.title}</span>
                      </span>
                      <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                        {quiz.questions.length} question{quiz.questions.length === 1 ? "" : "s"}
                        {quiz.isExam ? " · Exam" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}

export default function EditAiModulePage() {
  return (
    <Suspense fallback={null}>
      <EditAiModuleContent />
    </Suspense>
  );
}
