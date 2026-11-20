"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, BookOpen, Building2, Plus, RefreshCw, Users } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { getHammetAiSchoolCourses, getHammetAiSchools, getHammetLearnerSummary } from "@/lib/api/hammet";
import type { AiSchool, AiSchoolCourse, HammetLearnerSummary } from "@/lib/api/types";
import { canManageAiCatalog, canViewLearnerSummary } from "@/lib/utils/roles";

type DashboardCourse = AiSchoolCourse & { schoolName: string };

export default function HammetDashboardPage() {
  const { user, accessToken, refreshToken, isLoading: authLoading } = useAuth();
  const canManageCatalog = canManageAiCatalog(user);
  const canViewLearners = canViewLearnerSummary(user);
  const [schools, setSchools] = useState<AiSchool[]>([]);
  const [courses, setCourses] = useState<DashboardCourse[]>([]);
  const [learnerSummary, setLearnerSummary] = useState<HammetLearnerSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError("");
    try {
      const onRefresh = refreshToken ?? (async () => null);
      const [schoolData, learnerData] = await Promise.all([
        canManageCatalog ? getHammetAiSchools(accessToken, onRefresh, 1, 100) : Promise.resolve([]),
        canViewLearners ? getHammetLearnerSummary(accessToken, onRefresh) : Promise.resolve(null),
      ]);
      const courseGroups = await Promise.all(
        schoolData.map(async (school) => {
          const result = await getHammetAiSchoolCourses(school.id, accessToken, onRefresh);
          return result.courses.map((course) => ({ ...course, schoolName: school.name }));
        }),
      );
      setSchools(schoolData);
      setCourses(courseGroups.flat());
      setLearnerSummary(learnerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard data.");
      setSchools([]);
      setCourses([]);
      setLearnerSummary(null);
    } finally {
      setLoading(false);
    }
  }, [accessToken, canManageCatalog, canViewLearners, refreshToken]);

  useEffect(() => {
    if (authLoading) return;
    const timer = window.setTimeout(() => {
      if (accessToken) void loadDashboard();
      else setLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [authLoading, accessToken, loadDashboard]);

  const stats = [
    ...(canManageCatalog ? [
      { label: "AI Schools", value: schools.length, description: "Learning environments", icon: Building2, className: "bg-[#EDE9FE] text-purple-700 dark:bg-[#21183A] dark:text-purple-300" },
      { label: "Courses", value: courses.length, description: "Across all schools", icon: BookOpen, className: "bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300" },
    ] : []),
    ...(canViewLearners ? [{ label: "Learners", value: learnerSummary?.total ?? 0, description: "Registered learners", icon: Users, className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" }] : []),
  ];

  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1280px]">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-8">
          <p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">B2C administration</p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">Dashboard</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">Manage Hammet&apos;s schools, courses, and learning experience.</p>
        </motion.section>

        {error && (
          <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/[0.06] dark:text-rose-200">
            <span>{error}</span>
            <button type="button" onClick={() => void loadDashboard()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-current/20 px-3 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"><RefreshCw className="h-4 w-4" /> Try again</button>
          </div>
        )}

        {stats.length > 0 && (
          <section aria-label="Dashboard totals" className="mb-10 grid gap-4 sm:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.article key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.04 }} className={`relative overflow-hidden rounded-2xl p-6 ${stat.className}`}>
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/30 blur-2xl dark:bg-white/[0.04]" />
                  <div className="relative">
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/75 dark:bg-white/[0.08]"><Icon className="h-5 w-5" /></div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-65">{stat.label}</p>
                    <div className="mt-1 flex items-end justify-between gap-4"><p className="text-3xl font-semibold tracking-[-0.04em]">{loading ? "—" : stat.value.toLocaleString()}</p><p className="pb-1 text-xs opacity-60">{stat.description}</p></div>
                  </div>
                </motion.article>
              );
            })}
          </section>
        )}

        {loading && !error ? (
          <div aria-label="Loading dashboard data" aria-busy="true" className="grid gap-5 lg:grid-cols-2"><div className="h-64 animate-pulse rounded-2xl bg-purple-50 dark:bg-white/[0.04]" /><div className="h-64 animate-pulse rounded-2xl bg-purple-50 dark:bg-white/[0.04]" /></div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
            {canManageCatalog && (
              <section aria-labelledby="dashboard-courses-heading">
                <div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Content</p><h2 id="dashboard-courses-heading" className="mt-1 text-xl font-semibold tracking-[-0.03em]">Courses</h2></div><Link href="/hammet/courses" className="inline-flex min-h-10 items-center gap-1 text-sm font-medium text-purple-700 hover:text-purple-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:text-cyan-400">View all <ArrowUpRight className="h-4 w-4" /></Link></div>
                <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white dark:border-white/[0.06] dark:bg-white/[0.03]">
                  {courses.length ? courses.slice(0, 4).map((course) => (
                    <Link key={course.id} href={`/hammet/courses/${encodeURIComponent(course.id)}/edit`} className="group flex min-h-[76px] items-center gap-4 border-b border-black/[0.05] px-5 py-4 transition-colors last:border-0 hover:bg-purple-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-500 dark:border-white/[0.05] dark:hover:bg-white/[0.04]">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300"><BookOpen className="h-5 w-5" /></div>
                      <div className="min-w-0 flex-1"><h3 className="truncate text-sm font-semibold">{course.title}</h3><p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{course.schoolName}</p></div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-purple-600 dark:text-slate-600 dark:group-hover:text-cyan-400" />
                    </Link>
                  )) : <div className="p-6 text-sm text-slate-500 dark:text-slate-400">No courses found. Create a course to get started.</div>}
                </div>
              </section>
            )}

            {canManageCatalog && (
              <section aria-labelledby="dashboard-schools-heading">
                <div className="mb-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Structure</p><h2 id="dashboard-schools-heading" className="mt-1 text-xl font-semibold tracking-[-0.03em]">AI Schools</h2></div>
                <div className="space-y-3">
                  {schools.length ? schools.slice(0, 3).map((school) => (
                    <Link key={school.id} href={`/hammet/ai-schools/${encodeURIComponent(school.id)}/edit`} className="group relative block min-h-40 overflow-hidden rounded-2xl bg-[#EDE9FE] p-6 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:bg-[#21183A]">
                      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-purple-400/20 blur-2xl transition-transform duration-300 group-hover:scale-110 dark:bg-purple-400/10" />
                      <div className="relative"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-purple-700 dark:bg-white/[0.08] dark:text-purple-300"><Building2 className="h-5 w-5" /></div><h3 className="text-base font-semibold tracking-[-0.025em]">{school.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{school.description}</p><div className="mt-4 flex items-center justify-between"><span className="text-xs font-medium text-slate-500 dark:text-slate-400">{courses.filter((course) => course.aiSchoolId === school.id).length} courses</span><ArrowUpRight className="h-4 w-4 text-purple-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-cyan-400" /></div></div>
                    </Link>
                  )) : <div className="rounded-2xl border border-dashed border-purple-300/70 p-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">No AI schools yet. Create the first one to get started.</div>}
                </div>
              </section>
            )}
          </div>
        )}

        {(canManageCatalog || canViewLearners) && (
          <section className="mt-10">
            <div className="mb-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Actions</p><h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Create</h2></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {canManageCatalog && <Link href="/hammet/ai-schools/new" className="group flex min-h-20 items-center gap-4 rounded-2xl border border-black/[0.06] bg-white p-5 transition-colors hover:border-purple-200 hover:bg-purple-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:border-purple-400/20 dark:hover:bg-white/[0.05]"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300"><Plus className="h-5 w-5" /></span><span className="flex-1"><span className="block text-sm font-semibold">Create AI School</span><span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">Add a new learning environment.</span></span><ArrowUpRight className="h-4 w-4 text-slate-400" /></Link>}
              {canManageCatalog && <Link href="/hammet/courses/new" className="group flex min-h-20 items-center gap-4 rounded-2xl border border-black/[0.06] bg-white p-5 transition-colors hover:border-cyan-200 hover:bg-cyan-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:border-cyan-400/20 dark:hover:bg-white/[0.05]"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300"><Plus className="h-5 w-5" /></span><span className="flex-1"><span className="block text-sm font-semibold">Create Course</span><span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">Add a course to an AI School.</span></span><ArrowUpRight className="h-4 w-4 text-slate-400" /></Link>}
              {canViewLearners && <Link href="/hammet/learners" className="group flex min-h-20 items-center gap-4 rounded-2xl border border-black/[0.06] bg-white p-5 transition-colors hover:border-emerald-200 hover:bg-emerald-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:border-emerald-400/20 dark:hover:bg-white/[0.05]"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"><Users className="h-5 w-5" /></span><span className="flex-1"><span className="block text-sm font-semibold">Learner summary</span><span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">View aggregate learner account totals.</span></span><ArrowUpRight className="h-4 w-4 text-slate-400" /></Link>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
