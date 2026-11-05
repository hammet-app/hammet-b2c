"use client";

import { useExperiment } from "@/components/pages/experiments/use-experiment";
import LandingPageA from "@/components/pages/experiments/landing-page/page-a";
import LandingPageB from "@/components/pages/experiments/landing-page/page-b";

export default function Page() {
  const variant = useExperiment("landing_page_layout", "A");

  if (variant === "A") {
    return <LandingPageA />;
  }

  return <LandingPageB />;
}
