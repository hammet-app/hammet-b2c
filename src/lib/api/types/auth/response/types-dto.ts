import { UserRole, UserAccess, UserScope } from "@/lib/utils/roles";

// ============================================================
// AUTH ROUTES
// ============================================================


export type InviteInfoDto = {
  full_name: string;
  email: string;
  role: UserRole;
}

export type SessionDetailsDto = {
  country: string;
  city: string;
}

export type SchoolDetailsDto = {
  school_id: string;
  cookie_consent: boolean;
  cookie_policy_version: string;
  class_level: string | null; // null for non-students
  class_arm: string | null;
  term: number | null;
}

export type ProfileDetailsDto = {
  learning_mode?:  "guided" | "focus"
  tier: string | null;
  profile_picture?: string | null;
}

export type LoginResponseDto = {
  access_token: string;         // JWT, 60 min expiry — store in memory only, never localStorage
  user: {
    id: string;
    full_name: string;
    email: string;
    username: string;
    role: UserRole;
    scope: UserScope;
    access: UserAccess[];
    school_details: SchoolDetailsDto | null;
    profile_details: ProfileDetailsDto | null;
    session_details: SessionDetailsDto | null;
    profile_picture?: string | null;
  };
};


export type ClaimAccountResponseDto = {
  access_token: string;
  user: LoginResponseDto["user"];
};


// POST /auth/refresh — no request body, uses httpOnly refresh token cookie
export type RefreshResponseDto = {
  access_token: string;         // JWT, 60 min expiry — store in memory only, never localStorage
  user: {
    id: string;
    full_name: string;
    email: string;
    username: string;
    role: UserRole;
    scope: UserScope;
    access: UserAccess[];
    school_details: SchoolDetailsDto | null;
    profile_details: ProfileDetailsDto | null;
    session_details: SessionDetailsDto | null;
  };
};


export type forgotPasswordResponseDto = {
  is_admin: boolean;
}
// POST /auth/profile-picture/upload-url
export type ProfilePictureUploadResponseDto = {
  signed_url: string;
  signedUrl: string;
  token: string;
  path: string;
  public_url: string;
  content_type: string;
};

// POST /auth/profile-picture/confirm-upload
export type ProfilePictureResponseDto = {
  profile_picture: string;
};
