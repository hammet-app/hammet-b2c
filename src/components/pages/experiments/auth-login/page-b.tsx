"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft, ChevronDown } from "lucide-react";
import {
  AuthShell,
  AuthAlert,
} from "@/components/ui/auth-shell";
import { AuthInput } from "@/components/ui/auth-input";
import { Button } from "@/components/ui/button";
import { apiClient, ApiError } from "@/lib/api/api-client";
import { useAuth } from "@/lib/auth/auth-context";
import { getDeviceId } from "@/lib/auth/device-id";
import { LoginResponseDto, toLoginResponse } from "@/lib/api/types";


export default function LoginPage() {
  const { setSession, redirectAfterAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const deviceId = getDeviceId();

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);

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
          setErrors({
            form: err.message,
          });
        } else if (err instanceof Error) {
          setErrors({
            form: err.message,
          });
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
      });

      const btnEl = document.getElementById("google-button");
      if (btnEl) {
        window.google.accounts.id.renderButton(btnEl, {
          theme: "outline",
          size: "large",
          width: 200,
        });
      }

      try {
        (window.google.accounts.id as unknown as { prompt?: () => void }).prompt?.();
      } catch {
        // Ignored if prompt is not permitted
      }
    };

    if (window.google) {
      initializeGoogle();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", initializeGoogle);
      return () => {
        existingScript.removeEventListener("load", initializeGoogle);
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
    };
  }, [handleGoogleCredentialResponse]);

  function validate() {
    const nextErrors: typeof errors = {};

    if (!email.trim()) {
      nextErrors.email = "Please enter your work email address.";
    }

    if (!password) {
      nextErrors.password = "Please enter your password.";
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
      const response = await apiClient.post<LoginResponseDto>(
        "/auth/login",
        {
          email,
          password,
          device_id: deviceId,
        }
      );

      const data = toLoginResponse(response);
      setSession(data.user, data.accessToken);
      redirectAfterAuth(data.user);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({
          form: err.message,
        });
      } else if (err instanceof Error) {
        setErrors({
          form: err.message,
        });
      } else {
        setErrors({
          form: "Unable to sign in. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <AuthShell mode="login">
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
            Sign in with your work email
          </p>
        </div>

        {errors.form && (
          <div className="mb-4">
            <AuthAlert message={errors.form} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
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

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[12px] font-semibold text-slate-700 dark:text-slate-300"
              >
                Password <span className="text-danger ml-0.5">*</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-[11.5px] font-medium text-purple-600 transition-colors hover:underline dark:text-cyan-400"
              >
                Forgot password?
              </Link>
            </div>
            <AuthInput
              id="password"
              label=""
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password}
              disabled={isLoading}
              required
              onEnter={() => {
                if (!isLoading) {
                  document.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
                }
              }}
            />
          </div>

          {/* Primary Action Button: Continue */}
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="mt-2 h-11 w-full rounded-xl bg-[#1E75E5] font-semibold text-white shadow-sm transition-all hover:bg-[#1964C7] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8]"
          >
            <span>{isLoading ? "Continuing..." : "Continue"}</span>
            {!isLoading && <ArrowRight size={15} className="ml-1" />}
          </Button>
        </form>

        {/* Divider: or continue with */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/[0.08] dark:border-white/[0.08]" />
          </div>
          <span className="relative bg-[#F8F7FF] px-3 text-[11.5px] font-medium text-slate-400 dark:bg-[#0B0813] dark:text-slate-500">
            or continue with
          </span>
        </div>

        {/* 3 Social Buttons Row (Google, Microsoft, ChatGPT) */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* 1. Google Button */}
          <div
            onClick={() => {
              try {
                (window.google?.accounts?.id as unknown as { prompt?: () => void })?.prompt?.();
              } catch {
                // Handled
              }
            }}
            className="group relative flex h-11 items-center justify-center gap-1.5 overflow-hidden rounded-xl border border-black/[0.08] bg-white px-2 text-xs font-semibold text-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] cursor-pointer"
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
            <span className="truncate">Google</span>

            {/* Invisible Google Sign-In iframe overlay */}
            <div
              id="google-button"
              className="absolute inset-0 z-10 flex items-center justify-center opacity-[0.001] overflow-hidden cursor-pointer scale-125"
              title="Sign in with Google"
            />
          </div>

          {/* 2. Microsoft Button */}
          <button
            type="button"
            onClick={() => setErrors({ form: "Microsoft login is connected in production." })}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-2 text-xs font-semibold text-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
          >
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
              <rect fill="#F25022" x="1" y="1" width="10" height="10" />
              <rect fill="#7FBA00" x="13" y="1" width="10" height="10" />
              <rect fill="#00A4EF" x="1" y="13" width="10" height="10" />
              <rect fill="#FFB900" x="13" y="13" width="10" height="10" />
            </svg>
            <span className="truncate">Microsoft</span>
          </button>

          {/* 3. ChatGPT Button */}
          <button
            type="button"
            onClick={() => setErrors({ form: "ChatGPT login is connected in production." })}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-2 text-xs font-semibold text-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
          >
            <svg className="h-4 w-4 shrink-0 text-slate-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.28 9.9c-.23-.84-.71-1.57-1.39-2.1-.48-.37-1.04-.63-1.63-.76-.09-.9-.45-1.74-1.05-2.42-.71-.81-1.68-1.34-2.73-1.5-.78-.12-1.57-.04-2.31.25-.6-.68-1.39-1.16-2.28-1.38-1.04-.26-2.14-.14-3.1.34-.84.42-1.53 1.08-1.99 1.9-.9-.12-1.81.04-2.61.47-.94.51-1.68 1.34-2.1 2.34-.37.89-.47 1.87-.27 2.81-.8.47-1.42 1.18-1.77 2.03-.43 1.05-.46 2.22-.09 3.29.33.95.96 1.76 1.79 2.3.09.89.44 1.74 1.03 2.42.71.82 1.68 1.36 2.74 1.52.77.12 1.56.04 2.29-.24.59.67 1.38 1.15 2.27 1.37 1.04.26 2.14.14 3.1-.34.84-.42 1.54-1.08 2-1.9.91.12 1.82-.04 2.62-.47.94-.5 1.68-1.33 2.1-2.34.37-.88.46-1.86.26-2.8.8-.47 1.42-1.18 1.77-2.03.43-1.05.46-2.22.09-3.29-.33-.94-.96-1.75-1.79-2.29zm-7.63 11.23c-.76.38-1.64.48-2.47.28-.7-.17-1.33-.56-1.8-1.1.04-.02.09-.04.14-.07l4.08-2.35c.2-.12.33-.33.33-.57v-5.76l1.73 1c.02.01.03.02.03.04v6.23c0 .88-.38 1.7-1.04 2.3z" />
            </svg>
            <span className="truncate">ChatGPT</span>
          </button>
        </div>

        {/* Notion-style Terms Acknowledgment */}
        <p className="mt-6 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          By continuing, you acknowledge that you understand and agree to the{" "}
          <Link
            href="/terms"
            className="underline underline-offset-2 hover:text-slate-900 dark:hover:text-white"
          >
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-slate-900 dark:hover:text-white"
          >
            Privacy Policy
          </Link>
          .
        </p>

        {/* Language selector footer from image */}
        <div className="mt-7 flex items-center justify-center gap-1 text-xs text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300">
          <span>🌐 Language: English (US)</span>
          <ChevronDown className="h-3 w-3" />
        </div>

        {/* Link to create account */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-purple-600 transition-colors hover:underline dark:text-cyan-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </AuthShell>
  );
}