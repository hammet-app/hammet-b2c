"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, FolderKanban, ListChecks, Plus, Save, Trash2 } from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { Alert } from "@/components/ui";
import {
  addAiQuiz,
  deleteAiProject,
  deleteAiQuiz,
  deleteAiResource,
  getHammetAiModule,
  updateAiModule,
  updateAiProject,
  updateAiQuiz,
  updateAiResource,
} from "@/lib/api/hammet";
import type {
  AiProject,
  AiQuiz,
  AiResource,
  AiResourceType,
  HammetAiModuleContent,
} from "@/lib/api/types";
import { canManageAiCatalog } from "@/lib/utils/roles";
import {
  Notice,
  SessionExpiredNotice,
  cardClassName,
  inputClassName,
  parseWholeNumber,
  primaryButtonClassName,
} from "@/components/layout/hammet/admin-form";

export type ModuleContentKind = "resources" | "quizzes" | "projects";

const RESOURCE_TYPES: { value: AiResourceType; label: string }[] = [
  { value: "link", label: "Link" },
  { value: "video", label: "Video" },
  { value: "article", label: "Article" },
  { value: "document", label: "Document" },
];

const secondaryButtonClassName =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-black/[0.08] px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-white/[0.08] dark:hover:bg-white/[0.04]";

type ResourceDraft = {
  id?: string;
  title: string;
  resourceType: AiResourceType;
  url: string;
  position: string;
};

type ProjectDraft = {
  id?: string;
  title: string;
  description: string;
  instructions: string;
  position: string;
};

type QuestionDraft = {
  id?: string;
  key: number;
  question: string;
  options: { id?: string; text: string; isCorrect: boolean }[];
};

type QuizDraft = {
  id?: string;
  title: string;
  description: string;
  position: string;
  passingScore: string;
  durationMinutes: string;
  isExam: boolean;
  questions: QuestionDraft[];
};

type DeleteTarget = {
  kind: ModuleContentKind;
  id: string;
  label: string;
};

let rowKey = 0;
function nextKey() {
  rowKey += 1;
  return rowKey;
}

function emptyQuestion(): QuestionDraft {
  return {
    key: nextKey(),
    question: "",
    options: Array.from({ length: 4 }, () => ({ text: "", isCorrect: false })),
  };
}

function emptyResource(position = "1"): ResourceDraft {
  return { title: "", resourceType: "link", url: "", position };
}

function emptyProject(position = "1"): ProjectDraft {
  return { title: "", description: "", instructions: "", position };
}

function emptyQuiz(position = "1"): QuizDraft {
  return {
    title: "",
    description: "",
    position,
    passingScore: "",
    durationMinutes: "30",
    isExam: false,
    questions: [emptyQuestion()],
  };
}

function hasValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function quizToDraft(quiz: AiQuiz): QuizDraft {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    position: String(quiz.position),
    passingScore: String(quiz.passingScore),
    durationMinutes: String(quiz.durationMinutes),
    isExam: quiz.isExam,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      key: nextKey(),
      question: question.question,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
        isCorrect: option.isCorrect,
      })),
    })),
  };
}

function getQuizValidationErrors(quiz: QuizDraft): string[] {
  const errors: string[] = [];
  if (!quiz.title.trim()) errors.push("Enter a quiz title.");
  if (!quiz.description.trim()) errors.push("Enter a quiz description.");
  if (parseWholeNumber(quiz.position) === null) errors.push("Enter a valid whole-number position.");
  if (parseWholeNumber(quiz.passingScore) === null) errors.push("Enter a valid whole-number passing score.");
  const durationMinutes = parseWholeNumber(quiz.durationMinutes);
  if (durationMinutes === null || durationMinutes < 1) errors.push("Duration must be at least one minute.");
  if (quiz.questions.length === 0) errors.push("Add at least one question.");

  quiz.questions.forEach((question, index) => {
    const missing: string[] = [];
    if (!question.question.trim()) missing.push("enter the question text");
    if (question.options.length !== 4) missing.push("provide four answer choices");
    else if (question.options.some((option) => !option.text.trim())) missing.push("fill in all four answer choices");
    if (question.options.filter((option) => option.isCorrect).length !== 1) {
      missing.push("select exactly one correct answer");
    }
    if (missing.length) errors.push(`Question ${index + 1}: ${missing.join(" and ")}.`);
  });

  return errors;
}

