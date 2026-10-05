"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import type { AuthUser } from "@/lib/utils/roles";
import {
  persistSession,
  getPersistedSession,
  clearPersistedSession,
  clearModuleState,
} from "@/lib/db";
import { toRefreshResponse } from "../api/types";

// ─── Types ────────────────────────────────────────────────────

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isResolved: boolean;
  /**
   * True when the user was hydrated from IndexedDB and the network
   * refresh either failed or hasn't resolved yet. Pages that need
   * live data can use this to show a "offline mode" indicator.
   */
  isOffline: boolean;
}

interface AuthContextValue extends AuthState {
  setSession: (user: AuthUser, accessToken: string) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  completeOnboarding: (
    learningMode: "guided" | "focus",
    interests?: string[]
  ) => Promise<void>;
  redirectAfterAuth: (user?: AuthUser | null) => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

// ─── Context ──────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Constants ────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const REFRESH_INTERVAL_MS = 55 * 60 * 1000;

// ─── Provider ─────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
    isResolved: false,
    isOffline: false,
  });

  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);
  const refreshTokenRef = useRef<() => Promise<string | null>>(
    async () => null
  );

  function scheduleRefresh() {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    refreshTimerRef.current = setTimeout(() => {
      void refreshTokenRef.current();
    }, REFRESH_INTERVAL_MS);
  }

  /**
   * Determines where an authenticated user should enter the application.
   *
   * Learners who haven't completed onboarding go to onboarding.
   * Completed learners go to the learner application.
   * Hammet admins go to the Hammet admin application.
   */
  const getPostAuthRoute = useCallback((user: AuthUser): string | null => {
    if (user.role === "learner") {
      return user.learningMode === null ? "/onboarding" : "/learner";
    }

    if (user.role === "hammet_admin") {
      return "/hammet";
    }

    return null;
  }, []);

  /**
   * Redirect an authenticated user to the appropriate product entry point.
   */
  const redirectAfterAuth = useCallback(
    (user?: AuthUser | null) => {
      const authenticatedUser = user ?? state.user;

      if (!authenticatedUser) {
        return;
      }

      const route = getPostAuthRoute(authenticatedUser);

      if (route) {
        router.replace(route);
      }
    },
    [getPostAuthRoute, router, state.user]
  );

  const refreshToken = useCallback(async (): Promise<string | null> => {
    if (localStorage.getItem("logged_out") === "true") {
    setState({
      user: null,
      accessToken: null,
      isLoading: false,
      isResolved: true,
      isOffline: false,
    });
    return null;
  }

    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    refreshPromiseRef.current = (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) {
          await clearPersistedSession();

          setState({
            user: null,
            accessToken: null,
            isLoading: false,
            isResolved: true,
            isOffline: false,
          });

          return null;
        }

        const response = await res.json();
        const data = toRefreshResponse(response);

        await persistSession(data.user, data.accessToken);

        setState((prev) => ({
          ...prev,
          accessToken: data.accessToken,
          user: data.user,
          isLoading: false,
          isResolved: true,
          isOffline: false,
        }));

        scheduleRefresh();

        return data.accessToken;
      } catch {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isResolved: true,
          isOffline: true,
        }));

        return null;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  }, []);

  useEffect(() => {
    refreshTokenRef.current = refreshToken;
  }, [refreshToken]);

  // ── Silent refresh on mount ──

  useEffect(() => {
    let cancelled = false;

    const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

    async function init() {
      const cached = await getPersistedSession();

      if (cached) {
        const age = Date.now() - new Date(cached.cachedAt).getTime();

        if (age > SESSION_MAX_AGE_MS) {
          await clearPersistedSession();
        } else {
          setState({
            user: cached.user,
            accessToken: cached.accessToken,
            isLoading: false,
            isResolved: true,
            isOffline: true,
          });
        }
      }

      if (!cancelled) {
        await refreshToken();
      }
    }

    init();

    return () => {
      cancelled = true;

      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [refreshToken]);

  // ── Session ─────────────────────────────────────────────────

  const setSession = useCallback(
    (user: AuthUser, accessToken: string) => {
      persistSession(user, accessToken);

      localStorage.removeItem("logged_out");

      setState({
        user,
        accessToken,
        isLoading: false,
        isResolved: true,
        isOffline: false,
      });

      scheduleRefresh();
    },
    []
  );

  // ── User ────────────────────────────────────────────────────

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setState((prev) => {
      if (!prev.user) return prev;

      const user = {
        ...prev.user,
        ...updates,
      };

      if (prev.accessToken) {
        persistSession(user, prev.accessToken);
      }

      return {
        ...prev,
        user,
      };
    });
  }, []);

  // ── Onboarding ──────────────────────────────────────────────

  const completeOnboarding = useCallback(
    async (
      learningMode: "guided" | "focus",
      interests: string[] = []
    ) => {
      if (!state.user || !state.accessToken) {
        throw new Error("You must be authenticated to complete onboarding.");
      }

      await fetch(`${API_BASE}/profile/onboarding`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          learning_mode: learningMode,
          interests,
        }),
      }).then(async (res) => {
        if (!res.ok) {
          let message = "Unable to complete onboarding.";

          try {
            const data = await res.json();
            message = data.detail ?? message;
          } catch {
            // Keep default message.
          }

          throw new Error(message);
        }
      });

      updateUser({
        learningMode: learningMode,
      });

      router.replace("/learner");
    },
    [state.user, state.accessToken, updateUser, router]
  );

  // ── Logout ──────────────────────────────────────────────────

  const logout = useCallback(async () => {
    localStorage.setItem("logged_out", "true");

    await clearModuleState();
    await clearPersistedSession();

    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore
    } finally {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      setState({
        user: null,
        accessToken: null,
        isLoading: false,
        isResolved: true,
        isOffline: false,
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setSession,
        updateUser,
        completeOnboarding,
        redirectAfterAuth,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return ctx;
}

export function useAccessToken(): string | null {
  return useAuth().accessToken;
}