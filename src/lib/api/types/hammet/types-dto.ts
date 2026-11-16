// GET /hammet/schools

import { UserAccess, UserRole, UserScope } from "@/lib/utils/roles";
import { PaginationDto } from "../support";
import type { LogLevel } from "./types";

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

export type CouponProductDto = {
  coupon_id: string;
  product_type: string;
  product_id: string;
};

export type CouponDto = {
  id: string;
  code: string;
  description: string | null;
  discount_type: "FIXED" | "PERCENTAGE";
  discount_value: string | number;
  currency: string | null;
  max_discount_amount: string | number | null;
  min_purchase_amount: string | number | null;
  starts_at: string | null;
  expires_at: string | null;
  usage_limit: number | null;
  usage_limit_per_user: number;
  used_count: number;
  applies_to_all_products: boolean;
  status: string;
  products: CouponProductDto[] | null;
};

export type CouponsResponseDto = {
  coupons: CouponDto[];
  pagination: PaginationDto;
};

export type CreateCouponRequestDto = {
  code: string;
  description: string | null;
  discount_type: "FIXED" | "PERCENTAGE";
  discount_value: string;
  currency: string | null;
  max_discount_amount: string | null;
  min_purchase_amount: string | null;
  starts_at: string | null;
  expires_at: string | null;
  usage_limit: number | null;
  usage_limit_per_user: number;
  applies_to_all_products: boolean;
  products: null;
};

export type EditCouponRequestDto = {
  activate: boolean;
  expires_at?: string | null;
};

// GET /hammet/logs
export type LogSummaryDto = {
  id: string;
  timestamp: string;
  level: LogLevel;
  event: string;
  message: string;
  domain: string | null;
  user_id: string | null;
  request_id: string | null;
  method: string | null;
  path: string | null;
  status_code: number | null;
};

// GET /hammet/logs/{log_id}
export type LogDetailDto = LogSummaryDto & {
  error_type: string | null;
  error_message: string | null;
  stack_trace: string | null;
  duration_ms: number | null;
  user_agent: string | null;
  metadata: Record<string, unknown> | null;
};

export type LogsResponseDto = {
  logs: LogSummaryDto[];
  pagination: PaginationDto;
};

// GET /hammet/logs/stats
export type LogStatsDto = {
  total: number;
  by_level: Record<LogLevel, number>;
  start_date: string | null;
  end_date: string | null;
};
