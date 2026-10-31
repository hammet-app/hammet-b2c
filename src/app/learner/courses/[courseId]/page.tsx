"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  AlertCircle,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  Clock,
  ExternalLink,
  Layers,
  Lock,
  Play,
  PlayCircle,
  Search,
  X,
  FileText,
  Video,
  Globe,
  FolderKanban,
  ArrowUpRight,
  Terminal,
  Upload,
  Loader2,
  Send,
} from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { learnerApi } from "@/lib/api/learner";
import { cartApi } from "@/lib/api/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { ModuleQuiz } from "./module-quiz";
import type {
  PublishedCourse,
  PublishedModule,
  CourseModuleResource,
  CourseModuleProject,
  ProjectSubmission,
} from "@/lib/api/types/learner";

type CourseDetailsPageProps = {
  params: Promise<{ courseId: string }>;
};

function getResourceIcon(type: string) {
  const normalized = (type || "").toLowerCase();
  if (normalized.includes("video")) return Video;
  if (normalized.includes("doc")) return FileText;
  if (normalized.includes("article")) return BookOpen;
  if (normalized.includes("link")) return Globe;
  return ExternalLink;
}

function getResourceTypeBadgeClass(type: string) {
  const normalized = (type || "").toLowerCase();
  if (normalized.includes("video"))
    return "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 border-sky-200 dark:border-sky-500/30";
  if (normalized.includes("doc"))
    return "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border-purple-200 dark:border-purple-500/30";
  if (normalized.includes("article"))
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30";
  return "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30";
}

