"use client"

import TermsAndConditionsPage from "@/components/pages/experiments/terms/page-a";
import TermsAndConditionsPageB from "@/components/pages/experiments/terms/page-b";
import { useExperiment } from "@/components/pages/experiments/use-experiment";

export default function Page() {

  const variant = useExperiment("legal_page", "A");

  if (variant === "A") {
    return <TermsAndConditionsPage />;
  }
  
  return <TermsAndConditionsPageB />;
}