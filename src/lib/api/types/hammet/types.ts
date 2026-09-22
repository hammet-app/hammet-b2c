import { CurriculumModuleBlock } from "@/lib/api/types/module";
import { UserAccess, UserRole, UserScope } from "@/lib/utils/roles";
import { UserStatus } from "../admin";
import { Pagination, PaginationDto } from "../support";

export type RegisterHammetAdminRequest = {
  fullName: string;
  email: string;
  username: string;
  scope: UserScope;
  access: UserAccess[] | null;
}

export type AdminDetails = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole[];
  status: UserStatus
  lastLogin: string | null;
}


// POST /hammet/schools/[schoolId]/deactivate
// Sets tier to "suspended" — hammet_admin only
// No request body needed
export type DeactivateSchoolResponse = {
  schoolId: string;
  tier: "suspended";
  message: string;
};

// PUT /admin/modules/[moduleId] — full replace, no partial update
// reuses CreateModuleRequest as request body
export type UpdateModuleResponse = {
  success: boolean;
};

// POST /admin/modules
export type CreateModuleRequest = {
  title: string;
  term: number;
  week_number: number;
  level: string;
  published: boolean;           // false = draft, not visible to students yet
  content_json: {
    blocks: CurriculumModuleBlock[];
  };
};

export type DisputeReviewPayload = {
  id: string;
  reviewNote: string
}

export type  Dispute = {
  id: string;
  studentId: string;
  moduleTitle: string;
  originalResponse: string;
  aiStatus: string;
  aiScore: number;
  studentReview: string;
  studentDisputeNote: string;
  disputedAt: string;
  reviewedBy: string | null;
  reviewed: boolean;
  reviewNote: string | null
}

export type Disputes = {
  disputes: Dispute[];
  pagination: Pagination
}