export default function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { courseId } = use(params);
  const router = useRouter();
  const { accessToken, refreshToken } = useAuth();

  const [course, setCourse] = useState<PublishedCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moduleSearchQuery, setModuleSearchQuery] = useState("");
  const [activeModule, setActiveModule] = useState<PublishedModule | null>(
    null,
  );
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [modulePrimaryProject, setModulePrimaryProject] =
    useState<CourseModuleProject | null>(null);
  const [projectLinks, setProjectLinks] = useState<Record<string, string>>({});
  const [submittingProjectId, setSubmittingProjectId] = useState<string | null>(
    null,
  );
  const [projectSubmissions, setProjectSubmissions] = useState<
    Record<string, ProjectSubmission>
  >({});
  const [projectErrors, setProjectErrors] = useState<
    Record<string, string | null>
  >({});

  useEffect(() => {
    let cancelled = false;
    setModulePrimaryProject(null);

    if (!activeModule || !accessToken) return;

    if (!activeModule.projects || activeModule.projects.length === 0) {
      learnerApi
        .getModuleProject(activeModule.id, accessToken, refreshToken)
        .then((project) => {
          if (!cancelled && project) {
            setModulePrimaryProject(project);
          }
        })
        .catch(() => {
          // Module may not have a project attached
        });
    }

    return () => {
      cancelled = true;
    };
  }, [activeModule, accessToken, refreshToken]);

  async function handleProjectSubmit(projectId: string) {
    const link = (projectLinks[projectId] ?? "").trim();
    if (!link || !accessToken) return;

    try {
      setSubmittingProjectId(projectId);
      setProjectErrors((prev) => ({ ...prev, [projectId]: null }));

      const submission = await learnerApi.submitProject(
        projectId,
        link,
        accessToken,
        refreshToken,
      );

      setProjectSubmissions((prev) => ({
        ...prev,
        [projectId]: submission,
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setProjectErrors((prev) => ({
        ...prev,
        [projectId]: msg || "Failed to submit project. Please try again.",
      }));
    } finally {
      setSubmittingProjectId(null);
    }
  }

  const displayProjects = useMemo(() => {
    if (!activeModule) return [];
    const existing = activeModule.projects ?? [];
    if (existing.length > 0) return existing;
    if (modulePrimaryProject) return [modulePrimaryProject];
    return [];
  }, [activeModule, modulePrimaryProject]);


  useEffect(() => {
    if (!courseId || !accessToken) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchCourse() {
      if (!accessToken) return;
      try {
        setLoading(true);
        setError(null);

        const result = await learnerApi.getCourse(
          courseId,
          accessToken,
          refreshToken,
        );

        if (!cancelled) {
          setCourse(result);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load course details. Please try again.");
          setCourse(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchCourse();

    return () => {
      cancelled = true;
    };
  }, [courseId, accessToken, refreshToken]);

  const modules = course?.modules ?? [];
  const completedCount = useMemo(
    () => modules.filter((module) => module.hasFinished).length,
    [modules],
  );

  const filteredModules = useMemo(() => {
    const query = moduleSearchQuery.trim().toLowerCase();
    if (!query) return modules;

    return modules.filter(
      (module) =>
        module.title.toLowerCase().includes(query) ||
        module.description.toLowerCase().includes(query) ||
        module.slug.toLowerCase().includes(query),
    );
  }, [modules, moduleSearchQuery]);

  const isEnrolled = Boolean(course?.isEnrolled);
  const isEntitled = Boolean(course?.isEntitled);
  const canAccessCourse = isEnrolled || isEntitled;

  function handleOpenModule(module: PublishedModule) {
    if (!canAccessCourse || (!module.isEnrolled && !module.isEntitled)) {
      setShowLockedModal(true);
      return;
    }

    setActiveModule(module);
  }

  async function handleStartCourse() {
    if (!canAccessCourse) {
      setShowLockedModal(true);
      return;
    }
    if (!accessToken) return;

    await learnerApi.enrollCourse(courseId, accessToken, refreshToken)

    const nextModule = modules.find(
      (module) =>
        !module.hasFinished && (module.isEnrolled || module.isEntitled),
    );

    const firstAccessibleModule =
      nextModule ??
      modules.find((module) => module.isEnrolled || module.isEntitled);

    if (firstAccessibleModule) {
      setActiveModule(firstAccessibleModule);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F3FF] px-4 pb-28 pt-6 font-poppins transition-colors duration-300 dark:bg-[#0D0A17] sm:px-7 sm:pt-10 lg:px-10 lg:pb-16">
        <div className="mx-auto max-w-[1080px] animate-pulse space-y-6">
          <div className="h-8 w-40 rounded-lg bg-white/70 dark:bg-white/[0.05]" />
          <div className="h-48 rounded-3xl bg-white/70 dark:bg-white/[0.05]" />
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 rounded-2xl bg-white/70 dark:bg-white/[0.05]"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-[#F5F3FF] px-4 py-8 font-poppins dark:bg-[#0D0A17] sm:px-7 lg:px-10">
        <div className="mx-auto max-w-[1080px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Curriculum
          </button>

          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-500/20 dark:bg-red-500/[0.05]">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
            <div>
              <h2 className="font-bold text-red-900 dark:text-red-200">
                Unable to load course
              </h2>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {error ?? "Course details were not found."}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F3FF] px-4 pb-28 pt-6 font-poppins transition-colors duration-300 dark:bg-[#0D0A17] sm:px-7 sm:pt-10 lg:px-10 lg:pb-16">
      <div className="mx-auto max-w-[1080px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Curriculum</span>
        </button>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <section className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-8 rounded-3xl border border-black/[0.06] bg-white p-7 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02] sm:p-9"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  Course
                </span>

                {isEnrolled ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Enrolled
                  </span>
                ) : isEntitled ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Access granted
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                    <Lock className="h-3.5 w-3.5" />
                    Enrollment required
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
                {course.title}
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                {course.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-100 pt-5 text-xs font-medium text-slate-500 dark:border-white/5 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                  <span>
                    {modules.length}{" "}
                    {modules.length === 1 ? "Module" : "Modules"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                  <span>
                    {completedCount} of {modules.length} completed
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                  <span>
                    {course.hasFinished
                      ? "Course completed"
                      : "Course in progress"}
                  </span>
                </div>
              </div>
            </motion.div>

            <section className="space-y-4">
              <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Course Curriculum &amp; Modules
                </h2>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {completedCount} of {modules.length} Completed
                </span>
              </div>

              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="search"
                  placeholder="Search module titles or descriptions..."
                  value={moduleSearchQuery}
                  onChange={(event) => setModuleSearchQuery(event.target.value)}
                  className="w-full rounded-2xl border border-black/[0.08] bg-white py-2.5 pl-10 pr-9 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-slate-500 sm:text-sm"
                />
                {moduleSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setModuleSearchQuery("")}
                    aria-label="Clear module search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {filteredModules.length === 0 ? (
                <div className="rounded-2xl border border-black/[0.06] bg-white p-8 text-center dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <Search className="mx-auto mb-3 h-7 w-7 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No modules matched &ldquo;{moduleSearchQuery}&rdquo;
                  </p>
                  <button
                    type="button"
                    onClick={() => setModuleSearchQuery("")}
                    className="mt-2 text-xs font-bold text-purple-600 hover:underline dark:text-purple-400"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                filteredModules.map((module, index) => {
                  const isCompleted = module.hasFinished;
                  const moduleHasAccess =
                    module.isEnrolled || module.isEntitled;
                  const moduleCanOpen = canAccessCourse && moduleHasAccess;
                  const resources = module.resources ?? [];
                  const projects = module.projects ?? [];

                  return (
                    <motion.article
                      key={module.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 sm:p-6",
                        moduleCanOpen
                          ? "border-black/[0.06] bg-white hover:border-purple-300 hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-purple-500/40"
                          : "border-black/[0.05] bg-slate-50/60 dark:border-white/[0.04] dark:bg-white/[0.01]",
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          type="button"
                          onClick={() => handleOpenModule(module)}
                          aria-label={`${moduleCanOpen ? "Open" : "Unlock"} ${module.title}`}
                          className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold shadow-sm transition",
                            isCompleted
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                              : moduleCanOpen
                                ? "bg-purple-100 text-purple-700 group-hover:scale-105 dark:bg-purple-500/20 dark:text-purple-300"
                                : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                          )}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5" />
                          ) : moduleCanOpen ? (
                            <PlayCircle className="h-5 w-5" />
                          ) : (
                            <Lock className="h-5 w-5" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                                Module {module.position}
                              </span>
                              {isCompleted && (
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                  Completed
                                </span>
                              )}
                              {!moduleHasAccess && (
                                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                                  Locked
                                </span>
                              )}
                              {resources.length > 0 && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                                  <FileText className="h-3 w-3" />
                                  <span>
                                    {resources.length}{" "}
                                    {resources.length === 1
                                      ? "Resource"
                                      : "Resources"}
                                  </span>
                                </span>
                              )}
                              {projects.length > 0 && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                                  <FolderKanban className="h-3 w-3" />
                                  <span>
                                    {projects.length}{" "}
                                    {projects.length === 1
                                      ? "Project"
                                      : "Projects"}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenModule(module)}
                            className="text-left text-base font-bold text-slate-900 transition-colors hover:text-purple-600 dark:text-white dark:hover:text-cyan-400"
                          >
                            {module.title}
                          </button>

                          <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
                            {module.description}
                          </p>

                          {/* Quick clickable resource links on card if available */}
                          {resources.length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              {resources.map((res) => {
                                const ResIcon = getResourceIcon(
                                  res.resourceType,
                                );
                                return (
                                  <a
                                    key={res.id}
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`Open ${res.title} (${res.resourceType})`}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-slate-50/70 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xs transition hover:border-purple-300 hover:bg-white hover:text-purple-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:text-cyan-300"
                                  >
                                    <ResIcon className="h-3 w-3 text-purple-600 dark:text-cyan-400" />
                                    <span className="truncate max-w-[150px] sm:max-w-[200px]">
                                      {res.title}
                                    </span>
                                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                                  </a>
                                );
                              })}
                            </div>
                          )}

                          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.05]">
                            <button
                              type="button"
                              onClick={() => handleOpenModule(module)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 transition hover:bg-purple-100 dark:bg-purple-500/10 dark:text-purple-300"
                            >
                              {moduleCanOpen ? (
                                <PlayCircle className="h-3.5 w-3.5" />
                              ) : (
                                <Lock className="h-3.5 w-3.5" />
                              )}
                              <span>
                                {moduleCanOpen
                                  ? "Open Module"
                                  : "Unlock Module"}
                              </span>
                            </button>

                            {module.masterclass &&
                              /^https?:\/\//i.test(module.masterclass) && (
                                <a
                                  href={module.masterclass}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3 py-1.5 text-xs font-bold text-purple-700 transition hover:bg-purple-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-cyan-300 dark:hover:bg-white/[0.06]"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  Masterclass
                                </a>
                              )}

                            {projects.length > 0 && (
                              <Link
                                href="/learner/projects"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200/80 bg-indigo-50/50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100/70 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300"
                              >
                                <FolderKanban className="h-3.5 w-3.5" />
                                <span>
                                  {projects.length}{" "}
                                  {projects.length === 1
                                    ? "Project"
                                    : "Projects"}
                                </span>
                                <ArrowUpRight className="h-3 w-3 opacity-70" />
                              </Link>
                            )}
                            {moduleCanOpen && (
                              <button
                                type="button"
                                onClick={() => handleOpenModule(module)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200/80 bg-purple-50/50 px-3 py-1.5 text-xs font-bold text-purple-700 transition hover:bg-purple-100/70 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-cyan-300"
                              >
                                <HelpCircle className="h-3.5 w-3.5" />
                                <span>Quiz</span>
                              </button>
                            )}

                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenModule(module)}
                          aria-label={`View ${module.title}`}
                          className="hidden self-center text-slate-300 transition hover:text-purple-600 dark:text-slate-600 dark:hover:text-cyan-400 sm:flex"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.article>
                  );
                })
              )}
            </section>
          </section>

          <aside>
            <div className="sticky top-24 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
              <div className="mb-6">
                {canAccessCourse ? (
                  <>
                    <div className="mb-1 flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>
                        {isEnrolled
                          ? "Enrolled in Course"
                          : "Course Access Granted"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Your course access is active. Start or resume an available
                      module.
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                      Course Access
                    </span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {course.price === 0
                          ? "Free"
                          : `₦${course.price.toLocaleString()}`}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Get access to the modules included in this course.
                    </p>
                  </>
                )}
              </div>

              <Button
                onClick={handleStartCourse}
                size="lg"
                className="w-full rounded-xl bg-purple-600 font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
              >
                <Play className="mr-2 h-4 w-4" />
                <span>
                  {canAccessCourse ? "Start / Resume Course" : "Unlock Course"}
                </span>
              </Button>

              <div className="mt-6 space-y-2.5 border-t border-slate-100 pt-5 text-xs text-slate-600 dark:border-white/5 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{modules.length} course modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{completedCount} modules completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>
                    {course.hasFinished
                      ? "Course completed"
                      : "Progress saved by the backend"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {showLockedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.button
              type="button"
              aria-label="Close enrollment prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLockedModal(false)}
              className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-black/[0.08] bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-[#151026]"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-sm dark:bg-amber-500/10 dark:text-amber-400">
                <Lock className="h-7 w-7" />
              </div>
              <h2 className="text-center text-xl font-bold text-slate-900 dark:text-white">
                Course Access Required
              </h2>
              <p className="mt-2 text-center text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
                You don&apos;t currently have access to this course or module.
                Enroll in the course to unlock its available content.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button
                  disabled={isAddingToCart}
                  onClick={async () => {
                    if (!accessToken || !course) return;
                    setIsAddingToCart(true);
                    const result = await cartApi.addItem(
                      {
                        type: "course",
                        productId: course.id,
                        title: course.title,
                        price: course.price,
                      },
                      accessToken,
                    );
                    setIsAddingToCart(false);
                    if (!result.success) {
                      setError(result.error ?? "Unable to add this course to your cart.");
                      return;
                    }
                    setShowLockedModal(false);
                    router.push("/learner/checkout");
                  }}
                  className="w-full rounded-xl bg-purple-600 py-3 font-bold text-white shadow-md shadow-purple-600/25 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                >
                  {isAddingToCart ? "Adding to cart…" : "Continue to Checkout"}
                  {course.price > 0
                    ? ` • ₦${course.price.toLocaleString()}`
                    : ""}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowLockedModal(false)}
                  className="w-full rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.button
              type="button"
              aria-label="Close module details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModule(null)}
              className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-md"
            />
            <motion.section
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative flex h-[min(92vh,780px)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-black/[0.08] bg-white shadow-2xl dark:border-white/10 dark:bg-[#120E1F]"
            >
              <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4 dark:border-white/10">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-purple-100 px-2 py-0.5 font-mono text-xs font-bold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                      MODULE {activeModule.position}
                    </span>
                    {(activeModule.resources?.length ?? 0) > 0 && (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                        {activeModule.resources.length} Resources
                      </span>
                    )}
                    {(activeModule.projects?.length ?? 0) > 0 && (
                      <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                        {activeModule.projects.length} Projects
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 truncate text-lg font-bold text-slate-900 dark:text-white">
                    {activeModule.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModule(null)}
                  aria-label="Close module"
                  className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {activeModule.hasFinished ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-purple-500 dark:text-cyan-400" />
                    )}
                    <span>
                      {activeModule.hasFinished
                        ? "Module completed"
                        : "Module overview"}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {activeModule.description}
                  </p>
                </div>

                {activeModule.masterclass && (
                  <div className="rounded-2xl border border-purple-200/70 bg-purple-50 p-4 dark:border-purple-500/20 dark:bg-purple-950/20">
                    <h3 className="font-bold text-purple-900 dark:text-purple-200 text-sm">
                      Masterclass Video
                    </h3>
                    {/^https?:\/\//i.test(activeModule.masterclass) ? (
                      <a
                        href={activeModule.masterclass}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 underline hover:text-purple-900 dark:text-cyan-300 dark:hover:text-white"
                      >
                        Open masterclass video <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <p className="mt-2 break-words text-sm text-purple-950 dark:text-purple-300">
                        {activeModule.masterclass}
                      </p>
                    )}
                  </div>
                )}

                {/* ── MODULE RESOURCES: Display Title as Clickable Link with URL Destination ── */}
                {activeModule.resources && activeModule.resources.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                        <FileText className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                        <span>Curated Module Resources</span>
                      </h3>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                        {activeModule.resources.length} Links
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {activeModule.resources
                        .slice()
                        .sort((a, b) => a.position - b.position)
                        .map((resource) => {
                          const ResIcon = getResourceIcon(
                            resource.resourceType,
                          );
                          return (
                            <div
                              key={resource.id}
                              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-slate-50/70 p-4 transition-all hover:border-purple-300 hover:bg-white hover:shadow-xs dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-cyan-500/30 dark:hover:bg-white/[0.04]"
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 shadow-2xs dark:bg-cyan-500/15 dark:text-cyan-300">
                                  <ResIcon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  {/* Title as a clickable link using url as destination */}
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 transition hover:text-purple-600 dark:text-white dark:hover:text-cyan-300 group-hover:underline"
                                  >
                                    <span className="break-words">
                                      {resource.title}
                                    </span>
                                    <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70 group-hover:opacity-100" />
                                  </a>
                                  <div className="mt-1 flex flex-wrap items-center gap-2">
                                    <span
                                      className={cn(
                                        "rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                        getResourceTypeBadgeClass(
                                          resource.resourceType,
                                        ),
                                      )}
                                    >
                                      {resource.resourceType || "resource"}
                                    </span>
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="truncate font-mono text-[11px] text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                                    >
                                      {resource.url}
                                    </a>
                                  </div>
                                </div>
                              </div>

                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 transition"
                              >
                                <span>Open</span>
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* ── MODULE PROJECTS: Hands-on Capstone Projects & Instructions ── */}
                {displayProjects.length > 0 && (
                  <div className="space-y-3 border-t border-slate-100 pt-5 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                        <FolderKanban className="h-4 w-4 text-purple-600 dark:text-cyan-400" />
                        <span>Attached Capstone Projects</span>
                      </h3>
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                        {displayProjects.length}{" "}
                        {displayProjects.length === 1 ? "Project" : "Projects"}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {displayProjects
                        .slice()
                        .sort((a, b) => a.position - b.position)
                        .map((project) => (
                          <div
                            key={project.id}
                            className="rounded-2xl border border-black/[0.06] bg-slate-50/70 p-5 dark:border-white/[0.06] dark:bg-white/[0.02]"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div>
                                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                                  Project {project.position}
                                </span>
                                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                                  {project.title}
                                </h4>
                                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                  {project.description}
                                </p>
                              </div>
                              <Link
                                href="/learner/projects"
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3.5 py-2 text-xs font-bold text-purple-700 shadow-xs hover:bg-purple-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-cyan-300 dark:hover:bg-white/[0.08] transition"
                              >
                                <span>Open Project Lab</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>

                            {project.instructions && (
                              <div className="mt-4 rounded-xl border border-slate-200/70 bg-white p-3.5 dark:border-white/[0.06] dark:bg-[#0B0815]">
                                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                  <Terminal className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
                                  <span>Instructions &amp; Requirements</span>
                                </div>
                                <p className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                                  {project.instructions}
                                </p>
                              </div>
                            )}

                            {/* ── PROJECT SUBMISSION: Link Input & Submission Feedback ── */}
                            <div className="mt-4 rounded-xl border border-purple-200/60 bg-white p-4 dark:border-white/10 dark:bg-black/20">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <Upload className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
                                  <span>Submit Project Link</span>
                                </span>
                                {projectSubmissions[project.id] && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>
                                      Submitted (
                                      {projectSubmissions[project.id].status})
                                    </span>
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
                                Provide a URL to your GitHub repository, live demo, or external documentation for review.
                              </p>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                  type="url"
                                  placeholder="https://github.com/username/project"
                                  value={projectLinks[project.id] ?? ""}
                                  onChange={(e) =>
                                    setProjectLinks((prev) => ({
                                      ...prev,
                                      [project.id]: e.target.value,
                                    }))
                                  }
                                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  disabled={
                                    !projectLinks[project.id]?.trim() ||
                                    submittingProjectId === project.id
                                  }
                                  onClick={() => handleProjectSubmit(project.id)}
                                  className="rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 shrink-0"
                                >
                                  {submittingProjectId === project.id ? (
                                    <>
                                      <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                      Submitting...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-3.5 w-3.5 mr-1" />
                                      {projectSubmissions[project.id]
                                        ? "Update Link"
                                        : "Submit Link"}
                                    </>
                                  )}
                                </Button>
                              </div>
                              {projectErrors[project.id] && (
                                <p className="mt-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                  <AlertCircle className="h-3.5 w-3.5" />
                                  <span>{projectErrors[project.id]}</span>
                                </p>
                              )}
                              {projectSubmissions[project.id]?.content && (
                                <p className="mt-2 text-[10px] text-slate-400 truncate">
                                  Last submitted: {projectSubmissions[project.id].content}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* ── MODULE QUIZ: Assessment Questions & Options (GET /api/v1/learner/modules/{module_id}/quiz) ── */}
                <div className="border-t border-slate-100 pt-5 dark:border-white/10">
                  <ModuleQuiz
                    moduleId={activeModule.id}
                    moduleTitle={activeModule.title}
                    token={accessToken}
                    onRefresh={refreshToken}
                  />
                </div>
              </div>

              <footer className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-white/10 dark:bg-white/[0.02]">
                <Button
                  variant="outline"
                  onClick={() => setActiveModule(null)}
                  className="rounded-xl"
                >
                  Close Module
                </Button>
                <Button
                  onClick={() => {
                    const currentIndex = modules.findIndex(
                      (module) => module.id === activeModule.id,
                    );
                    const nextModule = modules
                      .slice(currentIndex + 1)
                      .find((module) => module.isEnrolled || module.isEntitled);

                    setActiveModule(nextModule ?? null);
                  }}
                  className="rounded-xl bg-purple-600 font-bold text-white hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                >
                  Next Available Module{" "}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </footer>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
