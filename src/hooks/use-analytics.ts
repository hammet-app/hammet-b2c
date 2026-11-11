"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { analyticsApi } from "@/lib/api/analytics";
import { useAuth } from "@/lib/auth/auth-context";
import { AnalyticsEventName } from "@/lib/api/types/analytics";
import { useCookieConsent } from "@/components/legal/CookieConsentProvider";
import { getOrCreateAnonymousId } from "@/lib/legal/cookie-consent";

export function useAnalytics() {
  const { user, accessToken, refreshToken } = useAuth();
  const { analyticsAllowed } = useCookieConsent();
  const pathname = usePathname();
  const [anonymousId, setAnonymousId] = useState<string | undefined>();

  const trackEvent = useCallback(
    async (
      eventName: AnalyticsEventName,
      options?: {
        element?: string;
        variant?: string;
          properties?: Record<string, unknown>;
      }
    ) => {
      if (!analyticsAllowed) return;
      try {
        let eventAnonymousId = anonymousId;
        if (!user?.id && !eventAnonymousId) {
          eventAnonymousId = getOrCreateAnonymousId();
          setAnonymousId(eventAnonymousId);
        }

        await analyticsApi.trackEvent(
          {
            eventName,
            domain: "b2c",
            userId: user?.id,
            anonymousId: !user?.id ? eventAnonymousId : undefined,
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
    [user, accessToken, refreshToken, pathname, anonymousId, analyticsAllowed]
  );

  return { trackEvent };
}
