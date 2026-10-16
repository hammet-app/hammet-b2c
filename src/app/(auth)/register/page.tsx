"use client";

import { FormEvent, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft, Check, Loader2, ChevronDown, ShieldCheck, AlertTriangle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils/utils";
import {
  AuthAlert,
  AuthShell,
  FieldError,
} from "@/components/ui/auth-shell";
import { AuthInput } from "@/components/ui/auth-input";
import { Button } from "@/components/ui/button";

import {
  apiClient,
  ApiError,
} from "@/lib/api/api-client";
import { LoginResponseDto, RegisterB2CRequestDto, toLoginResponse } from "@/lib/api/types";
import { useAuth } from "@/lib/auth/auth-context";

type RegisterErrors = {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  form?: string;
};

function computePasswordStrength(pw: string) {
  let score = 0;
  const hasLength = pw.length >= 8;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);

  if (hasLength) score++;
  if (hasUpper && hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  let label = "Weak";
  let color = "#EF4444"; // red
  if (score === 2) {
    label = "Fair";
    color = "#F59E0B"; // amber
  } else if (score === 3) {
    label = "Good";
    color = "#06B6D4"; // cyan
  } else if (score >= 4) {
    label = "Strong";
    color = "#10B981"; // emerald
  }

  return {
    score,
    label,
    color,
    hasLength,
    hasUpperLower: hasUpper && hasLower,
    hasNumber,
    hasSpecial,
    isStrong: score >= 4,
  };
}

export default function RegisterPage() {
  const { setSession, redirectAfterAuth } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const handleGoogleCredentialResponse = useCallback(
    async (googleResponse: { credential: string }) => {
      setErrors({});
      setIsLoading(true);

      try {
        const response = await apiClient.post<LoginResponseDto>(
          "/auth/google",
          {
            credential: googleResponse.credential,
            device_id: crypto.randomUUID(),
          }
        );

        const data = toLoginResponse(response);

        setSession(data.user, data.accessToken);
        redirectAfterAuth(data.user);
      } catch (err) {
        if (err instanceof ApiError) {
          setErrors({ form: err.message });
        } else if (err instanceof Error) {
          setErrors({ form: err.message });
        } else {
          setErrors({
            form: "Something went wrong with Google authentication.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [setSession, redirectAfterAuth]
  );
  
  useEffect(() => {
    let isMounted = true;

    const initializeGoogle = () => {
      if (!window.google || !isMounted) return;

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured");
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
        use_fedcm_for_prompt: false,
        auto_select: false,
      });

      const btnEl = document.getElementById("google-button");
      if (btnEl) {
        window.google.accounts.id.renderButton(btnEl, {
          theme: "outline",
          size: "large",
          width: 200,
        });
      }
    };

    if (window.google) {
      initializeGoogle();
      return () => {
        try {
          window.google?.accounts?.id?.cancel?.();
        } catch {
          // Ignored
        }
      };
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", initializeGoogle);
      return () => {
        existingScript.removeEventListener("load", initializeGoogle);
        try {
          window.google?.accounts?.id?.cancel?.();
        } catch {
          // Ignored
        }
      };
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.body.appendChild(script);

    return () => {
      isMounted = false;
      try {
        window.google?.accounts?.id?.cancel?.();
      } catch {
        // Ignored
      }
    };
  }, [handleGoogleCredentialResponse]);

  function validate() {
    const nextErrors: RegisterErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!username.trim()) {
      nextErrors.username = "Please choose a username.";
    }

    if (!email.trim()) {
      nextErrors.email = "Please enter your work email address.";
    }

    const strength = computePasswordStrength(password);
    if (!password) {
      nextErrors.password = "Please enter a password.";
    } else if (!strength.isStrong) {
      nextErrors.password = "Only strong passwords are accepted. Include 8+ characters, uppercase, lowercase, number, and special symbol.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!acceptedTerms) {
      nextErrors.terms = "Please accept the Terms of Service.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleResendVerification() {
    if (!registeredEmail) return;

    setIsResending(true);
    setResendMessage(null);

    try {
      await apiClient.post("/auth/resend-verification", {
        email: registeredEmail,
      });
      setResendMessage("Verification email resent successfully.");
    } catch {
      setResendMessage("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiClient.post<string>(
        "/auth/register",
        {
          full_name: fullName,
          email,
          password,
          username,
        } satisfies RegisterB2CRequestDto
      );

      if (typeof response === "string") {
        setRegisteredEmail(response);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401 || err.status === 403) {
          setErrors({ form: err.message });
        } else if (err.status === 422) {
          setErrors({
            form: "Please check your details and try again.",
          });
        } else {
          setErrors({ form: err.message });
        }
      } else if (err instanceof Error) {
        setErrors({
          form: `Unable to connect. Check your internet connection. ${err.message}`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }


  if (registeredEmail) {
    return (
      <AuthShell mode="register">
        <section className="mx-auto w-full max-w-[390px] pt-4 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Check size={22} strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Check your email
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            We sent a verification link to <strong className="text-slate-900 dark:text-white">{registeredEmail}</strong>.
          </p>

          <div className="mt-6 rounded-2xl border border-black/[0.08] bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">
              Open the email and click the confirmation link to activate your Hammet account.
            </p>

            <button
              type="button"
              className="mt-3 text-xs font-semibold text-purple-600 hover:underline dark:text-cyan-400"
              onClick={handleResendVerification}
              disabled={isResending}
            >
              {isResending ? "Resending..." : "Didn't receive it? Resend email"}
            </button>
            {resendMessage && <p className="mt-2 text-xs text-emerald-600">{resendMessage}</p>}
          </div>

          <div className="mt-6">
            <Link href="/login" className="text-xs font-semibold text-purple-600 dark:text-cyan-400 hover:underline">
              Back to sign in →
            </Link>
          </div>
        </section>
      </AuthShell>
    );
  }

  return (
    <AuthShell mode="register">
      <section className="mx-auto w-full max-w-[390px] pt-2">
        {/* Hammet Icon linking directly to Homepage */}
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

        {/* Notion-style Title & Subtitle */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
            Hammet: your AI academy.
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 sm:text-[15px] dark:text-slate-400">
            Sign up with your work email
          </p>
        </div>

        {errors.form && (
          <div className="mb-4">
            <AuthAlert message={errors.form} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
          <AuthInput
            id="fullName"
            label="Full name"
            value={fullName}
            onChange={setFullName}
            placeholder="Ada Lovelace"
            autoComplete="name"
            error={errors.fullName}
            disabled={isLoading}
            required
          />

          <AuthInput
            id="username"
            label="Username"
            value={username}
            onChange={setUsername}
            placeholder="adalovelace"
            autoComplete="username"
            error={errors.username}
            disabled={isLoading}
            required
          />

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
              Use an organization email to easily collaborate with teammates
            </p>
          </div>

          <AuthInput
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Create a strong password"
            autoComplete="new-password"
            error={errors.password}
            disabled={isLoading}
            required
          />

          {/* Enhanced Live Password Strength Meter with Smooth Light Appearing Animation */}
          <AnimatePresence>
            {password && (
              <motion.div
                key="password-strength-meter"
                initial={{ opacity: 0, height: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, height: "auto", y: 0, scale: 1 }}
                exit={{ opacity: 0, height: 0, y: -8, scale: 0.98 }}
                transition={{
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="overflow-hidden"
              >
                {(() => {
                  const strength = computePasswordStrength(password);
                  return (
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-2xl border p-3.5 text-xs transition-all duration-300",
                        "border-purple-200/90 bg-white/95 shadow-lg shadow-purple-950/5 backdrop-blur-md",
                        "dark:border-white/10 dark:bg-white/[0.03]"
                      )}
                      style={{
                        boxShadow: `0 8px 24px -4px ${strength.color}25, 0 2px 8px -2px rgba(0,0,0,0.04)`,
                      }}
                    >
                      {/* Luminous Light Ray Beam passing across top edge on appearing */}
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="pointer-events-none absolute top-0 left-0 h-[2px] w-1/2 bg-gradient-to-r from-transparent via-white dark:via-cyan-300 to-transparent"
                      />

                      {/* Ambient colored light aura inside card */}
                      <div
                        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl opacity-20 transition-colors duration-500"
                        style={{ backgroundColor: strength.color }}
                      />

                      {/* Header with Status Badge */}
                      <div className="relative z-10 flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="flex h-2 w-2 rounded-full animate-pulse transition-colors duration-300"
                            style={{ backgroundColor: strength.color }}
                          />
                          <span className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-200">
                            Password strength
                          </span>
                        </div>

                        <span
                          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide transition-all duration-300 shadow-sm"
                          style={{
                            backgroundColor: `${strength.color}18`,
                            color: strength.color,
                            border: `1px solid ${strength.color}33`,
                          }}
                        >
                          {strength.isStrong && <Sparkles className="h-3 w-3" />}
                          {strength.label} {strength.isStrong ? "✓ Accepted" : "(Strong required)"}
                        </span>
                      </div>

                      {/* 4-Segment Luminous Progress Bar with Smooth Animated Light Fill */}
                      <div className="relative z-10 grid grid-cols-4 gap-1.5 h-2 mb-3">
                        {[1, 2, 3, 4].map((seg) => {
                          const active = strength.score >= seg;
                          return (
                            <div
                              key={seg}
                              className="relative overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10 h-full transition-all"
                            >
                              <motion.div
                                initial={false}
                                animate={{
                                  width: active ? "100%" : "0%",
                                  backgroundColor: active ? strength.color : "transparent",
                                }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                className="h-full rounded-full relative"
                                style={{
                                  boxShadow: active ? `0 0 8px ${strength.color}88` : "none",
                                }}
                              >
                                {active && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
                                )}
                              </motion.div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Requirements Checklist with Animated Glow Checkmarks */}
                      <div className="relative z-10 grid grid-cols-2 gap-2 text-[10.5px] text-slate-500 dark:text-slate-400">
                        <span
                          className={cn(
                            "flex items-center gap-1.5 transition-colors duration-200",
                            strength.hasLength ? "text-emerald-600 dark:text-emerald-400 font-bold" : ""
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded-full transition-all duration-200",
                              strength.hasLength
                                ? "bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                : "bg-slate-200/70 text-slate-400 dark:bg-white/10 dark:text-slate-500"
                            )}
                          >
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </span>
                          8+ characters
                        </span>

                        <span
                          className={cn(
                            "flex items-center gap-1.5 transition-colors duration-200",
                            strength.hasUpperLower ? "text-emerald-600 dark:text-emerald-400 font-bold" : ""
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded-full transition-all duration-200",
                              strength.hasUpperLower
                                ? "bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                : "bg-slate-200/70 text-slate-400 dark:bg-white/10 dark:text-slate-500"
                            )}
                          >
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </span>
                          Upper &amp; lowercase
                        </span>

                        <span
                          className={cn(
                            "flex items-center gap-1.5 transition-colors duration-200",
                            strength.hasNumber ? "text-emerald-600 dark:text-emerald-400 font-bold" : ""
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded-full transition-all duration-200",
                              strength.hasNumber
                                ? "bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                : "bg-slate-200/70 text-slate-400 dark:bg-white/10 dark:text-slate-500"
                            )}
                          >
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </span>
                          At least 1 number
                        </span>

                        <span
                          className={cn(
                            "flex items-center gap-1.5 transition-colors duration-200",
                            strength.hasSpecial ? "text-emerald-600 dark:text-emerald-400 font-bold" : ""
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded-full transition-all duration-200",
                              strength.hasSpecial
                                ? "bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                : "bg-slate-200/70 text-slate-400 dark:bg-white/10 dark:text-slate-500"
                            )}
                          >
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </span>
                          Special symbol (!@#$)
                        </span>
                      </div>

                      {!strength.isStrong && (
                        <div className="relative z-10 mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-xl">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                          <span>Only strong passwords are accepted for AI accounts.</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          <AuthInput
            id="confirmPassword"
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            error={errors.confirmPassword}
            disabled={isLoading}
            required
          />

          <div className="pt-0.5">
            <label className="flex cursor-pointer items-start gap-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={acceptedTerms}
                onClick={() => setAcceptedTerms((current) => !current)}
                disabled={isLoading}
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all",
                  acceptedTerms
                    ? "border-purple-600 bg-purple-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-black"
                    : "border-slate-300 bg-white dark:border-white/20 dark:bg-white/[0.04]"
                )}
              >
                {acceptedTerms && <Check size={11} strokeWidth={3} />}
              </button>

              <span className="text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                I agree to the{" "}
                <Link href="/terms" className="underline hover:text-slate-900 dark:hover:text-white">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-slate-900 dark:hover:text-white">
                  Privacy Policy
                </Link>.
              </span>
            </label>

            {errors.terms && (
              <div className="mt-1">
                <FieldError message={errors.terms} />
              </div>
            )}
          </div>

          {/* Primary Action Button: Continue */}
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="mt-2 h-11 w-full rounded-xl bg-[#1E75E5] font-semibold text-white shadow-sm transition-all hover:bg-[#1964C7] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8]"
          >
            <span>{isLoading ? "Continuing..." : "Continue"}</span>
            {isLoading ? <Loader2 size={15} className="ml-1 animate-spin" /> : <ArrowRight size={15} className="ml-1" />}
          </Button>
        </form>

        {/* Divider: or continue with */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/[0.08] dark:border-white/[0.08]" />
          </div>
          <span className="relative bg-[#F8F7FF] px-3 text-[11.5px] font-medium text-slate-400 dark:bg-[#0B0813] dark:text-slate-500">
            or continue with
          </span>
        </div>

        {/* Single Google Sign-In Button */}
        <div className="w-full">
          <div
            className="group relative flex h-11 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-black/[0.08] bg-white px-4 text-xs font-semibold text-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] cursor-pointer"
          >
            {/* Custom Google Visual matching other buttons */}
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-xs font-semibold">Sign up with Google</span>

            {/* Invisible Google Sign-In iframe overlay */}
            <div
              id="google-button"
              className="absolute inset-0 z-10 flex items-center justify-center opacity-[0.001] overflow-hidden cursor-pointer scale-125"
              title="Sign up with Google"
            />
          </div>
        </div>

        <p className="mt-5 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          By continuing, you acknowledge that you understand and agree to the{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-slate-900 dark:hover:text-white">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-slate-900 dark:hover:text-white">
            Privacy Policy
          </Link>.
        </p>

        <div className="mt-6 flex items-center justify-center gap-1 text-xs text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300">
          <span>🌐 Language: English (US)</span>
          <ChevronDown className="h-3 w-3" />
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-purple-600 transition-colors hover:underline dark:text-cyan-400">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </AuthShell>
  );
}