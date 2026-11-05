// Scope and access options shared by the register and manage administrator pages.
import { UserAccess, UserScope } from "@/lib/utils/roles";

export type AccessOption = {
  id: UserAccess;
  label: string;
  description: string;
};

export const adminScopes: { id: UserScope; description: string }[] = [
  { id: "b2b", description: "B2B school administration." },
  { id: "b2c", description: "B2C learning administration." },
  { id: "platform", description: "Platform-level administration." },
];

export const b2bAccess: AccessOption[] = [
  {
    id: "schools",
    label: "Schools",
    description: "Manage B2B school administration.",
  },
  {
    id: "module",
    label: "Modules",
    description: "Manage learning modules.",
  },
  {
    id: "disputes",
    label: "Disputes",
    description: "Review and manage platform disputes.",
  },
];

export const b2cAccess: AccessOption[] = [
  {
    id: "courses",
    label: "Courses",
    description: "Create and manage B2C courses.",
  },
  {
    id: "coupons",
    label: "Coupons",
    description: "Create and manage B2C coupons.",
  },
];

export function accessOptionsFor(scope: UserScope): AccessOption[] {
  if (scope === "b2b") return b2bAccess;
  if (scope === "b2c") return b2cAccess;
  return [];
}

// Access a new admin starts with when their scope is picked. Platform admins have full access.
export function defaultAccessFor(scope: UserScope): UserAccess[] {
  if (scope === "b2b") return ["schools"];
  if (scope === "b2c") return ["courses"];
  return [];
}

export function getAccessLabel(access: UserAccess): string {
  const option = [...b2bAccess, ...b2cAccess].find((item) => item.id === access);
  if (option) return option.label;
  return access.charAt(0).toUpperCase() + access.slice(1).replace(/_/g, " ");
}
