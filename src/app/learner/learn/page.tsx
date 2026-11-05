"use client";

import { useExperiment } from "@/components/pages/experiments/use-experiment";
import MyLearningPageA from "@/components/pages/experiments/my-learning/page-a";
import MyLearningPageB from "@/components/pages/experiments/my-learning/page-b";

export default function Page() {
  const variant = useExperiment("my_learning_layout", "B");

  if (variant === "A") {
    return <MyLearningPageA />;
  }

  return <MyLearningPageB />;
}