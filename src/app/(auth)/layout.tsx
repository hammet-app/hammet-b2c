"use client";

import { GuestGuard } from "@/components/layout/auth-guard";
import { AuthPageViewTracker } from "@/components/analytics/AuthPageViewTracker";
import { CookieConsentPrompt } from "@/components/legal/CookieConsentProvider";
import { useExperiment } from "@/components/pages/experiments/use-experiment";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const legalPageVariant = useExperiment("legal_page", "A");

  return (
    <GuestGuard>
      <div className="relative min-h-screen bg-bg-page flex flex-col">
        <AuthPageViewTracker />
        {legalPageVariant === "A" && <CookieConsentPrompt />}
        <div className="relative z-10 flex flex-col flex-1">
          {children}
        </div>
      </div>
    </GuestGuard>
  );
}
