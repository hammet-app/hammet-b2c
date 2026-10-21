"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  AlertCircle,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Search,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import {
  AISchoolEntitlement,
  CourseEntitlement,
} from "@/lib/api/types/learner";
import { learnerApi } from "@/lib/api/learner";

// Set this to the learner-entitlements endpoint when the backend route is ready.
const ENTITLEMENTS_ROUTE = "";

export default function MyLearningPage() {
  const { accessToken, refreshToken } = useAuth();
  const [schools, setSchools] = useState<AISchoolEntitlement[]>([]);
  const [courses, setCourses] = useState<CourseEntitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadEntitlements() {
      if (!accessToken) {
        setSchools([]);
        setCourses([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await learnerApi.getEntitlements(
          accessToken,
          refreshToken,
        );

        setSchools(
          (response.schools ?? []).filter(
            (school: AISchoolEntitlement) => school.isEntitled,
          ),
        );
        setCourses(
          (response.courses ?? []).filter(
            (course: CourseEntitlement) => course.isEntitled,
          ),
        );
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load learner entitlements:", err);
        setSchools([]);
        setCourses([]);
        setError(
          "Unable to load your learning entitlements. Please try again.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadEntitlements();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const visibleCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return courses;
    return courses.filter((course) =>
      [course.title, course.description, course.slug].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [courses, searchQuery]);

  const coursesBySchool = useMemo(() => {
    const grouped = new Map<string, CourseEntitlement[]>();
    for (const course of visibleCourses) {
      const group = grouped.get(course.aiSchoolId) ?? [];
      group.push(course);
      grouped.set(course.aiSchoolId, group);
    }
    return grouped;
  }, [visibleCourses]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8F7FF] px-5 pb-28 pt-8 transition-colors duration-500 dark:bg-[#0B0813] sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 lg:pt-10">
      {/* Keep the original animated gradient-mesh styling. */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-tr from-purple-500/15 via-indigo-500/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-cyan-400/15 via-purple-600/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-[550px] w-[550px] rounded-full bg-gradient-to-t from-violet-600/10 via-pink-500/5 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-[1280px]">
        <motion.header
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-10 mt-20 rounded-3xl border border-black/[0.05] bg-white/70 p-7 shadow-sm backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.02] sm:mt-24 sm:p-9"
        >
          <div className="pointer-events-none absolute right-8 top-0 z-20 flex -translate-y-[calc(100%-1px)] select-none flex-row items-end gap-3.5 sm:right-16">
            <div className="mb-4 rounded-2xl border border-purple-200/90 bg-white/95 px-4 py-2 text-xs font-bold text-slate-800 shadow-[0_6px_24px_rgba(0,0,0,0.1)] backdrop-blur dark:border-white/10 dark:bg-slate-900/95 dark:text-cyan-300 sm:text-sm">
              Ready to learn AI! 💡
            </div>
            <img
              src="/peeking-human.png"
              alt="Peeking learner illustration"
              className="h-24 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)] sm:h-28"
            />
          </div>

          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-purple-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
              <Brain className="h-3.5 w-3.5" />
              AI Learner Portal
            </div>
            <h1 className="text-3xl font-extrabold tracking-[-0.035em] text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
              My learning
            </h1>
            <p className="mt-2.5 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
              Access your AI schools and courses in one place.
            </p>
          </div>
        </motion.header>

        <section className="mb-10">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                My AI Schools
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Schools you are entitled to access.
              </p>
            </div>
            {!loading && !error && (
              <span className="w-fit rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700 dark:bg-cyan-500/15 dark:text-cyan-300">
                {schools.length} {schools.length === 1 ? "school" : "schools"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-44 animate-pulse rounded-2xl border border-black/[0.06] bg-white/80 dark:border-white/[0.06] dark:bg-white/[0.02]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Entitlements unavailable</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          ) : schools.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-8 text-center dark:border-white/10 dark:bg-white/[0.02]">
              <BookOpen className="mx-auto mb-3 h-8 w-8 text-slate-400" />
              <p className="font-semibold text-slate-900 dark:text-white">
                No entitled AI schools yet
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Schools you have access to will appear here when access is
                granted.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {schools.map((school, index) => (
                <motion.article
                  key={school.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.25) }}
                  className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-white/[0.06] dark:bg-[#151221]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                    <Brain className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {school.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">
                    {school.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {school.isEnrolled && (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <CheckCircle2 className="mr-1 inline h-3 w-3" />
                        Enrolled
                      </span>
                    )}
                    {school.hasFinished && (
                      <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                        Completed
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/learner/ai-schools/${school.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-cyan-400"
                  >
                    Open school <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-4 border-b border-black/[0.06] pb-4 dark:border-white/[0.06] sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                My AI Courses
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Courses included in your entitlements.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!loading && !error && (
                <span className="whitespace-nowrap text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {visibleCourses.length}{" "}
                  {visibleCourses.length === 1 ? "course" : "courses"}
                </span>
              )}
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search your AI courses..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-full border border-black/[0.08] bg-white py-2 pl-9 pr-4 text-xs text-slate-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-2xl border border-black/[0.06] bg-white/80 dark:border-white/[0.06] dark:bg-white/[0.02]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-black/[0.06] bg-white/70 p-6 text-sm text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-400">
              Courses will be shown here once your entitlements can be loaded.
            </div>
          ) : visibleCourses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-white/10">
              <GraduationCap className="mx-auto mb-3 h-8 w-8 text-slate-400" />
              <p className="font-semibold text-slate-900 dark:text-white">
                {searchQuery
                  ? "No matching courses"
                  : "No entitled courses yet"}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {searchQuery
                  ? "Try another search term."
                  : "Courses you have access to will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Array.from(coursesBySchool.entries()).map(
                ([schoolId, groupedCourses]) => {
                  const school = schools.find((item) => item.id === schoolId);
                  const schoolCourses = [...groupedCourses].sort(
                    (a, b) => a.position - b.position,
                  );

                  return (
                    <div key={schoolId}>
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {school?.name ?? "AI School"}
                        </h3>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {schoolCourses.map((course) => (
                          <motion.article
                            key={course.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-white/[0.06] dark:bg-[#151221]"
                          >
                            <div className="mb-3 flex items-start justify-between gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                                <GraduationCap className="h-5 w-5" />
                              </div>
                              {course.hasFinished ? (
                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                  Completed
                                </span>
                              ) : course.isEnrolled ? (
                                <span className="rounded-full bg-purple-100 px-2.5 py-1 text-[11px] font-semibold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                                  Enrolled
                                </span>
                              ) : null}
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white">
                              {course.title}
                            </h4>
                            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                              {course.description}
                            </p>
                            <Link
                              href={`/learner/courses/${course.slug}`}
                              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-cyan-400"
                            >
                              View course <ChevronRight className="h-4 w-4" />
                            </Link>
                          </motion.article>
                        ))}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
