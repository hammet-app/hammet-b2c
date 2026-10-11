import { UserAccess, UserRole, UserScope } from "@/lib/utils/roles";

export type InviteInfo = {
  fullName: string;
  email: string;
  role: UserRole;
}

export type SessionDetails = {
  country: string;
  city: string;
}

export type SchoolDetails = {
  schoolId: string;
  cookieConsent: boolean;
  cookiePolicyVersion: string;
  classLevel: string | null; // null for non-students
  classArm: string | null;
  term: number | null;
}

export type ProfileDetails = {
  learningMode?:  "guided" | "focus"
  tier: string | null;
}

export type LoginResponse = {
  accessToken: string;         // JWT, 60 min expiry — store in memory only, never localStorage
  user: {
    id: string;
    fullName: string;
    email: string;
    username: string;
    role: UserRole;
    scope: UserScope;
    access: UserAccess[];
    schoolDetails: SchoolDetails | null;
    profileDetails: ProfileDetails | null;
    sessionDetails: SessionDetails | null;
  };
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
};

export type ClaimAccountResponse = {
  accessToken: string;
  user: LoginResponse["user"];
};


// POST /auth/resend/student
export type ResendVerificationRequest = {
  id: string;
  role: UserRole
  reset: boolean
};

export type ResendVerificationResponse = {
  password: string
};


// POST /auth/refresh — no request body, uses httpOnly refresh token cookie
export type RefreshResponse = {
  accessToken: string;         // JWT, 60 min expiry — store in memory only, never localStorage
  user: {
    id: string;
    fullName: string;
    email: string;
    username: string;
    role: UserRole;
    scope: UserScope;
    access: UserAccess[];
    schoolDetails: SchoolDetails | null;
    profileDetails: ProfileDetails | null;
    sessionDetails: SessionDetails | null;
  };
};

// POST /auth/reset
// Before you call this you call /auth/reset/{token}
// to verify the code or token. It returns True if it's correct
export type ResetPassword = {
  token: string; // This is for either the code or token
  password: string;
}