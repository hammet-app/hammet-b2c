"use client"

import PrivacyPolicyPage from "@/components/pages/experiments/privacy/page-a";
import PrivacyPolicyPageB from "@/components/pages/experiments/privacy/page-b";
import { useExperiment } from "@/components/pages/experiments/use-experiment";

export default function Page() {

  const variant = useExperiment("legal_page", "B");

  if (variant === "A") {
    return <PrivacyPolicyPage />;
  }
  
  return <PrivacyPolicyPageB />;
}