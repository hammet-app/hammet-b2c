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
