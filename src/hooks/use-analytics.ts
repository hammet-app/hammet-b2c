"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { analyticsApi } from "@/lib/api/analytics";
import { useAuth } from "@/lib/auth/auth-context";
import { AnalyticsEventName } from "@/lib/api/types/analytics";

const ANONYMOUS_ID_STORAGE_KEY = "hammet-analytics-anonymous-id";

function createAnonymousId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function getOrCreateAnonymousId(): string | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const storedId = window.localStorage.getItem(ANONYMOUS_ID_STORAGE_KEY);
    if (storedId) return storedId;

    const anonymousId = createAnonymousId();
    window.localStorage.setItem(ANONYMOUS_ID_STORAGE_KEY, anonymousId);
    return anonymousId;
  } catch {
    // Keep anonymous analytics working for this page session if storage is unavailable.
    return createAnonymousId();
  }
}

export function useAnalytics() {
  const { user, accessToken, refreshToken } = useAuth();
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
    [user, accessToken, refreshToken, pathname, anonymousId]
  );

  return { trackEvent };
}
