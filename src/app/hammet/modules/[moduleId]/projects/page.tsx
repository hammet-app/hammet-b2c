"use client";

import { Suspense } from "react";
import { ModuleContentManager } from "@/components/layout/hammet/module-content-manager";

export default function ModuleProjectsPage() {
  return <Suspense fallback={null}><ModuleContentManager kind="projects" /></Suspense>;
}
