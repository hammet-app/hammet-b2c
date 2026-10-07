import { UserAccess, UserRole, UserScope } from "@/lib/utils/roles";
import { Pagination, PaginationDto } from "../support";

export type RegisterHammetAdminRequest = {
  fullName: string;
  email: string;
  username: string;
  scope: UserScope;
  access: UserAccess[] | null;
}
