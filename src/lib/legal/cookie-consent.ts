import { legalApi } from "@/lib/api/legal";
import type { CookieConsentRequest } from "@/lib/api/types/legal";

export const ANONYMOUS_ID_STORAGE_KEY = "hammet-analytics-anonymous-id";
export const COOKIE_CONSENT_STORAGE_KEY = "hammet-cookie-consent";

export type StoredCookieConsent = CookieConsentRequest & {
  syncedUserId?: string;
};

let analyticsConsentReady = false;
let analyticsConsentGranted = false;

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

export function getOrCreateAnonymousId(): string {
  if (typeof window === "undefined") return createAnonymousId();

  try {
    const storedId = window.localStorage.getItem(ANONYMOUS_ID_STORAGE_KEY);
    if (storedId) return storedId;

    const anonymousId = createAnonymousId();
    window.localStorage.setItem(ANONYMOUS_ID_STORAGE_KEY, anonymousId);
    return anonymousId;
  } catch {
    return createAnonymousId();
  }
}

export function getStoredCookieConsent(): StoredCookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    return value ? (JSON.parse(value) as StoredCookieConsent) : null;
  } catch {
    return null;
  }
}

export function setStoredCookieConsent(consent: StoredCookieConsent) {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // The current page can still honor the in-memory choice when storage is unavailable.
  }
}

export function clearStoredCookieConsent() {
  try {
    window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
  } catch {
    // Consent remains disabled in memory until the visitor makes a new choice.
  }
}

export function setAnalyticsConsentRuntime(ready: boolean, granted: boolean) {
  analyticsConsentReady = ready;
  analyticsConsentGranted = granted;
}

export function isAnalyticsConsentGranted() {
  return analyticsConsentReady && analyticsConsentGranted;
}

export async function submitCookieConsent(
  cookiePolicyVersion: string,
  privacyPolicyVersion: string,
  analyticsConsent: boolean,
  token?: string | null,
) {
  const payload: CookieConsentRequest = {
    anonymousId: getOrCreateAnonymousId(),
    cookiePolicyVersion,
    privacyPolicyVersion,
    analyticsConsent,
  };
  await legalApi.saveCookieConsent(payload, token);
  return payload;
}