export function ModuleContentManager({ kind }: { kind: ModuleContentKind }) {
  const { moduleId } = useParams<{ moduleId: string }>();
  const searchParams = useSearchParams();
  const { user, accessToken, refreshToken, isLoading: authLoading } = useAuth();
  const canEdit = canManageAiCatalog(user);
  const [module, setModule] = useState<HammetAiModuleContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [savedText, setSavedText] = useState("Changes saved.");
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [resource, setResource] = useState<ResourceDraft>(emptyResource());
  const [project, setProject] = useState<ProjectDraft>(emptyProject());
  const [quiz, setQuiz] = useState<QuizDraft>(emptyQuiz());

  const loadModule = useCallback(async () => {
    if (!accessToken) return null;
    const result = await getHammetAiModule(
      moduleId,
      accessToken,
      refreshToken ?? (async () => null),
    );
    setModule(result);
    return result;
  }, [accessToken, moduleId, refreshToken]);

  useEffect(() => {
    if (!accessToken || !canEdit) return;
    let active = true;
    setLoading(true);
    void getHammetAiModule(
      moduleId,
      accessToken,
      refreshToken ?? (async () => null),
    )
      .then((result) => {
        if (active) setModule(result);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Unable to load module content.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [accessToken, canEdit, moduleId, refreshToken]);

  const title = kind === "resources" ? "Resources" : kind === "quizzes" ? "Quizzes" : "Projects";
  const Icon = kind === "resources" ? FileText : kind === "quizzes" ? ListChecks : FolderKanban;
  const resources = module?.resources ?? [];
  const projects = module?.projects ?? [];
  const quizzes = module?.quizzes ?? [];

  const nextResourcePosition = useMemo(() => {
    const positions = new Set(resources.map((item) => item.position));
    let position = 1;
    while (positions.has(position)) position += 1;
    return position;
  }, [resources]);

  const nextProjectPosition = useMemo(
    () => Math.max(0, ...projects.map((item) => item.position)) + 1,
    [projects],
  );

  function selectResource(item: AiResource) {
    setSaved(false);
    setResource({
      id: item.id,
      title: item.title,
      resourceType: item.resourceType as AiResourceType,
      url: item.url,
      position: String(item.position),
    });
  }

  function selectProject(item: AiProject) {
    setSaved(false);
    setProject({
      id: item.id,
      title: item.title,
      description: item.description,
      instructions: item.instructions,
      position: String(item.position),
    });
  }

  function selectQuiz(item: AiQuiz) {
    setSaved(false);
    setQuiz(quizToDraft(item));
  }

  async function handleResourceSave() {
    if (!accessToken || !module || !resource.title.trim() || !hasValidUrl(resource.url.trim())) return;
    const position = parseWholeNumber(resource.position);
    if (position === null) return;
    const occupied = resources.some((item) => item.position === position && item.id !== resource.id);
    if (occupied) {
      setError("Choose a position that is not already used by another resource.");
      return;
    }

    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const onRefresh = refreshToken ?? (async () => null);
      if (resource.id) {
        await updateAiResource(resource.id, {
          title: resource.title.trim(),
          resourceType: resource.resourceType,
          url: resource.url.trim(),
          position,
        }, accessToken, onRefresh);
      } else {
        await updateAiModule(module.id, {
          resources: [{
            title: resource.title.trim(),
            resourceType: resource.resourceType,
            moduleId: module.id,
            url: resource.url.trim(),
            position,
          }],
        }, accessToken, onRefresh);
      }
      await loadModule();
      setResource(emptyResource(String(nextResourcePosition + (resource.id ? 0 : 1))));
      setSavedText("Changes saved.");
      setSaved(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save resource.");
    } finally {
      setSaving(false);
    }
  }

  async function handleProjectSave() {
    if (!accessToken || !module || !project.title.trim() || !project.description.trim() || !project.instructions.trim()) return;
    const position = parseWholeNumber(project.position);
    if (position === null) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const onRefresh = refreshToken ?? (async () => null);
      if (project.id) {
        await updateAiProject(project.id, {
          title: project.title.trim(),
          description: project.description.trim(),
          instructions: project.instructions.trim(),
          position,
        }, accessToken, onRefresh);
      } else {
        await updateAiModule(module.id, {
          projects: [{
            title: project.title.trim(),
            moduleId: module.id,
            description: project.description.trim(),
            instructions: project.instructions.trim(),
            position,
          }],
        }, accessToken, onRefresh);
      }
      await loadModule();
      setProject(emptyProject(String(nextProjectPosition + (project.id ? 0 : 1))));
      setSavedText("Changes saved.");
      setSaved(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save project.");
    } finally {
      setSaving(false);
    }
  }

  function updateQuestion(key: number, patch: Partial<Omit<QuestionDraft, "key">>) {
    setQuiz((current) => ({
      ...current,
      questions: current.questions.map((item) => item.key === key ? { ...item, ...patch } : item),
    }));
  }

  function updateOption(key: number, optionIndex: number, patch: Partial<QuestionDraft["options"][number]>) {
    setQuiz((current) => ({
      ...current,
      questions: current.questions.map((item) => item.key === key
        ? { ...item, options: item.options.map((option, index) => index === optionIndex ? { ...option, ...patch } : option) }
        : item),
    }));
  }

  async function handleQuizSave() {
    if (!accessToken || !module) return;
    const position = parseWholeNumber(quiz.position);
    const passingScore = parseWholeNumber(quiz.passingScore);
    const durationMinutes = parseWholeNumber(quiz.durationMinutes);
    const validationErrors = getQuizValidationErrors(quiz);
    if (validationErrors.length) {
      setError(validationErrors.join(" "));
      setSaved(false);
      return;
    }
    if (position === null || passingScore === null || durationMinutes === null) return;

    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const onRefresh = refreshToken ?? (async () => null);
      const body = {
        title: quiz.title.trim(),
        description: quiz.description.trim(),
        position,
        passingScore,
        durationMinutes,
        isExam: quiz.isExam,
        questions: quiz.questions.map((question, questionIndex) => ({
          ...(question.id ? { id: question.id } : {}),
          question: question.question.trim(),
          position: questionIndex + 1,
          options: question.options.map((option, optionIndex) => ({
            ...(option.id ? { id: option.id } : {}),
            text: option.text.trim(),
            position: optionIndex + 1,
            isCorrect: option.isCorrect,
          })),
        })),
      };

      const result = quiz.id
        ? await updateAiQuiz(quiz.id, body, accessToken, onRefresh)
        : await addAiQuiz(module.id, {
            ...body,
            questions: body.questions.map(({ question, position: questionPosition, options }) => ({
              question,
              position: questionPosition,
              options: options.map(({ text, position: optionPosition, isCorrect }) => ({
                text,
                position: optionPosition,
                isCorrect,
              })),
            })),
          }, accessToken, onRefresh);

      const refreshedModule = await loadModule();
      const refreshedQuiz = quiz.id
        ? refreshedModule?.quizzes.find((item) => item.id === quiz.id)
        : undefined;
      setQuiz(quizToDraft(refreshedQuiz ?? result));
      setSavedText("Changes saved.");
      setSaved(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save quiz.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!accessToken || !deleteTarget) return;
    setDeleting(true);
    setError("");
    setSaved(false);
    try {
      const onRefresh = refreshToken ?? (async () => null);
      if (deleteTarget.kind === "resources") {
        await deleteAiResource(deleteTarget.id, accessToken, onRefresh);
        if (resource.id === deleteTarget.id) setResource(emptyResource(String(nextResourcePosition)));
      } else if (deleteTarget.kind === "projects") {
        await deleteAiProject(deleteTarget.id, accessToken, onRefresh);
        if (project.id === deleteTarget.id) setProject(emptyProject(String(nextProjectPosition)));
      } else {
        await deleteAiQuiz(deleteTarget.id, accessToken, onRefresh);
        if (quiz.id === deleteTarget.id) setQuiz(emptyQuiz());
      }
      await loadModule();
      setDeleteTarget(null);
      setSavedText("Deleted successfully.");
      setSaved(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : `Unable to delete ${deleteTarget.kind.slice(0, -1)}.`);
    } finally {
      setDeleting(false);
    }
  }

  if (!authLoading && !accessToken) return <SessionExpiredNotice />;
  if (!canEdit) return <Notice title={`Manage ${title.toLowerCase()}`}>You do not have access to manage course content.</Notice>;

  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1050px]">
        <header className="mb-7">
          <Link href={`/hammet/modules/${encodeURIComponent(moduleId)}/edit${searchParams.size ? `?${searchParams.toString()}` : ""}`} className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to module
          </Link>
          <p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">{module?.title ?? "Module content"}</p>
          <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl">
            <Icon className="h-7 w-7 shrink-0" /> Manage {title.toLowerCase()}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            {kind === "resources" ? "Add and update links learners use in this module." : kind === "quizzes" ? "Create and update quiz questions, answer options, and scoring." : "Add and update project briefs for this module."}
          </p>
        </header>

        {error && <div className="mb-5"><Alert title={`Unable to manage ${title.toLowerCase()}`} variant="error">{error}</Alert></div>}
        {saved && <p role="status" className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">{savedText}</p>}
        {loading ? (
          <div aria-busy="true" className="grid gap-4"><div className="h-40 animate-pulse rounded-2xl bg-purple-50 dark:bg-white/[0.04]" /><div className="h-72 animate-pulse rounded-2xl bg-purple-50 dark:bg-white/[0.04]" /></div>
        ) : !module ? (
          <Alert title="Module content unavailable" variant="error">Please refresh the page and try again.</Alert>
        ) : kind === "resources" ? (
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <section className={cardClassName} aria-labelledby="resource-list-heading">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 id="resource-list-heading" className="text-lg font-semibold">Module resources</h2>
                <span className="text-sm text-slate-500">{resources.length}</span>
              </div>
              {resources.length ? <ul className="space-y-2">{resources.map((item) => (
                <li key={item.id ?? `${item.position}-${item.url}`}>
                  <button type="button" onClick={() => selectResource(item)} className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border border-black/[0.06] px-4 py-3 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-white/[0.06] dark:hover:bg-white/[0.04]">
                    <span className="min-w-0"><span className="block truncate text-sm font-semibold">{item.title}</span><span className="mt-1 block truncate text-xs text-slate-500">{item.position}. {item.resourceType} · {item.url}</span></span>
                    <span className="shrink-0 text-sm font-medium text-purple-700 dark:text-cyan-300">Edit</span>
                  </button>
                </li>
              ))}</ul> : <p className="rounded-xl border border-dashed border-black/10 p-5 text-sm text-slate-500 dark:border-white/10">No resources have been added.</p>}
            </section>
            <section className={cardClassName} aria-labelledby="resource-form-heading">
              <div className="mb-5 flex items-center justify-between gap-3"><h2 id="resource-form-heading" className="text-lg font-semibold">{resource.id ? "Edit resource" : "Add resource"}</h2><div className="flex gap-2">{resource.id && <button type="button" onClick={() => setDeleteTarget({ kind: "resources", id: resource.id!, label: resource.title })} disabled={saving || deleting} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-500/20 px-3 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 dark:text-red-300 dark:hover:bg-red-400/10"><Trash2 className="h-4 w-4" /><span className="sr-only sm:not-sr-only">Delete</span></button>}<button type="button" onClick={() => setResource(emptyResource(String(nextResourcePosition)))} className={secondaryButtonClassName}><Plus className="h-4 w-4" /> New</button></div></div>
              <div className="space-y-4">
                <label className="block"><span className="mb-2 block text-sm font-medium">Title</span><input value={resource.title} onChange={(event) => setResource({ ...resource, title: event.target.value })} className={inputClassName} /></label>
                <label className="block"><span className="mb-2 block text-sm font-medium">Type</span><select value={resource.resourceType} onChange={(event) => setResource({ ...resource, resourceType: event.target.value as AiResourceType })} className={inputClassName}>{RESOURCE_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>
                <label className="block"><span className="mb-2 block text-sm font-medium">URL</span><input type="url" inputMode="url" value={resource.url} onChange={(event) => setResource({ ...resource, url: event.target.value })} placeholder="https://" className={inputClassName} /></label>
                <label className="block"><span className="mb-2 block text-sm font-medium">Position</span><input type="number" min={0} step={1} value={resource.position} onChange={(event) => setResource({ ...resource, position: event.target.value })} className={inputClassName} /></label>
                {resources.some((item) => item.position === Number(resource.position) && item.id !== resource.id) && <p className="text-sm text-red-600 dark:text-red-400">That position is already used in this module.</p>}
                <button type="button" onClick={handleResourceSave} disabled={saving || !resource.title.trim() || !hasValidUrl(resource.url.trim()) || parseWholeNumber(resource.position) === null || resources.some((item) => item.position === Number(resource.position) && item.id !== resource.id)} className={primaryButtonClassName}><Save className="h-4 w-4" />{saving ? "Saving…" : resource.id ? "Save resource" : "Add resource"}</button>
              </div>
            </section>
          </div>
        ) : kind === "projects" ? (
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <section className={cardClassName} aria-labelledby="project-list-heading">
              <div className="mb-4 flex items-center justify-between gap-3"><h2 id="project-list-heading" className="text-lg font-semibold">Module projects</h2><span className="text-sm text-slate-500">{projects.length}</span></div>
              {projects.length ? <ul className="space-y-2">{projects.map((item) => <li key={item.id}><button type="button" onClick={() => selectProject(item)} className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border border-black/[0.06] px-4 py-3 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-white/[0.06] dark:hover:bg-white/[0.04]"><span className="min-w-0"><span className="block truncate text-sm font-semibold">{item.title}</span><span className="mt-1 block text-xs text-slate-500">Position {item.position}</span></span><span className="shrink-0 text-sm font-medium text-purple-700 dark:text-cyan-300">Edit</span></button></li>)}</ul> : <p className="rounded-xl border border-dashed border-black/10 p-5 text-sm text-slate-500 dark:border-white/10">No projects have been added.</p>}
            </section>
            <section className={cardClassName} aria-labelledby="project-form-heading">
              <div className="mb-5 flex items-center justify-between gap-3"><h2 id="project-form-heading" className="text-lg font-semibold">{project.id ? "Edit project" : "Add project"}</h2><div className="flex gap-2">{project.id && <button type="button" onClick={() => setDeleteTarget({ kind: "projects", id: project.id!, label: project.title })} disabled={saving || deleting} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-500/20 px-3 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 dark:text-red-300 dark:hover:bg-red-400/10"><Trash2 className="h-4 w-4" /><span className="sr-only sm:not-sr-only">Delete</span></button>}<button type="button" onClick={() => setProject(emptyProject(String(nextProjectPosition)))} className={secondaryButtonClassName}><Plus className="h-4 w-4" /> New</button></div></div>
              <div className="space-y-4">
                <label className="block"><span className="mb-2 block text-sm font-medium">Title</span><input value={project.title} onChange={(event) => setProject({ ...project, title: event.target.value })} className={inputClassName} /></label>
                <label className="block"><span className="mb-2 block text-sm font-medium">Description</span><textarea rows={3} value={project.description} onChange={(event) => setProject({ ...project, description: event.target.value })} className={`${inputClassName} resize-y`} /></label>
                <label className="block"><span className="mb-2 block text-sm font-medium">Instructions</span><textarea rows={5} value={project.instructions} onChange={(event) => setProject({ ...project, instructions: event.target.value })} className={`${inputClassName} resize-y`} /></label>
                <label className="block"><span className="mb-2 block text-sm font-medium">Position</span><input type="number" min={0} step={1} value={project.position} onChange={(event) => setProject({ ...project, position: event.target.value })} className={inputClassName} /></label>
                <button type="button" onClick={handleProjectSave} disabled={saving || !project.title.trim() || !project.description.trim() || !project.instructions.trim() || parseWholeNumber(project.position) === null} className={primaryButtonClassName}><Save className="h-4 w-4" />{saving ? "Saving…" : project.id ? "Save project" : "Add project"}</button>
              </div>
            </section>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <section className={cardClassName} aria-labelledby="quiz-list-heading">
              <div className="mb-4 flex items-center justify-between gap-3"><h2 id="quiz-list-heading" className="text-lg font-semibold">Module quizzes</h2><span className="text-sm text-slate-500">{quizzes.length}</span></div>
              <button type="button" onClick={() => setQuiz(emptyQuiz(String(Math.max(0, ...quizzes.map((item) => item.position)) + 1)))} className={`${secondaryButtonClassName} mb-4 w-full`}><Plus className="h-4 w-4" /> Create a quiz</button>
              {quizzes.length ? <ul className="space-y-2">{quizzes.map((item) => <li key={item.id}><button type="button" onClick={() => selectQuiz(item)} className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border border-black/[0.06] px-4 py-3 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-white/[0.06] dark:hover:bg-white/[0.04]"><span className="min-w-0"><span className="block truncate text-sm font-semibold">{item.title}</span><span className="mt-1 block text-xs text-slate-500">Position {item.position} · {item.questions.length} questions{item.isExam ? " · Exam" : ""}</span></span><span className="shrink-0 text-sm font-medium text-purple-700 dark:text-cyan-300">Edit</span></button></li>)}</ul> : <p className="rounded-xl border border-dashed border-black/10 p-5 text-sm text-slate-500 dark:border-white/10">No quizzes have been added.</p>}
            </section>
            <section className={cardClassName} aria-labelledby="quiz-form-heading">
              <div className="mb-5 flex items-center justify-between gap-3"><h2 id="quiz-form-heading" className="text-lg font-semibold">{quiz.id ? "Edit quiz" : "Create quiz"}</h2>{quiz.id && <button type="button" onClick={() => setDeleteTarget({ kind: "quizzes", id: quiz.id!, label: quiz.title })} disabled={saving || deleting} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-500/20 px-3 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 dark:text-red-300 dark:hover:bg-red-400/10"><Trash2 className="h-4 w-4" /><span className="sr-only sm:not-sr-only">Delete</span></button>}</div>
              <div className="space-y-4">
                <label className="block"><span className="mb-2 block text-sm font-medium">Title</span><input value={quiz.title} onChange={(event) => setQuiz({ ...quiz, title: event.target.value })} className={inputClassName} /></label>
                <label className="block"><span className="mb-2 block text-sm font-medium">Description</span><textarea rows={3} value={quiz.description} onChange={(event) => setQuiz({ ...quiz, description: event.target.value })} className={`${inputClassName} resize-y`} /></label>
                <div className="grid gap-4 sm:grid-cols-3"><label className="block"><span className="mb-2 block text-sm font-medium">Position</span><input type="number" min={0} step={1} value={quiz.position} onChange={(event) => setQuiz({ ...quiz, position: event.target.value })} className={inputClassName} /></label><label className="block"><span className="mb-2 block text-sm font-medium">Passing score</span><input type="number" min={0} step={1} value={quiz.passingScore} onChange={(event) => setQuiz({ ...quiz, passingScore: event.target.value })} className={inputClassName} /></label><label className="block"><span className="mb-2 block text-sm font-medium">Duration (minutes)</span><input type="number" min={1} step={1} value={quiz.durationMinutes} onChange={(event) => setQuiz({ ...quiz, durationMinutes: event.target.value })} className={inputClassName} /></label></div>
                <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-black/[0.06] p-4 dark:border-white/[0.06]"><input type="checkbox" checked={quiz.isExam} onChange={(event) => setQuiz({ ...quiz, isExam: event.target.checked })} className="h-4 w-4 accent-purple-600" /><span className="text-sm font-medium">This quiz is an exam</span></label>
                <div className="space-y-4">
                  {quiz.questions.map((question, questionIndex) => <fieldset key={question.key} className="rounded-2xl border border-black/[0.06] p-4 dark:border-white/[0.06]"><div className="mb-3 flex items-center justify-between gap-3"><legend className="text-sm font-semibold">Question {questionIndex + 1}</legend>{quiz.questions.length > 1 && <button type="button" onClick={() => setQuiz((current) => ({ ...current, questions: current.questions.filter((item) => item.key !== question.key) }))} className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-400/10"><Trash2 className="h-4 w-4" /> Remove</button>}</div><input value={question.question} onChange={(event) => updateQuestion(question.key, { question: event.target.value })} aria-label={`Question ${questionIndex + 1}`} placeholder="Question text" className={inputClassName} /><p className="mb-2 mt-4 text-xs text-slate-500 dark:text-slate-400">Select the correct answer.</p><div className="space-y-2">{question.options.map((option, optionIndex) => <div key={option.id ?? optionIndex} className="flex min-h-11 items-center gap-3"><input type="radio" name={`correct-${question.key}`} checked={option.isCorrect} onChange={() => question.options.forEach((_, index) => updateOption(question.key, index, { isCorrect: index === optionIndex }))} aria-label={`Option ${optionIndex + 1} is correct`} className="h-4 w-4 shrink-0 accent-purple-600" /><input value={option.text} onChange={(event) => updateOption(question.key, optionIndex, { text: event.target.value })} aria-label={`Question ${questionIndex + 1} option ${optionIndex + 1}`} placeholder={`Option ${optionIndex + 1}`} className={inputClassName} /></div>)}</div></fieldset>)}
                </div>
                <button type="button" onClick={() => setQuiz((current) => ({ ...current, questions: [...current.questions, emptyQuestion()] }))} className={secondaryButtonClassName}><Plus className="h-4 w-4" /> Add question</button>
                {quiz.questions.some((question) => question.options.filter((option) => option.isCorrect).length !== 1) && <p className="text-sm text-amber-700 dark:text-amber-300">Choose one correct answer for each question.</p>}
                <button type="button" onClick={handleQuizSave} disabled={saving} className={primaryButtonClassName}><Save className="h-4 w-4" />{saving ? "Saving…" : quiz.id ? "Save quiz" : "Add quiz"}</button>
              </div>
            </section>
          </div>
        )}
      </div>
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !deleting) setDeleteTarget(null); }}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-content-title"
            aria-describedby="delete-content-description"
            onKeyDown={(event) => { if (event.key === "Escape" && !deleting) setDeleteTarget(null); }}
            className="w-full max-w-md rounded-2xl border border-black/[0.08] bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#171321]"
          >
            <h2 id="delete-content-title" className="text-lg font-semibold text-slate-950 dark:text-white">
              Delete {deleteTarget.kind.slice(0, -1)}?
            </h2>
            <p id="delete-content-description" className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Delete <span className="font-semibold">{deleteTarget.label}</span>? This cannot be undone.
              {deleteTarget.kind === "projects" && " Any learner submissions for this project will also be deleted."}
              {deleteTarget.kind === "quizzes" && " Learner attempts for this quiz will also be deleted."}
            </p>
            <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button type="button" autoFocus onClick={() => setDeleteTarget(null)} disabled={deleting} className={secondaryButtonClassName}>
                Cancel
              </button>
              <button type="button" onClick={() => void handleDelete()} disabled={deleting} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
                <Trash2 className="h-4 w-4" /> {deleting ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
