"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Search,
  ShieldCheck,
  UserMinus,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/lib/auth/auth-context";
import {
  deactivateHammetAdmin,
  editHammetAdmin,
  getHammetAdmins,
} from "@/lib/api/hammet";
import type {
  EditHammetAdminRequest,
  HammetAdmin,
  Pagination,
} from "@/lib/api/types";
import {
  UserAccess,
  UserScope,
  canManageAdmins,
  getInitials,
} from "@/lib/utils/roles";
import { Alert } from "@/components/ui";
import {
  Notice,
  SessionExpiredNotice,
  inputClassName,
} from "@/components/hammet/admin-form";
import {
  accessOptionsFor,
  adminScopes,
  defaultAccessFor,
  getAccessLabel,
} from "@/components/hammet/admin-access";

const PAGE_SIZE = 20;

function sameAccess(a: UserAccess[], b: UserAccess[]) {
  return a.length === b.length && a.every((item) => b.includes(item));
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HammetAdminsPage() {
  const { user, accessToken, refreshToken, isLoading: authLoading } = useAuth();
  const canManage = canManageAdmins(user);
  const isPlatformAdmin = user?.scope === "platform";

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState<UserScope | "">("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const [admins, setAdmins] = useState<HammetAdmin[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  // Wait for the user to stop typing before searching.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    if (!accessToken || !canManage) return;

    const token = accessToken;
    let active = true;
    async function loadAdmins() {
      setIsLoading(true);
      setError("");
      try {
        const response = await getHammetAdmins(
          {
            page,
            pageSize: PAGE_SIZE,
            scope: scopeFilter || null,
            search: search || null,
          },
          token,
          refreshToken ?? (async () => null),
        );
        if (active) {
          setAdmins(response.admins);
          setPagination(response.pagination);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load administrators.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadAdmins();
    return () => {
      active = false;
    };
  }, [accessToken, refreshToken, canManage, page, search, scopeFilter, reloadKey]);

  async function handleDeactivate(admin: HammetAdmin) {
    if (!accessToken) return;
    setDeactivatingId(admin.id);
    setActionError("");
    try {
      const deactivated = await deactivateHammetAdmin(
        admin.id,
        accessToken,
        refreshToken ?? (async () => null),
      );
      if (deactivated) {
        setConfirmingId(null);
        setReloadKey((key) => key + 1);
      } else {
        setActionError(`${admin.fullName} could not be deactivated. Please try again.`);
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to deactivate administrator.");
    } finally {
      setDeactivatingId(null);
    }
  }

  function handleSaved(updated: HammetAdmin) {
    setAdmins((current) =>
      current.map((admin) => (admin.id === updated.id ? updated : admin)),
    );
    setEditingId(null);
  }

  if (!authLoading && !accessToken) {
    return <SessionExpiredNotice />;
  }

  if (!authLoading && !canManage) {
    return (
      <Notice title="Administrators">
        You do not have access to manage Hammet administrators.
      </Notice>
    );
  }

  const totalPages = pagination?.totalPages ?? 1;

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
              Administration
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
              Administrators
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              See who administers Hammet, change what they can access, or
              deactivate them.
            </p>
          </div>

          <Link
            href="/hammet/admins/new"
            className="flex items-center gap-2 rounded-xl bg-[#24134F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#321b68] dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300"
          >
            <UserPlus className="h-4 w-4" />
            Register administrator
          </Link>
        </motion.section>

        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search administrators</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name or email"
              maxLength={200}
              className={`${inputClassName} bg-white pl-11 dark:bg-white/[0.03]`}
            />
          </label>

          <label className="sm:w-52">
            <span className="sr-only">Filter by scope</span>
            <select
              value={scopeFilter}
              onChange={(event) => {
                setScopeFilter(event.target.value as UserScope | "");
                setPage(1);
              }}
              className={`${inputClassName} bg-white dark:bg-white/[0.03]`}
            >
              <option value="">All scopes</option>
              {adminScopes.map((scope) => (
                <option key={scope.id} value={scope.id}>
                  {scope.id.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <Alert title="Error loading administrators" variant="error">
            {error}
          </Alert>
        )}

        {actionError && (
          <Alert title="Error updating administrator" variant="error">
            {actionError}
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[92px] animate-pulse rounded-2xl bg-purple-50 dark:bg-[#21183A]"
              />
            ))}
          </div>
        ) : admins.length === 0 && !error ? (
          <div className="rounded-[28px] border border-black/[0.06] bg-white p-10 text-center dark:border-white/[0.06] dark:bg-white/[0.03]">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {search || scopeFilter
                ? "No administrators match your search."
                : "No administrators yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {admins.map((admin) => {
              const isSelf = admin.id === user?.id;
              const isActive = admin.status.toLowerCase() === "active";
              // Non-platform admins can only manage admins in their own scope.
              const canAct =
                !isSelf && isActive && (isPlatformAdmin || admin.scope === user?.scope);
              const access = admin.access ?? [];

              return (
                <motion.article
                  key={admin.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border border-black/[0.06] bg-white p-5 dark:border-white/[0.06] dark:bg-white/[0.03]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-sm font-semibold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                        {getInitials(admin.fullName)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-sm font-semibold">
                            {admin.fullName}
                          </h2>
                          {isSelf && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-white/[0.08] dark:text-slate-300">
                              You
                            </span>
                          )}
                          <span
                            className={[
                              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                              isActive
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                                : "bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-slate-400",
                            ].join(" ")}
                          >
                            {admin.status}
                          </span>
                        </div>

                        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                          {admin.email} · Added {formatDate(admin.createdAt)}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="rounded-md bg-[#EDE9FE] px-2 py-0.5 text-[11px] font-semibold uppercase text-purple-700 dark:bg-[#21183A] dark:text-purple-300">
                            {admin.scope}
                          </span>
                          {admin.scope === "platform" ? (
                            <span className="rounded-md bg-cyan-50 px-2 py-0.5 text-[11px] font-medium text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                              Full access
                            </span>
                          ) : access.length === 0 ? (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">
                              No additional access
                            </span>
                          ) : (
                            access.map((item) => (
                              <span
                                key={item}
                                className="rounded-md bg-cyan-50 px-2 py-0.5 text-[11px] font-medium text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300"
                              >
                                {getAccessLabel(item)}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {canAct && editingId !== admin.id && confirmingId !== admin.id && (
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(admin.id);
                            setConfirmingId(null);
                            setActionError("");
                          }}
                          className="flex items-center gap-1.5 rounded-xl border border-black/[0.08] px-3.5 py-2 text-xs font-semibold transition hover:bg-slate-50 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit access
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmingId(admin.id);
                            setEditingId(null);
                            setActionError("");
                          }}
                          className="flex items-center gap-1.5 rounded-xl border border-rose-200 px-3.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-400/20 dark:text-rose-300 dark:hover:bg-rose-400/10"
                        >
                          <UserMinus className="h-3.5 w-3.5" />
                          Deactivate
                        </button>
                      </div>
                    )}
                  </div>

                  {confirmingId === admin.id && (
                    <div className="mt-4 flex flex-col gap-3 rounded-xl bg-rose-50 p-4 sm:flex-row sm:items-center dark:bg-rose-400/[0.08]">
                      <p className="flex-1 text-xs leading-5 text-rose-700 dark:text-rose-200">
                        Deactivate <strong>{admin.fullName}</strong>? They will
                        no longer be able to sign in to Hammet admin.
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmingId(null)}
                          disabled={deactivatingId === admin.id}
                          className="rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white/70 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-white/[0.06]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeactivate(admin)}
                          disabled={deactivatingId === admin.id}
                          className="rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                        >
                          {deactivatingId === admin.id ? "Deactivating..." : "Deactivate"}
                        </button>
                      </div>
                    </div>
                  )}

                  {editingId === admin.id && (
                    <EditAdminPanel
                      admin={admin}
                      canChangeScope={isPlatformAdmin}
                      onSaved={handleSaved}
                      onCancel={() => setEditingId(null)}
                    />
                  )}
                </motion.article>
              );
            })}
          </div>
        )}

        {pagination && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Page {pagination.page} of {totalPages} · {pagination.total} administrators
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1 || isLoading}
                className="flex items-center gap-1 rounded-xl border border-black/[0.08] px-3 py-2 text-xs font-semibold transition hover:bg-white disabled:opacity-40 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page >= totalPages || isLoading}
                className="flex items-center gap-1 rounded-xl border border-black/[0.08] px-3 py-2 text-xs font-semibold transition hover:bg-white disabled:opacity-40 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EditAdminPanel({
  admin,
  canChangeScope,
  onSaved,
  onCancel,
}: {
  admin: HammetAdmin;
  canChangeScope: boolean;
  onSaved: (admin: HammetAdmin) => void;
  onCancel: () => void;
}) {
  const { accessToken, refreshToken } = useAuth();
  const originalAccess = admin.access ?? [];

  const [scope, setScope] = useState<UserScope>(admin.scope);
  const [access, setAccess] = useState<UserAccess[]>(originalAccess);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const scopeChanged = scope !== admin.scope;
  const accessChanged = !sameAccess(access, originalAccess);
  const hasChanges = scopeChanged || (scope !== "platform" && accessChanged);

  // Keep access the admin already has but that isn't one of the standard options,
  // so saving doesn't silently remove it.
  const standardOptions = accessOptionsFor(scope);
  const extraOptions =
    scope === admin.scope
      ? originalAccess
          .filter((item) => !standardOptions.some((option) => option.id === item))
          .map((item) => ({ id: item, label: getAccessLabel(item), description: "Existing access." }))
      : [];
  const options = [...standardOptions, ...extraOptions];

  function handleScopeChange(nextScope: UserScope) {
    setScope(nextScope);
    setAccess(nextScope === admin.scope ? originalAccess : defaultAccessFor(nextScope));
  }

  function toggleAccess(accessId: UserAccess) {
    setAccess((current) =>
      current.includes(accessId)
        ? current.filter((item) => item !== accessId)
        : [...current, accessId],
    );
  }

  async function handleSave() {
    if (!accessToken || !hasChanges) return;
    setIsSaving(true);
    setError("");

    const body: EditHammetAdminRequest = {};
    if (scopeChanged) body.scope = scope;
    if (scope === "platform") {
      if (scopeChanged) body.access = null;
    } else if (scopeChanged || accessChanged) {
      body.access = access;
    }

    try {
      const updated = await editHammetAdmin(
        admin.id,
        body,
        accessToken,
        refreshToken ?? (async () => null),
      );
      onSaved(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update administrator.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mt-5 border-t border-black/[0.06] pt-5 dark:border-white/[0.06]">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
        <h3 className="text-sm font-semibold">Edit access</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Administration scope
          </p>

          {canChangeScope ? (
            <div className="space-y-2">
              {adminScopes.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleScopeChange(option.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition ${scope === option.id
                      ? "border-purple-300 bg-purple-50 dark:border-purple-400/30 dark:bg-purple-500/10"
                      : "border-black/[0.06] hover:bg-slate-50 dark:border-white/[0.06] dark:hover:bg-white/[0.03]"
                    }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${scope === option.id
                        ? "border-purple-600 bg-purple-600 dark:border-cyan-400 dark:bg-cyan-400"
                        : "border-slate-300 dark:border-slate-600"
                      }`}
                  >
                    {scope === option.id && (
                      <span className="h-2 w-2 rounded-full bg-white dark:bg-[#24134F]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase">{option.id}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {option.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-[#EDE9FE] p-4 text-sm dark:bg-[#21183A]">
              <p className="font-semibold uppercase text-purple-700 dark:text-purple-300">
                {admin.scope}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                Only platform administrators can change scope.
              </p>
            </div>
          )}
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Additional access
          </p>

          {scope === "platform" ? (
            <p className="rounded-xl bg-cyan-50/70 p-4 text-xs leading-5 text-slate-600 dark:bg-cyan-400/[0.08] dark:text-slate-300">
              Platform administrators have access to everything.
            </p>
          ) : (
            <div className="space-y-2">
              {options.map((option) => {
                const checked = access.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleAccess(option.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition ${checked
                        ? "border-cyan-300 bg-cyan-50/70 dark:border-cyan-400/20 dark:bg-cyan-400/[0.08]"
                        : "border-black/[0.06] hover:bg-slate-50 dark:border-white/[0.06] dark:hover:bg-white/[0.03]"
                      }`}
                  >
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${checked
                          ? "border-cyan-600 bg-cyan-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-[#24134F]"
                          : "border-slate-300 dark:border-slate-600"
                        }`}
                    >
                      {checked && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{option.label}</p>
                      <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {option.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <Alert title="Error updating administrator" variant="error">
            {error}
          </Alert>
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-white/[0.06]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="rounded-xl bg-[#24134F] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#321b68] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}
