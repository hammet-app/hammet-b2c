import { UserAccess, UserRole, UserScope } from "@/lib/utils/roles";
import { Pagination, PaginationDto } from "../support";

export type RegisterHammetAdminRequest = {
  fullName: string;
  email: string;
  username: string;
  scope: UserScope;
  access: UserAccess[] | null;
}

// GET /hammet/admins
export type HammetAdmin = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  scope: UserScope;
  access: UserAccess[] | null;
  status: string;
  createdAt: string;
}

export type HammetAdminsResponse = {
  admins: HammetAdmin[];
  pagination: Pagination;
}

export type GetHammetAdminsParams = {
  page?: number;
  pageSize?: number;
  scope?: UserScope | null;
  access?: UserAccess | null;
  search?: string | null;
}

// PATCH /hammet/admins/{admin_id}
// Leave a field out to keep its current value.
export type EditHammetAdminRequest = {
  scope?: UserScope | null;
  access?: UserAccess[] | null;
}

export type CouponProduct = {
  couponId: string;
  productType: string;
  productId: string;
};

export type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discountType: "FIXED" | "PERCENTAGE";
  discountValue: number;
  currency: string | null;
  maxDiscountAmount: number | null;
  minPurchaseAmount: number | null;
  startsAt: string | null;
  expiresAt: string | null;
  usageLimit: number | null;
  usageLimitPerUser: number;
  usedCount: number;
  appliesToAllProducts: boolean;
  status: string;
  products: CouponProduct[] | null;
};

export type CouponsResponse = {
  coupons: Coupon[];
  pagination: Pagination;
};

export type CreateCouponRequest = {
  code: string;
  description: string | null;
  discountType: "FIXED" | "PERCENTAGE";
  discountValue: string;
  currency: string | null;
  maxDiscountAmount: string | null;
  minPurchaseAmount: string | null;
  startsAt: string | null;
  expiresAt: string | null;
  usageLimit: number | null;
  usageLimitPerUser: number;
};

export type EditCouponRequest = {
  activate: boolean;
  expiresAt?: string | null;
};

export type LogLevel = "debug" | "info" | "warning" | "error" | "critical";

export type LogSortOrder = "desc" | "asc";

// GET /hammet/logs
export type LogSummary = {
  id: string;
  timestamp: string;
  level: LogLevel;
  event: string;
  message: string;
  domain: string | null;
  userId: string | null;
  requestId: string | null;
  method: string | null;
  path: string | null;
  statusCode: number | null;
};

// GET /hammet/logs/{log_id}
export type LogDetail = LogSummary & {
  errorType: string | null;
  errorMessage: string | null;
  stackTrace: string | null;
  durationMs: number | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
};

export type LogsResponse = {
  logs: LogSummary[];
  pagination: Pagination;
};

export type GetHammetLogsParams = {
  page?: number;
  pageSize?: number;
  level?: LogLevel | null;
  event?: string | null;
  search?: string | null;
  userId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  order?: LogSortOrder | null;
};

// GET /hammet/logs/stats
export type LogStats = {
  total: number;
  byLevel: Record<LogLevel, number>;
  startDate: string | null;
  endDate: string | null;
};

export type GetHammetLogStatsParams = {
  startDate?: string | null;
  endDate?: string | null;
};
