"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  AuthShell,
  AuthAlert,
  AuthDivider,
} from "@/components/ui/auth-shell";
import { AuthInput } from "@/components/ui/auth-input";
import { Button } from "@/components/ui/button";
import { apiClient, ApiError } from "@/lib/api/api-client";
import { useAuth } from "@/lib/auth/auth-context";
import { getDeviceId } from "@/lib/auth/device-id";
import { LoginResponseDto, toLoginResponse } from "@/lib/api/types";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string | undefined;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options: {
              theme: string;
              size: string;
              width: number;
            }
          ) => void;
        };
      };
    };
  }
}

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

      try {
        const response = await apiClient.post<LoginResponseDto>(
          "/auth/google",
          {
            credential: googleResponse.credential,
            device_id: crypto.randomUUID(),
          }
        );

        const data = toLoginResponse(response);

        console.log(data.user);

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
    const nextErrors: typeof errors = {};

    if (!email.trim()) {
      nextErrors.email = "Please enter your email address.";
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
      const response =await apiClient.post<LoginResponseDto>(
        "/auth/login",
        {
          email,
          password,
          device_id: deviceId,
        }
      );

      const data = toLoginResponse(response);
      console.log(data.user)
      setSession(data.user, data.accessToken);
      redirectAfterAuth(data.user)
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
    <AuthShell>
      <section>
        <div className="mb-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-purple dark:text-cyan">
            Welcome back
          </p>

          <h1
            className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.035em]"
            style={{ fontFamily: "var(--font-head)" }}
          >
            Sign in
          </h1>

          <p className="mt-3 max-w-sm text-[13.5px] leading-6 text-text-muted">
            Continue learning, building, and creating with Hammet.
          </p>
        </div>

        {errors.form && (
          <div className="mb-5">
            <AuthAlert message={errors.form} />
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
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
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password}
            disabled={isLoading}
            required
            onEnter={() => {
              if (!isLoading) {
                document
                  .querySelector<HTMLButtonElement>(
                    'button[type="submit"]'
                  )
                  ?.click();
              }
            }}
          />

          <div className="-mt-1 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-[12px] font-medium text-purple transition-colors hover:text-purple-mid dark:text-cyan dark:hover:text-cyan/80"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="mt-1 h-11 w-full rounded-xl bg-purple text-white hover:bg-purple/90 dark:bg-cyan dark:text-slate-950 dark:hover:bg-cyan/90"
          >
            <span>
              {isLoading ? "Signing in..." : "Sign in"}
            </span>

            {!isLoading && (
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover/button:translate-x-0.5"
              />
            )}
          </Button>
        </form>

        <div className="my-6">
          <AuthDivider />
        </div>

        <div
          id="google-button"
          className="flex min-h-[40px] justify-center"
        />

        <div className="mt-7 text-center">
          <p className="text-[12.5px] text-text-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-text-primary transition-colors hover:text-purple dark:hover:text-cyan"
            >
              Create one
            </Link>
          </p>
        </div>
      </section>
    </AuthShell>
  );
}