"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, GraduationCap, Plus } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/lib/auth/auth-context";
import { getHammetAiSchoolsPage } from "@/lib/api/hammet";
import type { AiSchool, Pagination } from "@/lib/api/types";
import { Alert } from "@/components/ui";
import { SessionExpiredNotice } from "@/components/layout/hammet/admin-form";

export default function AiSchoolsPage() {
  const { accessToken, refreshToken, isLoading: authLoading } = useAuth();

  const [schools, setSchools] = useState<AiSchool[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    const token = accessToken;
    let active = true;
    async function loadSchools() {
      setIsLoading(true);
      setError("");
      try {
        const response = await getHammetAiSchoolsPage(
          token,
          refreshToken ?? (async () => null),
          page,
          pageSize,
        );
        if (active) {
          setSchools(response.aiSchools);
          setPagination(response.pagination);
        }
      } catch (err) {
        if (active) {
          setSchools([]);
          setPagination(null);
          setError(err instanceof Error ? err.message : "Unable to load schools.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadSchools();
    return () => {
      active = false;
    };
  }, [accessToken, page, pageSize, refreshToken]);

  const totalPages = pagination?.totalPages ?? 0;
  const firstItem = pagination && pagination.total > 0 ? (page - 1) * pageSize + 1 : 0;
  const lastItem = pagination ? Math.min(page * pageSize, pagination.total) : 0;

  if (!authLoading && !accessToken) {
    return <SessionExpiredNotice />;
  }

  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1050px]">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">
              AI Schools
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
              All AI schools
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Open a school to see its courses, or create a new one.
            </p>
          </div>

          <Link
            href="/hammet/ai-schools/new"
            className="flex items-center gap-2 rounded-xl bg-[#24134F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#321b68] dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300"
          >
            <Plus className="h-4 w-4" />
            Create school
          </Link>
        </motion.section>

        {error && (
          <Alert title="Error loading AI schools" variant="error">
            {error}
          </Alert>
        )}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[170px] animate-pulse rounded-2xl bg-purple-50 dark:bg-[#21183A]"
              />
            ))}
          </div>
        ) : schools.length === 0 && !error ? (
          <div className="rounded-[28px] border border-black/[0.06] bg-white p-10 text-center dark:border-white/[0.06] dark:bg-white/[0.03]">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No AI schools yet. Create the first one to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {schools.map((school) => (
              <motion.article
                key={school.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col rounded-2xl border border-black/[0.06] bg-white p-6 dark:border-white/[0.06] dark:bg-white/[0.03]"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                    <GraduationCap className="h-5 w-5" />
                  </div>

                  {school.published !== undefined && (
                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        school.published
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
                      ].join(" ")}
                    >
                      {school.published ? "Published" : "Draft"}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-semibold tracking-[-0.03em]">{school.name}</h2>

                <p className="mt-1 line-clamp-3 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {school.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {school.price === 0 ? "Free" : school.price.toLocaleString()}
                  </span>

                  <div className="flex gap-3 text-sm font-semibold">
                    <Link
                      href={`/hammet/courses?schoolId=${encodeURIComponent(school.id)}`}
                      className="text-purple-700 hover:underline dark:text-cyan-400"
                    >
                      View courses
                    </Link>
                    <Link
                      href={`/hammet/courses/new?schoolId=${encodeURIComponent(school.id)}`}
                      className="text-slate-500 hover:underline dark:text-slate-400"
                    >
                      Add course
                    </Link>
                    <Link
                      href={`/hammet/ai-schools/${encodeURIComponent(school.id)}/edit`}
                      className="text-slate-500 hover:underline dark:text-slate-400"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {!isLoading && pagination && pagination.total > 0 && (
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/[0.06] bg-white px-4 py-3 dark:border-white/[0.06] dark:bg-white/[0.03]">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {firstItem}–{lastItem} of {pagination.total.toLocaleString()} schools
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                Per page
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
                  className="min-h-10 rounded-lg border border-black/10 bg-white px-2 text-sm dark:border-white/10 dark:bg-[#21183A]"
                  aria-label="Schools per page"
                >
                  {[25, 50, 100].map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </label>

              <span className="text-sm text-slate-500 dark:text-slate-400">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1 || isLoading}
                className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-black/10 px-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page >= totalPages || isLoading}
                className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-black/10 px-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10"
                aria-label="Next page"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
