"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAnalytics } from "@/hooks/use-analytics";

export function AuthPageViewTracker() {
  const { trackEvent } = useAnalytics();
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;
    void trackEvent("auth_page_viewed", { element: "page" });
  }, [pathname, trackEvent]);

  return null;
}
