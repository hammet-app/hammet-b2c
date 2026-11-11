"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { legalApi } from "@/lib/api/legal";
import type { CookieConsentRequest } from "@/lib/api/types/legal";
import { useAuth } from "@/lib/auth/auth-context";
import {
  clearStoredCookieConsent,
  getStoredCookieConsent,
  setAnalyticsConsentRuntime,
  setStoredCookieConsent,
  submitCookieConsent,
  type StoredCookieConsent,
} from "@/lib/legal/cookie-consent";

type ConsentContextValue = {
  isLoading: boolean;
  error: string | null;
  cookiePolicyVersion: string | null;
  privacyPolicyVersion: string | null;
  consent: StoredCookieConsent | null;
  analyticsAllowed: boolean;
  reload: () => Promise<void>;
  accept: (analyticsConsent: boolean) => Promise<void>;
  markSyncedUser: (userId: string) => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cookiePolicyVersion, setCookiePolicyVersion] = useState<string | null>(null);
  const [privacyPolicyVersion, setPrivacyPolicyVersion] = useState<string | null>(null);
  const [consent, setConsent] = useState<StoredCookieConsent | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnalyticsConsentRuntime(false, false);
    try {
      const [cookiePolicy, privacyPolicy] = await Promise.all([
        legalApi.getPublishedDocument("cookie_policy"),
        legalApi.getPublishedDocument("privacy_policy"),
      ]);
      const cookieVersion = String(cookiePolicy.version);
      const privacyVersion = String(privacyPolicy.version);
      const stored = getStoredCookieConsent();
      const matchesCurrentPolicies =
        stored?.cookiePolicyVersion === cookieVersion &&
        stored?.privacyPolicyVersion === privacyVersion;

      if (!matchesCurrentPolicies) clearStoredCookieConsent();
      const currentConsent = matchesCurrentPolicies ? stored : null;

      setCookiePolicyVersion(cookieVersion);
      setPrivacyPolicyVersion(privacyVersion);
      setConsent(currentConsent);
      setAnalyticsConsentRuntime(true, Boolean(currentConsent?.analyticsConsent));
    } catch {
      setCookiePolicyVersion(null);
      setPrivacyPolicyVersion(null);
      setConsent(null);
      setError("We could not load the current cookie and privacy policies.");
      setAnalyticsConsentRuntime(false, false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const accept = useCallback(
    async (analyticsConsent: boolean) => {
      if (!cookiePolicyVersion || !privacyPolicyVersion) {
        throw new Error("The current policies are not available yet.");
      }

      const payload = await submitCookieConsent(
        cookiePolicyVersion,
        privacyPolicyVersion,
        analyticsConsent,
      );
      const nextConsent: StoredCookieConsent = payload;
      setStoredCookieConsent(nextConsent);
      setConsent(nextConsent);
      setAnalyticsConsentRuntime(true, analyticsConsent);
    },
    [cookiePolicyVersion, privacyPolicyVersion],
  );

  const markSyncedUser = useCallback((userId: string) => {
    setConsent((current) => current ? { ...current, syncedUserId: userId } : null);
    const stored = getStoredCookieConsent();
    if (stored) setStoredCookieConsent({ ...stored, syncedUserId: userId });
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      isLoading,
      error,
      cookiePolicyVersion,
      privacyPolicyVersion,
      consent,
      analyticsAllowed: !isLoading && Boolean(consent?.analyticsConsent),
      reload,
      accept,
      markSyncedUser,
    }),
    [isLoading, error, cookiePolicyVersion, privacyPolicyVersion, consent, reload, accept, markSyncedUser],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useCookieConsent() {
  const value = useContext(ConsentContext);
  if (!value) {
    throw new Error("useCookieConsent must be used inside CookieConsentProvider");
  }
  return value;
}

export function CookieConsentSync() {
  const { user, accessToken } = useAuth();
  const { consent, markSyncedUser } = useCookieConsent();

  useEffect(() => {
    if (!user || !accessToken || !consent || consent.syncedUserId === user.id) return;
    let cancelled = false;

    void legalApi
      .saveCookieConsent(consent as CookieConsentRequest, accessToken)
      .then(() => {
        if (cancelled) return;
        markSyncedUser(user.id);
      })
      .catch(() => {
        // A later authenticated app visit retries linking this anonymous choice.
      });

    return () => {
      cancelled = true;
    };
  }, [user, accessToken, consent, markSyncedUser]);

  return null;
}

export function CookieConsentPrompt() {
  const { isLoading, error, consent, reload, accept } = useCookieConsent();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (isLoading || consent) return null;

  const choose = async (analyticsConsent: boolean) => {
    setSaving(true);
    setSaveError(null);
    try {
      await accept(analyticsConsent);
    } catch {
      setSaveError("We could not save your choice. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1000] flex justify-center pb-[env(safe-area-inset-bottom)]">
      <section
        role="region"
        aria-label="Cookie consent"
        aria-labelledby="cookie-consent-title"
        className="pointer-events-auto flex w-full max-w-5xl flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_18px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#171222] sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-6"
      >
        <div className="min-w-0 flex-1">
          <h2 id="cookie-consent-title" className="text-sm font-semibold text-slate-950 dark:text-white">
            Your cookie choices
          </h2>
          <p className="mt-0.5 text-xs leading-5 text-slate-600 dark:text-slate-300">
            We use necessary cookies to keep Hammet working and, with your permission, analytics cookies to understand usage.{" "}
            <a className="font-medium text-purple-700 underline dark:text-purple-300" href="/cookies">Cookie policy</a>
            {" | "}
            <a className="font-medium text-purple-700 underline dark:text-purple-300" href="/privacy">Privacy policy</a>
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-amber-50 p-2 text-xs text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
            <p>{error}</p>
            <button type="button" onClick={() => void reload()} className="font-semibold underline">
              Try loading again
            </button>
          </div>
        )}
        {saveError && <p role="alert" className="text-xs text-red-600 dark:text-red-300">{saveError}</p>}

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            disabled={saving || Boolean(error)}
            onClick={() => void choose(true)}
            className="min-h-9 rounded-lg bg-purple-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Accept all"}
          </button>
          <button
            type="button"
            disabled={saving || Boolean(error)}
            onClick={() => void choose(false)}
            className="min-h-9 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            Accept necessary
          </button>
          {/* <button type="button">Manage cookies</button> */}
        </div>
      </section>
    </div>
  );
}
