"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Building2,
  Check,
  KeyRound,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/lib/auth/auth-context";
import { RegisterHammetAdminRequest } from "@/lib/api/types";
import { UserAccess } from "@/lib/utils/roles";
import { registerHammet } from "@/lib/api/hammet";
import { ApiError } from "@/lib/api/api-client";
import { Alert } from "@/components/ui";

type AdminScope = "b2b" | "b2c" | "platform";

const b2bAccess = [
  {
    id: "schools" as UserAccess,
    label: "Schools",
    description: "Manage B2B school administration.",
  },
  {
    id: "module" as UserAccess,
    label: "Modules",
    description: "Manage learning modules.",
  },
  {
    id: "disputes" as UserAccess,
    label: "Disputes",
    description: "Review and manage platform disputes.",
  },
];

const b2cAccess = [
  {
    id: "courses" as UserAccess,
    label: "Courses",
    description: "Create and manage B2C courses.",
  },
];

export default function RegisterAdminPage() {
  const { user, accessToken, refreshToken } = useAuth();

  const access = user?.access ?? [];
  const adminScope = user?.scope ?? ""

  const isPlatformAdmin = adminScope == "platform";
  const isB2CAdmin =
    adminScope == "b2c" && access.includes("admin");

  const canRegister = isPlatformAdmin || isB2CAdmin;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [scope, setScope] = useState<AdminScope>(
    isPlatformAdmin ? "b2c" : "b2c"
  );

  const [selectedAccess, setSelectedAccess] = useState<UserAccess[]>([
    "courses",
  ]);

  const [isRegistering, setIsRegistering] = useState<boolean>(false)
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState("")

  function handleScopeChange(nextScope: AdminScope) {
    setScope(nextScope);

    if (nextScope === "platform") {
      setSelectedAccess([]);
      return;
    }

    if (nextScope === "b2b") {
      setSelectedAccess(["schools"]);
      return;
    }

    setSelectedAccess(["courses"]);
  }

  function toggleAccess(accessId: UserAccess) {
    setSelectedAccess((current) =>
      current.includes(accessId)
        ? current.filter((item) => item !== accessId)
        : [...current, accessId]
    );
  }

  async function handleRegisterAdmin() {
    if (!user || !accessToken) return;
    setIsRegistering(true)
    setError("")
    try {
      const body = { 
        fullName: fullName, 
        email: email, 
        username: username, 
        scope: scope, 
        access: scope === "platform" ? null : selectedAccess,
      } satisfies RegisterHammetAdminRequest

      const response = await registerHammet(
        body,
        accessToken,
        refreshToken
      )

      if (response === true) {
        setIsSuccessful(true)
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      }
    } finally {
      setIsRegistering(false)
    }
  }

  if (!canRegister) {
    return (
      <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
        <div className="mx-auto max-w-[900px]">
          <div className="rounded-[28px] border border-black/[0.06] bg-white p-8 dark:border-white/[0.06] dark:bg-white/[0.03]">
            <h1 className="text-2xl font-semibold tracking-[-0.04em]">
              Administrator registration
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              You do not have access to register Hammet administrators.
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
              Invitation sent
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
              Administrator registered
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              An invitation has been sent to{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {email}
              </span>
              . They can verify their email and create their password to
              complete their account setup.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/hammet"
                className="rounded-xl bg-[#24134F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#321b68] dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300"
              >
                Back to dashboard
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsSuccessful(false);
                  setFullName("");
                  setEmail("");
                  setUsername("");
                  setScope(isPlatformAdmin ? "b2c" : "b2c");
                  setSelectedAccess(["courses"]);
                }}
                className="rounded-xl border border-black/[0.08] px-5 py-3 text-sm font-semibold transition hover:bg-slate-50 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
              >
                Register another
              </button>
            </div>
          </motion.section>
        </div>
      </div>
    );
  }

  const availableAccess = scope === "b2b" ? b2bAccess : b2cAccess

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
            Administration
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
            Register administrator
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Invite a new administrator and define the areas of Hammet they
            can access.
          </p>
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          {/* Details */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="rounded-[28px] border border-black/[0.06] bg-white p-7 dark:border-white/[0.06] dark:bg-white/[0.03] sm:p-8"
          >
            <div className="mb-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                <UserPlus className="h-5 w-5" />
              </div>

              <h2 className="text-xl font-semibold tracking-[-0.03em]">
                Administrator details
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Enter the details we&apos;ll use to invite the administrator.
              </p>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Full name
                </span>

                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-black/[0.08] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Email
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="jane@example.com"
                  className="w-full rounded-xl border border-black/[0.08] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Username
                </span>

                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="janedoe"
                  className="w-full rounded-xl border border-black/[0.08] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10"
                />
              </label>
            </div>

            <div className="mt-7 flex items-start gap-3 rounded-xl bg-purple-50 p-4 dark:bg-purple-500/[0.08]">
              <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-300" />

              <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">
                We&apos;ll send a verification link to this email address. The
                administrator will create their password after verifying
                their email.
              </p>
            </div>
          </motion.section>

          {/* Access */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-[28px] border border-black/[0.06] bg-white p-7 dark:border-white/[0.06] dark:bg-white/[0.03] sm:p-8"
          >
            <div className="mb-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h2 className="text-xl font-semibold tracking-[-0.03em]">
                Access
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Define where this administrator can work.
              </p>
            </div>

            {isPlatformAdmin ? (
              <div className="space-y-2">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Administration scope
                </p>

                {(["b2b", "b2c", "platform"] as AdminScope[]).map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleScopeChange(option)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${scope === option
                          ? "border-purple-300 bg-purple-50 dark:border-purple-400/30 dark:bg-purple-500/10"
                          : "border-black/[0.06] hover:bg-slate-50 dark:border-white/[0.06] dark:hover:bg-white/[0.03]"
                        }`}
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${scope === option
                            ? "border-purple-600 bg-purple-600 dark:border-cyan-400 dark:bg-cyan-400"
                            : "border-slate-300 dark:border-slate-600"
                          }`}
                      >
                        {scope === option && (
                          <span className="h-2 w-2 rounded-full bg-white dark:bg-[#24134F]" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-semibold uppercase">
                          {option}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {option === "b2b" &&
                            "B2B school administration."}
                          {option === "b2c" &&
                            "B2C learning administration."}
                          {option === "platform" &&
                            "Platform-level administration."}
                        </p>
                      </div>
                    </button>
                  )
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-[#EDE9FE] p-5 dark:bg-[#21183A]">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-purple-700 dark:bg-white/[0.08] dark:text-purple-300">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-purple-700 dark:text-purple-300">
                      B2C administration
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      This administrator will have access to B2C
                      administration.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {scope !== "platform" && (
              <div className="mt-7">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Additional access
                </p>

                <div className="space-y-2">
                  {availableAccess.map((option) => {
                    const checked = selectedAccess.includes(option.id);

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleAccess(option.id)}
                        className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${checked
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
                          <p className="text-sm font-semibold">
                            {option.label}
                          </p>

                          <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {option.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleRegisterAdmin}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#24134F] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(76,29,149,0.16)] transition hover:bg-[#321b68] dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300"
              disabled={isRegistering}
            >
              <UserPlus className="h-4 w-4" />
              {isRegistering ? "Registering..." : "Register administrator"}
            </button>
            {error && (
              <Alert title="Error registering Admin" variant="error">
                {error}
              </Alert>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}