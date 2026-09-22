"use client";

import { motion } from "motion/react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { AuthShell } from "@/components/ui/auth-shell";
import { apiClient, ApiError } from "@/lib/api/api-client";
import { Button } from "@/components/ui/button";
import { LoginResponseDto, toLoginResponse } from "@/lib/api/types";
import { useAuth } from "@/lib/auth/auth-context";

type VerificationState =
  | "verifying"
  | "success"
  | "error";

export default function VerifyEmailContent() {
  const router = useRouter();
  const { setSession, redirectAfterAuth } = useAuth();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [state, setState] =
    useState<VerificationState>("verifying");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        /*
        * Change only this route when you update
        * the backend verification endpoint.
        *
        * The token is passed as a URL parameter.
        */
        const response = await apiClient.post<LoginResponseDto>(
          "/auth/email/verify",
          {
            token,
            device_id: crypto.randomUUID(),
          }
        );

        const data = toLoginResponse(response);

        setSession(data.user, data.accessToken);
        redirectAfterAuth(data.user);
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 401 || err.status === 404) {
            setError(
              "This verification link is invalid or has expired."
            );
          } else if (err.status === 409) {
            setError(
              "This email address has already been verified."
            );
          } else {
            setError(err.message);
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Unable to verify your email. Please try again."
          );
        }

        setState("error");
      }
    };

    void verify();
  }, [token, setSession, redirectAfterAuth]);

  if (!token) {
    return (
      <AuthShell>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center py-6 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
            }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-light/60 dark:bg-danger/10"
          >
            <X size={30} className="text-danger" />
          </motion.div>

          <div className="mt-5">
            <h1
              className="text-[24px] font-extrabold leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-head)" }}
            >
              Verification failed
            </h1>

            <p className="mt-2 text-[13.5px] leading-6 text-text-muted">
              This verification link is missing a token.
            </p>
          </div>

          <div className="mt-7 flex w-full flex-col gap-3">
            <Button
              type="button"
              size="lg"
              className="h-11 w-full rounded-xl bg-purple text-white hover:bg-purple/90 dark:bg-cyan dark:text-slate-950 dark:hover:bg-cyan/90"
              onClick={() => router.push("/register")}
            >
              Back to registration
            </Button>

            <Link
              href="/login"
              className="text-[12.5px] font-medium text-text-muted transition-colors hover:text-text-primary"
            >
              Already verified? Sign in
            </Link>
          </div>
        </motion.div>
      </AuthShell>
    );
  }

  if (state === "verifying") {
    return (
      <AuthShell>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center py-8 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple/10 dark:bg-cyan/10">
            <Loader2
              size={28}
              className="animate-spin text-purple dark:text-cyan"
            />
          </div>

          <div className="mt-5">
            <h1
              className="text-[24px] font-extrabold leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-head)" }}
            >
              Verifying your email
            </h1>

            <p className="mt-2 text-[13.5px] leading-6 text-text-muted">
              Just a moment while we verify your account.
            </p>
          </div>
        </motion.div>
      </AuthShell>
    );
  }

  if (state === "error") {
    return (
      <AuthShell>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center py-6 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
            }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-light/60 dark:bg-danger/10"
          >
            <X
              size={30}
              className="text-danger"
            />
          </motion.div>

          <div className="mt-5">
            <h1
              className="text-[24px] font-extrabold leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-head)" }}
            >
              Verification failed
            </h1>

            <p className="mt-2 text-[13.5px] leading-6 text-text-muted">
              {error}
            </p>
          </div>

          <div className="mt-7 flex w-full flex-col gap-3">
            <Button
              type="button"
              size="lg"
              className="h-11 w-full rounded-xl bg-purple text-white hover:bg-purple/90 dark:bg-cyan dark:text-slate-950 dark:hover:bg-cyan/90"
              onClick={() => router.push("/register")}
            >
              Back to registration
            </Button>

            <Link
              href="/login"
              className="text-[12.5px] font-medium text-text-muted transition-colors hover:text-text-primary"
            >
              Already verified? Sign in
            </Link>
          </div>
        </motion.div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center py-6 text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 18,
          }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-success-light dark:bg-success/10"
        >
          <CheckCircle2
            size={32}
            className="text-success"
          />
        </motion.div>

        <div className="mt-5">
          <h1
            className="text-[24px] font-extrabold leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-head)" }}
          >
            Email verified
          </h1>

          <p className="mt-2 text-[13.5px] leading-6 text-text-muted">
            Your email has been verified successfully.
          </p>
        </div>

        <Button
          type="button"
          size="lg"
          className="mt-7 h-11 w-full rounded-xl bg-purple text-white hover:bg-purple/90 dark:bg-cyan dark:text-slate-950 dark:hover:bg-cyan/90"
          onClick={() => {
            router.push("/onboarding");
          }}
        >
          Continue to onboarding
        </Button>
      </motion.div>
    </AuthShell>
  );
}