
export type RegisterB2CRequest = {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

// POST /auth/login
export type LoginRequest = {
  email: string;
  password: string;
  deviceId: string;
};

// POST /auth/claim — student/teacher claiming invite via password or Google
export type ClaimAccountRequest =
  | { token?: string; claimCode?: string; email?: string; password: string, deviceId: string }
  | { token: string; googleIdToken: string, deviceId: string };

// PATCH /auth/update-password
export type UpdatePassword = {
  currentPassword: string;
  newPassword: string;
}
