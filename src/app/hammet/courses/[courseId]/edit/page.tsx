"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Layers,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/lib/auth/auth-context";
import type {
  AiModule,
  CreateAiModuleRequest,
  UpdateAiCourseRequest,
} from "@/lib/api/types";
import {
  getHammetAiCourse,
  getHammetAiSchoolCourses,
  updateAiCourse,
} from "@/lib/api/hammet";
import { ApiError } from "@/lib/api/api-client";
import { is_enabled } from "@/lib/features/flags";
import { trackGloriaEvent } from "@/lib/analytics";
import { canManageAiCatalog } from "@/lib/utils/roles";
import { Alert } from "@/components/ui";
import {
  Notice,
  PublishSelect,
  SessionExpiredNotice,
  cardClassName,
  inputClassName,
  parseWholeNumber,
  primaryButtonClassName,
} from "@/components/hammet/admin-form";

type ModuleRow = {
  key: number;
  title: string;
  description: string;
  position: string;
  masterclass: string;
};

let nextRowKey = 0;
function emptyModuleRow(position = ""): ModuleRow {
  nextRowKey += 1;
  return {
    key: nextRowKey,
    title: "",
    description: "",
    position,
    masterclass: "",
  };
}

function isBlankRow(row: ModuleRow) {
  return (
    !row.title.trim() &&
    !row.description.trim() &&
    !row.position.trim() &&
    !row.masterclass.trim()
  );
}

