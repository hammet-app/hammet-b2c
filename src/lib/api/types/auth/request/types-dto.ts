

export type RegisterB2CRequestDto = {
  full_name: string;
  username: string;
  email: string;
  password: string;
}

// POST /auth/login
export type LoginRequestDto = {
  email: string;
  password: string;
  device_id: string;
};

// POST /auth/claim — student/teacher claiming invite via password or Google
export type ClaimAccountRequestDto =
  | { token?: string; claim_code?: string; email?: string; password: string, device_id: string }
  | { token: string; google_id_token: string, device_id: string };


// PATCH /auth/update-password
export type UpdatePasswordDto = {
  current_password: string;
  new_password: string;
}
