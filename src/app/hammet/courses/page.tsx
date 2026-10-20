"use client";

import { Suspense, useEffect, useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/lib/auth/auth-context";
import { getHammetAiSchoolCourses, getHammetAiSchools } from "@/lib/api/hammet";
import type { AiSchool, AiSchoolCourse } from "@/lib/api/types";
import { Alert } from "@/components/ui";

const inputClassName =
  "w-full rounded-xl border border-black/[0.08] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10";

function AiCoursesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken, refreshToken } = useAuth();
  const requestedSchoolId = searchParams.get("schoolId") ?? "";

  const [schools, setSchools] = useState<AiSchool[]>([]);
  const [courses, setCourses] = useState<AiSchoolCourse[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState("");

  const selectedSchoolId = requestedSchoolId || schools[0]?.id || "";

  useEffect(() => {
    if (!accessToken) return;

    const token = accessToken;
    let active = true;
    async function loadSchools() {
      try {
        const response = await getHammetAiSchools(token, refreshToken ?? (async () => null));
        if (active) setSchools(response);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load schools.");
      } finally {
        if (active) setLoadingSchools(false);
      }
    }

    void loadSchools();
    return () => {
      active = false;
    };
  }, [accessToken, refreshToken]);

  useEffect(() => {
    if (!accessToken || !selectedSchoolId) return;

    const token = accessToken;
    let active = true;
    async function loadCourses() {
      setLoadingCourses(true);
      setError("");
      try {
        const response = await getHammetAiSchoolCourses(
          selectedSchoolId,
          token,
          refreshToken ?? (async () => null)
        );
        if (active) setCourses(response.courses);
      } catch (err) {
        if (active) {
          setCourses([]);
          setError(err instanceof Error ? err.message : "Unable to load courses.");
        }
      } finally {
        if (active) setLoadingCourses(false);
      }
    }

    void loadCourses();
    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, selectedSchoolId]);

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
              AI Courses
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
              Courses
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Pick a school to see its courses.
            </p>
          </div>

          <Link
            href={`/hammet/courses/new${selectedSchoolId ? `?schoolId=${encodeURIComponent(selectedSchoolId)}` : ""}`}
            className="flex items-center gap-2 rounded-xl bg-[#24134F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#321b68] dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300"
          >
            <Plus className="h-4 w-4" />
            Create course
          </Link>
        </motion.section>

        <label className="mb-6 block max-w-sm">
          <span className="mb-2 block text-sm font-medium">School</span>

          <select
            value={selectedSchoolId}
            onChange={(event) =>
              router.replace(`/hammet/courses?schoolId=${encodeURIComponent(event.target.value)}`)
            }
            disabled={loadingSchools || schools.length === 0}
            className={inputClassName}
          >
            {schools.length === 0 && (
              <option value="">{loadingSchools ? "Loading schools..." : "No schools yet"}</option>
            )}
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </label>

        {error && (
          <Alert title="Error loading courses" variant="error">
            {error}
          </Alert>
        )}

        {loadingCourses ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[150px] animate-pulse rounded-2xl bg-purple-50 dark:bg-[#21183A]"
              />
            ))}
          </div>
        ) : selectedSchoolId && courses.length === 0 && !error ? (
          <div className="rounded-[28px] border border-black/[0.06] bg-white p-10 text-center dark:border-white/[0.06] dark:bg-white/[0.03]">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This school has no courses yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.map((course) => (
              <motion.article
                key={course.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col rounded-2xl border border-black/[0.06] bg-white p-6 dark:border-white/[0.06] dark:bg-white/[0.03]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300">
                  <BookOpen className="h-5 w-5" />
                </div>

                <h2 className="text-lg font-semibold tracking-[-0.03em]">{course.title}</h2>

                <p className="mt-1 line-clamp-3 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {course.description}
                </p>

                <p className="mt-5 text-sm font-semibold">
                  {course.price === 0 ? "Free" : course.price.toLocaleString()}
                </p>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AiCoursesPage() {
  return (
    <Suspense fallback={null}>
      <AiCoursesContent />
    </Suspense>
  );
}
