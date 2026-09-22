import type { UserRole } from "@/lib/utils/roles";

/**
 * Returns the default landing route for a given role after login.
 * Each role maps directly to its own top-level route.
 */
export const ROLE_DEFAULT_ROUTES: Record<UserRole, string> = {
  learner:       "/learner",
  facilitator:  "/facilitator",
  hammet_admin:  "/hammet",
};

export function getDashboardRoute(role: UserRole): string {
  if (role === "hammet_admin") return ROLE_DEFAULT_ROUTES.hammet_admin;
  if (role === "facilitator") return ROLE_DEFAULT_ROUTES.facilitator;
  return ROLE_DEFAULT_ROUTES.learner;
}