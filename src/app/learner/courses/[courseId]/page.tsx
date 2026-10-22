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
  ChevronRight,
  Clock,
  ExternalLink,
  Layers,
  Lock,
  Play,
  PlayCircle,
  Search,
  X,
} from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { learnerApi } from "@/lib/api/learner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import type { PublishedCourse, PublishedModule } from "@/lib/api/types/learner";

type CourseDetailsPageProps = {
  params: Promise<{ courseId: string }>;
};

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

  function handleStartCourse() {
    if (!canAccessCourse) {
      setShowLockedModal(true);
      return;
    }

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
                  onClick={() => {
                    setShowLockedModal(false);
                    router.push("/learner/checkout");
                  }}
                  className="w-full rounded-xl bg-purple-600 py-3 font-bold text-white shadow-md shadow-purple-600/25 hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                >
                  Continue to Checkout
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
              className="relative flex h-[min(90vh,680px)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-black/[0.08] bg-white shadow-2xl dark:border-white/10 dark:bg-[#120E1F]"
            >
              <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4 dark:border-white/10">
                <div className="min-w-0">
                  <span className="rounded-md bg-purple-100 px-2 py-0.5 font-mono text-xs font-bold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                    MODULE {activeModule.position}
                  </span>
                  <h2 className="mt-2 truncate font-bold text-slate-900 dark:text-white">
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

              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {activeModule.hasFinished ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <BookOpen className="h-5 w-5 text-purple-500 dark:text-cyan-400" />
                  )}
                  {activeModule.hasFinished
                    ? "Module completed"
                    : "Module overview"}
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {activeModule.description}
                </p>

                {activeModule.masterclass && (
                  <div className="mt-6 rounded-2xl border border-purple-200/70 bg-purple-50 p-4 dark:border-purple-500/20 dark:bg-purple-950/20">
                    <h3 className="font-bold text-purple-900 dark:text-purple-200">
                      Masterclass
                    </h3>
                    {/^https?:\/\//i.test(activeModule.masterclass) ? (
                      <a
                        href={activeModule.masterclass}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 underline dark:text-cyan-300"
                      >
                        Open masterclass <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <p className="mt-2 break-words text-sm text-purple-950 dark:text-purple-300">
                        {activeModule.masterclass}
                      </p>
                    )}
                  </div>
                )}
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
