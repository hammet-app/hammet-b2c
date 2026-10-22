"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Check, GraduationCap, Save } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/lib/auth/auth-context";
import { UpdateAiSchoolRequest } from "@/lib/api/types";
import { getHammetAiSchoolCourses, updateAiSchool } from "@/lib/api/hammet";
import { ApiError } from "@/lib/api/api-client";
import { is_enabled } from "@/lib/features/flags";
import { Alert } from "@/components/ui";

const inputClassName =
  "w-full rounded-xl border border-black/[0.08] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10";

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[900px]">
        <div className="rounded-[28px] border border-black/[0.06] bg-white p-8 dark:border-white/[0.06] dark:bg-white/[0.03]">
          <h1 className="text-2xl font-semibold tracking-[-0.04em]">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{children}</p>
        </div>
      </div>
    </div>
  );
}

export default function EditAiSchoolPage() {
  const { schoolId } = useParams<{ schoolId: string }>();
  const { user, accessToken, refreshToken } = useAuth();

  const access = user?.access ?? [];
  const adminScope = user?.scope ?? "";

  const isHammetAdmin = user?.role === "hammet_admin";
  const isPlatformAdmin = adminScope == "platform";
  const isB2CCoursesAdmin =
    adminScope == "b2c" && access.includes("courses");

  const canEdit = isHammetAdmin && (isPlatformAdmin || isB2CCoursesAdmin);

  const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    is_enabled("gloria_school_creation").then((value) => setFeatureEnabled(Boolean(value)));
  }, []);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [published, setPublished] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken || !canEdit) return;

    const token = accessToken;
    let active = true;
    async function loadSchool() {
      try {
        // The admin courses route also returns the school itself, drafts included.
        const { aiSchool: school } = await getHammetAiSchoolCourses(
          schoolId,
          token,
          refreshToken ?? (async () => null)
        );
        if (!active) return;
        setName(school.name);
        setDescription(school.description);
        setPrice(String(school.price));
        setPublished(Boolean(school.published));
      } catch (err) {
        if (!active) return;
        if (err instanceof ApiError && err.notFound) {
          setNotFound(true);
          return;
        }
        setError(err instanceof Error ? err.message : "Unable to load school.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadSchool();
    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, schoolId, canEdit]);

  const parsedPrice = Number(price);
  const isPriceValid =
    price.trim() !== "" && Number.isInteger(parsedPrice) && parsedPrice >= 0;
  const isFormValid =
    name.trim() !== "" && description.trim() !== "" && isPriceValid;

  async function handleSave() {
    if (!user || !accessToken || !isFormValid) return;
    setIsSaving(true);
    setIsSaved(false);
    setError("");
    try {
      const body = {
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        published,
      } satisfies UpdateAiSchoolRequest;

      await updateAiSchool(schoolId, body, accessToken, refreshToken);
      setIsSaved(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (!canEdit) {
    return <Notice title="Edit AI school">You do not have access to edit AI schools.</Notice>;
  }

  if (featureEnabled === false) {
    return (
      <Notice title="School editing is disabled">
        Turn on the gloria_school_creation flag in Growthbook to roll out school editing.
      </Notice>
    );
  }

  if (notFound) {
    return <Notice title="School not found">This AI school doesn&apos;t exist or was removed.</Notice>;
  }

  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1050px]">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <Link
            href="/hammet/ai-schools"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-purple-700 dark:text-slate-400 dark:hover:text-cyan-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to AI schools
          </Link>

          <p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">
            AI Schools
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
            Edit AI school
          </h1>
        </motion.section>

        <div className="mx-auto max-w-[760px]">
          {isLoading ? (
            <div className="h-[460px] animate-pulse rounded-[28px] bg-purple-50 dark:bg-[#21183A]" />
          ) : (
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
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={inputClassName}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Description</span>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
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
                      Learners can&apos;t see unpublished schools.
                    </span>
                  </span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#24134F] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(76,29,149,0.16)] transition hover:bg-[#321b68] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300"
                disabled={isSaving || !isFormValid}
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save changes"}
              </button>

              {isSaved && (
                <p className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
                  <Check className="h-4 w-4" />
                  Changes saved
                </p>
              )}

              {error && (
                <Alert title="Error saving AI school" variant="error">
                  {error}
                </Alert>
              )}
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}
