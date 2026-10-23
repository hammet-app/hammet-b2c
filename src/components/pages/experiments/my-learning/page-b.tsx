"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Search,
  Sparkles,
  Award,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import {
  AISchoolEntitlement,
  CourseEntitlement,
} from "@/lib/api/types/learner";
import { learnerApi } from "@/lib/api/learner";
import {
  HugeAcademicWatermark,
  HugeCourseAcademicWatermark,
} from "@/components/ui/educational-illustrations";
import {
  SchoolVibrantIcon,
  GlowingMagicSparkle,
} from "@/components/ui/vibrant-ai-icons";

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
            (school: AISchoolEntitlement) =>
              school.isEntitled || school.isEnrolled,
          ),
        );
        setCourses(
          (response.courses ?? []).filter(
            (course: CourseEntitlement) =>
              course.isEntitled || course.isEnrolled,
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
  }, [accessToken, refreshToken]);

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
    <main className="relative min-h-screen overflow-x-hidden bg-[#F8F7FF] px-5 pb-28 pt-8 transition-colors duration-500 dark:bg-[#0B0813] sm:px-7 sm:pt-10 lg:px-10 lg:pb-16 lg:pt-10 font-poppins">
      {/* High-performance static gradient mesh depth */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[640px] w-[640px] rounded-full bg-gradient-to-tr from-purple-500/12 via-indigo-500/08 to-transparent blur-3xl transform-gpu" />
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[560px] w-[560px] rounded-full bg-gradient-to-bl from-cyan-400/12 via-purple-600/08 to-transparent blur-3xl transform-gpu" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-[580px] w-[580px] rounded-full bg-gradient-to-t from-violet-600/08 via-pink-500/05 to-transparent blur-3xl transform-gpu" />

      <div className="relative mx-auto max-w-[1280px]">
        {/* ── 1. ELEVATED "MY LEARNING" HERO BANNER ────────────────────── */}
        {/* Note: NO overflow-hidden on outer container so peeking-human is NEVER clipped! */}
        <header className="group relative mb-12 mt-20 sm:mt-24 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-white via-purple-50/40 to-indigo-50/50 p-7 sm:p-10 lg:p-12 shadow-[0_12px_40px_rgba(139,92,246,0.10)] dark:border-white/[0.08] dark:bg-gradient-to-br dark:from-[#130E24] dark:via-[#17112C] dark:to-[#0D091A] dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
          {/* Peeking Human atop the banner - completely restored and visible above the roof */}
          <div className="pointer-events-none absolute right-6 sm:right-16 top-0 z-30 flex -translate-y-[calc(100%-1px)] select-none flex-row items-end gap-3.5">
            <div className="mb-4 rounded-2xl border border-purple-200/90 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-[0_8px_24px_rgba(0,0,0,0.10)] dark:border-white/10 dark:bg-slate-900 dark:text-cyan-300 sm:text-sm">
              Ready to learn AI! 💡
            </div>
            <img
              src="/peeking-human.png"
              alt="Peeking learner illustration"
              className="h-24 w-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)] sm:h-28"
            />
          </div>

          {/* Dedicated inner clipping container for background effects ONLY */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            {/* Subtle Ambient Radial Glowing Lights */}
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15" />
            <div className="absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-cyan-400/08 blur-3xl dark:bg-cyan-500/10" />

            {/* Tech Academic Coordinate Dot Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#8B5CF6_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-[0.05] dark:opacity-[0.08]" />
          </div>

          {/* Banner Inner Content */}
          <div className="relative z-10 max-w-3xl">
            <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-purple-700 shadow-sm dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-300">
              <GlowingMagicSparkle size="xs" />
              <span>AI Learner Portal</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-[-0.035em] text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
              My learning
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Access your AI schools and courses in one place. Advance your skills, earn verifiable certificates, and master production-grade artificial intelligence.
            </p>

            {/* Educational Metrics & Reassurance Pills */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-purple-800 shadow-xs dark:border-white/10 dark:bg-white/5 dark:text-purple-300">
                <GraduationCap className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
                <span>Accredited AI Curriculums</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-indigo-800 shadow-xs dark:border-white/10 dark:bg-white/5 dark:text-indigo-300">
                <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Self-Paced Mastery</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-xs dark:border-white/10 dark:bg-white/5 dark:text-emerald-300">
                <Award className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Credentials</span>
              </span>
            </div>
          </div>
        </header>

        {/* ── 2. "MY AI SCHOOLS" SECTION & CARDS ("THE TABS") ─────────── */}
        <section className="mb-14">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-cyan-500/15 dark:text-cyan-300">
                  <Brain className="h-4 w-4" />
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  My AI Schools
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Schools you are entitled to access. Complete tracks for
                career-defining AI capability.
              </p>
            </div>
            {!loading && !error && (
              <span className="w-fit rounded-full bg-purple-100/80 border border-purple-200 px-3.5 py-1 text-xs font-bold text-purple-700 dark:border-cyan-500/20 dark:bg-cyan-500/15 dark:text-cyan-300">
                {schools.length}{" "}
                {schools.length === 1 ? "School Enrolled" : "Schools Enrolled"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-52 animate-pulse rounded-3xl border border-purple-500/10 bg-white/80 dark:border-white/[0.06] dark:bg-white/[0.02]"
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
            <div className="relative overflow-hidden rounded-3xl border border-dashed border-purple-300/80 bg-gradient-to-br from-white/70 to-purple-50/40 p-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
              <div className="pointer-events-none absolute right-4 top-4 h-32 w-32 opacity-[0.06] text-purple-600 dark:text-cyan-400">
                <HugeAcademicWatermark className="h-full w-full" />
              </div>
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-purple-500 dark:text-cyan-400" />
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                No entitled AI schools yet
              </p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Schools you have access to will appear here once registered or
                unlocked through checkout.
              </p>
              <Link
                href="/learner/ai-schools"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
              >
                <span>Browse AI Schools</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {schools.map((school) => (
                <article
                  key={school.id}
                  className="group relative overflow-hidden rounded-3xl border border-purple-500/15 bg-white p-6 sm:p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-purple-500/35 dark:border-white/[0.08] dark:bg-[#151221] dark:hover:border-cyan-500/30 flex flex-col justify-between"
                >
                  {/* Dedicated background container */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                    {/* Subtle dot matrix */}
                    <div className="absolute inset-0 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.035] dark:opacity-[0.06]" />

                    {/* HUGE Educational Academic Watermark positioned at TOP-RIGHT, safely AWAY from bottom-right "Open school" */}
                    <div className="absolute -right-2 top-2 h-36 w-36 pointer-events-none select-none text-purple-600/[0.07] dark:text-cyan-400/[0.08] transition-transform duration-500 group-hover:scale-105">
                      <HugeAcademicWatermark className="h-full w-full" />
                    </div>
                  </div>

                  {/* Card Main Foreground Content */}
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/15 to-indigo-500/10 text-purple-600 border border-purple-500/20 shadow-xs dark:from-cyan-500/15 dark:to-purple-500/10 dark:text-cyan-300 dark:border-cyan-400/20">
                        <SchoolVibrantIcon
                          schoolId={school.id}
                          schoolName={school.name}
                          size="md"
                        />
                      </div>
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/40">
                        School Track
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors dark:text-white dark:group-hover:text-cyan-300 line-clamp-1">
                      {school.name}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {school.description}
                    </p>
                  </div>

                  {/* Card Bottom Row: Badges & Action Link - Clean, no purple background clutter behind "Open school" */}
                  <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {school.isEnrolled && (
                        <span className="inline-flex items-center rounded-full bg-emerald-100/90 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Enrolled
                        </span>
                      )}
                      {school.hasFinished && (
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                          Completed
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/learner/ai-schools/${school.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors py-1 px-2 rounded-lg hover:bg-purple-50 dark:hover:bg-cyan-500/10"
                    >
                      <span>Open school</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ── 3. "MY AI COURSES" SECTION & CARDS ──────────────────────── */}
        <section>
          <div className="mb-6 flex flex-col gap-4 border-b border-black/[0.06] pb-4 dark:border-white/[0.06] sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-purple-500/15 dark:text-purple-300">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  My AI Courses
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Courses included in your entitlements. Self-paced, interactive
                AI labs.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!loading && !error && (
                <span className="whitespace-nowrap text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {visibleCourses.length}{" "}
                  {visibleCourses.length === 1 ? "Course" : "Courses"}
                </span>
              )}
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search your AI courses..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-full border border-purple-500/20 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse rounded-3xl border border-purple-500/10 bg-white/80 dark:border-white/[0.06] dark:bg-white/[0.02]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-purple-500/15 bg-white/70 p-6 text-sm text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-400">
              Courses will be shown here once your entitlements can be loaded.
            </div>
          ) : visibleCourses.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl border border-dashed border-purple-300/80 bg-gradient-to-br from-white/70 to-purple-50/30 p-10 text-center dark:border-white/10">
              <div className="pointer-events-none absolute right-4 top-4 h-32 w-32 opacity-[0.06] text-purple-600 dark:text-cyan-400">
                <HugeCourseAcademicWatermark className="h-full w-full" />
              </div>
              <GraduationCap className="mx-auto mb-3 h-10 w-10 text-indigo-500 dark:text-cyan-400" />
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {searchQuery
                  ? "No matching courses found"
                  : "No entitled courses yet"}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {searchQuery
                  ? "Try searching for a different keyword or topic."
                  : "Courses you have access to will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {Array.from(coursesBySchool.entries()).map(
                ([schoolId, groupedCourses]) => {
                  const school = schools.find((item) => item.id === schoolId);
                  const schoolCourses = [...groupedCourses].sort(
                    (a, b) => a.position - b.position,
                  );

                  return (
                    <div key={schoolId}>
                      <div className="mb-4 flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-cyan-500/15 dark:text-cyan-400">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {school?.name ?? "AI School"}
                        </h3>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                          {schoolCourses.length}{" "}
                          {schoolCourses.length === 1 ? "module" : "modules"}
                        </span>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {schoolCourses.map((course) => (
                          <article
                            key={course.id}
                            className="group relative overflow-hidden rounded-3xl border border-purple-500/15 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-purple-500/35 dark:border-white/[0.08] dark:bg-[#151221] dark:hover:border-cyan-500/30 flex flex-col justify-between"
                          >
                            {/* Dedicated background container */}
                            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                              {/* Dot matrix pattern */}
                              <div className="absolute inset-0 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.035] dark:opacity-[0.06]" />

                              {/* HUGE Educational Course Watermark at top-right */}
                              <div className="absolute -right-2 top-2 h-32 w-32 pointer-events-none select-none text-purple-600/[0.06] dark:text-cyan-400/[0.07] transition-transform duration-500 group-hover:scale-105">
                                <HugeCourseAcademicWatermark className="h-full w-full" />
                              </div>
                            </div>

                            {/* Foreground Course Content */}
                            <div className="relative z-10">
                              <div className="mb-3.5 flex items-start justify-between gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/15 to-indigo-500/10 text-purple-600 border border-purple-500/20 shadow-xs dark:from-cyan-500/15 dark:to-purple-500/10 dark:text-cyan-300 dark:border-cyan-400/20">
                                  <GraduationCap className="h-5 w-5" />
                                </div>
                                {course.hasFinished ? (
                                  <span className="rounded-full bg-emerald-100/90 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                                    Completed
                                  </span>
                                ) : course.isEnrolled ? (
                                  <span className="rounded-full bg-purple-100/90 px-2.5 py-1 text-[11px] font-semibold text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                                    Enrolled
                                  </span>
                                ) : null}
                              </div>

                              <h4 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors dark:text-white dark:group-hover:text-cyan-300 line-clamp-1">
                                {course.title}
                              </h4>
                              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                {course.description}
                              </p>
                            </div>

                            {/* Bottom row: clean, no purple watermark obstruction */}
                            <div className="relative z-10 mt-5 pt-3.5 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                              <span className="text-xs text-slate-400 font-medium">
                                Self-paced course
                              </span>
                              <Link
                                href={`/learner/courses/${course.slug}`}
                                className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors py-1 px-2 rounded-lg hover:bg-purple-50 dark:hover:bg-cyan-500/10"
                              >
                                <span>View course</span>
                                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </Link>
                            </div>
                          </article>
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
