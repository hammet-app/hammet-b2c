"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth/auth-context";
import { getDashboardRoute } from "@/lib/auth/routes";

import type { UserRole, UserScope } from "@/lib/utils/roles";

interface AuthGuardProps {
  children: React.ReactNode;
}

function redirectB2BUser(scope: UserScope | null | undefined) {
  if (scope !== "b2b") {
    return false;
  }

  if (process.env.NEXT_PUBLIC_ENV === "production") {
    window.location.replace("https://schools.hammetedu.com");
  }

  if (process.env.NEXT_PUBLIC_ENV === "development") {
    window.location.replace("https://dev-schools.hammetedu.com");
  }

  return true;
}

/**
 * Wraps dashboard pages. Shows a skeleton while the silent refresh
 * is in flight, then either renders children or redirects to login.
 *
 * Place this inside the (dashboard) group layout, inside AuthProvider.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading, isResolved, isOffline } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isResolved) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user) {
      redirectB2BUser(user.scope);
    }
  }, [isResolved, user, isOffline, router]);

  if (isLoading || !isResolved) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null;
  }

  if (user.scope === "b2b") {
    return null;
  }

  return <>{children}</>;
}

export function GuestGuard({ children }: AuthGuardProps) {
  const { user, isLoading, isResolved } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isResolved || !user) return;

    if (redirectB2BUser(user.scope)) {
      return;
    }

    const route = getDashboardRoute(user.role as UserRole);
    router.replace(route);
  }, [isResolved, user, router]);

  if (isLoading || !isResolved) {
    return <DashboardSkeleton />;
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}

// ─── Skeleton ─────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mb-8 animate-pulse">
          <div className="mb-3 h-4 w-32 rounded bg-purple-100 dark:bg-purple-500/10" />

          <div className="h-10 w-52 rounded-lg bg-slate-200 dark:bg-white/[0.08]" />

          <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-100 dark:bg-white/[0.05]" />
        </div>

        {/* Overview */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`relative h-[145px] overflow-hidden rounded-2xl p-6 animate-pulse ${
                index === 0
                  ? "bg-purple-50 dark:bg-purple-500/[0.08]"
                  : index === 1
                    ? "bg-cyan-50 dark:bg-cyan-400/[0.06]"
                    : "bg-emerald-50 dark:bg-emerald-400/[0.06]"
              }`}
            >
              <div className="h-10 w-10 rounded-xl bg-white/70 dark:bg-white/[0.06]" />

              <div className="mt-5 h-3 w-20 rounded bg-black/[0.06] dark:bg-white/[0.07]" />

              <div className="mt-2 h-8 w-12 rounded bg-black/[0.08] dark:bg-white/[0.08]" />
            </div>
          ))}
        </div>

        {/* Main workspace */}
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          {/* Courses */}
          <section>
            <div className="mb-4 animate-pulse">
              <div className="h-3 w-16 rounded bg-slate-200 dark:bg-white/[0.07]" />

              <div className="mt-2 h-7 w-24 rounded bg-slate-200 dark:bg-white/[0.08]" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white dark:border-white/[0.06] dark:bg-white/[0.03]">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b border-black/[0.05] px-6 py-5 last:border-0 dark:border-white/[0.05]"
                >
                  <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-purple-50 dark:bg-purple-500/10" />

                  <div className="min-w-0 flex-1 animate-pulse">
                    <div className="h-4 w-3/5 rounded bg-slate-200 dark:bg-white/[0.08]" />

                    <div className="mt-2 h-3 w-2/5 rounded bg-slate-100 dark:bg-white/[0.05]" />
                  </div>

                  <div className="hidden shrink-0 animate-pulse sm:block">
                    <div className="ml-auto h-4 w-5 rounded bg-slate-200 dark:bg-white/[0.08]" />

                    <div className="mt-2 h-3 w-12 rounded bg-slate-100 dark:bg-white/[0.05]" />
                  </div>

                  <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-slate-100 dark:bg-white/[0.05]" />
                </div>
              ))}
            </div>
          </section>

          {/* AI Schools */}
          <section>
            <div className="mb-4 animate-pulse">
              <div className="h-3 w-20 rounded bg-slate-200 dark:bg-white/[0.07]" />

              <div className="mt-2 h-7 w-28 rounded bg-slate-200 dark:bg-white/[0.08]" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="min-h-[190px] animate-pulse rounded-2xl bg-purple-50 p-6 dark:bg-[#21183A]"
                >
                  <div className="h-10 w-10 rounded-xl bg-white/70 dark:bg-white/[0.07]" />

                  <div className="mt-4 h-4 w-3/4 rounded bg-purple-900/[0.08] dark:bg-white/[0.08]" />

                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-full rounded bg-purple-900/[0.06] dark:bg-white/[0.05]" />

                    <div className="h-3 w-4/5 rounded bg-purple-900/[0.06] dark:bg-white/[0.05]" />
                  </div>

                  <div className="mt-5 h-3 w-16 rounded bg-purple-900/[0.06] dark:bg-white/[0.05]" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Quick actions */}
        <section className="mt-10">
          <div className="mb-4 animate-pulse">
            <div className="h-3 w-16 rounded bg-slate-200 dark:bg-white/[0.07]" />

            <div className="mt-2 h-7 w-20 rounded bg-slate-200 dark:bg-white/[0.08]" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="flex h-[76px] animate-pulse items-center gap-4 rounded-2xl border border-black/[0.06] bg-white p-5 dark:border-white/[0.06] dark:bg-white/[0.03]"
              >
                <div
                  className={`h-10 w-10 rounded-xl ${
                    index === 0
                      ? "bg-purple-50 dark:bg-purple-500/10"
                      : "bg-cyan-50 dark:bg-cyan-400/10"
                  }`}
                />

                <div className="flex-1">
                  <div className="h-4 w-28 rounded bg-slate-200 dark:bg-white/[0.08]" />

                  <div className="mt-2 h-3 w-40 rounded bg-slate-100 dark:bg-white/[0.05]" />
                </div>

                <div className="h-4 w-4 rounded bg-slate-100 dark:bg-white/[0.05]" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}