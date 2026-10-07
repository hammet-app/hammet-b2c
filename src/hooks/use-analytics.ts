"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { analyticsApi } from "@/lib/api/analytics";
import { useAuth } from "@/lib/auth/auth-context";
import { AnalyticsEventName } from "@/lib/api/types/analytics";

export function useAnalytics() {
  const { user, accessToken, refreshToken } = useAuth();
  const pathname = usePathname();

  const trackEvent = useCallback(
    async (
      eventName: AnalyticsEventName,
      options?: {
        element?: string;
        variant?: string;
        properties?: Record<string, any>;
      }
    ) => {
      try {
        await analyticsApi.trackEvent(
          {
            eventName,
            domain: "b2c",
            userId: user?.id,
            // anonymousId could be tracked via a cookie or localStorage if needed
            anonymousId: !user?.id ? "anon-device" : undefined, 
            page: pathname || "/",
            element: options?.element,
            variant: options?.variant,
            properties: options?.properties,
            deviceType: typeof window !== "undefined" && /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
            referrer: typeof document !== "undefined" ? document.referrer : undefined,
          },
          accessToken,
          refreshToken
        );
      } catch (error) {
        // Silently fail analytics so we don't disrupt the user experience
        console.warn("[Analytics] Failed to track event:", eventName, error);
      }
    },
    [user?.id, accessToken, pathname]
  );

  return { trackEvent };
}
