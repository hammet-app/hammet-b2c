"use client";

import { FormEvent, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2 } from "lucide-react";

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
        setErrors({
          form:
            err instanceof Error
              ? err.message
              : "Something went wrong with Google authentication.",
        });
      }
    },
    [setSession, redirectAfterAuth]
  );
  
  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-button"),
        {
          theme: "outline",
          size: "large",
          width: 300,
        }
      );
    };

    if (window.google) {
      initializeGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = initializeGoogle;
    document.body.appendChild(script);

    return () => {
      script.remove();
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
      nextErrors.email = "Please enter your email address.";
    }

    if (!password) {
      nextErrors.password = "Please create a password.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword =
        "Please confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords don't match.";
    }

    if (!acceptedTerms) {
      nextErrors.terms =
        "Please accept Hammet's terms and privacy policy.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleResendVerification() {
    if (!registeredEmail || isResending) return;

    setIsResending(true);
    setResendMessage(null);

    try {
      await apiClient.post<string>(
        `/auth/resend?email=${encodeURIComponent(registeredEmail)}`
      );

      setResendMessage("A new verification email has been sent.");
    } catch (err) {
      if (err instanceof ApiError) {
        setResendMessage(err.message);
      } else if (err instanceof Error) {
        setResendMessage(err.message);
      } else {
        setResendMessage("Unable to resend the verification email.");
      }
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
      /*
       * Backend response:
       *
       * POST /auth/register
       * {
       *   full_name,
       *   email,
       *   password,
       *   username
       * }
       *
       * Expected response:
       * "user@example.com"
       *
       * Confirm password and terms are intentionally
       * frontend-only.
       */

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
      <AuthShell>
        <section className="w-full">
          <div className="mb-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-success-light text-success">
              <Check size={21} strokeWidth={2.5} />
            </div>

            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-purple dark:text-cyan">
              Almost there
            </p>

            <h1
              className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.035em]"
              style={{ fontFamily: "var(--font-head)" }}
            >
              Check your email.
            </h1>

            <p className="mt-4 text-[14px] leading-6 text-text-muted">
              We sent a verification link to{" "}
              <span className="font-semibold text-text-primary">
                {registeredEmail}
              </span>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface/70 p-5 shadow-sm">
            <p className="text-[13px] leading-6 text-text-muted">
              Open the email and follow the link to finish
              setting up your Hammet account.
            </p>

            <button
              type="button"
              className="mt-4 text-[13px] font-semibold text-purple transition-colors hover:text-purple-mid dark:text-cyan dark:hover:text-cyan/80"
              onClick={handleResendVerification}
            >
              Didn&apos;t receive it? Resend email
            </button>
          </div>

          <div className="mt-7 text-center">
            <Link
              href="/login"
              className="text-[12.5px] font-medium text-text-primary transition-colors hover:text-purple dark:hover:text-cyan"
            >
              Back to sign in
            </Link>
          </div>
        </section>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <section className="w-full">
        <div className="mb-7">

          <h1
            className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.035em]"
            style={{ fontFamily: "var(--font-head)" }}
          >
            Create your account
          </h1>

          <p className="mt-3 max-w-sm text-[13.5px] leading-6 text-text-muted">
            Start learning, building, and creating with
            Hammet.
          </p>
        </div>

        {errors.form && (
          <div className="mb-5">
            <AuthAlert message={errors.form} />
          </div>
        )}

        <div id="google-button" className="flex justify-center"/>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />

          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted">
            or
          </span>

          <div className="h-px flex-1 bg-border" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          <AuthInput
            id="fullName"
            label="Full name"
            value={fullName}
            onChange={setFullName}
            placeholder="Enter your full name"
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
            placeholder="Choose a username"
            autoComplete="username"
            error={errors.username}
            disabled={isLoading}
            required
          />

          <AuthInput
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email}
            disabled={isLoading}
            required
          />

          <AuthInput
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Create a password"
            autoComplete="new-password"
            error={errors.password}
            disabled={isLoading}
            showStrength
            required
          />

          <AuthInput
            id="confirmPassword"
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Enter your password again"
            autoComplete="new-password"
            error={errors.confirmPassword}
            disabled={isLoading}
            required
          />

          <div className="pt-1">
            <label className="flex cursor-pointer items-start gap-3">
              <button
                type="button"
                role="checkbox"
                aria-checked={acceptedTerms}
                onClick={() =>
                  setAcceptedTerms((current) => !current)
                }
                disabled={isLoading}
                className={cn(
                  "mt-0.5 flex h-[17px] w-[17px] shrink-0",
                  "items-center justify-center rounded-[5px]",
                  "border transition-all duration-150",
                  acceptedTerms
                    ? "border-purple bg-purple text-white dark:border-cyan dark:bg-cyan dark:text-slate-950"
                    : "border-border bg-surface",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-purple/30 dark:focus-visible:ring-cyan/30",
                  "disabled:opacity-50"
                )}
              >
                {acceptedTerms && (
                  <Check size={11} strokeWidth={3} />
                )}
              </button>

              <span className="text-[11.5px] leading-5 text-text-muted">
                I agree to Hammet&apos;s{" "}
                <Link
                  href="/terms"
                  className="font-medium text-text-primary underline decoration-border underline-offset-2 transition-colors hover:text-purple dark:hover:text-cyan"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-text-primary underline decoration-border underline-offset-2 transition-colors hover:text-purple dark:hover:text-cyan"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {errors.terms && (
              <div className="mt-2">
                <FieldError message={errors.terms} />
              </div>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="group mt-1 h-11 w-full rounded-xl bg-purple text-white hover:bg-purple/90 dark:bg-cyan dark:text-slate-950 dark:hover:bg-cyan/90"
          >
            <span>
              {isLoading ? "Creating account..." : "Create account"}
            </span>

            {isLoading ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            )}
          </Button>
        </form>

        <div className="mt-7 text-center">
          <p className="text-[12.5px] text-text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-text-primary transition-colors hover:text-purple dark:hover:text-cyan"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </AuthShell>
  );
}