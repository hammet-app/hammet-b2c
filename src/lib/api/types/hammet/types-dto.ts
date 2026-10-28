// GET /hammet/schools

import { UserAccess, UserRole, UserScope } from "@/lib/utils/roles";
import { PaginationDto } from "../support";

export type RegisterHammetAdminRequestDto = {
  full_name: string;
  email: string;
  username: string;
  scope: UserScope;
  access: UserAccess[] | null;
}

// GET /hammet/admins
export type HammetAdminDto = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  scope: UserScope;
  access: UserAccess[] | null;
  status: string;
  created_at: string;
}

export type HammetAdminsResponseDto = {
  admins: HammetAdminDto[];
  pagination: PaginationDto;
}

// PATCH /hammet/admins/{admin_id}
export type EditHammetAdminRequestDto = {
  scope?: UserScope | null;
  access?: UserAccess[] | null;
}
