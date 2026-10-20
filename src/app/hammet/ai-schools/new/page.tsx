"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  GraduationCap,
  Plus,
} from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/lib/auth/auth-context";
import { CreateAiSchoolRequest } from "@/lib/api/types";
import { createAiSchool } from "@/lib/api/hammet";
import { ApiError } from "@/lib/api/api-client";
import { is_enabled } from "@/lib/features/flags";
import { trackGloriaEvent } from "@/lib/analytics";
import { Alert } from "@/components/ui";

const inputClassName =
  "w-full rounded-xl border border-black/[0.08] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10";

export default function CreateAiSchoolPage() {
  const { user, accessToken, refreshToken } = useAuth();

  const access = user?.access ?? [];
  const adminScope = user?.scope ?? "";

  const isHammetAdmin = user?.role === "hammet_admin";
  const isPlatformAdmin = adminScope == "platform";
  const isB2CCoursesAdmin =
    adminScope == "b2c" && access.includes("courses");

  const canCreate = isHammetAdmin && (isPlatformAdmin || isB2CCoursesAdmin);

  const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    is_enabled("gloria_school_creation").then((value) => setFeatureEnabled(Boolean(value)));
  }, []);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [published, setPublished] = useState(false);

  const [createdSchoolId, setCreatedSchoolId] = useState("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState("");

  const parsedPrice = Number(price);
  const isPriceValid =
    price.trim() !== "" && Number.isInteger(parsedPrice) && parsedPrice >= 0;
  const isFormValid =
    name.trim() !== "" && description.trim() !== "" && isPriceValid;

  function resetForm() {
    setIsSuccessful(false);
    setCreatedSchoolId("");
    setName("");
    setDescription("");
    setPrice("");
    setPublished(false);
  }

  async function handleCreateAiSchool() {
    if (!user || !accessToken || !isFormValid) return;
    setIsCreating(true);
    setError("");
    try {
      const body = {
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        published,
      } satisfies CreateAiSchoolRequest;

      const school = await createAiSchool(body, accessToken, refreshToken);
      trackGloriaEvent("gloria_school_created", {
        schoolId: school.id,
        price: school.price,
      });

      setCreatedSchoolId(school.id);
      setIsSuccessful(true);
    } catch (err) {
      trackGloriaEvent("gloria_school_create_failed", {
        error: err instanceof Error ? err.message : "Unknown error",
      });
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsCreating(false);
    }
  }

  if (!canCreate) {
    return (
      <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
        <div className="mx-auto max-w-[900px]">
          <div className="rounded-[28px] border border-black/[0.06] bg-white p-8 dark:border-white/[0.06] dark:bg-white/[0.03]">
            <h1 className="text-2xl font-semibold tracking-[-0.04em]">
              Create AI school
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              You do not have access to create AI schools.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (featureEnabled === false) {
    return (
      <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
        <div className="mx-auto max-w-[900px]">
          <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-8 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
            <h1 className="text-2xl font-semibold">School creation is disabled</h1>
            <p className="mt-2 text-sm leading-6">
              Turn on the gloria_school_creation flag in Growthbook to roll out school creation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccessful) {
    return (
      <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
        <div className="mx-auto flex min-h-[70vh] max-w-[720px] items-center justify-center">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full rounded-[28px] border border-black/[0.06] bg-white p-8 text-center shadow-[0_24px_80px_rgba(76,29,149,0.08)] dark:border-white/[0.06] dark:bg-white/[0.03] sm:p-12"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
              <Check className="h-8 w-8" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-300">
              School created
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
              Gloria school ready
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {name}
              </span>{" "}
              is ready for courses. Keep its ID available while you create the first course.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={`/hammet/courses/new?schoolId=${encodeURIComponent(createdSchoolId)}`}
                className="rounded-xl bg-[#24134F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#321b68] dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300"
              >
                Create a course
              </Link>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-black/[0.08] px-5 py-3 text-sm font-semibold transition hover:bg-slate-50 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
              >
                Create another
              </button>
            </div>
          </motion.section>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1050px]">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <Link
            href="/hammet"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-purple-700 dark:text-slate-400 dark:hover:text-cyan-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">
            AI Schools
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
            Create AI school
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Create the Gloria school record. Its courses can be added immediately.
          </p>
        </motion.section>

        <div className="mx-auto max-w-[760px]">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="rounded-[28px] border border-black/[0.06] bg-white p-7 dark:border-white/[0.06] dark:bg-white/[0.03] sm:p-8"
          >
            <div className="mb-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                <GraduationCap className="h-5 w-5" />
              </div>

              <h2 className="text-xl font-semibold tracking-[-0.03em]">
                School details
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Learners will see these details when browsing AI schools.
              </p>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Name</span>

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="AI for Product Managers"
                  className={inputClassName}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Description
                </span>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What learners will get from this school."
                  rows={5}
                  className={`${inputClassName} resize-y`}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Price</span>

                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="0"
                  className={inputClassName}
                />

                {price.trim() !== "" && !isPriceValid && (
                  <span className="mt-2 block text-xs text-red-600 dark:text-red-400">
                    Price must be a whole number of 0 or more.
                  </span>
                )}
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/[0.08] bg-slate-50 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.04]">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(event) => setPublished(event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-purple-600"
                />

                <span>
                  <span className="block text-sm font-medium">Publish school</span>
                  <span className="block text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Leave unchecked to save as a draft. Learners can&apos;t see unpublished schools.
                  </span>
                </span>
              </label>
            </div>

            <button
              type="button"
              onClick={handleCreateAiSchool}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#24134F] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(76,29,149,0.16)] transition hover:bg-[#321b68] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300"
              disabled={isCreating || !isFormValid}
            >
              <Plus className="h-4 w-4" />
              {isCreating ? "Creating..." : "Create school"}
            </button>
            {error && (
              <Alert title="Error creating AI school" variant="error">
                {error}
              </Alert>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
