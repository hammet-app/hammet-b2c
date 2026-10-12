"use client";

import { useExperiment } from "@/components/pages/experiments/use-experiment";
import AiSchoolsPageA from "@/components/pages/experiments/ai-schools/page-a";
import AiSchoolsPageB from "@/components/pages/experiments/ai-schools/page-b";

export default function Page() {
  const variant = useExperiment("ai_schools_layout", "B");

  if (variant === "A") {
    return <AiSchoolsPageA />;
  }

  return <AiSchoolsPageB />;
}
