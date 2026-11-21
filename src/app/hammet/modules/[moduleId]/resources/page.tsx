"use client";

import { Suspense } from "react";
import { ModuleContentManager } from "@/components/layout/hammet/module-content-manager";

export default function ModuleResourcesPage() {
  return <Suspense fallback={null}><ModuleContentManager kind="resources" /></Suspense>;
}
