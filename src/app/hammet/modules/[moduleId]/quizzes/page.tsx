"use client";

import { Suspense } from "react";
import { ModuleContentManager } from "@/components/layout/hammet/module-content-manager";

export default function ModuleQuizzesPage() {
  return <Suspense fallback={null}><ModuleContentManager kind="quizzes" /></Suspense>;
}
