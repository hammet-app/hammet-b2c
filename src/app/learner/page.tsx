"use client";

import { useExperiment } from "@/components/pages/experiments/use-experiment";
import LearnerHomePageA from "@/components/pages/experiments/learner-home/page-a";
import LearnerHomePageB from "@/components/pages/experiments/learner-home/page-b";

export default function Page() {
  const variant = useExperiment("learner_home_layout", "A");

  if (variant === "A") {
    return <LearnerHomePageA />;
  }

  return <LearnerHomePageB />;
}