function EditAiCourseContent() {
  const { courseId } = useParams<{ courseId: string }>();
  const searchParams = useSearchParams();
  const schoolId = searchParams.get("schoolId") ?? "";
  const { user, accessToken, refreshToken, isLoading: authLoading } = useAuth();
  const canEdit = canManageAiCatalog(user);

  const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    is_enabled("gloria_course_creation").then((value) =>
      setFeatureEnabled(Boolean(value)),
    );
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState("");
  const [price, setPrice] = useState("");
  const [published, setPublished] = useState<boolean | null>(null);
  const [moduleRows, setModuleRows] = useState<ModuleRow[]>([]);
  const [createdModules, setCreatedModules] = useState<AiModule[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken || !canEdit || !schoolId) return;

    const token = accessToken;
    let active = true;
    async function loadCourse() {
      try {
        // There is no single-course admin route, so find it in its school's course list.
        const course = await getHammetAiCourse(
          courseId,
          token,
          refreshToken ?? (async () => null),
        );
        if (!active) return;
        setTitle(course.title);
        setDescription(course.description);
        setPosition(String(course.position));
        setPrice(String(course.price));
        setCreatedModules(course.modules || []);
      } catch (err) {
        if (!active) return;
        if (err instanceof ApiError && err.notFound) {
          setNotFound(true);
          return;
        }
        setError(err instanceof Error ? err.message : "Unable to load course.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadCourse();
    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, schoolId, courseId, canEdit]);

  const parsedPosition = parseWholeNumber(position);
  const parsedPrice = parseWholeNumber(price);
  const filledRows = moduleRows.filter((row) => !isBlankRow(row));
  const areModulesValid = filledRows.every(
    (row) =>
      row.title.trim() &&
      row.description.trim() &&
      parseWholeNumber(row.position) !== null,
  );
  const isFormValid =
    title.trim() !== "" &&
    description.trim() !== "" &&
    parsedPosition !== null &&
    parsedPrice !== null &&
    areModulesValid;

  function updateRow(
    key: number,
    field: keyof Omit<ModuleRow, "key">,
    value: string,
  ) {
    setModuleRows((rows) =>
      rows.map((row) => (row.key === key ? { ...row, [field]: value } : row)),
    );
  }

  function addRow() {
    const used = [
      ...createdModules.map((item) => item.position),
      ...moduleRows.map((row) => Number(row.position) || 0),
    ];
    setModuleRows((rows) => [
      ...rows,
      emptyModuleRow(String(Math.max(0, ...used) + 1)),
    ]);
  }

  async function handleSave() {
    if (
      !user ||
      !accessToken ||
      !isFormValid ||
      parsedPosition === null ||
      parsedPrice === null
    )
      return;
    setIsSaving(true);
    setIsSaved(false);
    setError("");

    const modules: CreateAiModuleRequest[] = filledRows.map((row) => ({
      title: row.title.trim(),
      description: row.description.trim(),
      courseId,
      position: Number(row.position),
      masterclass: row.masterclass.trim() || undefined,
    }));

    try {
      const body = {
        title: title.trim(),
        description: description.trim(),
        position: parsedPosition,
        price: parsedPrice,
        published: published ?? undefined,
        modules: modules.length > 0 ? modules : undefined,
      } satisfies UpdateAiCourseRequest;

      const response = await updateAiCourse(
        courseId,
        body,
        accessToken,
        refreshToken,
      );
      if (response.modules.length > 0) {
        trackGloriaEvent("gloria_modules_created", {
          courseId,
          count: response.modules.length,
        });
      }
      setCreatedModules((current) => [...current, ...response.modules]);
      setModuleRows([]);
      setIsSaved(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!authLoading && !accessToken) {
    return <SessionExpiredNotice />;
  }

  if (!canEdit) {
    return (
      <Notice title="Edit AI course">
        You do not have access to edit AI courses.
      </Notice>
    );
  }

  if (featureEnabled === false) {
    return (
      <Notice title="Course editing is disabled">
        Turn on the gloria_course_creation flag in Growthbook to roll out course
        editing.
      </Notice>
    );
  }

  if (!schoolId) {
    return (
      <Notice title="Pick a school first">
        Open this course from the Courses page so we know which school it
        belongs to.
      </Notice>
    );
  }

  if (notFound) {
    return (
      <Notice title="Course not found">
        This AI course doesn&apos;t exist or was removed.
      </Notice>
    );
  }

  const moduleLinkQuery = `courseId=${encodeURIComponent(courseId)}&schoolId=${encodeURIComponent(schoolId)}`;

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
            href={`/hammet/courses?schoolId=${encodeURIComponent(schoolId)}`}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-purple-700 dark:text-slate-400 dark:hover:text-cyan-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </Link>

          <p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">
            AI Courses
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
            Edit AI course
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Update the course details and add modules to it.
          </p>
        </motion.section>

        <div className="mx-auto max-w-[760px] space-y-6">
          {isLoading ? (
            <div className="h-[460px] animate-pulse rounded-[28px] bg-purple-50 dark:bg-[#21183A]" />
          ) : (
            <>
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className={cardClassName}
              >
                <div className="mb-7">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold tracking-[-0.03em]">
                    Course details
                  </h2>
                </div>

                <div className="space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">
                      Title
                    </span>
                    <input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
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
                      rows={5}
                      className={`${inputClassName} resize-y`}
                    />
                  </label>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">
                        Position
                      </span>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={position}
                        onChange={(event) => setPosition(event.target.value)}
                        className={inputClassName}
                      />
                      {position.trim() !== "" && parsedPosition === null && (
                        <span className="mt-2 block text-xs text-red-600 dark:text-red-400">
                          Position must be a whole number of 0 or more.
                        </span>
                      )}
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">
                        Price
                      </span>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        className={inputClassName}
                      />
                      {price.trim() !== "" && parsedPrice === null && (
                        <span className="mt-2 block text-xs text-red-600 dark:text-red-400">
                          Price must be a whole number of 0 or more.
                        </span>
                      )}
                    </label>
                  </div>

                  <PublishSelect
                    value={published}
                    onChange={setPublished}
                    noun="courses"
                  />
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className={cardClassName}
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300">
                      <Layers className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-semibold tracking-[-0.03em]">
                      Add modules
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      New modules are created when you save the course.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addRow}
                    className="flex shrink-0 items-center gap-2 rounded-xl border border-black/[0.08] px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
                  >
                    <Plus className="h-4 w-4" />
                    Add module
                  </button>
                </div>

                {moduleRows.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-black/[0.1] p-5 text-center text-sm text-slate-500 dark:border-white/[0.1] dark:text-slate-400">
                    No new modules. Use &ldquo;Add module&rdquo; to add one.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {moduleRows.map((row, index) => (
                      <div
                        key={row.key}
                        className="rounded-2xl border border-black/[0.06] p-5 dark:border-white/[0.06]"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-sm font-semibold">
                            New module {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setModuleRows((rows) =>
                                rows.filter((item) => item.key !== row.key),
                              )
                            }
                            aria-label={`Remove new module ${index + 1}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                            <label className="block">
                              <span className="mb-2 block text-sm font-medium">
                                Title
                              </span>
                              <input
                                value={row.title}
                                onChange={(event) =>
                                  updateRow(
                                    row.key,
                                    "title",
                                    event.target.value,
                                  )
                                }
                                className={inputClassName}
                              />
                            </label>
                            <label className="block">
                              <span className="mb-2 block text-sm font-medium">
                                Position
                              </span>
                              <input
                                type="number"
                                min={0}
                                step={1}
                                value={row.position}
                                onChange={(event) =>
                                  updateRow(
                                    row.key,
                                    "position",
                                    event.target.value,
                                  )
                                }
                                className={inputClassName}
                              />
                            </label>
                          </div>

                          <label className="block">
                            <span className="mb-2 block text-sm font-medium">
                              Description
                            </span>
                            <textarea
                              value={row.description}
                              onChange={(event) =>
                                updateRow(
                                  row.key,
                                  "description",
                                  event.target.value,
                                )
                              }
                              rows={3}
                              className={`${inputClassName} resize-y`}
                            />
                          </label>

                          <label className="block">
                            <span className="mb-2 block text-sm font-medium">
                              Masterclass link{" "}
                              <span className="font-normal text-slate-400">
                                (optional)
                              </span>
                            </span>
                            <input
                              value={row.masterclass}
                              onChange={(event) =>
                                updateRow(
                                  row.key,
                                  "masterclass",
                                  event.target.value,
                                )
                              }
                              placeholder="https://"
                              className={inputClassName}
                            />
                          </label>

                          {!isBlankRow(row) &&
                            (!row.title.trim() ||
                              !row.description.trim() ||
                              parseWholeNumber(row.position) === null) && (
                              <span className="block text-xs text-red-600 dark:text-red-400">
                                Title, description and a whole-number position
                                are required.
                              </span>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {createdModules.length > 0 && (
                  <div className="mt-6 border-t border-black/[0.06] pt-6 dark:border-white/[0.06]">
                    <p className="mb-1 text-sm font-semibold">
                      Modules added in this session
                    </p>
                    <p className="mb-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      The backend has no route to list a course&apos;s modules
                      yet, so only modules added here are shown.
                    </p>
                    <ul className="space-y-2">
                      {createdModules.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm dark:bg-white/[0.04]"
                        >
                          <span className="truncate">
                            <span className="text-slate-400">
                              {item.position}.
                            </span>{" "}
                            {item.title}
                          </span>
                          <Link
                            href={`/hammet/modules/${encodeURIComponent(item.id)}/edit?${moduleLinkQuery}&title=${encodeURIComponent(item.title)}`}
                            className="shrink-0 font-semibold text-purple-700 hover:underline dark:text-cyan-400"
                          >
                            Add resources / quiz
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.section>

              <div>
                <button
                  type="button"
                  onClick={handleSave}
                  className={primaryButtonClassName}
                  disabled={isSaving || !isFormValid}
                >
                  <Save className="h-4 w-4" />
                  {isSaving
                    ? "Saving..."
                    : filledRows.length > 0
                      ? `Save course and create ${filledRows.length} module${filledRows.length === 1 ? "" : "s"}`
                      : "Save changes"}
                </button>

                {isSaved && (
                  <p className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
                    <Check className="h-4 w-4" />
                    Changes saved
                  </p>
                )}

                {error && (
                  <div className="mt-4">
                    <Alert title="Error saving AI course" variant="error">
                      {error}
                    </Alert>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditAiCoursePage() {
  return (
    <Suspense fallback={null}>
      <EditAiCourseContent />
    </Suspense>
  );
}
