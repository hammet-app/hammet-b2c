"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { AuthShell, AuthHeading, AuthAlert } from "@/components/ui/auth-shell";
import { AuthInput } from "@/components/ui/auth-input";
import { Button } from "@/components/ui/button";
import { apiClient, ApiError } from "@/lib/api/api-client";
import { useAuth } from "@/lib/auth/auth-context";
import { getDeviceId } from "@/lib/auth/device-id";
import { getDashboardRoute } from "@/lib/auth/routes";
import { validatePassword } from "@/utils/password";
import {
  type ClaimAccountResponseDto,
  type InviteInfoDto,
  fromClaimAccountRequest,
  toClaimAccountResponse,
  toInviteInfo,
} from "@/lib/api/types";

type View = "loading" | "form" | "error" | "success";

export default function ClaimAdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { setSession } = useAuth();
  const [view, setView] = useState<View>(token ? "loading" : "error");
  const [inviteName, setInviteName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(token ? null : "This invitation link is missing its token.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    apiClient
      .get<InviteInfoDto>(`/auth/claim/${encodeURIComponent(token)}`)
      .then((dto) => {
        const invite = toInviteInfo(dto);
        if (invite.role !== "hammet_admin") {
          throw new Error("This invitation is not for a Hammet Admin account.");
        }
        if (!cancelled) {
          setInviteName(invite.fullName);
          setView("form");
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error && !(err instanceof ApiError)
          ? err.message
          : "This invitation link is invalid or has expired.");
        setView("error");
      });

    return () => { cancelled = true; };
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!token) {
      setError("This invitation link is missing its token.");
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = fromClaimAccountRequest({ token, password, deviceId: getDeviceId() });
      const dto = await apiClient.post<ClaimAccountResponseDto>("/auth/claim", payload);
      const result = toClaimAccountResponse(dto);
      setSession(result.user, result.accessToken);
      setView("success");
      window.setTimeout(() => router.replace(getDashboardRoute(result.user.role)), 900);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 401 || err.status === 404 || err.status === 409
          ? "This invitation is invalid, expired, or has already been claimed."
          : err.message);
      } else {
        setError(err instanceof Error ? err.message : "Unable to activate your account. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <div className="w-full max-w-[420px] rounded-2xl border border-border bg-surface p-6 shadow-xl sm:p-8">
        {view === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8 text-center" aria-live="polite">
            <Loader2 size={28} className="animate-spin text-purple dark:text-cyan" />
            <AuthHeading title="Checking your invitation" description="Just a moment while we confirm your account." />
          </div>
        )}

        {view === "error" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <X size={30} className="text-danger" aria-hidden="true" />
            <AuthHeading title="Invitation unavailable" description={error ?? "This invitation link is invalid or has expired."} />
            <Button type="button" onClick={() => router.push("/login")}>Go to sign in</Button>
          </div>
        )}

        {view === "success" && (
          <div className="flex flex-col items-center gap-4 py-8 text-center" aria-live="polite">
            <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
            <AuthHeading title="Account activated" description="Your account is ready. Taking you to your dashboard…" />
          </div>
        )}

        {view === "form" && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <AuthHeading
              title="Activate your Hammet Admin account"
              description={inviteName ? `Welcome, ${inviteName}. Set a password to finish activating your account.` : "Set a password to finish activating your account."}
            />
            <AuthInput
              id="admin-password"
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              required
              showStrength
              description="Use at least 8 characters with uppercase, lowercase, a number, and a symbol."
            />
            <AuthInput
              id="admin-confirm-password"
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              required
            />
            {error && <AuthAlert message={error} />}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Activating…</> : "Activate account"}
            </Button>
          </form>
        )}
      </div>
    </AuthShell>
  );
}
