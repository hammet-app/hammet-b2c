"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Check, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/lib/auth/auth-context";
import { createAiCourse } from "@/lib/api/hammet";
import { ApiError } from "@/lib/api/api-client";
import type { AiSchool } from "@/lib/api/types";
import { is_enabled } from "@/lib/features/flags";
import { trackGloriaEvent } from "@/lib/analytics";
import { Alert } from "@/components/ui";

const inputClassName =
  "w-full rounded-xl border border-black/[0.08] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10";

export default function CreateAiCoursePage() {
  const searchParams = useSearchParams();
  const { user, accessToken, refreshToken } = useAuth();
  const requestedSchoolId = searchParams.get("schoolId") ?? "";

  const [schools, setSchools] = useState<AiSchool[]>([]);
  const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    is_enabled("gloria_course_creation").then((value) => setFeatureEnabled(Boolean(value)));
  }, []);

  const [selectedSchoolId, setSelectedSchoolId] = useState(requestedSchoolId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState("");
  const [price, setPrice] = useState("");
  const [published, setPublished] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(Boolean(accessToken));
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    const token = accessToken;
    let active = true;
    async function loadSchools() {
      try {
        const { getHammetAiSchools } = await import("@/lib/api/hammet");
        const schoolsResponse = await getHammetAiSchools(token, refreshToken ?? (async () => null));
        if (!active) return;
        setSchools(schoolsResponse);
        if (!requestedSchoolId && schoolsResponse[0]) {
          setSelectedSchoolId(schoolsResponse[0].id);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load schools.");
        }
      } finally {
        if (active) setLoadingSchools(false);
      }
    }

    void loadSchools();
    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, requestedSchoolId]);

  const parsedPosition = Number(position);
  const parsedPrice = Number(price);
  const isPositionValid = position.trim() !== "" && Number.isInteger(parsedPosition) && parsedPosition >= 0;
  const isPriceValid = price.trim() !== "" && Number.isInteger(parsedPrice) && parsedPrice >= 0;
  const isFormValid =
    selectedSchoolId !== "" &&
    title.trim() !== "" &&
    description.trim() !== "" &&
    isPositionValid &&
    isPriceValid;

  async function handleCreateCourse() {
    if (!user || !accessToken || !isFormValid) return;
    setIsCreating(true);
    setError("");

    try {
      const course = await createAiCourse(
        {
          title: title.trim(),
          description: description.trim(),
          position: parsedPosition,
          aiSchoolId: selectedSchoolId,
          price: parsedPrice,
          published,
        },
        accessToken,
        refreshToken
      );

      trackGloriaEvent("gloria_course_created", {
        courseId: course.id,
        schoolId: course.aiSchoolId,
        published,
      });
      setIsSuccessful(true);
    } catch (err) {
      trackGloriaEvent("gloria_course_create_failed", {
        schoolId: selectedSchoolId,
        error: err instanceof Error ? err.message : "Unknown error",
      });
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }

  if (featureEnabled === false) {
    return (
      <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
        <div className="mx-auto max-w-[900px] rounded-[28px] border border-amber-200 bg-amber-50 p-8 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
          <h1 className="text-2xl font-semibold">Course creation is disabled</h1>
          <p className="mt-2 text-sm leading-6">Turn on the gloria_course_creation flag in Growthbook to roll out course creation.</p>
        </div>
      </div>
    );
  }

  if (isSuccessful) {
    return (
      <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex min-h-[70vh] max-w-[720px] items-center justify-center rounded-[28px] border border-black/[0.06] bg-white p-8 text-center shadow-[0_24px_80px_rgba(76,29,149,0.08)] dark:border-white/[0.06] dark:bg-white/[0.03] sm:p-12"
        >
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
              <Check className="h-8 w-8" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-300">Course created</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Gloria course ready</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              {title} has been created with slug {courseSlug(title)}.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/hammet" className="rounded-xl bg-[#24134F] px-5 py-3 text-sm font-semibold text-white dark:bg-cyan-400 dark:text-[#24134F]">Back to dashboard</Link>
              <button type="button" onClick={() => { setIsSuccessful(false); setTitle(""); setDescription(""); setPosition(""); setPrice(""); }} className="rounded-xl border border-black/[0.08] px-5 py-3 text-sm font-semibold dark:border-white/[0.08]">Create another</button>
            </div>
          </div>
        </motion.section>
      </div>
    );
  }

  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1050px]">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/hammet" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-700 dark:text-slate-400 dark:hover:text-cyan-400">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
          <p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">AI Schools</p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Create AI course</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">Add a course to an existing Gloria school.</p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-[28px] border border-black/[0.06] bg-white p-7 dark:border-white/[0.06] dark:bg-white/[0.03] sm:p-8">
          <div className="mb-7 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300"><BookOpen className="h-5 w-5" /></div>
            <div><h2 className="text-xl font-semibold tracking-[-0.03em]">Course details</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">The course is created exactly as supplied by Gloria.</p></div>
          </div>

          <div className="space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-medium">School</span>
              <select value={selectedSchoolId} onChange={(event) => setSelectedSchoolId(event.target.value)} className={inputClassName} disabled={loadingSchools}>
                <option value="">Select a school</option>
                {schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
              </select>
              {loadingSchools && <span className="mt-2 block text-xs text-slate-400">Loading schools...</span>}
              {!loadingSchools && schools.length === 0 && <span className="mt-2 block text-xs text-red-600 dark:text-red-400">Create a Gloria school before creating a course.</span>}
            </label>

            <label className="block"><span className="mb-2 block text-sm font-medium">Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Introduction to AI Product Design" className={inputClassName} /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium">Description</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What learners will study in this course." rows={5} className={`${inputClassName} resize-y`} /></label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block"><span className="mb-2 block text-sm font-medium">Position</span><input type="number" min={0} step={1} value={position} onChange={(event) => setPosition(event.target.value)} placeholder="1" className={inputClassName} />{position.trim() !== "" && !isPositionValid && <span className="mt-2 block text-xs text-red-600 dark:text-red-400">Position must be a whole number of 0 or more.</span>}</label>
              <label className="block"><span className="mb-2 block text-sm font-medium">Price</span><input type="number" min={0} step={1} value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0" className={inputClassName} />{price.trim() !== "" && !isPriceValid && <span className="mt-2 block text-xs text-red-600 dark:text-red-400">Price must be a whole number of 0 or more.</span>}</label>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/[0.06] p-4 dark:border-white/[0.06]">
              <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} className="h-4 w-4 accent-purple-600" />
              <span><span className="block text-sm font-medium">Publish immediately</span><span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Published courses are visible to learners.</span></span>
            </label>
          </div>

          <button type="button" onClick={handleCreateCourse} disabled={isCreating || loadingSchools || !isFormValid} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#24134F] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(76,29,149,0.16)] transition hover:bg-[#321b68] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300">
            <Plus className="h-4 w-4" />{isCreating ? "Creating..." : "Create course"}
          </button>
          {error && <div className="mt-4"><Alert title="Error creating AI course" variant="error">{error}</Alert></div>}
        </motion.section>
      </div>
    </div>
  );
}

function courseSlug(title: string) {
  return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "course";
}
