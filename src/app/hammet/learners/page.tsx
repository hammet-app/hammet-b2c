"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, GraduationCap, RefreshCw, Users } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { getHammetLearnerSummary } from "@/lib/api/hammet";
import type { HammetLearnerSummary } from "@/lib/api/types";
import { canViewLearnerSummary } from "@/lib/utils/roles";

export default function HammetLearnersPage() {
  const { user, accessToken, refreshToken, isLoading: authLoading } = useAuth();
  const canView = canViewLearnerSummary(user);
  const [summary, setSummary] = useState<HammetLearnerSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSummary = useCallback(async () => {
    if (!accessToken || !canView) return;
    setLoading(true);
    setError("");
    try {
      setSummary(await getHammetLearnerSummary(accessToken, refreshToken ?? (async () => null)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load the learner summary.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, canView, refreshToken]);

  useEffect(() => {
    if (authLoading) return;
    const timer = window.setTimeout(() => {
      if (canView && accessToken) void loadSummary();
      else setLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [authLoading, canView, accessToken, loadSummary]);

  if (!authLoading && !canView) {
    return (
      <main className="px-5 py-12 sm:px-7 lg:px-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-black/[0.06] bg-white p-7 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <h1 className="text-xl font-semibold text-slate-950 dark:text-white">Platform admin access required</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Learner summaries are only available to platform administrators.</p>
          <Link href="/hammet" className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:text-cyan-300">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const metrics = [
    { label: "Total learners", value: summary?.total ?? 0, description: "B2C learner accounts", icon: Users, color: "purple" },
    { label: "Active", value: summary?.active ?? 0, description: "Active accounts", icon: GraduationCap, color: "emerald" },
    { label: "Pending", value: summary?.pending ?? 0, description: "Pending accounts", icon: RefreshCw, color: "amber" },
  ] as const;

  return (
    <main className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1100px]">
        <Link href="/hammet" className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-slate-500 hover:text-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:text-slate-400 dark:hover:text-cyan-300">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">B2C overview</p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">Learners</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">A read-only summary of learner account totals and status.</p>
        </header>

        {error && (
          <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/[0.06] dark:text-rose-200">
            <span>{error}</span>
            <button type="button" onClick={() => void loadSummary()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-current/20 px-3 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
          </div>
        )}

        {loading ? (
          <div aria-label="Loading learner summary" aria-busy="true" className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((item) => <div key={item} className="h-40 animate-pulse rounded-2xl bg-purple-50 dark:bg-white/[0.04]" />)}
          </div>
        ) : error ? null : summary?.total === 0 ? (
          <section className="rounded-2xl border border-dashed border-purple-300/70 bg-white px-6 py-12 text-center dark:border-white/10 dark:bg-white/[0.03]">
            <Users className="mx-auto h-9 w-9 text-slate-400" />
            <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">No learners yet</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Learner account totals will appear here when accounts are created.</p>
          </section>
        ) : (
          <>
            <section aria-label="Learner account totals" className="grid gap-4 sm:grid-cols-3">
              {metrics.map(({ label, value, description, icon: Icon, color }) => (
                <article key={label} className="rounded-2xl border border-black/[0.06] bg-white p-6 dark:border-white/[0.08] dark:bg-white/[0.03]">
                  <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${color === "purple" ? "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300" : color === "emerald" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"}`}><Icon className="h-5 w-5" /></div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{value.toLocaleString()}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
                </article>
              ))}
            </section>

            <section className="mt-8 rounded-2xl border border-black/[0.06] bg-white p-6 dark:border-white/[0.08] dark:bg-white/[0.03]">
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Other account statuses</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                {(["suspended", "graduated", "inactive"] as const).map((status) => (
                  <div key={status} className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/[0.04]">
                    <dt className="text-sm capitalize text-slate-500 dark:text-slate-400">{status}</dt>
                    <dd className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{summary?.[status].toLocaleString() ?? 0}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
