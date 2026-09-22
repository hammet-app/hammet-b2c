// GET /hammet/schools

import { UserAccess, UserRole, UserScope } from "@/lib/utils/roles";
import { UserStatus } from "../admin";
import { PaginationDto } from "../support";

export type RegisterHammetAdminRequestDto = {
  full_name: string;
  email: string;
  username: string;
  scope: UserScope;
  access: UserAccess[] | null;
}

export type AdminDetailsDto = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole[];
  status: UserStatus;
  last_login: string | null;
}

// POST /hammet/schools/[schoolId]/deactivate
// Sets tier to "suspended" — hammet_admin only
// No request body needed
export type DeactivateSchoolResponseDto = {
  school_id: string;
  tier: "suspended";
  message: string;
};


export type DisputeReviewPayloadDto = {
  id: string;
  review_note: string
}

export type  DisputeDto = {
  id: string;
  student_id: string;
  module_title: string;
  original_response: string;
  ai_status: string;
  ai_score: number;
  student_review: string;
  student_dispute_note: string;
  disputed_at: string;
  reviewed_by: string | null;
  reviewed: boolean;
  review_note: string | null
}

export type DisputesDto = {
  disputes: DisputeDto[]
  pagination: PaginationDto
}

