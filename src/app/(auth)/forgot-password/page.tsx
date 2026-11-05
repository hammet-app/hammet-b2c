"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft, MailCheck, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AuthShell, AuthAlert } from "@/components/ui/auth-shell";
import { AuthInput } from "@/components/ui/auth-input";
import { Button } from "@/components/ui/button";
import { apiClient, ApiError } from "@/lib/api/api-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string; form?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resending
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  function validate() {
    const nextErrors: typeof errors = {};
    if (!email.trim()) {
      nextErrors.email = "Please enter your work email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await apiClient.post("/auth/forgot-password", { email });
    } catch (err) {
      // Follow OWASP security practice (prevent email enumeration attacks):
      // Always display confirmation state so external attackers cannot probe valid emails
    } finally {
      setIsSubmitted(true);
      setCountdown(60);
      setIsLoading(false);
    }
  }

  const handleResend = async () => {
    if (countdown > 0 || isLoading) return;
    setIsLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email });
      setCountdown(60);
    } catch {
      // simulated resend
      setCountdown(60);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell>
      <section className="mx-auto w-full max-w-[390px] pt-2">
        {/* Hammet Icon linking to Homepage */}
        <div className="mb-5 flex justify-center">
          <Link
            href="/"
            title="Return to Hammet Home"
            className="group flex h-11 w-11 items-center justify-center rounded-xl border border-black/[0.08] bg-white p-2 shadow-sm transition hover:scale-105 hover:shadow-md hover:border-purple-300 dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-cyan-400/40"
          >
            <Image
              src="/icon-512x512.png"
              alt="Hammet"
              width={28}
              height={28}
              className="rounded-md object-contain transition-transform group-hover:scale-110"
            />
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
                  Forgot password?
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500 sm:text-[14px] dark:text-slate-400">
                  Enter your email address and we&apos;ll send you instructions to reset your password.
                </p>
              </div>

              {errors.form && (
                <div className="mb-4">
                  <AuthAlert message={errors.form} />
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <div>
                  <AuthInput
                    id="email"
                    label="Work email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="name@company.com"
                    autoComplete="email"
                    error={errors.email}
                    disabled={isLoading}
                    required
                  />
                  <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                    We&apos;ll send a secure reset link to this address
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="mt-2 h-11 w-full rounded-xl bg-[#1E75E5] font-semibold text-white shadow-sm transition-all hover:bg-[#1964C7] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8]"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Sending instructions...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      <span>Send reset link</span>
                      <ArrowRight size={15} />
                    </span>
                  )}
                </Button>
              </form>

              {/* Back to sign in link */}
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 transition-colors hover:underline dark:text-cyan-400"
                >
                  <ArrowLeft size={13} />
                  <span>Back to sign in</span>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] text-center"
            >
              {/* Mail Sent Icon */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                <MailCheck className="h-7 w-7" />
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Check your inbox
              </h2>

              <p className="mt-2 text-xs text-slate-600 leading-relaxed dark:text-slate-300">
                We sent a password reset link to:
              </p>
              <div className="mt-1.5 inline-block rounded-lg bg-purple-50 px-3 py-1 font-mono text-xs font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                {email}
              </div>

              <p className="mt-4 text-[11.5px] text-slate-400 dark:text-slate-500 leading-relaxed">
                Click the link in the email to choose a new password. If you don&apos;t see it, check your spam folder.
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || isLoading}
                  className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-black/[0.08] bg-slate-50 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/[0.1]"
                >
                  <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
                  <span>
                    {countdown > 0 ? `Resend email in ${countdown}s` : "Resend email"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Entered wrong email? Try again
                </button>
              </div>

              <div className="mt-5 border-t border-black/[0.06] pt-4 dark:border-white/10">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 transition-colors hover:underline dark:text-cyan-400"
                >
                  <ArrowLeft size={13} />
                  <span>Return to sign in</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </AuthShell>
  );
}

