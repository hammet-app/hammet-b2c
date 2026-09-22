import { Suspense } from "react";
import OnboardingContent from "@/components/pages/OnboardingContent";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div />}>
      <OnboardingContent />
    </Suspense>
  );
}